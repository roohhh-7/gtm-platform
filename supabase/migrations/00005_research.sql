create table public.company_research (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null unique,
  
  ai_summary text,
  industry text,
  funding text,
  
  -- Using JSONB to store arrays
  tech_stack jsonb default '[]'::jsonb,
  competitors jsonb default '[]'::jsonb,
  recent_news jsonb default '[]'::jsonb,
  hiring_signals jsonb default '[]'::jsonb,
  pain_points jsonb default '[]'::jsonb,
  buying_signals jsonb default '[]'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.contact_research (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null unique,
  
  ai_personalization_notes text,
  role text,
  responsibilities text,
  linkedin_summary text,
  
  -- Using JSONB to store arrays
  recent_posts jsonb default '[]'::jsonb,
  interests jsonb default '[]'::jsonb,
  mutual_connections jsonb default '[]'::jsonb,
  personalized_talking_points jsonb default '[]'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.company_research enable row level security;
alter table public.contact_research enable row level security;

-- Policies for company_research
create policy "Users can view their own company_research."
  on public.company_research for select using ( auth.uid() = user_id );

create policy "Users can insert their own company_research."
  on public.company_research for insert with check ( auth.uid() = user_id );

create policy "Users can update their own company_research."
  on public.company_research for update using ( auth.uid() = user_id );

create policy "Users can delete their own company_research."
  on public.company_research for delete using ( auth.uid() = user_id );

-- Policies for contact_research
create policy "Users can view their own contact_research."
  on public.contact_research for select using ( auth.uid() = user_id );

create policy "Users can insert their own contact_research."
  on public.contact_research for insert with check ( auth.uid() = user_id );

create policy "Users can update their own contact_research."
  on public.contact_research for update using ( auth.uid() = user_id );

create policy "Users can delete their own contact_research."
  on public.contact_research for delete using ( auth.uid() = user_id );
