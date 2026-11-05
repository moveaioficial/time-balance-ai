import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Antes e depois da seção "Na prática". O "antes" é o site ruim de propósito. O "depois" é a landing reduzida da
// Barbearia Move (BarbeariaDepois.tsx), que só carrega quando a seção chega perto da tela. A barbearia é FICTÍCIA.
// Fotos do "antes", do Pexels (licença gratuita com uso comercial, sem crédito obrigatório), em public/img/:
//   barbearia-hero.webp  · Kawê Rodrigues · https://www.pexels.com/photo/barber-in-hair-salon-standing-by-client-on-chari-19664892/ (recortada, sem o logo da camisa)
//   barbearia-barba.webp · Th2city Santana · https://www.pexels.com/photo/barber-shaving-man-s-facial-hair-2014808/
//   barbearia-antes.webp · Nikolaos Dimou · https://www.pexels.com/photo/gray-hand-tool-1319459/

const Landing = lazy(() => import("@/components/home/BarbeariaDepois"));

/* ------------------------------------------------------------------ */
/* ANTES: o site típico de barbearia feito às pressas num construtor   */
/* ------------------------------------------------------------------ */

export function AntesBarbearia() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col overflow-hidden bg-black text-[#8a8a8a]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="flex justify-between bg-[#1a1a1a] px-[2em] sm:px-[3em] py-[0.5em] text-[0.8em]" style={{ fontFamily: "Arial, sans-serif" }}>
        <span>☎ (11) 0000-0000</span>
        <span className="hidden sm:inline">Seg a Sáb das 9h às 19h *exceto feriados</span>
        <span className="sm:hidden">☰</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-[0.6em] border-b-[0.2em] border-[#C9A227] px-[3em] py-[1em]">
        <span className="flex items-center gap-[0.5em]">
          <span className="flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full border-[0.15em] border-[#C9A227] text-[1.2em] text-[#C9A227]">✂</span>
          <span className="leading-none">
            <span className="block text-[1.8em] tracking-[0.04em] text-[#C9A227]" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>BARBEARIA MOVE</span>
            <span className="block text-[0.95em] italic text-white/70">desde 2015</span>
          </span>
        </span>
        <span className="hidden sm:flex gap-[1.4em] text-[0.8em] font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
          <span className="text-[#C9A227]">INÍCIO</span><span>SOBRE NÓS</span><span>SERVIÇOS</span><span>GALERIA</span><span>CONTATO</span>
        </span>
      </div>

      {/* "slider" com uma foto qualquer escurecida e esticada */}
      <div className="relative flex h-[17em] sm:h-[15em] items-center justify-center overflow-hidden text-center">
        <img src="/img/barbearia-antes.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-fill opacity-45 saturate-[0.4] sepia-[0.35]" />
        <span className="absolute left-[0.8em] text-[2.6em] text-white/60">‹</span>
        <span className="absolute right-[0.8em] text-[2.6em] text-white/60">›</span>
        <div className="relative px-[3em]">
          <p className="text-[2em] font-bold uppercase leading-tight text-[#FFD700]" style={{ textShadow: "2px 2px 3px #000" }}>
            Bem-vindo à Barbearia Move!!
          </p>
          <p className="mt-[0.5em] text-[1em] italic text-white" style={{ textShadow: "1px 1px 2px #000" }}>
            Tradição, estilo e qualidade para o homem moderno.
          </p>
          <span className="mt-[0.9em] inline-block bg-[#C9A227] px-[1.4em] py-[0.45em] text-[0.85em] font-bold text-black" style={{ fontFamily: "Arial, sans-serif" }}>SAIBA MAIS</span>
        </div>
      </div>

      <div className="flex-1 px-[2em] sm:px-[3em] pt-[1.4em] text-center">
        <p className="text-[1.4em] text-[#C9A227]">~ NOSSOS SERVIÇOS ~</p>
        <div className="mt-[1em] grid grid-cols-3 gap-[1.2em]">
          {["CORTE", "BARBA", "PIGMENTAÇÃO"].map((t) => (
            <div key={t}>
              <p className="text-[0.95em] font-bold text-white">{t}</p>
              <p className="mt-[0.3em] text-[0.75em] leading-snug">Consulte valores</p>
              <p className="mt-[0.3em] hidden sm:block text-[0.72em] leading-snug text-[#666]">Atendimento de qualidade com profissionais experientes e ambiente climatizado.</p>
            </div>
          ))}
        </div>
        <p className="mt-[1.2em] text-[0.85em] font-bold text-[#C0392B]" style={{ fontFamily: "Arial, sans-serif" }}>
          *** AGENDAMENTOS SOMENTE POR TELEFONE ***
        </p>
        {/* galeria com as mesmas fotos do site novo, só que espremidas, e o plugin do Instagram que quebrou */}
        <p className="mt-[1.2em] text-[1.1em] text-[#C9A227]">~ GALERIA ~</p>
        <div className="mx-auto mt-[0.6em] grid max-w-[30em] grid-cols-3 gap-[0.4em]">
          <img src="/img/barbearia-hero.webp" alt="" loading="lazy" decoding="async" className="h-[5em] w-full object-fill opacity-80" />
          <img src="/img/barbearia-barba.webp" alt="" loading="lazy" decoding="async" className="h-[5em] w-full object-fill opacity-80" />
          <div className="flex h-[5em] items-center justify-center border border-[#333] bg-[#111] px-[0.6em] text-[0.68em] leading-snug text-[#777]" style={{ fontFamily: "Arial, sans-serif" }}>
            ⚠ Erro ao carregar o feed do Instagram
          </div>
        </div>
      </div>

      <div className="bg-[#111] px-[3em] py-[0.6em] text-center text-[0.7em] text-[#555]" style={{ fontFamily: "Arial, sans-serif" }}>
        © 2015 Barbearia Move · Todos os direitos reservados
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DEPOIS: a landing reduzida, carregada sob demanda                    */
/* ------------------------------------------------------------------ */

export function DepoisBarbearia() {
  const quadro = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);

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
    <div ref={quadro} className="absolute inset-0 overflow-hidden bg-[#C4291C]">
      {perto && (
        <Suspense fallback={null}>
          <Landing />
        </Suspense>
      )}
    </div>
  );
}
