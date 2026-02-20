import { useRef } from "react";

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

// Duplicate list for seamless loop
const doubled = [...tools, ...tools];

function LogoItem({ tool }: { tool: typeof tools[0] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 mx-8 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
      {tool.colorLogo ? (
        <img
          src={tool.colorLogo}
          alt={tool.name}
          className="h-9 w-9 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="h-9 w-9 flex items-center justify-center">
          <span className="text-[10px] font-bold text-foreground/80 text-center leading-tight tracking-wider">
            SERP
          </span>
        </div>
      )}
    </div>
  );
}

export function ToolsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section className="py-16 border-y border-white/6 bg-card/40">
      <div className="section-container">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium text-center mb-12">
          Tecnologias que dominamos
        </p>
      </div>

      {/* Marquee strip — full bleed */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[hsl(var(--background))] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[hsl(var(--background))] to-transparent" />

        <div
          ref={trackRef}
          className="flex animate-marquee"
          style={{ width: "max-content" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleMouseEnter}
        >
          {doubled.map((tool, i) => (
            <LogoItem key={`${tool.name}-${i}`} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
