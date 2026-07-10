-- Add target_domains to icps table to support searching specific companies
ALTER TABLE public.icps
ADD COLUMN IF NOT EXISTS target_domains text[] not null default '{}';
