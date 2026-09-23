// Edge Function "agenda" — horários livres e reserva de reuniões (Google Agenda da Move AI)
//
// POST { action: "slots" }                    -> horários livres (seg–sex, 08–18h, 30 min, até 14 dias)
// POST { action: "book", start, nome, ... }   -> cria o evento com Google Meet e convida o cliente
//
// Segredos necessários (Supabase > Edge Functions > Secrets):
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
// Opcionais:
//   GOOGLE_BUSY_CALENDAR_IDS  (padrão: "primary" + agenda "Team Move AI")
//   GOOGLE_EVENT_CALENDAR_ID  (padrão: "primary")

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { AGENDA_CONFIG, freeSlots, isValidSlot, queryWindow, type Interval } from "./slots.ts";

const DEFAULT_BUSY_CALENDARS = [
  "primary",
  "10e8396c4d3eb4e04cccf8fbd601697baae5026520c624810469061bb963d13c@group.calendar.google.com",
];

const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?moveai\.tech$/,
  /^https:\/\/project-adppj(-[a-z0-9-]+)?\.vercel\.app$/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
];

const MAX_BOOKINGS_PER_IP_PER_DAY = 3;

const env = (k: string) => Deno.env.get(k) ?? "";

const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

// ---------- HTTP helpers ----------
function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.some((re) => re.test(origin)) ? origin : "https://www.moveai.tech";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// ---------- Google ----------
let cachedToken: { value: string; exp: number } | null = null;

function googleConfigured() {
  return Boolean(env("GOOGLE_CLIENT_ID") && env("GOOGLE_CLIENT_SECRET") && env("GOOGLE_REFRESH_TOKEN"));
}

async function googleToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("GOOGLE_CLIENT_ID"),
      client_secret: env("GOOGLE_CLIENT_SECRET"),
      refresh_token: env("GOOGLE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`google_token ${res.status}: ${await res.text()}`);
  const data = await res.json();
  cachedToken = { value: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

function busyCalendarIds() {
  const custom = env("GOOGLE_BUSY_CALENDAR_IDS");
  return custom ? custom.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_BUSY_CALENDARS;
}

async function googleBusy(window: Interval): Promise<Interval[]> {
  const token = await googleToken();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeMin: new Date(window.start).toISOString(),
      timeMax: new Date(window.end).toISOString(),
      timeZone: AGENDA_CONFIG.timeZone,
      items: busyCalendarIds().map((id) => ({ id })),
    }),
  });
  if (!res.ok) throw new Error(`google_freebusy ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const busy: Interval[] = [];
  for (const [id, cal] of Object.entries<{ busy?: { start: string; end: string }[]; errors?: unknown[] }>(
    data.calendars ?? {},
  )) {
    if (cal.errors?.length) console.warn("freebusy calendar error", id, JSON.stringify(cal.errors));
    for (const b of cal.busy ?? []) busy.push({ start: Date.parse(b.start), end: Date.parse(b.end) });
  }
  return busy;
}

async function dbBusy(window: Interval): Promise<Interval[]> {
  const { data, error } = await db
    .from("agendamentos")
    .select("inicio, fim")
    .in("status", ["pendente", "confirmado"])
    .lt("inicio", new Date(window.end).toISOString())
    .gt("fim", new Date(window.start).toISOString());
  if (error) throw error;
  return (data ?? []).map((r) => ({ start: Date.parse(r.inicio), end: Date.parse(r.fim) }));
}

type Lead = { nome: string; empresa?: string; email: string; whatsapp?: string; descricao?: string };

async function createEvent(start: number, end: number, lead: Lead) {
  const token = await googleToken();
  const calendarId = encodeURIComponent(env("GOOGLE_EVENT_CALENDAR_ID") || "primary");
  const description = [
    "Reunião agendada pelo site moveai.tech",
    "",
    `Nome: ${lead.nome}`,
    lead.empresa ? `Empresa: ${lead.empresa}` : "",
    `E-mail: ${lead.email}`,
    lead.whatsapp ? `WhatsApp: ${lead.whatsapp}` : "",
    lead.descricao ? `\nNecessidade:\n${lead.descricao}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: `Move AI × ${lead.empresa || lead.nome}`,
        description,
        start: { dateTime: new Date(start).toISOString(), timeZone: AGENDA_CONFIG.timeZone },
        end: { dateTime: new Date(end).toISOString(), timeZone: AGENDA_CONFIG.timeZone },
        attendees: [{ email: lead.email, displayName: lead.nome }],
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        reminders: { useDefault: true },
        conferenceData: {
          createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } },
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`google_insert ${res.status}: ${await res.text()}`);
  const ev = await res.json();
  const meet =
    ev.hangoutLink ??
    ev.conferenceData?.entryPoints?.find((e: { entryPointType: string }) => e.entryPointType === "video")?.uri ??
    null;
  return { id: ev.id as string, htmlLink: ev.htmlLink as string, meetLink: meet as string | null };
}

// ---------- validação ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function ipHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const bytes = new TextEncoder().encode(`${ip}|${env("SUPABASE_URL")}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------- handlers ----------
async function handleSlots(origin: string | null) {
  const now = Date.now();
  const window = queryWindow(now);
  const [g, d] = await Promise.all([googleBusy(window), dbBusy(window)]);
  return json(
    {
      timeZone: AGENDA_CONFIG.timeZone,
      slotMinutes: AGENDA_CONFIG.slotMinutes,
      days: freeSlots(now, [...g, ...d]),
    },
    200,
    origin,
  );
}

async function handleBook(req: Request, body: Record<string, unknown>, origin: string | null) {
  const now = Date.now();
  const startIso = clean(body.start, 40);
  const lead: Lead = {
    nome: clean(body.nome, 120),
    empresa: clean(body.empresa, 160) || undefined,
    email: clean(body.email, 254).toLowerCase(),
    whatsapp: clean(body.whatsapp, 20) || undefined,
    descricao: clean(body.descricao, 2000) || undefined,
  };

  if (!lead.nome || !EMAIL_RE.test(lead.email)) return json({ error: "dados_invalidos" }, 400, origin);
  if (!isValidSlot(now, startIso)) return json({ error: "horario_invalido" }, 400, origin);

  const start = Date.parse(startIso);
  const end = start + AGENDA_CONFIG.slotMinutes * 60_000;
  const nowIso = new Date(now).toISOString();

  // Uma reunião futura ativa por e-mail
  const { data: existing } = await db
    .from("agendamentos")
    .select("inicio")
    .eq("email", lead.email)
    .in("status", ["pendente", "confirmado"])
    .gt("inicio", nowIso)
    .limit(1);
  if (existing && existing.length) {
    return json({ error: "ja_agendado", inicio: existing[0].inicio }, 409, origin);
  }

  // Limite por IP (anti-abuso)
  const hash = await ipHash(req);
  const { count } = await db
    .from("agendamentos")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", hash)
    .gt("created_at", new Date(now - 24 * 3600_000).toISOString());
  if ((count ?? 0) >= MAX_BOOKINGS_PER_IP_PER_DAY) return json({ error: "limite_excedido" }, 429, origin);

  // Reserva o horário no banco (o índice único impede duas reservas simultâneas)
  const { data: row, error: insErr } = await db
    .from("agendamentos")
    .insert({
      inicio: new Date(start).toISOString(),
      fim: new Date(end).toISOString(),
      nome: lead.nome,
      empresa: lead.empresa ?? null,
      email: lead.email,
      whatsapp: lead.whatsapp ?? null,
      descricao: lead.descricao ?? null,
      status: "pendente",
      ip_hash: hash,
    })
    .select("id")
    .single();
  if (insErr) {
    if (insErr.code === "23505") return json({ error: "horario_ocupado" }, 409, origin);
    if (insErr.code === "23514") return json({ error: "dados_invalidos" }, 400, origin);
    throw insErr;
  }

  const cancel = () => db.from("agendamentos").update({ status: "cancelado" }).eq("id", row.id);

  try {
    // Confere de novo no Google (alguém pode ter marcado algo direto na agenda)
    const busy = await googleBusy({ start, end });
    if (busy.some((b) => b.start < end && start < b.end)) {
      await cancel();
      return json({ error: "horario_ocupado" }, 409, origin);
    }
    const ev = await createEvent(start, end, lead);
    await db
      .from("agendamentos")
      .update({ status: "confirmado", google_event_id: ev.id, meet_link: ev.meetLink })
      .eq("id", row.id);
    return json(
      { ok: true, inicio: new Date(start).toISOString(), fim: new Date(end).toISOString(), meetLink: ev.meetLink },
      200,
      origin,
    );
  } catch (e) {
    await cancel();
    throw e;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "metodo_nao_permitido" }, 405, origin);
  if (!googleConfigured()) return json({ error: "agenda_nao_configurada" }, 503, origin);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "json_invalido" }, 400, origin);
  }

  try {
    if (body.action === "slots") return await handleSlots(origin);
    if (body.action === "book") return await handleBook(req, body, origin);
    return json({ error: "acao_invalida" }, 400, origin);
  } catch (e) {
    console.error("agenda error", e instanceof Error ? e.message : e);
    return json({ error: "erro_interno" }, 500, origin);
  }
});
