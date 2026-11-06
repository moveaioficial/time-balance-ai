import { useEffect, useLayoutEffect, useRef, useState } from "react";

// O mosaico de cortes ao lado da promessa da Barbearia Move. Uma foto de cada vez é cortada e sai em pedaços, revelando outra:
// tesoura em ziguezague, tiras que caem como cabelo cortado ou um rasgo de papel. Só transform, opacity e stroke-dashoffset,
// com Web Animations; nada roda fora da tela, e com movimento reduzido o mosaico fica parado.
// Fotos do Pexels (licença gratuita com uso comercial), em public/img/barbearia/, pelo número em pexels.com/photo/<número>:
//   lateral-risca 12706272 · risca-maquina 39559270 · risca-perfil 39559262 · fade-barba 39559325 · nuca-pb 7956486
//   maquina-dourada 12464840 · pente-pb 10775086 · pente-maquina 33461079 · pente-navalha 12464845

const pasta = "/img/barbearia/";
const FOTOS = [
  { src: `${pasta}lateral-risca.webp`, pos: "40% 50%" },
  { src: `${pasta}risca-maquina.webp`, pos: "50% 55%" },
  { src: `${pasta}fade-barba.webp`, pos: "50% 40%" },
  { src: `${pasta}maquina-dourada.webp`, pos: "60% 50%" },
  { src: `${pasta}nuca-pb.webp`, pos: "50% 20%" },
  { src: `${pasta}pente-maquina.webp`, pos: "50% 55%" },
  { src: `${pasta}risca-perfil.webp`, pos: "45% 50%" },
  { src: `${pasta}pente-pb.webp`, pos: "55% 45%" },
  { src: `${pasta}pente-navalha.webp`, pos: "50% 70%" },
];

// quadros do mesmo tamanho, perto de 6:5, para qualquer foto caber neles sem cortar a cabeça
const QUADROS = [
  "col-[1/7] row-[1/5]",
  "col-[7/13] row-[1/5]",
  "col-[1/7] row-[5/9]",
  "col-[7/13] row-[5/9]",
  "col-[1/7] row-[9/13]",
  "col-[7/13] row-[9/13]",
];

const TIPOS = ["tesoura", "tiras", "rasgo"] as const;
type Tipo = (typeof TIPOS)[number];
const INTERVALO = 1500;
const DURACAO_CORTE: Record<Tipo, number> = { tesoura: 950, tiras: 1000, rasgo: 360 };
const PAPEL = "#F0E9DC";

type Ponto = [number, number];
interface Pedaco { foto: string; papel: string; saida: string; atraso: number }
interface Corte { tipo: Tipo; pedacos: Pedaco[]; linha: Ponto[]; caminho: Ponto[] }
interface Estado { foto: number; troca: { para: number; corte: Corte } | null }

const sorteio = (a: number, b: number) => a + Math.random() * (b - a);
const poligono = (p: Ponto[]) => `polygon(${p.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(",")})`;
const deslocar = (p: Ponto[], dx: number, dy: number) => p.map(([x, y]) => [x + dx, y + dy] as Ponto);

/** A emenda dos pedaços: entre `a` e `b`, serrilhada para fora da reta. */
function serra(a: Ponto, b: Ponto, passos: number, amplitude: number): Ponto[] {
  const horizontal = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
  return Array.from({ length: passos + 1 }, (_, i) => {
    const t = i / passos;
    const d = i === 0 || i === passos ? 0 : (i % 2 ? 1 : -1) * amplitude * sorteio(0.45, 1);
    return [a[0] + (b[0] - a[0]) * t + (horizontal ? 0 : d), a[1] + (b[1] - a[1]) * t + (horizontal ? d : 0)] as Ponto;
  });
}

function montarCorte(tipo: Tipo): Corte {
  if (tipo === "tesoura") {
    const linha = serra([0, sorteio(30, 45)], [100, sorteio(55, 70)], 12, 2.4);
    const volta = [...linha].reverse();
    return {
      tipo,
      linha,
      caminho: [[-18, linha[0][1]], [118, linha[linha.length - 1][1]]],
      pedacos: [
        { foto: poligono([[0, 0], [100, 0], ...deslocar(volta, 0, -1.2)]), papel: poligono([[0, 0], [100, 0], ...volta]), saida: "translate(-7%, -112%) rotate(-7deg)", atraso: 0 },
        { foto: poligono([...deslocar(linha, 0, 1.2), [100, 100], [0, 100]]), papel: poligono([...linha, [100, 100], [0, 100]]), saida: "translate(6%, 112%) rotate(6deg)", atraso: 40 },
      ],
    };
  }
  if (tipo === "rasgo") {
    const linha = serra([sorteio(42, 58), 0], [sorteio(42, 58), 100], 22, 3);
    return {
      tipo,
      linha,
      caminho: [],
      pedacos: [
        { foto: poligono([[0, 0], ...deslocar(linha, -2.2, 0), [0, 100]]), papel: poligono([[0, 0], ...linha, [0, 100]]), saida: "translate(-118%, 3%) rotate(-9deg)", atraso: 0 },
        { foto: poligono([...deslocar(linha, 2.2, 0), [100, 100], [100, 0]]), papel: poligono([...linha, [100, 100], [100, 0]]), saida: "translate(118%, -3%) rotate(8deg)", atraso: 30 },
      ],
    };
  }
  // tiras: a tesoura passa no alto e cada tira cai, como cabelo cortado
  const tiras = 4;
  const emendas = Array.from({ length: tiras + 1 }, (_, i) => {
    const x = (i / tiras) * 100;
    return i === 0 || i === tiras ? ([[x, 0], [x, 100]] as Ponto[]) : serra([x, 0], [x, 100], 10, 1.6);
  });
  return {
    tipo,
    linha: serra([0, 8], [100, 8], 10, 0.8),
    caminho: [[-18, 8], [118, 8]],
    pedacos: Array.from({ length: tiras }, (_, i) => {
      const esquerda = emendas[i];
      const direita = [...emendas[i + 1]].reverse();
      return {
        foto: poligono([...deslocar(esquerda, 0.8, 0), ...deslocar(direita, -0.8, 0)]),
        papel: poligono([...esquerda, ...direita]),
        saida: `translateY(118%) rotate(${i % 2 ? 5 : -5}deg)`,
        atraso: (DURACAO_CORTE.tiras * (i + 0.6)) / tiras - DURACAO_CORTE.tiras,
      };
    }),
  };
}

function Foto({ i }: { i: number }) {
  const f = FOTOS[i];
  return <img src={f.src} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: f.pos }} />;
}

function Lamina() {
  return (
    <>
      <path d="M28 29 L68 23 Q52 37 28 39 Z" fill={PAPEL} stroke="#120E0B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M30 33 L17 42" stroke="#120E0B" strokeWidth="4.6" strokeLinecap="round" />
      <circle cx="11" cy="47" r="7.5" fill="none" stroke="#120E0B" strokeWidth="4.2" />
    </>
  );
}

function Quadro({ posicao, estado, aoTerminar }: { posicao: string; estado: Estado; aoTerminar: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  const tesoura = useRef<HTMLDivElement>(null);
  const lamina1 = useRef<SVGGElement>(null);
  const lamina2 = useRef<SVGGElement>(null);
  const linha = useRef<SVGPolylineElement>(null);
  const pedacos = useRef<(HTMLDivElement | null)[]>([]);
  const fim = useRef(aoTerminar);
  fim.current = aoTerminar;
  const { foto, troca } = estado;

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!troca || !el) return;
    const { corte } = troca;
    const dur = DURACAO_CORTE[corte.tipo];
    const W = el.clientWidth;
    const H = el.clientHeight;
    const anims: Animation[] = [];

    if (linha.current) {
      // desenhada em pixels, para o tracejado não se partir; some quando os pedaços se soltam
      const l = linha.current;
      l.setAttribute("points", corte.linha.map(([x, y]) => `${(x / 100) * W},${(y / 100) * H}`).join(" "));
      const total = l.getTotalLength();
      l.style.strokeDasharray = `${total}`;
      anims.push(l.animate([{ strokeDashoffset: total }, { strokeDashoffset: 0 }], { duration: dur, easing: "linear", fill: "forwards" }));
      anims.push(l.animate([{ opacity: 1 }, { opacity: 0 }], { delay: dur, duration: 80, fill: "forwards" }));
    }
    if (corte.caminho.length && tesoura.current) {
      const [[x0, y0], [x1, y1]] = corte.caminho.map(([x, y]) => [(x / 100) * W, (y / 100) * H]);
      const giro = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      const pos = (x: number, y: number) => `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${giro}deg)`;
      anims.push(tesoura.current.animate([{ transform: pos(x0, y0) }, { transform: pos(x1, y1) }], { duration: dur, easing: "cubic-bezier(.35,0,.65,1)", fill: "forwards" }));
      const abre = { duration: 150, iterations: Math.ceil(dur / 150), direction: "alternate" as const, easing: "ease-in-out" };
      lamina1.current?.animate([{ rotate: "-15deg" }, { rotate: "3deg" }], abre);
      lamina2.current?.animate([{ rotate: "15deg" }, { rotate: "-3deg" }], abre);
    }
    corte.pedacos.forEach((p, i) => {
      const pd = pedacos.current[i];
      if (pd) anims.push(pd.animate([{ transform: "none" }, { transform: p.saida }], { delay: dur + p.atraso, duration: 620, easing: "cubic-bezier(.5,0,.85,.45)", fill: "forwards" }));
    });

    let vivo = true;
    Promise.all(anims.map((a) => a.finished))
      .then(() => { if (vivo) fim.current(); })
      .catch(() => { /* cancelada ao sair da página */ });
    return () => {
      vivo = false;
      anims.forEach((a) => a.cancel());
    };
  }, [troca]);

  return (
    <div ref={caixa} className={`relative overflow-hidden ${posicao}`}>
      <Foto key={troca ? troca.para : foto} i={troca ? troca.para : foto} />

      {troca?.corte.pedacos.map((p, i) => (
        <div key={i} ref={(n) => { pedacos.current[i] = n; }} className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: PAPEL, clipPath: p.papel }} />
          <div className="absolute inset-0" style={{ clipPath: p.foto }}>
            <Foto i={foto} />
          </div>
        </div>
      ))}

      {troca && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <polyline ref={linha} fill="none" stroke={PAPEL} strokeWidth="2" />
        </svg>
      )}

      {troca && troca.corte.caminho.length > 0 && (
        <div ref={tesoura} className="pointer-events-none absolute left-0 top-0 h-[6em] w-[6.6em] drop-shadow-[0_0.2em_0.3em_rgba(0,0,0,0.55)]">
          <svg viewBox="0 0 70 64" className="h-full w-full overflow-visible" aria-hidden="true">
            <g ref={lamina1} style={{ transformBox: "view-box", transformOrigin: "30px 33px" }}><Lamina /></g>
            <g transform="translate(0 66) scale(1 -1)">
              <g ref={lamina2} style={{ transformBox: "view-box", transformOrigin: "30px 33px" }}><Lamina /></g>
            </g>
            <circle cx="30" cy="33" r="2.4" fill="#120E0B" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function BarbeariaFotos() {
  const raiz = useRef<HTMLDivElement>(null);
  const passo = useRef(0);
  const [visivel, setVisivel] = useState(false);
  const [quadros, setQuadros] = useState<Estado[]>(() => QUADROS.map((_, foto) => ({ foto, troca: null })));

  // deixa as fotos de reserva prontas, para nenhuma aparecer pela metade atrás do corte
  useEffect(() => {
    FOTOS.slice(QUADROS.length).forEach((f) => {
      const img = new Image();
      img.src = f.src;
    });
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // um quadro de cada vez, numa ordem que salta pelo mosaico, sempre trocando por uma foto que não está à vista
  useEffect(() => {
    if (!visivel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      const n = passo.current;
      const alvo = (n * 5 + 1) % QUADROS.length;
      if (quadros[alvo].troca) return;
      const emUso = new Set(quadros.flatMap((q) => (q.troca ? [q.foto, q.troca.para] : [q.foto])));
      const livres = FOTOS.map((_, i) => i).filter((i) => !emUso.has(i));
      if (!livres.length) return;
      passo.current = n + 1;
      const corte = montarCorte(TIPOS[n % TIPOS.length]);
      const para = livres[n % livres.length];
      setQuadros((qs) => qs.map((q, i) => (i === alvo ? { ...q, troca: { para, corte } } : q)));
    }, INTERVALO);
    return () => clearTimeout(t);
  }, [visivel, quadros]);

  return (
    <div ref={raiz} aria-hidden="true" className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-[0.4em] bg-[#120E0B]">
      {quadros.map((q, i) => (
        <Quadro
          key={QUADROS[i]}
          posicao={QUADROS[i]}
          estado={q}
          aoTerminar={() => setQuadros((qs) => qs.map((x, j) => (j === i && x.troca ? { foto: x.troca.para, troca: null } : x)))}
        />
      ))}
    </div>
  );
}
