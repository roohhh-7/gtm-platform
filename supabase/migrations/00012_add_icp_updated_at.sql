ALTER TABLE public.icps ADD COLUMN updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
