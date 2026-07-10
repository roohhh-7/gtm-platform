create table public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  industry text,
  employees text,
  domain text,
  tags text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.campaign_companies (
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  status text not null default 'prospect', -- e.g. prospect, active, disqualified
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (campaign_id, company_id)
);

alter table public.companies enable row level security;
alter table public.campaign_companies enable row level security;

-- Policies for companies
create policy "Users can view their own companies."
  on public.companies for select using ( auth.uid() = user_id );

create policy "Users can insert their own companies."
  on public.companies for insert with check ( auth.uid() = user_id );

create policy "Users can update their own companies."
  on public.companies for update using ( auth.uid() = user_id );

create policy "Users can delete their own companies."
  on public.companies for delete using ( auth.uid() = user_id );

-- Policies for campaign_companies
create policy "Users can view their own campaign_companies."
  on public.campaign_companies for select using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_companies.campaign_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can insert their own campaign_companies."
  on public.campaign_companies for insert with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_companies.campaign_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can update their own campaign_companies."
  on public.campaign_companies for update using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_companies.campaign_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can delete their own campaign_companies."
  on public.campaign_companies for delete using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_companies.campaign_id
      and c.user_id = auth.uid()
    )
  );
