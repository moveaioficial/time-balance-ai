const tools = [
  {
    name: "OpenAI",
    logo: "https://cdn.simpleicons.org/openai/ffffff",
    colorLogo: "https://cdn.simpleicons.org/openai/10a37f",
  },
  {
    name: "Google Gemini",
    logo: "https://cdn.simpleicons.org/googlegemini/ffffff",
    colorLogo: "https://cdn.simpleicons.org/googlegemini/4285F4",
  },
  {
    name: "Google Workspace",
    logo: "https://cdn.simpleicons.org/google/ffffff",
    colorLogo: "https://cdn.simpleicons.org/google/4285F4",
  },
  {
    name: "Supabase",
    logo: "https://cdn.simpleicons.org/supabase/ffffff",
    colorLogo: "https://cdn.simpleicons.org/supabase/3ECF8E",
  },
  {
    name: "Firebase",
    logo: "https://cdn.simpleicons.org/firebase/ffffff",
    colorLogo: "https://cdn.simpleicons.org/firebase/FFCA28",
  },
  {
    name: "Anthropic",
    logo: "https://cdn.simpleicons.org/anthropic/ffffff",
    colorLogo: "https://cdn.simpleicons.org/anthropic/D4A17A",
  },
  {
    name: "n8n",
    logo: "https://cdn.simpleicons.org/n8n/ffffff",
    colorLogo: "https://cdn.simpleicons.org/n8n/EA4B71",
  },
  {
    name: "Make",
    logo: "https://cdn.simpleicons.org/make/ffffff",
    colorLogo: "https://cdn.simpleicons.org/make/6D00CC",
  },
  {
    name: "Lovable",
    logo: "https://cdn.simpleicons.org/lovable/ffffff",
    colorLogo: "https://cdn.simpleicons.org/lovable/FF3366",
  },
  {
    name: "Chatwoot",
    logo: "https://cdn.simpleicons.org/chatwoot/ffffff",
    colorLogo: "https://cdn.simpleicons.org/chatwoot/1F93FF",
  },
  {
    name: "SerpAPI",
    logo: null,
    colorLogo: null,
    text: "SerpAPI",
  },
  {
    name: "Apify",
    logo: "https://cdn.simpleicons.org/apify/ffffff",
    colorLogo: "https://cdn.simpleicons.org/apify/00C2CB",
  },
];

export function ToolsMarquee() {
  const doubled = [...tools, ...tools];

  return (
    <section className="py-14 border-y border-white/6 overflow-hidden bg-card/40">
      <div className="section-container mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          Tecnologias que dominamos
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
        />

        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 40s linear infinite",
          }}
        >
          {doubled.map((tool, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-3 mx-5 px-5 py-3 rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm flex-shrink-0 group hover:border-primary/30 transition-all duration-300 cursor-default"
              style={{ minWidth: "140px" }}
            >
              {tool.logo ? (
                <>
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="h-5 w-5 object-contain flex-shrink-0 transition-all duration-300"
                    style={{
                      filter: "grayscale(1) brightness(0.6)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).src = tool.colorLogo!;
                      (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) brightness(1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).src = tool.logo!;
                      (e.currentTarget as HTMLImageElement).style.filter = "grayscale(1) brightness(0.6)";
                    }}
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {tool.name}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {tool.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
