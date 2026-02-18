const tools = [
  { name: "n8n", logo: null },
  { name: "OpenAI", logo: null },
  { name: "WhatsApp", logo: null },
  { name: "Make", logo: null },
  { name: "Evolution API", logo: null },
  { name: "Chatwoot", logo: null },
  { name: "AWS", logo: null },
  { name: "Zapier", logo: null },
  { name: "Typebot", logo: null },
  { name: "Supabase", logo: null },
  { name: "Google AI", logo: null },
  { name: "Flowise", logo: null },
];

export function ToolsMarquee() {
  const doubled = [...tools, ...tools];

  return (
    <section className="py-14 border-y border-white/6 overflow-hidden bg-card/40">
      <div className="section-container mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          Tecnologias que dominamos
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(230,40%,5%), transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(230,40%,5%), transparent)" }} />

        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((tool, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center mx-6 px-6 py-3 rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm flex-shrink-0 min-w-[120px] group hover:border-primary/40 transition-colors"
            >
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
