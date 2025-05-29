# blob

A minimalist social media web app

## Features

- to be decided

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- Vercel (Deployment)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and set up the following environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database schema in Supabase:
   ```sql
   -- Create tables
   create table public.shouts (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     content text not null,
     user_id uuid references auth.users not null,
     upvotes integer default 0
   );

   create table public.votes (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     user_id uuid references auth.users not null,
     shout_id uuid references public.shouts not null,
     unique(user_id, shout_id)
   );

   -- Set up RLS policies
   alter table public.shouts enable row level security;
   alter table public.votes enable row level security;

   create policy "Shouts are viewable by everyone"
     on public.shouts for select
     using (true);

   create policy "Authenticated users can insert shouts"
     on public.shouts for insert
     with check (auth.role() = 'authenticated');

   create policy "Users can vote once per shout"
     on public.votes for all
     using (auth.uid() = user_id)
     with check (auth.uid() = user_id);
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

