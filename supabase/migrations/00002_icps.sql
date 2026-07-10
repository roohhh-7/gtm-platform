create table public.icps (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  titles text[] not null default '{}',
  industries text[] not null default '{}',
  company_sizes text[] not null default '{}',
  locations text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure only one ICP exists per campaign
  unique(campaign_id)
);

alter table public.icps enable row level security;

create policy "Users can view their own icps."
  on public.icps for select using ( auth.uid() = user_id );

create policy "Users can insert their own icps."
  on public.icps for insert with check ( auth.uid() = user_id );

create policy "Users can update their own icps."
  on public.icps for update using ( auth.uid() = user_id );

create policy "Users can delete their own icps."
  on public.icps for delete using ( auth.uid() = user_id );
