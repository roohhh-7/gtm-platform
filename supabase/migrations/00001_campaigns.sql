create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  industry text,
  status text not null default 'draft', -- 'draft', 'active', 'paused', 'completed', 'archived'
  sent integer not null default 0,
  replies integer not null default 0,
  meetings integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.campaigns enable row level security;

-- Policies for Campaigns
create policy "Users can view their own campaigns."
  on public.campaigns for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own campaigns."
  on public.campaigns for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own campaigns."
  on public.campaigns for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own campaigns."
  on public.campaigns for delete
  using ( auth.uid() = user_id );
