import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-brand-blue/5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Agende uma demonstração gratuita</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Pronto para recuperar seu{" "}
            <span className="text-gradient">tempo</span>?
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Descubra como a MoveAI pode transformar seus processos em minutos, não meses.
            Sem compromisso, sem complicação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contato">
              <button className="btn-gradient text-base px-8 py-4">
                Agendar Demonstração Gratuita
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Resposta em até 24 horas • Sem cartão de crédito
          </p>
        </div>
      </div>
    </section>
  );
}
