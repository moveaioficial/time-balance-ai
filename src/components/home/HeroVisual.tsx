import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import icone from "@/assets/move-ai-icone-app.webp";

// Animação da abertura: um site fraco é rolado, o cursor clica em "Ativar a Move" e o mesmo site aparece bem feito.
// A casca é CSS (classes hv-* em index.css), ciclo de 18s. A cena da calda, do granulado e da cereja (DocesCena.tsx) é um
// canvas que só carrega depois da primeira pintura, no computador. No celular nada disso aparece nem baixa.
// Com movimento reduzido, mostra só o site bom, parado no topo, com a cena no quadro final.
// A confeitaria (Move Doces, movedoces.com.br) é fictícia, só para ilustrar. Fotos: Unsplash (licença gratuita).

const DocesCena = lazy(() => import("@/components/home/DocesCena"));
const SERIFA = "Fraunces, Georgia, serif";

function SiteFeio() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white" style={{ fontFamily: "Verdana, Arial, sans-serif" }}>
      <div className="hv-scroll-a flex flex-col">
        <div className="flex justify-between bg-[#E75480] px-[3cqw] py-[0.8cqw] text-[1.8cqw] text-white">
          <span>☎ (11) 0000-0000</span>
          <span>contato@movedoces.com.br</span>
        </div>
        <div className="flex items-center justify-between px-[3cqw] py-[1.8cqw]">
          <span className="text-[4.6cqw] text-[#C71585]" style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive" }}>Move Doces</span>
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
            A Move Doces nasceu de um sonho e hoje é referência em qualidade e sabor. Trabalhamos com os melhores
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
          © 2014 Move Doces · Todos os direitos reservados · Visitas: 004321
        </div>
      </div>
      {/* pop-up que tapa o site feio no meio da rolagem */}
      <div className="hv-popup absolute left-1/2 top-[22%] w-[56%] border-[0.5cqw] border-[#FF00AA] bg-[#FFFF66] p-[2.4cqw] text-center shadow-[0.8cqw_0.8cqw_0_#6A0DAD]" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
        <span className="absolute right-[1.2cqw] top-[0.6cqw] text-[2.4cqw] text-[#999]">✕</span>
        <p className="text-[3.2cqw] font-bold text-[#FF0000]">🎉 PARABÉNS!!! 🎉</p>
        <p className="mt-[0.8cqw] text-[1.9cqw] text-[#333]">Você é o VISITANTE Nº 1.000.000!!! Cadastre seu e-mail e ganhe 5% OFF*</p>
        <p className="mt-[0.6cqw] text-[1.2cqw] text-[#777]">*válido para compras acima de R$ 300 às terças-feiras</p>
        <span className="mt-[1.2cqw] inline-block bg-[#00AA00] px-[2cqw] py-[0.6cqw] text-[1.8cqw] font-bold text-white">QUERO MEU DESCONTO!!!</span>
      </div>
    </div>
  );
}

const produtos = [
  { src: "/img/confeitaria-bolos.webp", t: "Bolos inteiros", d: "Encomenda com 1 dia" },
  { src: "/img/confeitaria-doces.webp", t: "Doces finos", d: "Caixas de 6 a 50" },
  { src: "/img/confeitaria-tortas.webp", t: "Tortas e fatias", d: "Todo dia na vitrine" },
];

function SiteBom({ cena }: { cena: boolean }) {
  const [pronta, setPronta] = useState(false);
  const aoFicarPronta = useCallback(() => setPronta(true), []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FFF3DF] text-[#47210F]">
      <div className="hv-scroll-b flex flex-col">
        {/* Abertura: a palavra vira bolo */}
        <div className="relative h-[66cqw] shrink-0 overflow-hidden">
          {/* a palavra em texto segura o lugar até o canvas chegar */}
          <p className={`absolute inset-x-0 top-[9cqw] text-center text-[33cqw] font-black leading-[0.9] tracking-[-0.03em] text-[#F4A3B8] ${pronta ? "invisible" : ""}`} style={{ fontFamily: SERIFA }}>Doces</p>
          {cena && (
            <Suspense fallback={null}>
              <DocesCena onPronto={aoFicarPronta} />
            </Suspense>
          )}

          <div className="relative flex items-center justify-between px-[4cqw] py-[2.4cqw]">
            <span className="text-[3cqw] font-black leading-none" style={{ fontFamily: SERIFA }}>Move Doces</span>
            <span className="flex items-center gap-[2.6cqw] text-[1.75cqw] font-medium">
              <span>Cardápio</span><span>Sabores</span><span>Onde estamos</span>
              <span className="bg-[#47210F] px-[1.8cqw] py-[0.9cqw] font-semibold text-[#FFF3DF]">Ver cardápio</span>
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-[5cqw] flex items-end justify-between gap-[3cqw] px-[4cqw]">
            <p className="max-w-[58cqw] text-[5.4cqw] font-semibold leading-[1.02] tracking-[-0.01em]" style={{ fontFamily: SERIFA }}>
              {["Bolo", "de", "verdade,", "feito", "todo", "dia."].map((w, i) => (
                <span key={w} className="hv-word inline-block" style={{ animationDelay: `${0.05 + i * 0.07}s` }}>{w}&nbsp;</span>
              ))}
            </p>
            <p className="hv-in max-w-[28cqw] pb-[0.6cqw] text-[1.8cqw] leading-snug" style={{ animationDelay: "0.2s" }}>
              Confeitaria artesanal. Sai do forno de madrugada e chega à vitrine às 8h.
            </p>
          </div>
        </div>

        {/* sabores correndo */}
        <div className="overflow-hidden whitespace-nowrap bg-[#47210F] py-[1.1cqw] text-[1.7cqw] font-semibold text-[#FFF3DF]">
          <div className="hv-marq inline-block">
            {[0, 1].map((k) => (
              <span key={k}>Pistache · Red velvet · Ninho com morango · Brigadeiro belga · Limão siciliano · Doce de leite ·&nbsp;</span>
            ))}
          </div>
        </div>

        {/* Mais pedidos */}
        <div className="bg-[#F4A3B8] px-[4cqw] py-[3cqw]">
          <p className="text-[4.4cqw] font-black leading-none" style={{ fontFamily: SERIFA }}>Mais pedidos</p>
          <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
            {produtos.map((p, i) => (
              <div key={p.t} className="[perspective:60cqw]">
                <img src={p.src} alt="" loading="lazy" decoding="async" className={`aspect-[4/3] w-full object-cover ${i === 0 ? "hv-tilt" : ""}`} />
                <p className="mt-[1cqw] text-[1.9cqw] font-semibold">{p.t}</p>
                <p className="text-[1.6cqw]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// faíscas que saem do botão no clique (ângulos em graus)
const sparks = [-80, -55, -30, -10, 10, 30, 55, 80, -120, 120, -150, 150];

export function HeroVisual() {
  // a cena só carrega no computador, onde a animação aparece, e depois que a página já pintou
  const [cena, setCena] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const w = window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number };
    const iniciar = () => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => setCena(true), { timeout: 2500 });
      else window.setTimeout(() => setCena(true), 1200);
    };
    if (document.readyState === "complete") iniciar();
    else {
      window.addEventListener("load", iniciar, { once: true });
      return () => window.removeEventListener("load", iniciar);
    }
  }, []);

  return (
    <div className="hv relative hidden lg:block w-full lg:-mr-10 xl:-mr-20 pb-6" aria-hidden="true">
      {/* luz de fundo para destacar a janela */}
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(0,195,208,0.28),rgba(85,31,126,0.25)_45%,transparent_75%)] blur-2xl" />

      <div className="relative [perspective:1600px]">
        <div className="animate-float" style={{ ["--r" as string]: "0deg" }}>
         <div className="hv-bump">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/20 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.04)] [transform:rotateY(-7deg)_rotateX(2deg)]">
            <div className="flex items-center gap-1.5 bg-[#1A1226] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]/80" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]/80" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]/80" />
              <span className="ml-3 grid flex-1 max-w-[260px] rounded-full bg-white/[0.07] px-3 py-1 font-mono text-[11px]">
                <span className="hv-off [grid-area:1/1] truncate text-[#FF8A80]">⚠ Não seguro · movedoces.com.br</span>
                <span className="hv-on [grid-area:1/1] truncate text-white/75">🔒 movedoces.com.br</span>
              </span>

              {/* Botão que "ativa a Move", na própria barra do navegador */}
              <div className="hv-btn2 relative ml-auto">
                <span className="hv-halo absolute -inset-2 rounded-full bg-[#00C3D0]/35 blur-md" />
                <span className="hv-ring absolute inset-0 rounded-full border-2 border-[#4DDDE7]" />
                <span className="hv-ring absolute inset-0 rounded-full border-2 border-[#A78BFA]" style={{ animationDelay: "0.25s" }} />
                <div className="relative flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-white/20 bg-white/[0.06] py-1 pl-1 pr-3.5">
                  <span className="hv-on absolute inset-0" style={{ background: "var(--brand-gradient)" }} />
                  <img src={icone} alt="" loading="lazy" decoding="async" className="relative h-5 w-5 rounded-md" />
                  <span className="relative grid font-display text-[12px] font-semibold leading-none text-white">
                    <span className="hv-off [grid-area:1/1]">Ativar a Move</span>
                    <span className="hv-on [grid-area:1/1]">Move ativada ✦</span>
                  </span>
                </div>
                {/* onda de choque e faíscas saem do botão para dentro do site */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
                  <span className="hv-shock absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#4DDDE7] shadow-[0_0_40px_rgba(0,195,208,0.7),inset_0_0_40px_rgba(167,139,250,0.5)]" />
                  <span className="hv-shock absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#A78BFA]" style={{ animationDelay: "0.18s" }} />
                  {sparks.map((a, i) => (
                    <span key={a} className="hv-spark absolute left-0 top-0 h-2 w-2 rounded-full" style={{ ["--a" as string]: `${a + 180}deg`, background: i % 2 ? "#A78BFA" : "#4DDDE7", boxShadow: `0 0 12px ${i % 2 ? "#A78BFA" : "#4DDDE7"}`, animationDelay: `${(i % 3) * 0.04}s` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ containerType: "inline-size" }}>
              <SiteFeio />
              <div className="hv-good absolute inset-0">
                <SiteBom cena={cena} />
              </div>
              <span className="hv-edge pointer-events-none absolute inset-y-0 w-[4px] -translate-x-1/2 bg-[#4DDDE7] shadow-[0_0_40px_12px_rgba(0,195,208,0.65)]" />
              <span className="hv-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(77,221,231,0.55),transparent_60%)]" />
            </div>
          </div>
         </div>
        </div>
      </div>

      {/* Cursor */}
      <svg className="hv-cursor absolute z-20 h-7 w-7 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24">
        <path d="M4 2l15 9.5-6.6 1.4L9.6 20z" fill="#fff" stroke="#07040C" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
