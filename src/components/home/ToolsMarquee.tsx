import { useRef } from "react";
import logoSerpapi from "@/assets/logo-serpapi.webp";
import logoApify from "@/assets/logo-apify.svg";
import logoLovable from "@/assets/logo-lovable.png";

const tools = [
  { name: "OpenAI", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z'/%3E%3C/svg%3E" },
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
] as { name: string; logo: string; invert?: boolean }[];

const doubled = [...tools, ...tools];

function LogoItem({ tool }: { tool: { name: string; logo: string; invert?: boolean } }) {
  return (
    <div className="flex items-center justify-center mx-12 flex-shrink-0 group cursor-default">
      <div className="w-16 h-16 flex items-center justify-center">
        <img
          src={tool.logo}
          alt={tool.name}
          className="h-11 w-11 object-contain transition-all duration-300 ease-out group-hover:scale-125 group-hover:brightness-125"
          style={{
            filter: `${tool.invert ? "invert(1) " : ""}brightness(1.15) contrast(1.1) drop-shadow(0 0 6px rgba(255,255,255,0.12))`,
          }}
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
    <section className="py-8 lg:py-10 border-y border-white/[0.06] bg-white/[0.03]">
      <div className="section-container">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold text-center mb-6">
          Tecnologias que dominamos
        </p>
      </div>

      <div className="relative overflow-hidden">

        <div
          ref={trackRef}
          className="flex items-center animate-marquee"
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
