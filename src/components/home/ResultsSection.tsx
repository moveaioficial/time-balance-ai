import { TrendingDown, Target, BarChart3, Shield, Clock } from "lucide-react";

const results = [
  {
    icon: TrendingDown,
    metric: "-70%",
    label: "Redução de tarefas manuais",
  },
  {
    icon: Target,
    metric: "+40%",
    label: "Conversão comercial",
  },
  {
    icon: BarChart3,
    metric: "3x",
    label: "Mais eficiência operacional",
  },
  {
    icon: Shield,
    metric: "100%",
    label: "Dados sob controle",
  },
  {
    icon: Clock,
    metric: "20h",
    label: "Economia semanal média",
  },
];

export function ResultsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Impacto <span className="text-gradient">comprovado</span> nos nossos clientes
          </h2>
          <p className="text-lg text-muted-foreground">
            Resultados reais de empresas que automatizaram seus processos com a MoveAI
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {results.map((result, index) => (
            <div
              key={result.label}
              className="group text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-brand-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <result.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
                {result.metric}
              </p>
              <p className="text-sm text-muted-foreground">{result.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
