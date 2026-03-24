import { Calendar } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";

export function CTASection() {
  const { openModal } = useContactModal();

  return (
    <section id="contato" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-10 lg:p-16 text-center reveal bg-primary/5 border border-primary/20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 mb-8">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Demonstração gratuita • Sem compromisso</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Pronto para recuperar seu{" "}
              <span className="text-primary">tempo</span>?
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Descubra como a Move AI pode transformar seus processos em dias, não meses.{" "}
              <strong className="text-foreground">Sem cartão de crédito.</strong>
            </p>

            <button onClick={openModal} className="btn-gradient px-10 py-4 text-base">
              Fale com a Move AI
            </button>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Resposta ágil
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
