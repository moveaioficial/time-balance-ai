// Motor do cabelo da Barbearia Move, o exemplo fictício da seção "Na prática". Canvas 2D, sem dependências.
// Feito para ser leve: os fios são desenhados UMA vez numa tela guardada. Cada quadro só cola 3 ou 4 imagens prontas e
// desenha poucos fios no ar. Cortar é apagar um retângulo da tela guardada, então a máquina custa quase nada.

const FIOS = ["#0c0907", "#17110d", "#241a14", "#35271d"];
export const FONTE_PALAVRA = '"Bowlby One"';

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function novaTela(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/** Aparelho fraco desenha menos fios e numa resolução menor. */
export function aparelhoFraco() {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (n.hardwareConcurrency ?? 8) <= 4 || (n.deviceMemory ?? 8) <= 4 || !!n.connection?.saveData;
}

export interface EstadoMaquina {
  x: number;
  y: number;
  dir: 1 | -1;
  visivel: boolean;
  altura: number;
}

export interface Caixa {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface OpcoesPalavra {
  linhas: string[];
  caixa: Caixa;
  corLetra: string;
  largura: number;
  altura: number;
  dpr: number;
  maxFios: number;
  faixasPorLinha: number;
  onMaquina: (e: EstadoMaquina) => void;
}

export class CabeloPalavra {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private limpa: HTMLCanvasElement;
  private escura: HTMLCanvasElement;
  private base: HTMLCanvasElement;
  private pelos: HTMLCanvasElement;
  private monte: HTMLCanvasElement;
  private monteX: Float32Array;
  private mascara: Uint8Array = new Uint8Array(0);
  private mW = 0;
  private comp = 20;
  private espessura = 1.2;
  private alturaFaixa = 40;
  private topoBloco = 0;
  private rota: { x: number; y: number }[] = [];
  private iRota = 0;
  private velocidade = 1000;
  private maq = { x: 0, y: 0, dir: 1 as 1 | -1, visivel: false };

  // fios no ar
  private maxP = 320;
  private pAtivo = 0;
  private px = new Float32Array(320);
  private py = new Float32Array(320);
  private pvx = new Float32Array(320);
  private pvy = new Float32Array(320);
  private pa = new Float32Array(320);
  private pva = new Float32Array(320);
  private pl = new Float32Array(320);
  private pc = new Uint8Array(320);

  private crescendo: { ms: number; t: number; fim?: () => void } | null = null;
  private opacidade = 1;
  private auto = false;
  private aoTerminar: (() => void) | null = null;
  private rodando = false;
  private pausado = false;
  private raf = 0;
  private ultimo = 0;
  private lento = 0;

  constructor(private canvas: HTMLCanvasElement, private op: OpcoesPalavra) {
    this.ctx = canvas.getContext("2d", { alpha: true })!;
    this.dpr = op.dpr;
    const W = Math.round(op.largura * this.dpr);
    const H = Math.round(op.altura * this.dpr);
    canvas.width = W;
    canvas.height = H;
    this.limpa = novaTela(W, H);
    this.escura = novaTela(W, H);
    this.base = novaTela(W, H);
    this.pelos = novaTela(W, H);
    this.monte = novaTela(W, H);
    this.monteX = new Float32Array(Math.ceil(op.largura / 4) + 2);
    this.montar();
  }

  private montar() {
    const { largura: W, altura: H, linhas, caixa } = this.op;
    const dpr = this.dpr;

    const med = document.createElement("canvas").getContext("2d")!;
    med.font = `100px ${FONTE_PALAVRA}`;
    let maiorW = 0;
    let capaAlt = 60;
    for (const l of linhas) {
      const m = med.measureText(l);
      maiorW = Math.max(maiorW, m.actualBoundingBoxLeft + m.actualBoundingBoxRight);
      capaAlt = Math.max(capaAlt, m.actualBoundingBoxAscent);
    }
    const vao = 0.16;
    const fs = Math.min((caixa.w / maiorW) * 100, (caixa.h / (capaAlt * (linhas.length + vao * (linhas.length - 1)))) * 100);
    const capa = (capaAlt * fs) / 100;
    const altBloco = capa * (linhas.length + vao * (linhas.length - 1));
    const topo = caixa.y + (caixa.h - altBloco) / 2;

    const m = novaTela(Math.ceil(W), Math.ceil(H));
    const mc = m.getContext("2d", { willReadFrequently: true })!;
    mc.font = `${fs}px ${FONTE_PALAVRA}`;
    let esq = Infinity;
    let dir = 0;
    const escrever = (c: CanvasRenderingContext2D) => {
      linhas.forEach((l, i) => {
        const lm = c.measureText(l);
        const lw = lm.actualBoundingBoxLeft + lm.actualBoundingBoxRight;
        const x = caixa.x + (caixa.w - lw) / 2 + lm.actualBoundingBoxLeft;
        c.fillText(l, x, topo + capa + i * capa * (1 + vao));
        esq = Math.min(esq, x - lm.actualBoundingBoxLeft);
        dir = Math.max(dir, x + lm.actualBoundingBoxRight);
      });
    };
    mc.fillStyle = "#000";
    escrever(mc);

    const lc = this.limpa.getContext("2d")!;
    lc.setTransform(dpr, 0, 0, dpr, 0, 0);
    lc.font = mc.font;
    lc.fillStyle = this.op.corLetra;
    escrever(lc);
    const ec = this.escura.getContext("2d")!;
    ec.drawImage(this.limpa, 0, 0);
    ec.globalCompositeOperation = "source-in";
    ec.fillStyle = FIOS[0];
    ec.fillRect(0, 0, this.escura.width, this.escura.height);

    // máscara em 1x: de onde podem cair fios
    const dados = mc.getImageData(0, 0, m.width, m.height).data;
    this.mW = m.width;
    this.mascara = new Uint8Array(m.width * m.height);
    let area = 0;
    for (let i = 0; i < this.mascara.length; i++) {
      if (dados[i * 4 + 3] > 128) {
        this.mascara[i] = 1;
        area++;
      }
    }

    // os fios: desenhados uma vez só, por cor
    const passo = Math.max(2.1, Math.sqrt(area / this.op.maxFios));
    const compMin = capa * 0.07;
    const compMax = capa * 0.17;
    this.comp = compMax;
    this.espessura = clamp(capa / 170, 0.9, 1.7);
    const pc = this.pelos.getContext("2d")!;
    pc.setTransform(dpr, 0, 0, dpr, 0, 0);
    pc.lineCap = "round";
    pc.lineWidth = this.espessura;
    const caminhos = FIOS.map(() => new Path2D());
    for (let y = 0; y < m.height; y += passo) {
      for (let x = 0; x < m.width; x += passo) {
        const jx = x + rnd(-passo, passo) * 0.5;
        const jy = y + rnd(-passo, passo) * 0.5;
        const ix = Math.round(jx);
        const iy = Math.round(jy);
        if (ix < 0 || iy < 0 || ix >= m.width || iy >= m.height) continue;
        if (!this.mascara[iy * m.width + ix]) continue;
        const r = Math.random();
        const cor = r < 0.42 ? 0 : r < 0.74 ? 1 : r < 0.93 ? 2 : 3;
        const ang = Math.PI / 2 + 0.6 * Math.sin(jx * 0.013 + jy * 0.008) + 0.25 * Math.sin(jy * 0.031 + jx * 0.004) + rnd(-0.22, 0.22);
        const comp = rnd(compMin, compMax);
        const curva = rnd(-0.28, 0.28) * comp;
        const dx = Math.cos(ang);
        const dy = Math.sin(ang);
        caminhos[cor].moveTo(jx, jy);
        caminhos[cor].quadraticCurveTo(jx + dx * comp * 0.5 - dy * curva, jy + dy * comp * 0.5 + dx * curva, jx + dx * comp, jy + dy * comp);
      }
    }
    caminhos.forEach((c, i) => {
      pc.strokeStyle = FIOS[i];
      pc.stroke(c);
    });

    // faixas da máquina, em zigue-zague
    const faixas = linhas.length * this.op.faixasPorLinha;
    this.alturaFaixa = altBloco / faixas;
    this.topoBloco = topo;
    const margem = this.alturaFaixa * 0.4;
    for (let i = 0; i < faixas; i++) {
      const y = topo + this.alturaFaixa * (i + 0.5);
      const a = esq - margem;
      const b = dir + margem;
      if (i % 2 === 0) this.rota.push({ x: a, y }, { x: b, y });
      else this.rota.push({ x: b, y }, { x: a, y });
    }
    this.velocidade = Math.max((dir - esq) / 0.72, 420);
    this.reiniciarBase();
  }

  private reiniciarBase() {
    const b = this.base.getContext("2d")!;
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.clearRect(0, 0, this.base.width, this.base.height);
    b.drawImage(this.escura, 0, 0);
  }

  private guardados: HTMLCanvasElement | null = null;

  /** Cópia dos fios inteiros, para crescer de novo sem redesenhar um por um. */
  private restaurarPelos() {
    const c = this.pelos.getContext("2d")!;
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (this.guardados) {
      c.clearRect(0, 0, this.pelos.width, this.pelos.height);
      c.drawImage(this.guardados, 0, 0);
    }
  }

  private cortarEntre(x0: number, y0: number, x1: number, y1: number, dir: 1 | -1) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const passos = Math.max(1, Math.ceil(dist / (this.alturaFaixa * 0.45)));
    for (let p = 1; p <= passos; p++) {
      const t = p / passos;
      this.cortar(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, dir);
    }
  }

  private cortar(x: number, y: number, dir: 1 | -1) {
    const meia = this.alturaFaixa * 0.52;
    const fundo = this.alturaFaixa * 0.5;
    const xa = dir > 0 ? x - fundo : x;
    const ya = y - meia;
    const d = this.dpr;
    const sx = Math.max(0, xa * d);
    const sy = Math.max(0, ya * d);
    const sw = Math.max(1, fundo * d);
    const sh = Math.max(1, meia * 2 * d);
    this.base.getContext("2d")!.drawImage(this.limpa, sx, sy, sw, sh, sx, sy, sw, sh);
    // na última faixa de cada linha, apaga também as pontas que pendiam para fora da letra
    const faixa = Math.floor((y - this.topoBloco) / this.alturaFaixa);
    const fimDeLinha = (faixa + 1) % this.op.faixasPorLinha === 0;
    this.pelos.getContext("2d")!.clearRect(sx, sy, sw, sh + (fimDeLinha ? this.comp * d * 1.1 : 0));
    // solta alguns fios do trecho
    const tentativas = this.maxP > 120 ? 8 : 2;
    for (let i = 0; i < tentativas; i++) {
      if (this.pAtivo >= this.maxP) break;
      const fx = rnd(xa, xa + fundo);
      const fy = rnd(ya, ya + meia * 2);
      const idx = Math.round(fy) * this.mW + Math.round(fx);
      if (!this.mascara[idx]) continue;
      const k = this.pAtivo++;
      this.px[k] = fx;
      this.py[k] = fy;
      this.pvx[k] = rnd(-30, 110) * dir;
      this.pvy[k] = rnd(-110, 30);
      this.pa[k] = rnd(0, Math.PI);
      this.pva[k] = rnd(-5, 5);
      this.pl[k] = this.comp * rnd(0.45, 1);
      this.pc[k] = Math.floor(rnd(0, FIOS.length));
    }
  }

  private pousar(k: number) {
    const { largura: W, altura: H } = this.op;
    const bin = clamp(Math.floor(this.px[k] / 4), 0, this.monteX.length - 1);
    const alt = this.monteX[bin];
    const y = H - 2 - alt * rnd(0.6, 1);
    const a = rnd(-0.32, 0.32);
    const c = this.monte.getContext("2d")!;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.strokeStyle = FIOS[this.pc[k]];
    c.lineWidth = this.espessura;
    c.lineCap = "round";
    c.beginPath();
    const x = clamp(this.px[k], 0, W);
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * this.pl[k], y + Math.sin(a) * this.pl[k]);
    c.stroke();
    if (alt < H * 0.06) {
      this.monteX[bin] += 1.5;
      if (bin > 0) this.monteX[bin - 1] += 0.8;
      if (bin < this.monteX.length - 1) this.monteX[bin + 1] += 0.8;
    }
    const u = --this.pAtivo;
    this.px[k] = this.px[u];
    this.py[k] = this.py[u];
    this.pvx[k] = this.pvx[u];
    this.pvy[k] = this.pvy[u];
    this.pa[k] = this.pa[u];
    this.pva[k] = this.pva[u];
    this.pl[k] = this.pl[u];
    this.pc[k] = this.pc[u];
  }

  private avisar(vibrar: boolean) {
    const j = vibrar ? 1.1 : 0;
    this.op.onMaquina({ x: this.maq.x + rnd(-j, j), y: this.maq.y + rnd(-j, j), dir: this.maq.dir, visivel: this.maq.visivel, altura: this.alturaFaixa * 1.25 });
  }

  private atualizar(dt: number) {
    if (this.crescendo) {
      this.crescendo.t += dt * 1000;
      const t = clamp(this.crescendo.t / this.crescendo.ms);
      this.opacidade = t;
      if (t >= 1) {
        const fim = this.crescendo.fim;
        this.crescendo = null;
        this.monte.getContext("2d")!.clearRect(0, 0, this.monte.width, this.monte.height);
        this.monteX.fill(0);
        this.reiniciarBase();
        fim?.();
      }
    }
    if (this.auto) {
      let resta = this.velocidade * dt;
      while (resta > 0 && this.iRota < this.rota.length) {
        const alvo = this.rota[this.iRota];
        const dx = alvo.x - this.maq.x;
        const dy = alvo.y - this.maq.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.5) { this.iRota++; continue; }
        const passo = Math.min(resta, dist);
        const nx = this.maq.x + (dx / dist) * passo;
        const ny = this.maq.y + (dy / dist) * passo;
        if (Math.abs(dx) > 1) this.maq.dir = dx > 0 ? 1 : -1;
        if (Math.abs(dx) > Math.abs(dy)) this.cortarEntre(this.maq.x, this.maq.y, nx, ny, this.maq.dir);
        this.maq.x = nx;
        this.maq.y = ny;
        resta -= passo;
      }
      if (this.iRota >= this.rota.length) {
        this.auto = false;
        this.maq.visivel = false;
        this.base.getContext("2d")!.drawImage(this.limpa, 0, 0);
        this.pelos.getContext("2d")!.clearRect(0, 0, this.pelos.width, this.pelos.height);
        const fim = this.aoTerminar;
        this.aoTerminar = null;
        this.avisar(false);
        fim?.();
      } else {
        this.avisar(true);
      }
    }
    for (let k = this.pAtivo - 1; k >= 0; k--) {
      this.pvy[k] = Math.min(this.pvy[k] + 760 * dt, 460);
      this.pvx[k] *= 0.985;
      this.px[k] += (this.pvx[k] + Math.sin(this.py[k] * 0.02 + k) * 28) * dt;
      this.py[k] += this.pvy[k] * dt;
      this.pa[k] += this.pva[k] * dt;
      const bin = clamp(Math.floor(this.px[k] / 4), 0, this.monteX.length - 1);
      if (this.py[k] >= this.op.altura - 2 - this.monteX[bin]) this.pousar(k);
    }
  }

  desenhar() {
    const { ctx, dpr } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.crescendo) {
      ctx.globalAlpha = 1 - this.opacidade;
      ctx.drawImage(this.monte, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(this.limpa, 0, 0);
      ctx.globalAlpha = this.opacidade;
      ctx.drawImage(this.escura, 0, 0);
      ctx.drawImage(this.pelos, 0, 0);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.drawImage(this.monte, 0, 0);
    ctx.drawImage(this.base, 0, 0);
    ctx.drawImage(this.pelos, 0, 0);
    if (!this.pAtivo) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineWidth = this.espessura;
    ctx.strokeStyle = FIOS[1];
    ctx.beginPath();
    for (let k = 0; k < this.pAtivo; k++) {
      const x = this.px[k];
      const y = this.py[k];
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(this.pa[k]) * this.pl[k], y + Math.sin(this.pa[k]) * this.pl[k]);
    }
    ctx.stroke();
  }

  private laco = (agora: number) => {
    if (!this.rodando) return;
    const ms = agora - this.ultimo;
    this.ultimo = agora;
    // aparelho patinando: menos fios no ar
    if (ms > 34) {
      if (++this.lento > 30 && this.maxP > 90) this.maxP = 90;
    } else {
      this.lento = Math.max(0, this.lento - 1);
    }
    this.atualizar(Math.min(0.05, ms / 1000 || 0.016));
    this.desenhar();
    if (this.auto || this.pAtivo > 0 || this.crescendo) this.raf = requestAnimationFrame(this.laco);
    else this.rodando = false;
  };

  private ligar() {
    if (this.rodando || this.pausado) return;
    this.rodando = true;
    this.ultimo = performance.now();
    this.raf = requestAnimationFrame(this.laco);
  }

  pausar() {
    this.pausado = true;
    this.rodando = false;
    cancelAnimationFrame(this.raf);
  }

  retomar() {
    this.pausado = false;
    this.ligar();
  }

  passarMaquina(fim?: () => void) {
    this.aoTerminar = fim ?? null;
    this.iRota = 1;
    this.maq.x = this.rota[0].x;
    this.maq.y = this.rota[0].y;
    this.maq.dir = this.rota[1].x > this.rota[0].x ? 1 : -1;
    this.maq.visivel = true;
    this.auto = true;
    this.ligar();
  }

  crescer(ms: number, fim?: () => void) {
    if (!this.guardados) {
      // primeira vez: guarda os fios inteiros
      this.guardados = novaTela(this.pelos.width, this.pelos.height);
      this.guardados.getContext("2d")!.drawImage(this.pelos, 0, 0);
    }
    this.auto = false;
    this.aoTerminar = null;
    this.pAtivo = 0;
    this.maq.visivel = false;
    this.avisar(false);
    this.restaurarPelos();
    this.opacidade = 0;
    this.crescendo = { ms, t: 0, fim };
    this.ligar();
  }

  /** Versão parada, para quem pediu menos movimento. */
  estadoFinal() {
    this.base.getContext("2d")!.drawImage(this.limpa, 0, 0);
    this.pelos.getContext("2d")!.clearRect(0, 0, this.pelos.width, this.pelos.height);
    for (let i = 0; i < 260; i++) {
      this.px[0] = rnd(0, this.op.largura);
      this.pl[0] = this.comp * rnd(0.45, 1);
      this.pc[0] = Math.floor(rnd(0, FIOS.length));
      this.pAtivo = 1;
      this.pousar(0);
    }
    this.desenhar();
  }

  destruir() {
    this.rodando = false;
    cancelAnimationFrame(this.raf);
  }
}

/* ------------------------------------------------------------------ */

/**
 * Degradê em três passadas. Duas telas prontas, cabelo comprido e cabelo em degradê; a máquina só muda o recorte entre elas.
 * Custa duas colagens de imagem por quadro, mesmo em tela grande.
 */
export class CampoDegrade {
  private ctx: CanvasRenderingContext2D;
  private longo: HTMLCanvasElement;
  private curto: HTMLCanvasElement;
  private readonly inicio = 0.5;
  private readonly faixas = 3;
  private raf = 0;
  private rodando = false;

  constructor(private canvas: HTMLCanvasElement, private W: number, private H: number, private dpr: number, maxFios: number) {
    this.ctx = canvas.getContext("2d")!;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    this.longo = novaTela(canvas.width, canvas.height);
    this.curto = novaTela(canvas.width, canvas.height);
    const passo = Math.sqrt((W * H) / maxFios);
    const comp = Math.max(30, Math.min(W, H) * 0.09);
    const larg = W < 500 ? 1.1 : 1.5;
    const camadas: [HTMLCanvasElement, (y: number) => number][] = [
      [this.longo, () => 1],
      [this.curto, (y) => {
        const u = clamp((y / H - this.inicio) / (1 - this.inicio));
        return Math.max(0, 1 - u * 1.08);
      }],
    ];
    for (const [tela, fator] of camadas) {
      const c = tela.getContext("2d")!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.lineCap = "round";
      const grossos = new Path2D();
      const finos = FIOS.map(() => new Path2D());
      for (let y = -comp; y < H; y += passo) {
        for (let x = 0; x < W; x += passo) {
          const fx = x + rnd(-passo, passo) * 0.5;
          const fy = y + rnd(-passo, passo) * 0.5;
          const g = fator(fy + rnd(-1, 1) * H * 0.03);
          if (g < 0.03) continue;
          const ang = Math.PI / 2 + 0.34 * Math.sin(fx * 0.012 + fy * 0.006) + rnd(-0.14, 0.14);
          const l = comp * rnd(0.8, 1.2) * g;
          const ex = fx + Math.cos(ang) * l;
          const ey = fy + Math.sin(ang) * l;
          if (g > 0.4) {
            grossos.moveTo(fx, fy);
            grossos.lineTo(ex, ey);
          }
          const r = Math.random();
          const p = finos[r < 0.45 ? 0 : r < 0.76 ? 1 : r < 0.94 ? 2 : 3];
          p.moveTo(fx, fy);
          p.lineTo(ex, ey);
        }
      }
      c.lineWidth = larg * 2.9;
      c.strokeStyle = FIOS[1];
      c.stroke(grossos);
      c.lineWidth = larg;
      finos.forEach((p, i) => {
        c.strokeStyle = FIOS[i];
        c.stroke(p);
      });
    }
    this.desenhar(0);
  }

  /** Posição da máquina no progresso p, de 0 a 1. A primeira passada é a de baixo. */
  posicao(p: number) {
    const f = clamp(p) * this.faixas;
    const i = Math.min(Math.floor(f), this.faixas - 1);
    const alt = (1 - this.inicio) * this.H / this.faixas;
    return { x: (f - i) * this.W, y: this.H - alt * (i + 0.5), faixa: i, altura: alt };
  }

  desenhar(p: number) {
    const { ctx, W, H } = this;
    const pos = this.posicao(p);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.curto, 0, 0);
    // o cabelo comprido só fica onde a máquina ainda não passou
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.beginPath();
    const topoCorte = H - pos.altura * (pos.faixa + 1);
    if (p < 1) {
      ctx.rect(0, 0, W, topoCorte);
      ctx.rect(pos.x, topoCorte, W - pos.x, pos.altura);
    } else {
      ctx.rect(0, 0, W, topoCorte);
    }
    ctx.clip();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.longo, 0, 0);
    ctx.restore();
  }

  /** Roda as passadas sozinho. */
  passar(ms: number, aoMover: (x: number, y: number, altura: number, faixa: number, visivel: boolean) => void, fim: () => void) {
    this.parar();
    this.rodando = true;
    const t0 = performance.now();
    const laco = (agora: number) => {
      if (!this.rodando) return;
      const p = clamp((agora - t0) / ms);
      this.desenhar(p);
      const pos = this.posicao(p);
      aoMover(pos.x, pos.y, pos.altura, pos.faixa, p < 1);
      if (p < 1) this.raf = requestAnimationFrame(laco);
      else {
        this.rodando = false;
        fim();
      }
    };
    this.raf = requestAnimationFrame(laco);
  }

  parar() {
    this.rodando = false;
    cancelAnimationFrame(this.raf);
  }
}
