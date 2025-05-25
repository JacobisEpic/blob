-- Drop existing publication if it exists
drop publication if exists supabase_realtime;

-- Create publication for realtime
create publication supabase_realtime;

-- Drop existing tables if they exist
drop table if exists public.blob_likes;
drop table if exists public.blobs;

-- Create tables
create table if not exists public.blobs (
    id uuid default gen_random_uuid() primary key,
    content text not null check (char_length(content) <= 100),
    color text,
    mood text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    expires_at timestamp with time zone generated always as (
        date_trunc('hour', created_at) + interval '1 hour'
    ) stored,
    user_id uuid references auth.users(id) on delete cascade not null,
    like_count integer default 0
);

create table if not exists public.blob_likes (
    id uuid default gen_random_uuid() primary key,
    blob_id uuid references public.blobs(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(blob_id, user_id)
);

-- Enable Row Level Security
alter table public.blobs enable row level security;
alter table public.blob_likes enable row level security;

-- Enable realtime
alter publication supabase_realtime add table blobs;
alter publication supabase_realtime add table blob_likes;

-- Create indexes
create index if not exists blobs_user_id_idx on public.blobs(user_id);
create index if not exists blobs_expires_at_idx on public.blobs(expires_at);
create index if not exists blob_likes_blob_id_idx on public.blob_likes(blob_id);
create index if not exists blob_likes_user_id_idx on public.blob_likes(user_id);

-- Drop existing policies
drop policy if exists "Anyone can read blobs" on public.blobs;
drop policy if exists "Users can insert their own blobs" on public.blobs;
drop policy if exists "Users can delete their own blobs" on public.blobs;
drop policy if exists "Anyone can read likes" on public.blob_likes;
drop policy if exists "Users can like blobs once" on public.blob_likes;
drop policy if exists "Users can unlike their likes" on public.blob_likes;

-- Create RLS Policies
-- Blobs policies
create policy "Anyone can read unexpired blobs"
    on public.blobs for select
    to authenticated
    using (expires_at > now());

create policy "Users can insert their own blobs"
    on public.blobs for insert
    to authenticated
    with check (
        auth.uid() = user_id AND
        NOT EXISTS (
            SELECT 1 FROM public.blobs
            WHERE user_id = auth.uid()
            AND created_at > date_trunc('hour', now())
        )
    );

create policy "Users can delete their own blobs"
    on public.blobs for delete
    to authenticated
    using (auth.uid() = user_id);

-- Blob likes policies
create policy "Anyone can read likes"
    on public.blob_likes for select
    to authenticated
    using (true);

create policy "Users can like blobs once"
    on public.blob_likes for insert
    to authenticated
    with check (
        auth.uid() = user_id AND
        NOT EXISTS (
            SELECT 1 FROM public.blob_likes
            WHERE user_id = auth.uid() AND blob_id = blob_likes.blob_id
        )
    );

create policy "Users can unlike their likes"
    on public.blob_likes for delete
    to authenticated
    using (auth.uid() = user_id);

-- Functions
create or replace function public.handle_blob_like()
returns trigger
language plpgsql
security definer
as $$
begin
    if (TG_OP = 'INSERT') then
        update public.blobs
        set like_count = like_count + 1
        where id = NEW.blob_id;
    elsif (TG_OP = 'DELETE') then
        update public.blobs
        set like_count = like_count - 1
        where id = OLD.blob_id;
    end if;
    return null;
end;
$$;

-- Drop existing trigger
drop trigger if exists on_blob_like on public.blob_likes;

-- Create trigger
create trigger on_blob_like
    after insert or delete on public.blob_likes
    for each row execute function public.handle_blob_like();

-- Function to clean expired blobs
create or replace function public.clean_expired_blobs()
returns void
language plpgsql
security definer
as $$
begin
    delete from public.blobs where expires_at <= now();
end;
$$;

-- Set up cron job to clean expired blobs
select cron.schedule(
    'clean-expired-blobs',
    '0 * * * *', -- Run at the start of every hour
    $$
    select clean_expired_blobs();
    $$
); 