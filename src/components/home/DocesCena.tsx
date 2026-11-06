import { useEffect, useRef } from "react";
import "@fontsource/fraunces/latin-900.css";
import "@fontsource/fraunces/latin-600.css";

// A cena da Move Doces (fictícia) na abertura do site, em canvas 2D, sem dependências. Só carrega depois da primeira pintura,
// no computador. A palavra é massa de bolo: a calda de chocolate desce, pinga das letras, o granulado cai, gruda na calda ou
// faz monte no chão, e a cereja cai em cima do "o".
// Tudo fica guardado em telas prontas: cada quadro cola imagens e desenha só o que está em movimento.

const CHOCOLATE = "#47210F";
const BRILHO = "#8E5532";
const MASSA = "#F4A3B8";
const GRANULADO = ["#E8437A", "#F7C531", "#2DB4C8", "#8B5BD6", "#F27B2E", "#FFFDF6"];
const FONTE = '"Fraunces"';

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const saida = (t: number) => 1 - Math.pow(1 - t, 3);
const tela = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

interface Pingo { x: number; y: number; w: number; comp: number; atraso: number; dur: number }

class Cena {
  private ctx: CanvasRenderingContext2D;
  private massa: HTMLCanvasElement;
  private calda: HTMLCanvasElement;
  private grudados: HTMLCanvasElement;
  private mascara: Uint8Array;
  private mW: number;
  private pingos: Pingo[] = [];
  private bbox = { x: 0, y: 0, w: 0, h: 0 };
  private cereja = { x: 0, y: 0, r: 10 };
  private monteX: Float32Array;
  private n = 0;
  private readonly maxG = 170;
  private gx = new Float32Array(this.maxG);
  private gy = new Float32Array(this.maxG);
  private gvx = new Float32Array(this.maxG);
  private gvy = new Float32Array(this.maxG);
  private ga = new Float32Array(this.maxG);
  private gva = new Float32Array(this.maxG);
  private gc = new Uint8Array(this.maxG);
  private soltos = 0;
  private escala: number;

  constructor(private canvas: HTMLCanvasElement, private W: number, private H: number, private dpr: number) {
    this.ctx = canvas.getContext("2d")!;
    const cw = Math.round(W * dpr);
    const ch = Math.round(H * dpr);
    canvas.width = cw;
    canvas.height = ch;
    this.massa = tela(cw, ch);
    this.calda = tela(cw, ch);
    this.grudados = tela(cw, ch);
    this.monteX = new Float32Array(Math.ceil(W / 4) + 2);
    this.escala = W / 700;

    // encaixa a palavra na caixa
    const med = document.createElement("canvas").getContext("2d")!;
    med.font = `900 100px ${FONTE}`;
    const m0 = med.measureText("Doces");
    const lw = m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight;
    const fs = ((W * 0.92) / lw) * 100;
    const escrever = (c: CanvasRenderingContext2D, dx = 0, dy = 0) => {
      c.font = `900 ${fs}px ${FONTE}`;
      c.fillText("Doces", x0 + dx, base + dy);
    };
    const m1 = (med.font = `900 ${fs}px ${FONTE}`, med.measureText("Doces"));
    const x0 = (W - (m1.actualBoundingBoxLeft + m1.actualBoundingBoxRight)) / 2 + m1.actualBoundingBoxLeft;
    const alt = m1.actualBoundingBoxAscent;
    const topo = H * 0.15;
    const base = topo + alt;
    this.bbox = { x: x0 - m1.actualBoundingBoxLeft, y: topo, w: m1.actualBoundingBoxLeft + m1.actualBoundingBoxRight, h: alt + m1.actualBoundingBoxDescent };

    const ma = this.massa.getContext("2d")!;
    ma.setTransform(dpr, 0, 0, dpr, 0, 0);
    ma.fillStyle = MASSA;
    escrever(ma);

    // calda: palavra escura com um filete de luz nas bordas de cima, que dá o brilho de chocolate
    const ca = this.calda.getContext("2d")!;
    ca.setTransform(dpr, 0, 0, dpr, 0, 0);
    ca.fillStyle = BRILHO;
    escrever(ca);
    ca.globalCompositeOperation = "source-atop";
    ca.fillStyle = CHOCOLATE;
    escrever(ca, 1.6 * this.escala, 3.2 * this.escala);
    ca.fillStyle = "rgba(255, 228, 200, 0.16)";
    for (let i = 0; i < 9; i++) {
      ca.beginPath();
      ca.ellipse(this.bbox.x + rnd(0.04, 0.96) * this.bbox.w, topo + rnd(0.12, 0.8) * alt, rnd(2.5, 6) * this.escala, rnd(10, 26) * this.escala, 0.25, 0, Math.PI * 2);
      ca.fill();
    }
    ca.globalCompositeOperation = "source-over";

    // máscara em 1x
    const mt = tela(Math.ceil(W), Math.ceil(H));
    const mc = mt.getContext("2d", { willReadFrequently: true })!;
    mc.fillStyle = "#000";
    escrever(mc);
    const d = mc.getImageData(0, 0, mt.width, mt.height).data;
    this.mW = mt.width;
    this.mascara = new Uint8Array(mt.width * mt.height);
    for (let i = 0; i < this.mascara.length; i++) this.mascara[i] = d[i * 4 + 3] > 128 ? 1 : 0;

    this.acharPingos();

    // a cereja fica em cima do "o"
    med.font = `900 ${fs}px ${FONTE}`;
    const mD = med.measureText("D").width;
    const mo = med.measureText("o").width;
    const cx = x0 + mD + mo / 2;
    let topoO = Math.round(base);
    while (topoO > 0 && this.dentro(cx, topoO)) topoO--;
    while (topoO > 0 && !this.dentro(cx, topoO) && base - topoO < alt * 0.55) topoO--;
    let t2 = Math.round(topoO);
    while (t2 > 0 && this.dentro(cx, t2)) t2--;
    const r = Math.max(fs * 0.095, 13 * this.escala);
    this.cereja = { x: cx, y: t2 - r * 0.72, r };
    this.limpar();
  }

  private dentro(x: number, y: number) {
    return this.mascara[Math.round(y) * this.mW + Math.round(x)] === 1;
  }

  /** Procura as beiradas de baixo das letras: é de lá que a calda pinga. */
  private acharPingos() {
    const { x, y, w, h } = this.bbox;
    const fundo = y + h;
    const espaco = this.W / 34;
    for (let px = x + 6; px < x + w - 4; px += espaco * rnd(0.75, 1.25)) {
      const col = Math.round(px);
      for (let py = Math.round(fundo + 2); py > y; py--) {
        if (this.dentro(col, py) && !this.dentro(col, py + 1)) {
          if (!this.dentro(col, py - 8)) continue;
          // quanto de vão existe embaixo
          let vao = 0;
          while (vao < h && !this.dentro(col, py + 1 + vao) && py + vao < this.H - 2) vao++;
          if (vao < 8) continue;
          const eFundo = py > fundo - h * 0.14;
          this.pingos.push({
            x: col,
            y: py,
            w: rnd(5, 11) * this.escala,
            comp: Math.min(vao - 3, (eFundo ? rnd(18, 62) : rnd(8, 26)) * this.escala),
            atraso: rnd(0, 1.1),
            dur: rnd(1.1, 2.3),
          });
          break;
        }
      }
    }
  }

  limpar() {
    this.n = 0;
    this.soltos = 0;
    this.monteX.fill(0);
    this.grudados.getContext("2d")!.clearRect(0, 0, this.grudados.width, this.grudados.height);
    const { ctx } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.massa, 0, 0);
  }

  private soltar(t: number) {
    // a chuva de granulado começa depois da calda
    const alvo = Math.floor(clamp((t - 3) / 2.7) * 240);
    while (this.soltos < alvo && this.n < this.maxG) {
      this.soltos++;
      const k = this.n++;
      this.gx[k] = rnd(0, this.W);
      this.gy[k] = -10;
      this.gvx[k] = rnd(-14, 14);
      this.gvy[k] = rnd(170, 300);
      this.ga[k] = rnd(0, Math.PI);
      this.gva[k] = rnd(-7, 7);
      this.gc[k] = Math.floor(rnd(0, GRANULADO.length));
    }
  }

  private colar(k: number, x: number, y: number, a: number) {
    const c = this.grudados.getContext("2d")!;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.traco(c, x, y, a, this.gc[k]);
  }

  private traco(c: CanvasRenderingContext2D, x: number, y: number, a: number, cor: number) {
    const l = 5.5 * this.escala;
    c.strokeStyle = GRANULADO[cor];
    c.lineWidth = 3 * this.escala;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(x - Math.cos(a) * l, y - Math.sin(a) * l);
    c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    c.stroke();
  }

  private remover(k: number) {
    const u = --this.n;
    this.gx[k] = this.gx[u];
    this.gy[k] = this.gy[u];
    this.gvx[k] = this.gvx[u];
    this.gvy[k] = this.gvy[u];
    this.ga[k] = this.ga[u];
    this.gva[k] = this.gva[u];
    this.gc[k] = this.gc[u];
  }

  private cair(dt: number) {
    for (let k = this.n - 1; k >= 0; k--) {
      this.gvy[k] = Math.min(this.gvy[k] + 900 * dt, 620);
      this.gx[k] += this.gvx[k] * dt;
      this.gy[k] += this.gvy[k] * dt;
      this.ga[k] += this.gva[k] * dt;
      const x = this.gx[k];
      const y = this.gy[k];
      if (x < 0 || x >= this.W) { this.remover(k); continue; }
      if (y > 0 && y < this.H && this.dentro(x, y) && Math.random() < 0.5) {
        this.colar(k, x, y, this.ga[k]);
        this.remover(k);
        continue;
      }
      const bin = clamp(Math.floor(x / 4), 0, this.monteX.length - 1);
      const chao = this.H - 3 - this.monteX[bin];
      if (y >= chao) {
        this.colar(k, x, chao, rnd(-0.5, 0.5));
        if (this.monteX[bin] < this.H * 0.05) {
          this.monteX[bin] += 2.2;
          if (bin > 0) this.monteX[bin - 1] += 1.1;
          if (bin < this.monteX.length - 1) this.monteX[bin + 1] += 1.1;
        }
        this.remover(k);
      }
    }
  }

  private desenharCereja(t: number) {
    const { ctx } = this;
    const { x, y, r } = this.cereja;
    const t0 = 5.2;
    if (t < t0) return;
    const u = t - t0;
    let py = y;
    let sx = 1;
    let sy = 1;
    const queda = 0.42;
    if (u < queda) {
      const k = u / queda;
      py = -r * 4 + (y + r * 4) * k * k;
      sy = 1.1;
      sx = 0.94;
    } else {
      const v = u - queda;
      // amassa ao bater e dá dois pulinhos, cada vez menores
      const pulo = Math.abs(Math.sin(v * 8.5)) * Math.exp(-v * 3.6) * r * 1.5;
      py = y - pulo;
      const am = Math.exp(-v * 8) * 0.26;
      sx = 1 + am;
      sy = 1 - am;
    }
    ctx.save();
    ctx.translate(x, py + r);
    ctx.scale(sx, sy);
    ctx.translate(0, -r);
    // cabinho
    ctx.strokeStyle = "#3F6B2A";
    ctx.lineWidth = Math.max(2, r * 0.13);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.82);
    ctx.quadraticCurveTo(r * 0.25, -r * 1.7, r * 0.95, -r * 1.95);
    ctx.stroke();
    // fruta
    ctx.fillStyle = "#C2162E";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8F0D20";
    ctx.beginPath();
    ctx.arc(r * 0.08, r * 0.12, r * 0.86, 0.1, Math.PI * 0.95);
    ctx.quadraticCurveTo(r * 0.1, r * 0.4, r * 0.9, r * 0.2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.ellipse(-r * 0.36, -r * 0.4, r * 0.2, r * 0.13, -0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /** Desenha o instante t, em segundos desde o começo da cena. Devolve true enquanto ainda há movimento. */
  quadro(t: number, dt: number) {
    const { ctx, dpr, W, H } = this;
    this.soltar(t);
    this.cair(dt);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.massa, 0, 0);

    // a frente da calda desce em lóbulos, recortando a palavra de chocolate
    const pr = clamp((t - 1.4) / 1.7);
    const p = pr * pr * (3 - 2 * pr);
    if (p > 0) {
      const { y: by, h: bh } = this.bbox;
      const frente = by - 40 * this.escala + (bh + 90 * this.escala) * p;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, frente);
      const passos = 22;
      for (let i = 0; i <= passos; i++) {
        const x = (i / passos) * W;
        const lobo = (Math.sin(i * 1.9 + 1) + Math.sin(i * 0.77)) * 15 * this.escala * (1 - p * 0.5);
        ctx.lineTo(x, frente + lobo);
      }
      ctx.lineTo(W, 0);
      ctx.closePath();
      ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(this.calda, 0, 0);
      ctx.restore();
    }

    // os pingos
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    for (const g of this.pingos) {
      const k = clamp((t - 2.4 - g.atraso) / g.dur);
      if (k <= 0) continue;
      const l = saida(k) * g.comp;
      ctx.strokeStyle = CHOCOLATE;
      ctx.fillStyle = CHOCOLATE;
      ctx.lineWidth = g.w;
      // base que se alarga onde o pingo sai da letra
      ctx.beginPath();
      ctx.moveTo(g.x - g.w * 1.25, g.y - 1);
      ctx.quadraticCurveTo(g.x - g.w * 0.5, g.y + 1, g.x - g.w * 0.45, g.y + g.w * 0.9);
      ctx.lineTo(g.x + g.w * 0.45, g.y + g.w * 0.9);
      ctx.quadraticCurveTo(g.x + g.w * 0.5, g.y + 1, g.x + g.w * 1.25, g.y - 1);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x, g.y + l);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(g.x, g.y + l + g.w * 0.08, g.w * 0.62, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = BRILHO;
      ctx.lineWidth = Math.max(1, g.w * 0.16);
      ctx.beginPath();
      ctx.moveTo(g.x - g.w * 0.2, g.y + 2);
      ctx.lineTo(g.x - g.w * 0.2, g.y + l * 0.8);
      ctx.stroke();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.grudados, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let k = 0; k < this.n; k++) this.traco(ctx, this.gx[k], this.gy[k], this.ga[k], this.gc[k]);
    this.desenharCereja(t);
    void H;
    return t < 8;
  }

  /** Quadro final parado, para quem pediu menos movimento. */
  estadoFinal() {
    for (let i = 0; i < 90; i++) {
      this.gc[0] = Math.floor(rnd(0, GRANULADO.length));
      const x = rnd(0, this.W);
      const yy = rnd(0, this.H);
      if (this.dentro(x, yy)) this.colar(0, x, yy, rnd(0, Math.PI));
      else this.colar(0, x, this.H - rnd(3, 12), rnd(-0.5, 0.5));
    }
    this.n = 0;
    this.soltos = 1e6;
    this.quadro(20, 0);
  }
}

// Janela do ciclo de 18 s (ver hv-good em index.css) em que a cena roda: da virada, aos 40%, até o site sair, aos 98%.
const CICLO = 18000;
const INICIO = 7200;
const FIM = 17640;

// `parada`: desenha só o quadro final, sem animação (usado no celular, no antes e depois).
export default function DocesCena({ onPronto, parada: soQuadroFinal = false }: { onPronto: () => void; parada?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let vivo = true;
    let raf = 0;
    let timer = 0;
    let cena: Cena | null = null;
    let visivel = true;
    let ultimo = 0;
    let parada = false;
    let cicloAtual = -1;
    const reduz = soQuadroFinal || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const relogio = canvas.closest(".hv")?.querySelector<HTMLElement>(".hv-good");

    const agora = () => {
      const a = relogio?.getAnimations()[0];
      const t = a?.currentTime;
      return typeof t === "number" ? t : performance.now();
    };

    const passo = () => {
      if (!vivo || !visivel || !cena) return;
      const bruto = agora();
      const nCiclo = Math.floor(bruto / CICLO);
      const t = bruto % CICLO;
      if (t < INICIO || t >= FIM) {
        // fora da cena: deixa a palavra limpa e dorme até a próxima virada
        if (cicloAtual !== -1) {
          cena.limpar();
          cicloAtual = -1;
          parada = false;
        }
        const falta = t < INICIO ? INICIO - t : CICLO - t + INICIO;
        timer = window.setTimeout(passo, falta);
        return;
      }
      if (cicloAtual !== nCiclo) {
        cena.limpar();
        cicloAtual = nCiclo;
        parada = false;
        ultimo = t;
      }
      if (parada) {
        timer = window.setTimeout(passo, FIM - t + 20);
        return;
      }
      const dt = clamp((t - ultimo) / 1000, 0, 0.05);
      ultimo = t;
      const segue = cena.quadro((t - INICIO) / 1000, dt);
      if (!segue) parada = true;
      raf = requestAnimationFrame(passo);
    };

    document.fonts.load(`900 100px ${FONTE}`).finally(() => {
      if (!vivo) return;
      const pai = canvas.parentElement;
      const W = pai?.clientWidth ?? 0;
      const H = pai?.clientHeight ?? 0;
      if (!W || !H) return;
      cena = new Cena(canvas, W, H, Math.min(window.devicePixelRatio || 1, 1.5));
      onPronto();
      if (reduz) cena.estadoFinal();
      else passo();
    });

    const io = new IntersectionObserver(([e]) => {
      const era = visivel;
      visivel = e.isIntersecting;
      if (visivel && !era && !reduz) passo();
      if (!visivel) {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      }
    });
    io.observe(canvas);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a cena é montada uma vez; trocar o callback não pode refazê-la
  }, [soQuadroFinal]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
