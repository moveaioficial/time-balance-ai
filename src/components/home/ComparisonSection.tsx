import { Check, X } from "lucide-react";

const rows = [
  {
    label: "Tempo para contratar",
    moveai: "Poucas Horas",
    freelancers: "5–7 dias",
    interno: "Meses",
    agencias: "2–3 Semanas",
  },
  {
    label: "Nível de Experiência",
    moveai: "Nível Sênior",
    freelancers: "Iniciante / Júnior",
    interno: "Risco de rotatividade",
    agencias: "Confie na Sorte",
  },
  {
    label: "Comunicação",
    moveai: "Diária",
    freelancers: "Inconsistente",
    interno: "Reuniões longas",
    agencias: "Fantasma",
  },
  {
    label: "Primeira Entrega",
    moveai: "2–3 dias",
    freelancers: "Várias Semanas",
    interno: "6–7 Semanas",
    agencias: "2–3 Meses",
  },
  {
    label: "Rescisão",
    moveai: "Um clique, zero multas",
    freelancers: "Demorada",
    interno: "Custos trabalhistas altos",
    agencias: "Multas contratuais",
  },
];

export function ComparisonSection() {
  return (
    <section id="compare" className="py-20 lg:py-32 bg-card/30">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Compare suas <span className="text-gradient">Opções</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A escolha mais inteligente, transparente e sem riscos.
          </p>
        </div>

        {/* Table */}
        <div className="reveal overflow-x-auto">
          <table className="w-full min-w-[640px]">
            {/* Header */}
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium w-1/5">
                  Critério
                </th>
                {/* MoveAI */}
                <th className="py-4 px-4 w-1/5">
                  <div className="rounded-xl py-3 px-4 text-center"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(59,130,246,0.12) 100%)", border: "1px solid rgba(124,58,237,0.35)" }}>
                    <span className="text-sm font-bold text-foreground">MoveAI</span>
                    <div className="mt-1">
                      <Check className="h-4 w-4 text-green-400 mx-auto" />
                    </div>
                  </div>
                </th>
                {/* Others */}
                {["FREELANCERS", "EQUIPE INTERNA", "OUTRAS AGÊNCIAS"].map((col) => (
                  <th key={col} className="py-4 px-4 w-1/5">
                    <div className="rounded-xl py-3 px-4 text-center bg-white/3 border border-white/6">
                      <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wide">{col}</span>
                      <div className="mt-1">
                        <X className="h-4 w-4 text-red-400/70 mx-auto" />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={`border-t border-white/5 ${i % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                  <td className="py-4 px-4 text-sm font-medium text-muted-foreground">
                    {row.label}
                  </td>
                  {/* MoveAI column */}
                  <td className="py-4 px-4 text-center"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.07) 0%, rgba(59,130,246,0.05) 100%)" }}>
                    <span className="text-sm font-semibold text-foreground px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/20">
                      {row.moveai}
                    </span>
                  </td>
                  {/* Others columns */}
                  {[row.freelancers, row.interno, row.agencias].map((val, j) => (
                    <td key={j} className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground/60">{val}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA below table */}
        <div className="text-center mt-12 reveal">
          <button
            onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-gradient px-8 py-4 text-base"
          >
            Quero trabalhar com a MoveAI
          </button>
        </div>
      </div>
    </section>
  );
}
