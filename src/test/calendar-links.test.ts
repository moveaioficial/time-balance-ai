import { describe, expect, it } from "vitest";
import { googleCalendarUrl, icsContent, outlookCalendarUrl, toCalendarStamp } from "@/lib/calendar-links";
import { dayLabels, formatLong, formatTime } from "@/lib/agenda";

const ev = {
  title: "Reunião com a Move AI",
  description: "Linha 1\nLinha 2, com vírgula; e ponto-e-vírgula",
  location: "https://meet.google.com/abc-defg-hij",
  start: new Date("2026-09-23T13:30:00Z"),
  end: new Date("2026-09-23T14:00:00Z"),
};

describe("links de agenda", () => {
  it("formata datas no padrão de calendário", () => {
    expect(toCalendarStamp(ev.start)).toBe("20260923T133000Z");
  });
  it("Google Agenda", () => {
    const u = new URL(googleCalendarUrl(ev));
    expect(u.searchParams.get("dates")).toBe("20260923T133000Z/20260923T140000Z");
    expect(u.searchParams.get("text")).toBe(ev.title);
    expect(u.searchParams.get("location")).toBe(ev.location);
  });
  it("Outlook", () => {
    const u = new URL(outlookCalendarUrl(ev));
    expect(u.searchParams.get("startdt")).toBe("2026-09-23T13:30:00.000Z");
    expect(u.searchParams.get("subject")).toBe(ev.title);
  });
  it(".ics válido e escapado", () => {
    const ics = icsContent(ev, "teste@moveai.tech");
    expect(ics).toContain("DTSTART:20260923T133000Z\r\n");
    expect(ics).toContain("DTEND:20260923T140000Z\r\n");
    expect(ics).toContain("DESCRIPTION:Linha 1\\nLinha 2\\, com vírgula\\; e ponto-e-vírgula\r\n");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });
});

describe("formatação em horário de Brasília", () => {
  it("hora e data", () => {
    expect(formatTime("2026-09-23T13:30:00.000Z")).toBe("10:30");
    expect(formatLong("2026-09-23T13:30:00.000Z")).toBe("quarta-feira, 23 de setembro, às 10:30");
    expect(dayLabels("2026-09-23")).toEqual({ weekday: "qua", dayMonth: "23/09" });
  });
});
