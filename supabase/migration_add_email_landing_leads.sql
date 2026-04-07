-- Ejecutar en Supabase SQL Editor si la tabla ya existía sin email (opcional para leads del chat).
alter table public.landing_leads add column if not exists email text;
