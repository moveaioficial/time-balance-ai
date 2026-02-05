import { Settings, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Settings,
    title: "Personalização Total",
    description: "Não mudamos seu sistema. Adaptamos a IA ao que você já usa.",
  },
  {
    icon: Users,
    title: "Sem Substituição",
    description: "Não substituímos pessoas. Devolvemos tempo para o que realmente importa.",
  },
  {
    icon: Zap,
    title: "Você no Controle",
    description: "Você pede, nós cumprimos. Simples assim.",
  },
];

export function WhyMoveAI() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Trocamos <span className="text-gradient">EXCESSO</span> pela{" "}
            <span className="text-gradient">EFICIÊNCIA</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            e <strong>SACRIFÍCIO</strong> pela <strong>INTELIGÊNCIA</strong>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-0 bg-background shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
