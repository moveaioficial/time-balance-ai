import { Check, X } from "lucide-react";
import moveaiLogoSvg from "@/assets/moveai-logo.svg";
import { useContactModal } from "@/components/ui/ContactModal";

const rows = [
  { label: "Tempo para contratar", moveai: "Poucas Horas", freelancers: "5–7 dias", agencias: "2–3 Semanas" },
  { label: "Comunicação", moveai: "Diária", freelancers: "Inconsistente", agencias: "Fantasma" },
  { label: "Primeira Entrega", moveai: "5–7 dias", freelancers: "Várias Semanas", agencias: "2–3 Meses" },
  { label: "Rescisão", moveai: "Fácil", freelancers: "Demorada", agencias: "Multas contratuais" },
  { label: "Criação e Redesign", moveai: "Incluído", freelancers: "Varia", agencias: "Separado" },
  { label: "Período de Teste", moveai: "7 dias grátis", freelancers: "Sem garantia", agencias: "Sem garantia" },
];

export function ComparisonSection() {
  const { openModal } = useContactModal();

  return (
    <section id="compare" className="py-20 lg:py-32 bg-card/30">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Compare suas <span className="text-highlight">Opções</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A escolha mais inteligente, transparente e sem riscos.
          </p>
        </div>

        {/* Desktop table */}
        <div className="reveal hidden md:block overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium w-1/4">Critério</th>
                <th className="py-4 px-4 w-1/4">
                  <div className="rounded-xl py-3 px-4 text-center bg-primary/10 border border-primary/30 flex flex-col items-center gap-1">
                    <img
                      src={moveaiLogoSvg}
                      alt="Move AI"
                      className="h-8 w-auto"
                    />
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                </th>
                {["FREELANCERS", "OUTRAS AGÊNCIAS"].map((col) => (
                  <th key={col} className="py-4 px-4 w-1/4">
                    <div className="rounded-xl py-3 px-4 text-center bg-white/3 border border-white/6">
                      <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wide">{col}</span>
                      <div className="mt-1"><X className="h-4 w-4 text-red-400/70 mx-auto" /></div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={`border-t border-white/5 ${i % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                  <td className="py-4 px-4 text-sm font-medium text-muted-foreground">{row.label}</td>
                  <td className="py-4 px-4 text-center bg-primary/5">
                    <span className="text-sm font-semibold text-foreground px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/20">
                      {row.moveai}
                    </span>
                  </td>
                  {[row.freelancers, row.agencias].map((val, j) => (
                    <td key={j} className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground/60">{val}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="reveal md:hidden space-y-4">
          {/* Move AI card */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border-b border-primary/20">
              <img
                src={moveaiLogoSvg}
                alt="Move AI"
                className="h-8 w-auto"
              />
              <Check className="h-4 w-4 text-green-400 ml-auto" />
            </div>
            <div className="divide-y divide-white/5">
              {rows.map((row) => (
                <div key={row.label} className="px-4 py-3 flex justify-between items-center gap-4">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs font-semibold text-foreground px-2 py-1 rounded-md bg-primary/15 border border-primary/20 text-right shrink-0">
                    {row.moveai}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Competitors side by side */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "FREELANCERS", values: rows.map(r => r.freelancers) },
              { label: "OUTRAS AGÊNCIAS", values: rows.map(r => r.agencias) },
            ].map((col) => (
              <div key={col.label} className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-3 bg-white/[0.03] border-b border-white/6">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wide leading-tight">{col.label}</span>
                  <X className="h-3 w-3 text-red-400/70 shrink-0 ml-1" />
                </div>
                <div className="divide-y divide-white/5">
                  {rows.map((row, i) => (
                    <div key={row.label} className="px-3 py-3">
                      <p className="text-[10px] text-muted-foreground/50 mb-0.5">{row.label}</p>
                      <p className="text-xs text-muted-foreground/60">{col.values[i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 reveal">
          <button
            onClick={openModal}
            className="btn-gradient px-8 py-4 text-base"
          >
            Quero trabalhar com a Move AI
          </button>
        </div>
      </div>
    </section>
  );
}
