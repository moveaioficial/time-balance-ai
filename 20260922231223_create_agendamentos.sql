-- Já aplicada no projeto mcmsebonteugcunfrwze (22/09/2026). Mantida aqui como registro.
create table public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  inicio timestamptz not null,
  fim timestamptz not null,
  nome text not null check (char_length(btrim(nome)) between 1 and 120),
  empresa text check (empresa is null or char_length(empresa) <= 160),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  whatsapp text check (whatsapp is null or char_length(regexp_replace(whatsapp, '\D', '', 'g')) between 10 and 13),
  descricao text check (descricao is null or char_length(descricao) <= 2000),
  status text not null default 'pendente' check (status in ('pendente','confirmado','cancelado')),
  google_event_id text,
  meet_link text,
  ip_hash text,
  check (fim > inicio)
);
comment on table public.agendamentos is 'Reuniões de 30 min marcadas pelo site. Acesso apenas via Edge Function (service_role).';
create unique index agendamentos_inicio_ativo_uidx on public.agendamentos (inicio) where status in ('pendente','confirmado');
create index agendamentos_email_idx on public.agendamentos (lower(email));
create index agendamentos_ip_created_idx on public.agendamentos (ip_hash, created_at);
alter table public.agendamentos enable row level security;
revoke all on table public.agendamentos from anon, authenticated;
