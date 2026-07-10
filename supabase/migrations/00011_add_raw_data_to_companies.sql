-- Add raw_data to companies table to store Apollo response payload
ALTER TABLE public.companies
ADD COLUMN raw_data JSONB DEFAULT '{}'::jsonb;
