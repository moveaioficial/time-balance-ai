const tools = [
  {
    name: "OpenAI",
    colorLogo: "https://cdn.simpleicons.org/openai/10a37f",
  },
  {
    name: "Google Gemini",
    colorLogo: "https://cdn.simpleicons.org/googlegemini/4285F4",
  },
  {
    name: "Google Workspace",
    colorLogo: "https://cdn.simpleicons.org/google/4285F4",
  },
  {
    name: "Supabase",
    colorLogo: "https://cdn.simpleicons.org/supabase/3ECF8E",
  },
  {
    name: "Firebase",
    colorLogo: "https://cdn.simpleicons.org/firebase/FFCA28",
  },
  {
    name: "Claude",
    colorLogo: "https://cdn.simpleicons.org/anthropic/D4A574",
  },
  {
    name: "n8n",
    colorLogo: "https://cdn.simpleicons.org/n8n/EA4B71",
  },
  {
    name: "Make",
    colorLogo: "https://cdn.simpleicons.org/make/6D00CC",
  },
  {
    name: "Lovable",
    colorLogo: "https://cdn.simpleicons.org/lovable/FF3366",
  },
  {
    name: "Chatwoot",
    colorLogo: "https://cdn.simpleicons.org/chatwoot/1F93FF",
  },
  {
    name: "SerpAPI",
    colorLogo: null,
  },
  {
    name: "Apify",
    colorLogo: "https://cdn.simpleicons.org/apify/00C2CB",
  },
];

export function ToolsMarquee() {
  return (
    <section className="py-16 border-y border-white/6 bg-card/40">
      <div className="section-container">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium text-center mb-12">
          Tecnologias que dominamos
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm hover:border-white/16 hover:bg-white/8 hover:scale-105 transition-all duration-300 cursor-default"
            >
              {tool.colorLogo ? (
                <img
                  src={tool.colorLogo}
                  alt={tool.name}
                  className="h-10 w-10 object-contain flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-foreground/80 text-center leading-tight">SERP</span>
                </div>
              )}
              <span className="text-xs font-medium text-muted-foreground text-center leading-tight">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
