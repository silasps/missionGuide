alter table public.profiles
  add column if not exists missionary_mode boolean not null default false;
