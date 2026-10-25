import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CalendarPlus, Download, Loader2, Video } from "lucide-react";
import {
  AgendaError,
  bookSlot,
  dayLabels,
  fetchAvailability,
  formatLong,
  formatTime,
  type AgendaDay,
  type Booking,
  type Lead,
} from "@/lib/agenda";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl, type CalendarEvent } from "@/lib/calendar-links";

const WHATSAPP_URL =
  "https://wa.me/5511971858103?text=" +
  encodeURIComponent("Olá! Preenchi o formulário no site da Move AI e quero marcar uma conversa.");

type Status = "loading" | "ready" | "booking" | "done" | "unavailable";

const ERROR_MESSAGES: Record<string, string> = {
  horario_ocupado: "Esse horário acabou de ser ocupado. Escolha outro, por favor.",
  horario_invalido: "Esse horário não está mais disponível. Escolha outro, por favor.",
  limite_excedido: "Muitas tentativas de agendamento. Fale com a gente pelo WhatsApp.",
  dados_invalidos: "Não conseguimos validar seus dados. Fale com a gente pelo WhatsApp.",
};

const FECHA_EM = 12; // segundos até o aviso de reunião marcada fechar

export function Scheduler({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [status, setStatus] = useState<Status>("loading");
  const [days, setDays] = useState<AgendaDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const load = useCallback(async (keepMessage = false) => {
    setStatus("loading");
    if (!keepMessage) setMessage(null);
    try {
      const result = await fetchAvailability();
      setDays(result);
      const first = result.find((d) => d.slots.length > 0);
      setSelectedDate((prev) =>
        prev && result.some((d) => d.date === prev && d.slots.length > 0) ? prev : (first?.date ?? null),
      );
      setSelectedSlot(null);
      setStatus(first ? "ready" : "unavailable");
    } catch {
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Confirmação única: depois de marcar, o aviso fecha sozinho e a pessoa volta ao site (pausa com o mouse em cima)
  const [resta, setResta] = useState(FECHA_EM);
  const [pausado, setPausado] = useState(false);
  useEffect(() => {
    if (status !== "done" || pausado) return;
    if (resta <= 0) { onClose(); return; }
    const id = window.setTimeout(() => setResta((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [status, pausado, resta, onClose]);

  const currentDay = useMemo(() => days.find((d) => d.date === selectedDate), [days, selectedDate]);

  const confirm = async () => {
    if (!selectedSlot) return;
    setStatus("booking");
    setMessage(null);
    try {
      const result = await bookSlot(selectedSlot, lead);
      setBooking(result);
      setStatus("done");
    } catch (e) {
      const code = e instanceof AgendaError ? e.code : "erro_interno";
      if (code === "ja_agendado" && e instanceof AgendaError && typeof e.extra.inicio === "string") {
        setMessage(`Você já tem uma reunião marcada para ${formatLong(e.extra.inicio)}. Confira o convite no seu e-mail.`);
        setStatus("ready");
        return;
      }
      if (code === "horario_ocupado" || code === "horario_invalido") {
        setMessage(ERROR_MESSAGES[code]);
        await load(true);
        return;
      }
      setMessage(ERROR_MESSAGES[code] ?? "Não foi possível confirmar agora. Tente de novo ou fale pelo WhatsApp.");
      setStatus("ready");
    }
  };

  // ---------- Reunião confirmada ----------
  if (status === "done" && booking) {
    const event: CalendarEvent = {
      title: "Reunião com a Move AI",
      description: [
        "Conversa de 30 minutos com a equipe da Move AI.",
        booking.meetLink ? `Google Meet: ${booking.meetLink}` : "",
        "Dúvidas: https://wa.me/5511971858103",
      ]
        .filter(Boolean)
        .join("\n"),
      location: booking.meetLink ?? "Google Meet (link no convite por e-mail)",
      start: new Date(booking.inicio),
      end: new Date(booking.fim),
    };
    return (
      <div className="text-center py-2" onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
          <CalendarCheck className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">Reunião marcada!</h3>
        <p className="text-foreground/90 text-sm mb-1 first-letter:uppercase">{formatLong(booking.inicio)}</p>
        <p className="text-muted-foreground text-xs mb-5">30 minutos · horário de Brasília</p>

        {booking.meetLink && (
          <a
            href={booking.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-white/5"
          >
            <Video className="h-4 w-4 text-primary" /> Link do Google Meet
          </a>
        )}

        <p className="text-muted-foreground text-sm mb-4">
          Enviamos o convite para <strong className="text-foreground">{lead.email}</strong>. Se preferir, adicione na sua
          agenda:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground hover:border-primary/60"
          >
            <CalendarPlus className="h-4 w-4" /> Google
          </a>
          <a
            href={outlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground hover:border-primary/60"
          >
            <CalendarPlus className="h-4 w-4" /> Outlook
          </a>
          <button
            type="button"
            onClick={() => downloadIcs(event)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground hover:border-primary/60"
          >
            <Download className="h-4 w-4" /> Apple / .ics
          </button>
        </div>
        <div className="mt-6">
          <div className="mx-auto h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${(resta / FECHA_EM) * 100}%` }} />
          </div>
          <button type="button" onClick={onClose} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
            {pausado ? "Voltar ao site" : `Voltando ao site em ${resta}s`}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Cabeçalho comum ----------
  const header = (
    <>
      <p className="text-xs font-medium text-primary mb-2">✓ Recebemos seus dados, {lead.nome.split(" ")[0]}!</p>
      <h3 className="text-2xl font-bold text-foreground mb-1">Quer adiantar? Agende 30 min com a gente</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Escolha um horário (horário de Brasília). O convite com o link do Google Meet chega no seu e-mail.
      </p>
    </>
  );

  if (status === "loading") {
    return (
      <div>
        {header}
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Buscando horários disponíveis…
        </div>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div>
        {header}
        <div className="rounded-xl border border-border bg-background/40 p-5 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Não conseguimos carregar a agenda agora. Nossa equipe vai entrar em contato — ou, se preferir, fale com a
            gente pelo WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-gradient px-5 py-2.5 text-sm">
              <WhatsAppIcon className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <button type="button" onClick={() => load()} className="rounded-lg border border-border px-5 py-2.5 text-sm text-foreground hover:bg-white/5">
              Tentar de novo
            </button>
          </div>
        </div>
        <button type="button" onClick={onClose} className="mt-5 block w-full text-center text-sm text-muted-foreground hover:text-foreground">
          Fechar
        </button>
      </div>
    );
  }

  // ---------- Escolha de dia e horário ----------
  return (
    <div>
      {header}

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-2" role="listbox" aria-label="Dias disponíveis">
        {days.map((d) => {
          const { weekday, dayMonth } = dayLabels(d.date);
          const disabled = d.slots.length === 0;
          const active = d.date === selectedDate;
          return (
            <button
              key={d.date}
              type="button"
              role="option"
              aria-selected={active}
              disabled={disabled}
              onClick={() => {
                setSelectedDate(d.date);
                setSelectedSlot(null);
              }}
              className={`flex min-w-[64px] flex-shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-xs transition-colors ${
                active
                  ? "border-primary bg-primary/15 text-foreground"
                  : disabled
                    ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              <span className="uppercase tracking-wide">{weekday}</span>
              <span className="text-sm font-semibold">{dayMonth}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1" role="listbox" aria-label="Horários">
        {currentDay?.slots.map((s) => {
          const active = s === selectedSlot;
          return (
            <button
              key={s}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => setSelectedSlot(s)}
              className={`rounded-lg border py-2 text-sm transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary/60"
              }`}
            >
              {formatTime(s)}
            </button>
          );
        })}
      </div>

      {message && <p className="mt-4 text-xs text-amber-300 text-center">{message}</p>}

      <button
        type="button"
        onClick={confirm}
        disabled={!selectedSlot || status === "booking"}
        className="btn-gradient mt-5 w-full py-3 text-sm disabled:opacity-50"
      >
        {status === "booking" ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Confirmando…
          </span>
        ) : selectedSlot ? (
          <>Confirmar {formatLong(selectedSlot)}</>
        ) : (
          "Escolha um horário"
        )}
      </button>
      <button type="button" onClick={onClose} className="mt-3 block w-full text-center text-sm text-muted-foreground hover:text-foreground">
        Agora não, prefiro aguardar o contato
      </button>
    </div>
  );
}
