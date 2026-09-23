import { getSupabase } from "@/lib/supabase";

export const AGENDA_TZ = "America/Sao_Paulo";

export type AgendaDay = { date: string; slots: string[] };
export type Lead = { nome: string; empresa?: string; email: string; whatsapp?: string; descricao?: string };
export type Booking = { inicio: string; fim: string; meetLink: string | null };

export type AgendaErrorCode =
  | "agenda_nao_configurada"
  | "horario_ocupado"
  | "horario_invalido"
  | "ja_agendado"
  | "limite_excedido"
  | "dados_invalidos"
  | "erro_interno"
  | "rede";

export class AgendaError extends Error {
  constructor(
    public code: AgendaErrorCode,
    public extra: Record<string, unknown> = {},
  ) {
    super(code);
  }
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  let supabase;
  try {
    supabase = await getSupabase();
  } catch {
    throw new AgendaError("agenda_nao_configurada");
  }
  const { data, error } = await supabase.functions.invoke("agenda", { body });
  if (!error) return data as T;

  // Erros HTTP da função trazem { error: "codigo" } no corpo
  const ctx = (error as { context?: Response }).context;
  if (ctx && typeof ctx.json === "function") {
    try {
      const payload = await ctx.json();
      if (payload?.error) throw new AgendaError(payload.error as AgendaErrorCode, payload);
    } catch (e) {
      if (e instanceof AgendaError) throw e;
    }
  }
  throw new AgendaError("rede");
}

export async function fetchAvailability(): Promise<AgendaDay[]> {
  const res = await call<{ days: AgendaDay[] }>({ action: "slots" });
  return res.days ?? [];
}

export async function bookSlot(start: string, lead: Lead): Promise<Booking> {
  return call<Booking>({ action: "book", start, ...lead });
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", { timeZone: AGENDA_TZ, ...opts });

export const formatTime = (iso: string) => fmt({ hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** "qua" / "23/09" a partir de "2026-09-23" (meio-dia UTC evita virar o dia) */
export function dayLabels(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return {
    weekday: fmt({ weekday: "short" }).format(d).replace(".", ""),
    dayMonth: fmt({ day: "2-digit", month: "2-digit" }).format(d),
  };
}

/** "quarta-feira, 23 de setembro, às 10:30" */
export function formatLong(iso: string) {
  const d = new Date(iso);
  const day = fmt({ weekday: "long", day: "numeric", month: "long" }).format(d);
  return `${day}, às ${formatTime(iso)}`;
}
