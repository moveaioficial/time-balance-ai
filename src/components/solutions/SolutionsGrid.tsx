import { MessageSquare, Target, LineChart, Database, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const solutions = [
  {
    icon: MessageSquare,
    title: "Automação de Atendimento",
    target: "Clínicas, Escritórios",
    description: "Agendamentos, confirmações e lembretes automáticos",
    benefit: "-70% tempo em tarefas administrativas",
  },
  {
    icon: Target,
    title: "Qualificação Inteligente de Leads",
    target: "Imobiliárias, B2B",
    description: "Score automático e priorização de oportunidades",
    benefit: "+40% conversão do time comercial",
  },
  {
    icon: LineChart,
    title: "Análise Preditiva de Dados",
    target: "Escolas, Cursos",
    description: "Previsão de churn e identificação de oportunidades",
    benefit: "Retenção proativa de clientes",
  },
  {
    icon: Database,
    title: "Integração CRM + IA",
    target: "Todos os segmentos",
    description: "Adiciona camada de IA ao seu CRM atual",
    benefit: "Sem migração, só evolução",
  },
];

export function SolutionsGrid() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Soluções Pré-Configuradas
          </h2>
          <p className="text-lg text-muted-foreground">
            Prontas para implementar, personalizáveis para seu contexto
          </p>
        </div>

        {/* Solutions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={solution.title}
              className="group border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                    <solution.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                    {solution.target}
                  </span>
                </div>
                <CardTitle className="text-xl mt-4">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{solution.description}</p>
                <p className="text-sm font-medium text-gradient">{solution.benefit}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Solution Card */}
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-brand-blue/5 border-primary/20">
          <CardContent className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-brand-blue flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="text-center lg:text-left flex-1">
                <h3 className="text-2xl font-bold mb-3">Seu desafio é único?</h3>
                <p className="text-muted-foreground mb-4">
                  Criamos soluções 100% customizadas para problemas que não têm resposta pronta.
                  Analisamos seu cenário e desenvolvemos a solução ideal.
                </p>
                <button className="btn-gradient">
                  Fale com especialista
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
