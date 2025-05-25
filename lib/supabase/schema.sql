-- Drop existing publication if it exists
drop publication if exists supabase_realtime;

-- Create publication for realtime
create publication supabase_realtime;

-- Drop existing tables if they exist
drop table if exists public.blob_likes;
drop table if exists public.blobs;
drop table if exists public.winners;

-- Create tables
create table if not exists public.blobs (
    id uuid default gen_random_uuid() primary key,
    content text not null check (char_length(content) <= 100),
    color text,
    mood text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    expires_at timestamp with time zone generated always as (
        date_trunc('minute', created_at) + interval '1 minute'
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

create table if not exists public.winners (
    id uuid default gen_random_uuid() primary key,
    blob_id uuid references public.blobs(id) not null,
    user_id uuid references auth.users(id) not null,
    content text not null,
    like_count integer not null,
    won_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.blobs enable row level security;
alter table public.blob_likes enable row level security;
alter table public.winners enable row level security;

-- Enable realtime
alter publication supabase_realtime add table blobs;
alter publication supabase_realtime add table blob_likes;
alter publication supabase_realtime add table winners;

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
drop policy if exists "Anyone can read winners" on public.winners;

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
            AND created_at > date_trunc('minute', now())
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

-- Winners policy
create policy "Anyone can read winners"
    on public.winners for select
    to authenticated
    using (true);

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

-- Function to select winner
create or replace function public.select_minute_winner()
returns void
language plpgsql
security definer
as $$
declare
    winning_blob record;
begin
    raise notice 'Running select_minute_winner at %', now();
    
    -- Get the winning blob from the previous minute
    select b.*, u.id as user_id, count(bl.id) as final_like_count
    into winning_blob
    from blobs b
    join auth.users u on b.user_id = u.id
    left join blob_likes bl on b.id = bl.blob_id
    where b.created_at >= date_trunc('minute', now() - interval '1 minute')
    and b.created_at < date_trunc('minute', now())
    group by b.id, u.id
    order by count(bl.id) desc, b.created_at asc
    limit 1;

    raise notice 'Found winning blob: %', winning_blob;

    -- If there's a winner, insert into winners table
    if winning_blob is not null then
        raise notice 'Inserting winner with content: % and likes: %', winning_blob.content, winning_blob.final_like_count;
        
        insert into public.winners (
            blob_id,
            user_id,
            content,
            like_count,
            won_at
        ) values (
            winning_blob.id,
            winning_blob.user_id,
            winning_blob.content,
            winning_blob.final_like_count,
            date_trunc('minute', now() - interval '1 minute')
        );
        
        raise notice 'Winner inserted successfully';
    else
        raise notice 'No winner found for the previous minute';
    end if;
end;
$$;

-- Update the cron job to run every minute
select cron.unschedule('hourly-blob-tasks');
select cron.schedule(
    'minute-blob-tasks',
    '* * * * *', -- Run every minute
    $$
    select clean_expired_blobs();
    select select_minute_winner();
    $$
); 