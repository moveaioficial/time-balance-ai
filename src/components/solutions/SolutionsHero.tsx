import { Puzzle } from "lucide-react";

export function SolutionsHero() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <Puzzle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Soluções sob medida</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Soluções <span className="text-gradient">personalizadas</span> para seu negócio
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground">
            Do pronto ao 100% customizado. Sua empresa, suas regras, nossa tecnologia.
          </p>
        </div>
      </div>
    </section>
  );
}
