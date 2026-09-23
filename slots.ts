// Regras de disponibilidade da agenda da Move AI.
// Arquivo puro (sem APIs do Deno) para poder ser testado também no Vitest.

export const AGENDA_CONFIG = {
  /** Offset fixo de Brasília (sem horário de verão desde 2019). */
  utcOffsetHours: -3,
  timeZone: "America/Sao_Paulo",
  /** 1 = segunda ... 5 = sexta (0 = domingo, 6 = sábado) */
  weekdays: [1, 2, 3, 4, 5],
  /** Primeiro horário de início */
  dayStartHour: 8,
  /** Fim do expediente: a última reunião termina às 18:00 */
  dayEndHour: 18,
  slotMinutes: 30,
  /** Antecedência mínima para marcar */
  minNoticeMinutes: 120,
  /** Até quantos dias à frente (contando a partir de hoje) */
  maxDaysAhead: 14,
} as const;

export type Interval = { start: number; end: number }; // epoch ms

export type DaySlots = { date: string; slots: string[] };

const MS_MIN = 60_000;
const MS_HOUR = 60 * MS_MIN;
const MS_DAY = 24 * MS_HOUR;

/** Data local de Brasília (YYYY-MM-DD) e dia da semana para um instante. */
export function localDateParts(epochMs: number, cfg = AGENDA_CONFIG) {
  const local = new Date(epochMs + cfg.utcOffsetHours * MS_HOUR);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();
  return {
    y,
    m,
    d,
    weekday: local.getUTCDay(),
    iso: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
  };
}

/** Converte data/hora local de Brasília para epoch ms (UTC). */
export function localToUtc(y: number, m: number, d: number, hour: number, minute: number, cfg = AGENDA_CONFIG) {
  return Date.UTC(y, m, d, hour - cfg.utcOffsetHours, minute);
}

/** Todos os horários possíveis (ignorando ocupação) dentro da janela, agrupados por dia útil. */
export function candidateSlots(nowMs: number, cfg = AGENDA_CONFIG): { date: string; starts: number[] }[] {
  const today = localDateParts(nowMs, cfg);
  const earliest = nowMs + cfg.minNoticeMinutes * MS_MIN;
  const days: { date: string; starts: number[] }[] = [];

  for (let offset = 0; offset <= cfg.maxDaysAhead; offset++) {
    const dayMidnightUtc = localToUtc(today.y, today.m, today.d, 0, 0, cfg) + offset * MS_DAY;
    const parts = localDateParts(dayMidnightUtc, cfg);
    if (!(cfg.weekdays as readonly number[]).includes(parts.weekday)) continue;

    const starts: number[] = [];
    for (let min = cfg.dayStartHour * 60; min + cfg.slotMinutes <= cfg.dayEndHour * 60; min += cfg.slotMinutes) {
      const start = localToUtc(parts.y, parts.m, parts.d, Math.floor(min / 60), min % 60, cfg);
      if (start >= earliest) starts.push(start);
    }
    days.push({ date: parts.iso, starts });
  }
  return days;
}

export function overlaps(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end;
}

/** Horários livres = candidatos que não colidem com nenhum período ocupado. */
export function freeSlots(nowMs: number, busy: Interval[], cfg = AGENDA_CONFIG): DaySlots[] {
  return candidateSlots(nowMs, cfg).map(({ date, starts }) => ({
    date,
    slots: starts
      .filter((s) => !busy.some((b) => overlaps({ start: s, end: s + cfg.slotMinutes * MS_MIN }, b)))
      .map((s) => new Date(s).toISOString()),
  }));
}

/** Janela total consultada (para o freeBusy do Google). */
export function queryWindow(nowMs: number, cfg = AGENDA_CONFIG): Interval {
  const days = candidateSlots(nowMs, cfg);
  const all = days.flatMap((d) => d.starts);
  if (all.length === 0) return { start: nowMs, end: nowMs };
  return { start: Math.min(...all), end: Math.max(...all) + cfg.slotMinutes * MS_MIN };
}

/** Um horário pedido pelo site só é aceito se for um candidato válido (alinhado, dia útil, dentro da janela). */
export function isValidSlot(nowMs: number, startIso: string, cfg = AGENDA_CONFIG): boolean {
  const start = Date.parse(startIso);
  if (Number.isNaN(start)) return false;
  return candidateSlots(nowMs, cfg).some((d) => d.starts.includes(start));
}
