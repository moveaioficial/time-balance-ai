// Animação da abertura: um site, uma marca e um feed sendo montados ao mesmo tempo.
// Tudo em CSS (classes hv-* em index.css), em ciclo de 10s. Com movimento reduzido, mostra o estado final.

const swatches = ["#48156F", "#551F7E", "#225C9E", "#00C3D0", "#FAFAFC"];
const feed = [
  "linear-gradient(135deg,#48156F,#225C9E)",
  "#FAFAFC",
  "linear-gradient(160deg,#00C3D0,#225C9E)",
  "#1A0F2E",
  "linear-gradient(135deg,#551F7E,#00C3D0)",
  "#FAFAFC",
  "linear-gradient(200deg,#225C9E,#48156F)",
  "#00C3D0",
  "#1A0F2E",
];

export function HeroVisual() {
  return (
    <div className="hv relative h-[420px] sm:h-[520px] lg:h-[580px] w-full max-w-[580px] mx-auto" aria-hidden="true">
      {/* anel pontilhado ao fundo */}
      <div className="hv-ring absolute left-1/2 top-1/2 h-[92%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />

      {/* Janela do navegador sendo montada */}
      <div className="absolute left-[4%] right-[10%] top-[12%] rounded-2xl glass-card overflow-hidden animate-float" style={{ ["--r" as string]: "-2deg" }}>
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 flex-1 max-w-[230px] rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/60">
            <span className="hv-type inline-block overflow-hidden whitespace-nowrap align-bottom">suaempresa.com.br</span>
            <span className="hv-caret inline-block w-px h-3 bg-[#4DDDE7] align-middle ml-px" />
          </span>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <span className="hv-pop h-5 w-5 rounded-md" style={{ background: "var(--brand-gradient)", animationDelay: "0.1s" }} />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="hv-grow h-1.5 w-8 rounded-full bg-white/20" style={{ animationDelay: `${0.2 + i * 0.1}s` }} />
              ))}
            </div>
          </div>

          <div className="mt-7 sm:mt-9 space-y-2.5">
            <span className="hv-grow block h-4 sm:h-5 w-[82%] rounded-md bg-white/85" style={{ animationDelay: "0.5s" }} />
            <span className="hv-grow block h-4 sm:h-5 w-[58%] rounded-md bg-[#4DDDE7]" style={{ animationDelay: "0.7s" }} />
            <span className="hv-grow block h-2 w-[70%] rounded-full bg-white/25 !mt-4" style={{ animationDelay: "0.9s" }} />
            <span className="hv-grow block h-2 w-[50%] rounded-full bg-white/25" style={{ animationDelay: "1s" }} />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="hv-pop hv-press inline-flex h-8 w-28 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: "var(--brand-gradient)", animationDelay: "1.2s" }}>
              Fale com a gente
            </span>
            <span className="hv-pop h-8 w-20 rounded-full border border-white/20" style={{ animationDelay: "1.35s" }} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="hv-rise block h-14 sm:h-16 rounded-xl bg-white/[0.06] ring-1 ring-white/10" style={{ animationDelay: `${1.5 + i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Paleta */}
      <div className="hv-pop absolute right-0 top-[2%] glass-card px-4 py-3" style={{ animationDelay: "2s" }}>
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-white/50">Paleta</p>
        <div className="mt-2 flex -space-x-1.5">
          {swatches.map((c, i) => (
            <span key={c} className="hv-pop h-7 w-7 rounded-full ring-2 ring-[#120a1f]" style={{ background: c, animationDelay: `${2.15 + i * 0.1}s` }} />
          ))}
        </div>
      </div>

      {/* Tipografia */}
      <div className="absolute left-0 bottom-[4%] animate-float" style={{ ["--r" as string]: "-4deg", animationDelay: "-2s" }}>
        <div className="hv-pop glass-card px-5 py-4" style={{ animationDelay: "2.6s" }}>
          <p className="font-accent italic text-5xl leading-none text-white">Aa</p>
          <p className="mt-2 font-display text-[10px] uppercase tracking-[0.2em] text-white/50">Tipografia</p>
        </div>
      </div>

      {/* Celular com o feed se preenchendo */}
      <div className="absolute right-[2%] bottom-0 w-[30%] min-w-[118px] max-w-[160px] animate-float" style={{ ["--r" as string]: "6deg", animationDelay: "-4s" }}>
       <div className="hv-pop rounded-[1.6rem] border border-white/15 bg-[#0d0716] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]" style={{ animationDelay: "3s" }}>
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/15" />
        <div className="flex items-center gap-1.5 px-1 pb-2">
          <span className="h-5 w-5 rounded-full" style={{ background: "var(--brand-gradient)" }} />
          <span className="h-1.5 w-12 rounded-full bg-white/20" />
        </div>
        <div className="grid grid-cols-3 gap-[3px] overflow-hidden rounded-lg">
          {feed.map((bg, i) => (
            <span key={i} className="hv-tile block aspect-[4/5]" style={{ background: bg, animationDelay: `${3.2 + i * 0.12}s` }} />
          ))}
        </div>
       </div>
      </div>

      {/* Cursor */}
      <svg className="hv-cursor absolute h-6 w-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24">
        <path d="M4 2l15 9.5-6.6 1.4L9.6 20z" fill="#fff" stroke="#07040C" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
