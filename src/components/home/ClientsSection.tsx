const industries = [
  "Clínicas Odontológicas",
  "Escritórios Jurídicos",
  "Contabilidade",
  "Imobiliárias",
  "Escolas e Cursos",
  "Empresas B2B",
];

export function ClientsSection() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Quem já <span className="text-gradient">confia</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Empresas de diversos setores que transformaram seus processos
          </p>
        </div>

        {/* Industry Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {industries.map((industry) => (
            <span
              key={industry}
              className="px-5 py-2.5 rounded-full bg-background border border-border text-sm font-medium hover:border-primary/50 hover:bg-secondary transition-colors cursor-default"
            >
              {industry}
            </span>
          ))}
        </div>

        {/* Logo Wall Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-16 bg-background rounded-lg border border-border flex items-center justify-center"
            >
              <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
