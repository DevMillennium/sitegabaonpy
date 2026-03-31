create table if not exists public.landing_leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nombre text not null,
  telefono text not null,
  ciudad text not null,
  producto text not null,
  variante_ab text not null check (variante_ab in ('A', 'B')),
  origen text not null,
  url text,
  user_agent text
);

alter table public.landing_leads enable row level security;

drop policy if exists "insert anon leads" on public.landing_leads;
create policy "insert anon leads"
  on public.landing_leads
  for insert
  to anon
  with check (true);
