# Agenda (Edge Function `agenda`)

Mostra horários livres do Google Agenda da Move AI e marca reuniões de 30 min com Google Meet.

**Regras** (em `slots.ts`): seg–sex, 08:00–18:00 (Brasília), 30 min, antecedência mínima de 2h, até 14 dias à frente.
Ocupado = qualquer evento na agenda principal `moveaioficial@gmail.com` ou na agenda "Team Move AI".
Para bloquear um horário, basta criar um evento no Google Agenda.

**Proteções**: 1 reunião futura por e-mail, 3 agendamentos por IP/dia, índice único por horário,
nova checagem no Google antes de criar o evento. Registros em `public.agendamentos` (só service_role).

## Configuração (uma vez)

Segredos em Supabase → Edge Functions → Secrets:

| Nome | Valor |
|---|---|
| `GOOGLE_CLIENT_ID` | ID do cliente OAuth (Google Cloud) |
| `GOOGLE_CLIENT_SECRET` | Chave secreta do cliente OAuth |
| `GOOGLE_REFRESH_TOKEN` | Refresh token da conta moveaioficial@gmail.com |

Escopos: `https://www.googleapis.com/auth/calendar.events` e `https://www.googleapis.com/auth/calendar.freebusy`.
O app OAuth precisa estar **publicado (Em produção)** — em "Teste" o refresh token expira em 7 dias.

Sem os segredos a função responde `503 agenda_nao_configurada` e o site mostra o botão do WhatsApp.

## Deploy
`supabase functions deploy agenda` (verify_jwt ligado; o site chama com a chave pública).
