create table public.outreach_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  
  subject text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'sent', 'bounced', 'replied')),
  
  -- Using JSONB to store an array of context items used by AI to generate this email
  context_used jsonb default '[]'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure only one outreach email per contact per campaign (for now)
  unique(campaign_id, contact_id)
);

alter table public.outreach_emails enable row level security;

-- Policies for outreach_emails
create policy "Users can view their own outreach_emails."
  on public.outreach_emails for select using ( auth.uid() = user_id );

create policy "Users can insert their own outreach_emails."
  on public.outreach_emails for insert with check ( auth.uid() = user_id );

create policy "Users can update their own outreach_emails."
  on public.outreach_emails for update using ( auth.uid() = user_id );

create policy "Users can delete their own outreach_emails."
  on public.outreach_emails for delete using ( auth.uid() = user_id );
