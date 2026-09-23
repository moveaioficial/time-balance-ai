import { describe, expect, it } from "vitest";
import { candidateSlots, freeSlots, isValidSlot, queryWindow } from "../../supabase/functions/agenda/slots";

// Terça, 22/09/2026 20:00 em Brasília (23:00 UTC)
const TUE_NIGHT = Date.parse("2026-09-22T23:00:00Z");
// Quarta, 23/09/2026 09:10 em Brasília
const WED_0910 = Date.parse("2026-09-23T12:10:00Z");

describe("agenda: horários candidatos", () => {
  it("só dias úteis, até 14 dias à frente", () => {
    const days = candidateSlots(TUE_NIGHT).map((d) => d.date);
    expect(days[0]).toBe("2026-09-22");
    expect(days.at(-1)).toBe("2026-10-06");
    for (const d of days) {
      const wd = new Date(`${d}T12:00:00Z`).getUTCDay();
      expect(wd).toBeGreaterThanOrEqual(1);
      expect(wd).toBeLessThanOrEqual(5);
    }
  });

  it("20 horários de 30 min por dia, de 08:00 a 17:30 (Brasília)", () => {
    const wed = candidateSlots(TUE_NIGHT).find((d) => d.date === "2026-09-23")!;
    expect(wed.starts).toHaveLength(20);
    expect(new Date(wed.starts[0]).toISOString()).toBe("2026-09-23T11:00:00.000Z"); // 08:00 BRT
    expect(new Date(wed.starts.at(-1)!).toISOString()).toBe("2026-09-23T20:30:00.000Z"); // 17:30 BRT
  });

  it("hoje depois das 18h não tem horários", () => {
    expect(candidateSlots(TUE_NIGHT)[0].starts).toHaveLength(0);
  });

  it("respeita 2h de antecedência", () => {
    const wed = candidateSlots(WED_0910).find((d) => d.date === "2026-09-23")!;
    expect(new Date(wed.starts[0]).toISOString()).toBe("2026-09-23T14:30:00.000Z"); // 11:30 BRT
  });
});

describe("agenda: ocupação e validação", () => {
  it("remove horários que colidem com compromissos", () => {
    const busy = [{ start: Date.parse("2026-09-23T13:15:00Z"), end: Date.parse("2026-09-23T14:00:00Z") }];
    const wed = freeSlots(TUE_NIGHT, busy).find((d) => d.date === "2026-09-23")!;
    expect(wed.slots).not.toContain("2026-09-23T13:00:00.000Z"); // 10:00 BRT (colide 10:15)
    expect(wed.slots).not.toContain("2026-09-23T13:30:00.000Z"); // 10:30 BRT
    expect(wed.slots).toContain("2026-09-23T14:00:00.000Z"); // 11:00 BRT livre
    expect(wed.slots).toHaveLength(18);
  });

  it("só aceita horários válidos", () => {
    expect(isValidSlot(TUE_NIGHT, "2026-09-23T11:00:00.000Z")).toBe(true);
    expect(isValidSlot(TUE_NIGHT, "2026-09-23T11:15:00.000Z")).toBe(false); // desalinhado
    expect(isValidSlot(TUE_NIGHT, "2026-09-26T13:00:00.000Z")).toBe(false); // sábado
    expect(isValidSlot(TUE_NIGHT, "2026-09-23T21:00:00.000Z")).toBe(false); // 18:00 BRT
    expect(isValidSlot(TUE_NIGHT, "2026-10-07T13:00:00.000Z")).toBe(false); // além de 14 dias
    expect(isValidSlot(TUE_NIGHT, "lixo")).toBe(false);
  });

  it("janela de consulta cobre do primeiro ao último horário", () => {
    const w = queryWindow(TUE_NIGHT);
    expect(new Date(w.start).toISOString()).toBe("2026-09-23T11:00:00.000Z");
    expect(new Date(w.end).toISOString()).toBe("2026-10-06T21:00:00.000Z");
  });
});
