import { ArrowRight, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section id="contato" className="py-20 lg:py-32 relative overflow-hidden">
      {/* BG glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-10 lg:p-16 text-center reveal"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 mb-8">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Demonstração gratuita • Sem compromisso</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Pronto para recuperar seu{" "}
              <span className="text-gradient">tempo</span>?
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Descubra como a MoveAI pode transformar seus processos em dias, não meses.
              Resposta em até 24 horas — <strong className="text-foreground">sem cartão de crédito.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Quero%20conhecer%20as%20soluções%20da%20MoveAI."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient text-base px-10 py-4 animate-pulse-glow"
              >
                Falar com um Especialista
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Resposta em até 24h
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Zero burocracia
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Sem multas de rescisão
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
