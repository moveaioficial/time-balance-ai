import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Antes e depois da seção "Na prática" no celular: a Move Doces, a mesma confeitaria da abertura do site no computador.
// Medidas em "em", como na barbearia. A calda aparece no quadro final, parada: nada anima enquanto a pessoa arrasta o divisor.
// Fotos: Unsplash (licença gratuita), as mesmas de HeroVisual.tsx.

const DocesCena = lazy(() => import("@/components/home/DocesCena"));
const SERIFA = "Fraunces, Georgia, serif";

const PRODUTOS = [
  { src: "/img/confeitaria-bolos.webp", t: "Bolos inteiros" },
  { src: "/img/confeitaria-doces.webp", t: "Doces finos" },
  { src: "/img/confeitaria-tortas.webp", t: "Tortas e fatias" },
];

export function AntesDoces() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col overflow-hidden bg-white" style={{ fontFamily: "Verdana, Arial, sans-serif" }}>
      <div className="flex justify-between bg-[#E75480] px-[1.4em] py-[0.5em] text-[0.8em] text-white">
        <span>☎ (11) 0000-0000</span>
        <span>☰ MENU</span>
      </div>
      <p className="px-[1em] py-[0.5em] text-center text-[2.4em] leading-tight text-[#C71585]" style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive" }}>Move Doces</p>
      <div className="relative mx-[1.4em] flex h-[15em] flex-none items-center justify-center bg-gradient-to-b from-[#F9C5D5] to-[#F4A3BC] px-[2em] text-center">
        <span className="absolute left-[0.4em] text-[2em] text-white/80">‹</span>
        <span className="absolute right-[0.4em] text-[2em] text-white/80">›</span>
        <div>
          <p className="text-[1.7em] font-bold leading-tight text-[#FFE600]" style={{ textShadow: "1px 1px 0 #C71585" }}>OS MELHORES BOLOS DA REGIÃO!!!</p>
          <p className="mt-[0.5em] text-[0.85em] text-white">Feitos com muito amor e carinho</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[0.8em] px-[1.4em] py-[1.2em]">
        {["BOLOS", "DOCES", "SALGADOS"].map((t) => (
          <div key={t} className="flex flex-col items-center border border-[#ddd] bg-[#FAFAFA] p-[0.5em]">
            <div className="flex h-[5em] w-full items-center justify-center bg-[#E5E5E5] text-[0.7em] text-[#999]">sem imagem</div>
            <p className="mt-[0.4em] text-[0.8em] font-bold text-[#6A0DAD]">{t}</p>
            <span className="mt-[0.4em] bg-[#FF8C00] px-[0.7em] py-[0.25em] text-[0.7em] font-bold text-white">SAIBA +</span>
          </div>
        ))}
      </div>
      <div className="mx-[1.4em] border-[0.2em] border-dashed border-[#FF0000] bg-[#FFFF99] p-[0.7em] text-center">
        <p className="text-[1.05em] font-bold text-[#FF0000]">★ PROMOÇÃO DA SEMANA ★</p>
        <p className="text-[0.75em] text-[#333]">Consulte condições!!!</p>
      </div>
      <div className="mx-[1.4em] my-[1em] flex flex-1 items-center justify-center bg-[#E5E5E5] text-[0.8em] text-[#999]">mapa_localizacao.jpg</div>
      <p className="bg-[#E75480] px-[1.4em] py-[0.6em] text-center text-[0.72em] text-white">© 2014 Move Doces · Visitas: 004321</p>
    </div>
  );
}

export function DepoisDoces() {
  const quadro = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPerto(true);
        io.disconnect();
      }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={quadro} aria-hidden="true" className="absolute inset-0 flex flex-col overflow-hidden bg-[#FFF3DF] text-[#47210F]">
      <div className="flex flex-none items-center justify-between px-[1.6em] py-[1em]">
        <span className="text-[1.5em] font-black leading-none" style={{ fontFamily: SERIFA }}>Move Doces</span>
        <span className="text-[1em] font-semibold">Cardápio</span>
      </div>

      {/* a palavra em texto segura o lugar até o canvas chegar */}
      <div className="relative h-[19em] flex-none overflow-hidden">
        <p className={`absolute inset-x-0 top-[0.42em] text-center text-[11.6em] font-black leading-[0.9] tracking-[-0.03em] text-[#47210F] ${pronta ? "invisible" : ""}`} style={{ fontFamily: SERIFA }}>Doces</p>
        {perto && (
          <Suspense fallback={null}>
            <DocesCena parada onPronto={() => setPronta(true)} />
          </Suspense>
        )}
      </div>

      <div className="flex-none px-[1.6em] pt-[0.8em]">
        <p className="text-[3.2em] font-semibold leading-[1.02] tracking-[-0.01em]" style={{ fontFamily: SERIFA }}>Bolo de verdade, feito todo dia.</p>
        <span className="mt-[0.7em] inline-block bg-[#47210F] px-[1.2em] py-[0.75em] text-[1.15em] font-semibold leading-none text-[#FFF3DF]">Ver cardápio</span>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-[0.7em] bg-[#F4A3B8] px-[1.6em] py-[1.2em]">
        {PRODUTOS.map((p) => (
          <div key={p.t}>
            <img src={p.src} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
            <p className="mt-[0.4em] text-[0.95em] font-semibold leading-tight">{p.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
