import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl animate-float animation-delay-400" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Automação inteligente com IA</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-in-up animation-delay-200">
            Devolvemos o que mais vale no mundo corporativo:{" "}
            <span className="text-gradient">TEMPO e EQUILÍBRIO</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-400">
            Automatização inteligente de processos com IA.{" "}
            <strong className="text-foreground">Você pede, nós cumprimos.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
            <Link to="/contato">
              <button className="btn-gradient text-base px-8 py-4 animate-pulse-glow">
                Fale com Vendas
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </Link>
            <Link to="/solucoes">
              <Button variant="outline" size="lg" className="px-8">
                Conheça nossas Soluções
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-10 border-t border-border/50 animate-fade-in-up animation-delay-600">
            <p className="text-sm text-muted-foreground mb-4">Empresas que confiam na MoveAI</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {/* Placeholder logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
