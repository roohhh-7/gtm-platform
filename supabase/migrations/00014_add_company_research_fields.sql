alter table public.company_research
  add column why_now text,
  add column company_overview text,
  add column custom_question_answer text,
  add column growth_signals jsonb default '[]'::jsonb,
  add column decision_makers jsonb default '[]'::jsonb,
  add column outreach_angles jsonb default '[]'::jsonb,
  add column timeline jsonb default '[]'::jsonb;
