-- Já aplicada no projeto mcmsebonteugcunfrwze (22/09/2026). Mantida aqui como registro.
drop policy if exists "Permitir select público" on public.leads;
drop policy if exists "Permitir delete público" on public.leads;
revoke all on table public.leads from anon, authenticated;

drop policy if exists "Permitir insert público" on public.leads_qualificados;
revoke all on table public.leads_qualificados from anon, authenticated;

revoke all on table public.formulario from anon, authenticated;
grant insert on table public.formulario to anon, authenticated;
drop policy if exists "Permitir insert público" on public.formulario;
create policy "Permitir insert público" on public.formulario
  for insert to anon, authenticated with check (true);

alter table public.formulario
  add constraint formulario_nome_chk check (nome is not null and char_length(btrim(nome)) between 1 and 120),
  add constraint formulario_empresa_chk check (empresa is null or char_length(empresa) <= 160),
  add constraint formulario_email_chk check (email is not null and char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  add constraint formulario_whatsapp_chk check (whatsapp is not null and char_length(regexp_replace(whatsapp, '\D', '', 'g')) between 10 and 13),
  add constraint formulario_descricao_chk check (descricao is null or char_length(descricao) <= 2000);

alter function public.notify_n8n_new_lead() set search_path = '';
revoke execute on function public.notify_n8n_new_lead() from public, anon, authenticated;
