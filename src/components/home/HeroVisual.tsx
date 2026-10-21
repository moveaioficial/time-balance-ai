import icone from "@/assets/move-ai-icone-app.png";

// Animação da abertura: um site fraco é rolado, o cursor clica em "Ativar a Move" e o mesmo site aparece bem feito e é rolado também.
// Tudo em CSS (classes hv-* em index.css), ciclo de 18s. Com movimento reduzido, mostra só o site bom, parado no topo.
// A confeitaria é fictícia, só para ilustrar. Fotos: Unsplash (licença gratuita).

function SiteFeio() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white" style={{ fontFamily: "Verdana, Arial, sans-serif" }}>
      <div className="hv-scroll-a flex flex-col">
        <div className="flex justify-between bg-[#E75480] px-[3cqw] py-[0.8cqw] text-[1.8cqw] text-white">
          <span>☎ (11) 0000-0000</span>
          <span>contato@seusite.com.br</span>
        </div>
        <div className="flex items-center justify-between px-[3cqw] py-[1.8cqw]">
          <span className="text-[4.6cqw] text-[#C71585]" style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive" }}>Sua Confeitaria</span>
          <span className="text-[1.7cqw] font-bold text-[#6A0DAD]">INÍCIO | BOLOS | DOCES | FALE CONOSCO</span>
        </div>
        <div className="relative mx-[3cqw] flex h-[32cqw] shrink-0 items-center justify-center bg-gradient-to-b from-[#F9C5D5] to-[#F4A3BC] text-center">
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
        <div className="grid grid-cols-3 gap-[2cqw] px-[3cqw] py-[2.4cqw]">
          {["BOLOS", "DOCES", "SALGADOS"].map((t) => (
            <div key={t} className="flex flex-col items-center border border-[#ddd] bg-[#FAFAFA] p-[1.2cqw]">
              <div className="flex h-[9cqw] w-full items-center justify-center bg-[#E5E5E5] text-[1.6cqw] text-[#999]">sem imagem</div>
              <p className="mt-[1cqw] text-[2cqw] font-bold text-[#6A0DAD]">{t}</p>
              <span className="mt-[0.8cqw] bg-[#FF8C00] px-[1.6cqw] py-[0.5cqw] text-[1.5cqw] font-bold text-white">SAIBA +</span>
            </div>
          ))}
        </div>
        <div className="px-[3cqw] pb-[2cqw]">
          <p className="text-[2.6cqw] font-bold text-[#C71585]">QUEM SOMOS</p>
          <p className="mt-[0.8cqw] text-[1.6cqw] leading-snug text-[#666]">
            A Sua Confeitaria nasceu de um sonho e hoje é referência em qualidade e sabor. Trabalhamos com os melhores
            ingredientes para oferecer produtos de excelência para você e sua família. Faça já a sua encomenda! Aceitamos
            encomendas para festas, aniversários, casamentos e eventos em geral. Consulte nossos preços.
          </p>
        </div>
        <div className="mx-[3cqw] border-[0.4cqw] border-dashed border-[#FF0000] bg-[#FFFF99] p-[1.6cqw] text-center">
          <p className="text-[2.4cqw] font-bold text-[#FF0000]">★ PROMOÇÃO DA SEMANA ★</p>
          <p className="text-[1.7cqw] text-[#333]">Bolo de chocolate com desconto especial!!! *consulte condições</p>
        </div>
        <div className="mx-[3cqw] mt-[2cqw] flex h-[14cqw] shrink-0 items-center justify-center bg-[#E5E5E5] text-[1.6cqw] text-[#999]">mapa_localizacao.jpg</div>
        <div className="mt-[2cqw] bg-[#E75480] px-[3cqw] py-[1.2cqw] text-center text-[1.4cqw] text-white">
          © 2014 Sua Confeitaria · Todos os direitos reservados · Visitas: 004321
        </div>
      </div>
    </div>
  );
}

const produtos = [
  { src: "/img/confeitaria-bolos.webp", t: "Bolos inteiros", d: "Encomenda com 1 dia" },
  { src: "/img/confeitaria-doces.webp", t: "Doces finos", d: "Caixas de 6 a 50" },
  { src: "/img/confeitaria-tortas.webp", t: "Tortas e fatias", d: "Todo dia na vitrine" },
];

const passos = [
  ["1", "Escolha no cardápio", "Sabores, tamanhos e recheios."],
  ["2", "Confirme no WhatsApp", "Data, horário e um sinal."],
  ["3", "Retire fresquinho", "Ou receba em casa."],
];

function SiteBom() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FBF6F0] text-[#2B1D16]">
      <div className="hv-scroll-b flex flex-col">
        {/* Abertura com foto em tela cheia */}
        <div className="relative h-[44cqw] shrink-0 overflow-hidden">
          <img src="/img/confeitaria-hero.webp" alt="" className="hv-zoom absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B110C]/90 via-[#1B110C]/55 to-transparent" />

          <div className="relative flex items-center justify-between px-[4cqw] py-[2.6cqw] text-white">
            <span className="font-accent text-[3.8cqw] italic leading-none">Sua Confeitaria</span>
            <span className="flex items-center gap-[2.6cqw] text-[1.75cqw] text-white/80">
              <span>Cardápio</span><span>Encomendas</span><span>Onde estamos</span>
              <span className="rounded-full bg-white px-[1.8cqw] py-[0.8cqw] font-semibold text-[#2B1D16]">Encomendar</span>
            </span>
          </div>

          <div className="relative px-[4cqw] pt-[3cqw] text-white">
            <p className="hv-in text-[1.5cqw] font-semibold uppercase tracking-[0.28em] text-[#F2C9A0]">Confeitaria artesanal</p>
            <p className="hv-in mt-[1.2cqw] max-w-[62%] font-accent text-[6.8cqw] leading-[0.95]" style={{ animationDelay: "0.1s" }}>
              Bolo de verdade, feito <span className="italic text-[#F2C9A0]">todo dia</span>.
            </p>
            <div className="hv-in mt-[2.4cqw] flex gap-[1.4cqw]" style={{ animationDelay: "0.2s" }}>
              <span className="rounded-full bg-[#F2C9A0] px-[2.6cqw] py-[1.2cqw] text-[1.8cqw] font-semibold text-[#2B1D16]">Ver cardápio</span>
              <span className="rounded-full border border-white/50 px-[2.6cqw] py-[1.2cqw] text-[1.8cqw] font-semibold">Pedir pelo WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Mais pedidos */}
        <div className="px-[4cqw] pt-[3cqw]">
          <div className="hv-in flex items-end justify-between" style={{ animationDelay: "0.3s" }}>
            <p className="font-accent text-[3.4cqw] leading-none">Mais pedidos</p>
            <p className="text-[1.6cqw] font-semibold text-[#9A5B34]">Ver tudo →</p>
          </div>
          <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
            {produtos.map((p, i) => (
              <div key={p.t} className="hv-in" style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
                <img src={p.src} alt="" className="aspect-[4/3] w-full rounded-[1.2cqw] object-cover" />
                <p className="mt-[1cqw] text-[1.8cqw] font-semibold">{p.t}</p>
                <p className="text-[1.5cqw] text-[#2B1D16]/55">{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Como encomendar */}
        <div className="mx-[4cqw] mt-[4cqw] rounded-[2cqw] bg-[#F3E6D8] p-[3.4cqw]">
          <p className="font-accent text-[3.4cqw] leading-none">Encomendar é simples</p>
          <div className="mt-[2.4cqw] grid grid-cols-3 gap-[2.4cqw]">
            {passos.map(([n, t, d]) => (
              <div key={n}>
                <p className="font-accent text-[5cqw] italic leading-none text-[#B4532A]">{n}</p>
                <p className="mt-[0.8cqw] text-[1.9cqw] font-semibold">{t}</p>
                <p className="mt-[0.3cqw] text-[1.5cqw] text-[#2B1D16]/60">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Faixa com foto */}
        <div className="relative mx-[4cqw] mt-[3cqw] h-[20cqw] shrink-0 overflow-hidden rounded-[2cqw]">
          <img src="/img/confeitaria-doces.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#1B110C]/55" />
          <div className="relative flex h-full items-center justify-between px-[3.4cqw] text-white">
            <p className="font-accent text-[4cqw] leading-none">
              Feito de madrugada.<br /><span className="italic text-[#F2C9A0]">Na vitrine às 8h.</span>
            </p>
            <span className="rounded-full bg-white px-[2.4cqw] py-[1.1cqw] text-[1.7cqw] font-semibold text-[#2B1D16]">Encomendar</span>
          </div>
        </div>

        <div className="mt-[3cqw] flex items-center justify-between bg-[#2B1D16] px-[4cqw] py-[2.6cqw] text-[1.5cqw] text-white/70">
          <span className="font-accent text-[2.6cqw] italic text-white">Sua Confeitaria</span>
          <span>Ter a dom · 8h às 19h</span>
          <span>@suaconfeitaria</span>
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="hv relative hidden lg:block w-full lg:-mr-10 xl:-mr-20 pb-16" aria-hidden="true">
      {/* luz de fundo para destacar a janela */}
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(0,195,208,0.28),rgba(85,31,126,0.25)_45%,transparent_75%)] blur-2xl" />

      <div className="relative [perspective:1600px]">
        <div className="animate-float" style={{ ["--r" as string]: "0deg" }}>
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/20 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.04)] [transform:rotateY(-7deg)_rotateX(2deg)]">
            <div className="flex items-center gap-1.5 bg-[#1A1226] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]/80" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]/80" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]/80" />
              <span className="ml-3 flex-1 max-w-[260px] rounded-full bg-white/[0.07] px-3 py-1 font-mono text-[11px] text-white/60">seusite.com.br</span>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ containerType: "inline-size" }}>
              <SiteFeio />
              <div className="hv-good absolute inset-0">
                <SiteBom />
              </div>
              <span className="hv-edge pointer-events-none absolute inset-y-0 w-[4px] -translate-x-1/2 bg-[#4DDDE7] shadow-[0_0_40px_12px_rgba(0,195,208,0.65)]" />
              <span className="hv-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(77,221,231,0.55),transparent_60%)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Botão que "ativa a Move" */}
      <div className="hv-btn absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
        <span className="hv-halo absolute -inset-3 rounded-full bg-[#00C3D0]/30 blur-md" />
        <span className="hv-ring absolute inset-0 rounded-full border-2 border-[#4DDDE7]" />
        <span className="hv-ring absolute inset-0 rounded-full border-2 border-[#A78BFA]" style={{ animationDelay: "0.25s" }} />
        <div className="relative flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full border border-white/20 bg-[#0C0416] py-2.5 pl-2.5 pr-7 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)]">
          <span className="hv-on absolute inset-0" style={{ background: "var(--brand-gradient)" }} />
          <img src={icone} alt="" className="relative h-10 w-10 rounded-xl ring-1 ring-white/20" />
          <span className="relative grid font-display text-lg font-bold text-white">
            <span className="hv-off [grid-area:1/1]">Ativar a Move</span>
            <span className="hv-on [grid-area:1/1]">Move ativada ✦</span>
          </span>
        </div>
      </div>

      {/* Cursor */}
      <svg className="hv-cursor absolute z-20 h-7 w-7 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24">
        <path d="M4 2l15 9.5-6.6 1.4L9.6 20z" fill="#fff" stroke="#07040C" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
