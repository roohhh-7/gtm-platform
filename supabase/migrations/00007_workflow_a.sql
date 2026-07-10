-- Add product_description to icps table
ALTER TABLE public.icps
ADD COLUMN IF NOT EXISTS product_description text;

-- Add ai_fit_score and why_recommended to campaign_companies table
ALTER TABLE public.campaign_companies
ADD COLUMN IF NOT EXISTS ai_fit_score integer,
ADD COLUMN IF NOT EXISTS why_recommended text[];
