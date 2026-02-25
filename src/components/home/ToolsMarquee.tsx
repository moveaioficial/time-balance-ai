import { useRef } from "react";
import logoOpenai from "@/assets/logo-openai-white.jpg";
import logoSerpapi from "@/assets/logo-serpapi.webp";
import logoApify from "@/assets/logo-apify.svg";
import logoLovable from "@/assets/logo-lovable.png";

const tools = [
  { name: "OpenAI", logo: logoOpenai },
  { name: "Google Gemini", logo: "https://cdn.simpleicons.org/googlegemini/4285F4" },
  { name: "Google Workspace", logo: "https://cdn.simpleicons.org/google/4285F4" },
  { name: "Supabase", logo: "https://cdn.simpleicons.org/supabase/3ECF8E" },
  { name: "Firebase", logo: "https://cdn.simpleicons.org/firebase/FFCA28" },
  { name: "Claude", logo: "https://cdn.simpleicons.org/anthropic/D4A574" },
  { name: "n8n", logo: "https://cdn.simpleicons.org/n8n/EA4B71" },
  { name: "Make", logo: "https://cdn.simpleicons.org/make/6D00CC" },
  { name: "Lovable", logo: logoLovable },
  { name: "Chatwoot", logo: "https://cdn.simpleicons.org/chatwoot/1F93FF" },
  { name: "SerpAPI", logo: logoSerpapi },
  { name: "Apify", logo: logoApify },
];

const doubled = [...tools, ...tools];

function LogoItem({ tool }: { tool: typeof tools[0] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 mx-10 flex-shrink-0 group cursor-default">
      <div className="relative transition-all duration-300 ease-out group-hover:scale-110">
        <img
          src={tool.logo}
          alt={tool.name}
          className="h-10 w-10 object-contain brightness-110 contrast-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.25)] transition-all duration-300 group-hover:brightness-125 group-hover:drop-shadow-[0_0_14px_rgba(59,130,246,0.4)]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function ToolsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const handleMouseLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  return (
    <section className="py-8 lg:py-10 border-y border-white/[0.06] bg-white/[0.02]">
      <div className="section-container">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80 font-semibold text-center mb-6">
          Tecnologias que dominamos
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[hsl(var(--background))] to-transparent" />
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
