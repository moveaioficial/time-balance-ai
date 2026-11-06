import { useEffect, useLayoutEffect, useRef, useState } from "react";

// As fotos ao lado da promessa da Barbearia Move. Em vez de trocar por fade, a foto da frente é cortada e sai em pedaços:
// tesoura em ziguezague, tiras que caem como cabelo cortado ou um rasgo de papel. Só transform e stroke-dashoffset, com
// Web Animations; nada roda fora da tela, e com movimento reduzido fica a primeira foto, parada.
// Fotos do Pexels (licença gratuita com uso comercial), créditos em BarbeariaMock.tsx e BarbeariaDepois.tsx.

const FOTOS = [
  { src: "/img/barbearia/fade-perfil.webp", pos: "50% 32%", espelhar: true },
  { src: "/img/barbearia/cadeira.webp", pos: "38% 50%", espelhar: false },
  { src: "/img/barbearia-hero.webp", pos: "72% 50%", espelhar: false },
];
const TIPOS = ["tesoura", "tiras", "rasgo"] as const;
type Tipo = (typeof TIPOS)[number];
const PAUSA = 2600;
const DURACAO_CORTE: Record<Tipo, number> = { tesoura: 1000, tiras: 1100, rasgo: 380 };
const PAPEL = "#F0E9DC";

type Ponto = [number, number];
interface Pedaco { foto: string; papel: string; saida: string; atraso: number }
interface Corte { pedacos: Pedaco[]; linha: Ponto[]; caminho: Ponto[] }

const sorteio = (a: number, b: number) => a + Math.random() * (b - a);
const poligono = (p: Ponto[]) => `polygon(${p.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(",")})`;

/** A emenda dos pedaços: entre `a` e `b`, serrilhada para fora da reta. */
function serra(a: Ponto, b: Ponto, passos: number, amplitude: number): Ponto[] {
  const horizontal = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
  return Array.from({ length: passos + 1 }, (_, i) => {
    const t = i / passos;
    const d = i === 0 || i === passos ? 0 : (i % 2 ? 1 : -1) * amplitude * sorteio(0.45, 1);
    const x = a[0] + (b[0] - a[0]) * t + (horizontal ? 0 : d);
    const y = a[1] + (b[1] - a[1]) * t + (horizontal ? d : 0);
    return [x, y] as Ponto;
  });
}

const deslocar = (p: Ponto[], dx: number, dy: number) => p.map(([x, y]) => [x + dx, y + dy] as Ponto);

function montarCorte(tipo: Tipo): Corte {
  if (tipo === "tesoura") {
    const linha = serra([0, sorteio(30, 45)], [100, sorteio(55, 70)], 16, 1.5);
    const volta = [...linha].reverse();
    return {
      linha,
      caminho: [[-14, linha[0][1]], [114, linha[linha.length - 1][1]]],
      pedacos: [
        { foto: poligono([[0, 0], [100, 0], ...deslocar(volta, 0, -0.7)]), papel: poligono([[0, 0], [100, 0], ...volta]), saida: "translate(-7%, -112%) rotate(-7deg)", atraso: 0 },
        { foto: poligono([...deslocar(linha, 0, 0.7), [100, 100], [0, 100]]), papel: poligono([...linha, [100, 100], [0, 100]]), saida: "translate(6%, 112%) rotate(6deg)", atraso: 40 },
      ],
    };
  }
  if (tipo === "rasgo") {
    const linha = serra([sorteio(42, 58), 0], [sorteio(42, 58), 100], 34, 2.1);
    const volta = [...linha].reverse();
    return {
      linha,
      caminho: [],
      pedacos: [
        { foto: poligono([[0, 0], ...deslocar(linha, -1.6, 0), [0, 100]]), papel: poligono([[0, 0], ...linha, [0, 100]]), saida: "translate(-118%, 3%) rotate(-9deg)", atraso: 0 },
        { foto: poligono([...deslocar(linha, 1.6, 0), [100, 100], [100, 0]]), papel: poligono([...linha, [100, 100], [100, 0]]), saida: "translate(118%, -3%) rotate(8deg)", atraso: 30 },
      ],
    };
  }
  // tiras: a tesoura passa no alto e cada tira cai, como cabelo cortado
  const tiras = 5;
  const emendas = Array.from({ length: tiras + 1 }, (_, i) => {
    const x = (i / tiras) * 100;
    return i === 0 || i === tiras ? ([[x, 0], [x, 100]] as Ponto[]) : serra([x, 0], [x, 100], 16, 1);
  });
  return {
    linha: serra([0, 5], [100, 5], 16, 0.5),
    caminho: [[-14, 5], [114, 5]],
    pedacos: Array.from({ length: tiras }, (_, i) => {
      const esquerda = emendas[i];
      const direita = [...emendas[i + 1]].reverse();
      return {
        foto: poligono([...deslocar(esquerda, 0.5, 0), ...deslocar(direita, -0.5, 0)]),
        papel: poligono([...esquerda, ...direita]),
        saida: `translateY(118%) rotate(${i % 2 ? 5 : -5}deg)`,
        atraso: (DURACAO_CORTE.tiras * (i + 0.6)) / tiras - DURACAO_CORTE.tiras,
      };
    }),
  };
}

function Foto({ i }: { i: number }) {
  const f = FOTOS[i];
  return (
    <img
      src={f.src}
      alt=""
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${f.espelhar ? "-scale-x-100" : ""}`}
      style={{ objectPosition: f.pos }}
    />
  );
}

function Tesoura({ lamina1, lamina2 }: { lamina1: React.Ref<SVGGElement>; lamina2: React.Ref<SVGGElement> }) {
  const lamina = "M28 29 L68 23 Q52 37 28 39 Z";
  return (
    <svg viewBox="0 0 70 64" className="h-full w-full overflow-visible" aria-hidden="true">
      <g ref={lamina1} style={{ transformBox: "view-box", transformOrigin: "30px 33px" }}>
        <path d={lamina} fill={PAPEL} stroke="#120E0B" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M30 33 L17 42" stroke="#120E0B" strokeWidth="4.6" strokeLinecap="round" />
        <circle cx="11" cy="47" r="7.5" fill="none" stroke="#120E0B" strokeWidth="4.2" />
      </g>
      <g transform="translate(0 66) scale(1 -1)">
        <g ref={lamina2} style={{ transformBox: "view-box", transformOrigin: "30px 33px" }}>
          <path d={lamina} fill={PAPEL} stroke="#120E0B" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M30 33 L17 42" stroke="#120E0B" strokeWidth="4.6" strokeLinecap="round" />
          <circle cx="11" cy="47" r="7.5" fill="none" stroke="#120E0B" strokeWidth="4.2" />
        </g>
      </g>
      <circle cx="30" cy="33" r="2.4" fill="#120E0B" />
    </svg>
  );
}

export function BarbeariaFotos() {
  const caixa = useRef<HTMLDivElement>(null);
  const tesoura = useRef<HTMLDivElement>(null);
  const lamina1 = useRef<SVGGElement>(null);
  const lamina2 = useRef<SVGGElement>(null);
  const linha = useRef<SVGPolylineElement>(null);
  const pedacos = useRef<(HTMLDivElement | null)[]>([]);
  const [atual, setAtual] = useState(0);
  const [cena, setCena] = useState<{ tipo: Tipo; corte: Corte } | null>(null);
  const [visivel, setVisivel] = useState(false);

  // deixa as próximas fotos prontas, para nenhuma aparecer pela metade atrás do corte
  useEffect(() => {
    FOTOS.slice(1).forEach((f) => {
      const img = new Image();
      img.src = f.src;
    });
    const el = caixa.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visivel || cena || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      const tipo = TIPOS[atual % TIPOS.length];
      setCena({ tipo, corte: montarCorte(tipo) });
    }, PAUSA);
    return () => clearTimeout(t);
  }, [visivel, cena, atual]);

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!cena || !el) return;
    const { tipo, corte } = cena;
    const dur = DURACAO_CORTE[tipo];
    const anims: Animation[] = [];

    if (linha.current) {
      // a linha do corte é desenhada em pixels, para o tracejado não se partir, e some quando os pedaços se soltam
      const l = linha.current;
      l.setAttribute("points", corte.linha.map(([x, y]) => `${(x / 100) * el.clientWidth},${(y / 100) * el.clientHeight}`).join(" "));
      const total = l.getTotalLength();
      l.style.strokeDasharray = `${total}`;
      anims.push(l.animate([{ strokeDashoffset: total }, { strokeDashoffset: 0 }], { duration: dur, easing: "linear", fill: "forwards" }));
      anims.push(l.animate([{ opacity: 1 }, { opacity: 0 }], { delay: dur, duration: 80, fill: "forwards" }));
    }
    if (corte.caminho.length && tesoura.current) {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const [[x0, y0], [x1, y1]] = corte.caminho.map(([x, y]) => [(x / 100) * W, (y / 100) * H]);
      const giro = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      const pos = (x: number, y: number) => `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${giro}deg)`;
      anims.push(tesoura.current.animate([{ transform: pos(x0, y0) }, { transform: pos(x1, y1) }], { duration: dur, easing: "cubic-bezier(.35,0,.65,1)", fill: "forwards" }));
      const abre = { duration: 170, iterations: Math.ceil(dur / 170), direction: "alternate" as const, easing: "ease-in-out" };
      if (lamina1.current) lamina1.current.animate([{ rotate: "-15deg" }, { rotate: "3deg" }], abre);
      if (lamina2.current) lamina2.current.animate([{ rotate: "15deg" }, { rotate: "-3deg" }], abre);
    }
    corte.pedacos.forEach((p, i) => {
      const pd = pedacos.current[i];
      if (!pd) return;
      anims.push(pd.animate([{ transform: "none" }, { transform: p.saida }], { delay: dur + p.atraso, duration: 760, easing: "cubic-bezier(.5,0,.85,.45)", fill: "forwards" }));
    });

    let vivo = true;
    Promise.all(anims.map((a) => a.finished))
      .then(() => {
        if (!vivo) return;
        setAtual((v) => (v + 1) % FOTOS.length);
        setCena(null);
      })
      .catch(() => { /* cancelada ao sair da página */ });
    return () => {
      vivo = false;
      anims.forEach((a) => a.cancel());
    };
  }, [cena]);

  const proxima = (atual + 1) % FOTOS.length;

  return (
    <div ref={caixa} aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#120E0B]">
      <Foto key={cena ? proxima : atual} i={cena ? proxima : atual} />

      {cena?.corte.pedacos.map((p, i) => (
        <div key={i} ref={(n) => { pedacos.current[i] = n; }} className="absolute inset-0 will-change-transform">
          <div className="absolute inset-0" style={{ background: PAPEL, clipPath: p.papel }} />
          <div className="absolute inset-0" style={{ clipPath: p.foto }}>
            <Foto i={atual} />
          </div>
        </div>
      ))}

      {cena && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <polyline ref={linha} fill="none" stroke={PAPEL} strokeWidth="2.5" />
        </svg>
      )}

      {cena && cena.corte.caminho.length > 0 && (
        <div ref={tesoura} className="pointer-events-none absolute left-0 top-0 h-[11em] w-[12em] will-change-transform drop-shadow-[0_0.25em_0.4em_rgba(0,0,0,0.55)]">
          <Tesoura lamina1={lamina1} lamina2={lamina2} />
        </div>
      )}
    </div>
  );
}
