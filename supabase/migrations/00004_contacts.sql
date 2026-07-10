create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  name text not null,
  role text,
  email text,
  linkedin_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.campaign_contacts (
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  status text not null default 'prospect', -- e.g. prospect, sent, replied, bounced
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (campaign_id, contact_id)
);

alter table public.contacts enable row level security;
alter table public.campaign_contacts enable row level security;

-- Policies for contacts
create policy "Users can view their own contacts."
  on public.contacts for select using ( auth.uid() = user_id );

create policy "Users can insert their own contacts."
  on public.contacts for insert with check ( auth.uid() = user_id );

create policy "Users can update their own contacts."
  on public.contacts for update using ( auth.uid() = user_id );

create policy "Users can delete their own contacts."
  on public.contacts for delete using ( auth.uid() = user_id );

-- Policies for campaign_contacts
create policy "Users can view their own campaign_contacts."
  on public.campaign_contacts for select using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_contacts.campaign_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can insert their own campaign_contacts."
  on public.campaign_contacts for insert with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_contacts.campaign_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can update their own campaign_contacts."
  on public.campaign_contacts for update using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_contacts.campaign_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can delete their own campaign_contacts."
  on public.campaign_contacts for delete using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_contacts.campaign_id
      and c.user_id = auth.uid()
    )
  );
