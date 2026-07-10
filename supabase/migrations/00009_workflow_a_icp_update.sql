-- Add new ICP fields to icps table
ALTER TABLE public.icps
ADD COLUMN IF NOT EXISTS problem_statement text,
ADD COLUMN IF NOT EXISTS company_types text[] not null default '{}',
ADD COLUMN IF NOT EXISTS ideal_customer_characteristics text;
