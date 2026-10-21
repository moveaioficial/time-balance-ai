import icone from "@/assets/move-ai-icone-app.png";

// Animação da abertura: um site fraco, o cursor clica em "Ativar a Move" e o mesmo site aparece bem feito.
// Tudo em CSS (classes hv-* em index.css), ciclo de 12s. Com movimento reduzido, mostra só o site bom.
// A confeitaria é fictícia, só para ilustrar.

function SiteFeio() {
  return (
    <div className="absolute inset-0 flex flex-col bg-white" style={{ fontFamily: "Verdana, Arial, sans-serif" }}>
      <div className="flex justify-between bg-[#E75480] px-[3cqw] py-[0.8cqw] text-[1.8cqw] text-white">
        <span>☎ (11) 0000-0000</span>
        <span>contato@seusite.com.br</span>
      </div>
      <div className="flex items-center justify-between px-[3cqw] py-[1.8cqw]">
        <span className="text-[4.6cqw] text-[#C71585]" style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive" }}>Sua Confeitaria</span>
        <span className="text-[1.7cqw] font-bold text-[#6A0DAD]">INÍCIO | BOLOS | DOCES | FALE CONOSCO</span>
      </div>
      <div className="relative mx-[3cqw] flex h-[34cqw] items-center justify-center bg-gradient-to-b from-[#F9C5D5] to-[#F4A3BC] text-center">
        <span className="absolute left-[1.5cqw] text-[4cqw] text-white/80">‹</span>
        <span className="absolute right-[1.5cqw] text-[4cqw] text-white/80">›</span>
        <div>
          <p className="text-[4.2cqw] font-bold text-[#FFE600]" style={{ textShadow: "2px 2px 0 #C71585" }}>OS MELHORES BOLOS DA REGIÃO!!!</p>
          <p className="mt-[1cqw] text-[1.9cqw] text-white">Venha conhecer nossas delícias feitas com muito amor e carinho</p>
        </div>
        <div className="absolute bottom-[1.4cqw] flex gap-[1cqw]">
          <span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-white" />
          <span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-white/50" />
          <span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-white/50" />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-[2cqw] px-[3cqw] py-[2.4cqw]">
        {["BOLOS", "DOCES", "SALGADOS"].map((t) => (
          <div key={t} className="flex flex-col items-center border border-[#ddd] bg-[#FAFAFA] p-[1.2cqw]">
            <div className="flex h-[9cqw] w-full items-center justify-center bg-[#E5E5E5] text-[1.6cqw] text-[#999]">sem imagem</div>
            <p className="mt-[1cqw] text-[2cqw] font-bold text-[#6A0DAD]">{t}</p>
            <span className="mt-[0.8cqw] bg-[#FF8C00] px-[1.6cqw] py-[0.5cqw] text-[1.5cqw] font-bold text-white">SAIBA +</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteBom() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#FBF5EE] text-[#2A1A14]">
      <div className="hv-in flex items-center justify-between px-[4cqw] py-[2.6cqw]">
        <span className="font-accent text-[4cqw] italic leading-none">Sua Confeitaria</span>
        <span className="flex gap-[2.6cqw] text-[1.9cqw] text-[#2A1A14]/70">
          <span>Cardápio</span><span>Encomendas</span><span>Onde estamos</span>
        </span>
      </div>

      <div className="relative grid flex-1 grid-cols-[1.15fr_1fr] items-center gap-[2cqw] px-[4cqw]">
        <div>
          <p className="hv-in text-[1.6cqw] font-semibold uppercase tracking-[0.25em] text-[#B4532A]" style={{ animationDelay: "0.1s" }}>Feito hoje de manhã</p>
          <p className="hv-in mt-[1.2cqw] font-display text-[6.4cqw] font-bold leading-[0.98] tracking-[-0.03em]" style={{ animationDelay: "0.2s" }}>
            Bolo de verdade, <span className="font-accent font-normal italic text-[#B4532A]">sem pressa</span>.
          </p>
          <p className="hv-in mt-[1.6cqw] max-w-[90%] text-[2cqw] leading-snug text-[#2A1A14]/70" style={{ animationDelay: "0.3s" }}>
            Encomende até as 18h e retire no dia seguinte.
          </p>
          <span className="hv-in mt-[2.4cqw] inline-flex rounded-full bg-[#2A1A14] px-[3cqw] py-[1.4cqw] text-[1.9cqw] font-semibold text-[#FBF5EE]" style={{ animationDelay: "0.4s" }}>
            Encomendar pelo WhatsApp
          </span>
        </div>

        {/* bolo desenhado em CSS */}
        <div className="hv-in relative mx-auto flex aspect-square w-[88%] items-end justify-center rounded-full bg-[#F2D9C4]" style={{ animationDelay: "0.25s" }}>
          <div className="mb-[18%] flex w-[64%] flex-col items-center">
            <span className="h-[3cqw] w-[3cqw] -mb-[0.6cqw] rounded-full bg-[#C0392B] z-10" />
            <span className="h-[5cqw] w-[70%] rounded-t-[2cqw] bg-[#FFF4E8] shadow-[inset_0_-1.2cqw_0_#E8B58A]" />
            <span className="h-[7cqw] w-full rounded-t-[2cqw] bg-[#6B3E26] shadow-[inset_0_1.6cqw_0_#FFF4E8]" />
            <span className="h-[1.6cqw] w-[112%] rounded-full bg-[#E9E0D6]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[2cqw] px-[4cqw] pb-[3.6cqw] pt-[2cqw]">
        {[
          { t: "Bolos", c: "#6B3E26" },
          { t: "Doces finos", c: "#B4532A" },
          { t: "Festas", c: "#E8B58A" },
        ].map(({ t, c }, i) => (
          <div key={t} className="hv-in flex items-center gap-[1.4cqw] rounded-[1.6cqw] bg-white px-[1.6cqw] py-[1.4cqw] shadow-[0_0.6cqw_2cqw_rgba(42,26,20,0.08)]" style={{ animationDelay: `${0.45 + i * 0.08}s` }}>
            <span className="h-[3.6cqw] w-[3.6cqw] rounded-full" style={{ background: c }} />
            <span className="text-[2cqw] font-semibold">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="hv relative w-full max-w-[600px] mx-auto pb-10" aria-hidden="true">
      <div className="animate-float" style={{ ["--r" as string]: "-1.5deg" }}>
        <div className="overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_40px_120px_-30px_rgba(85,31,126,0.9)]">
          <div className="flex items-center gap-1.5 bg-[#1A1226] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 rounded-full bg-white/[0.07] px-3 py-1 font-mono text-[11px] text-white/60">seusite.com.br</span>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ containerType: "inline-size" }}>
            <SiteFeio />
            <div className="hv-good absolute inset-0">
              <SiteBom />
            </div>
            <span className="hv-edge pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#4DDDE7] shadow-[0_0_30px_8px_rgba(0,195,208,0.6)]" />
          </div>
        </div>
      </div>

      {/* Botão que "ativa a Move" */}
      <div className="hv-press absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/15 bg-[#0C0416]/90 py-2 pl-2 pr-5 backdrop-blur-xl">
        <img src={icone} alt="" className="h-8 w-8 rounded-lg" />
        <span className="grid font-display text-sm font-semibold text-white">
          <span className="hv-off [grid-area:1/1]">Ativar a Move</span>
          <span className="hv-on [grid-area:1/1] text-[#4DDDE7]">Move ativada ✓</span>
        </span>
      </div>

      {/* Cursor */}
      <svg className="hv-cursor absolute z-10 h-6 w-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24">
        <path d="M4 2l15 9.5-6.6 1.4L9.6 20z" fill="#fff" stroke="#07040C" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
