// Motor do cabelo da Barbearia Move (exemplo fictício). Canvas 2D puro, sem dependências, para poder
// carregar também na home sem GSAP. Duas peças:
//   CabeloPalavra: uma palavra coberta de fios. A máquina passa, os fios caem e fazem monte no chão,
//   e por baixo aparece a letra limpa. Só desenha enquanto há movimento; parado, não gasta nada.
//   CampoDegrade: um campo de fios cujo comprimento vira um degradê, pente por pente, conforme a rolagem.

const FIOS = ["#0c0907", "#17110d", "#241a14", "#35271d"];
export const FONTE_PALAVRA = '"Bowlby One"';

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

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
  /** teto de fios: menos no celular e no quadro da home */
  maxFios: number;
  /** faixas (passadas de máquina) por linha de texto */
  faixasPorLinha: number;
  onMaquina?: (e: EstadoMaquina) => void;
  onCortado?: () => void;
}

export class CabeloPalavra {
  private ctx: CanvasRenderingContext2D;
  private dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  private base = document.createElement("canvas");
  private limpa = document.createElement("canvas");
  private monte = document.createElement("canvas");
  private monteX: Float32Array = new Float32Array(0);

  private n = 0;
  private inicioCor: number[] = [];
  private sx = new Float32Array(0);
  private sy = new Float32Array(0);
  private cx = new Float32Array(0);
  private cy = new Float32Array(0);
  private ex = new Float32Array(0);
  private ey = new Float32Array(0);
  private atraso = new Float32Array(0);
  private vivo = new Uint8Array(0);
  private vivos = 0;

  // fios caindo
  private readonly maxP = 1100;
  private pAtivo = 0;
  private px = new Float32Array(this.maxP);
  private py = new Float32Array(this.maxP);
  private pvx = new Float32Array(this.maxP);
  private pvy = new Float32Array(this.maxP);
  private pa = new Float32Array(this.maxP);
  private pva = new Float32Array(this.maxP);
  private pl = new Float32Array(this.maxP);
  private pc = new Uint8Array(this.maxP);

  private crescimento = 1;
  private crescendo: { de: number; ms: number; t: number } | null = null;
  private espessura = 1.2;
  private bbox: Caixa = { x: 0, y: 0, w: 0, h: 0 };
  private alturaFaixa = 40;
  private rota: { x: number; y: number }[] = [];
  private iRota = 0;
  private velocidade = 1000;
  private rodando = false;
  private raf = 0;
  private ultimo = 0;
  private auto = false;
  private maq = { x: 0, y: 0, dir: 1 as 1 | -1, visivel: false };
  private ultimoControle = 0;
  private aoTerminarAuto: (() => void) | null = null;
  private avisouCortado = false;
  private pausado = false;

  constructor(private canvas: HTMLCanvasElement, private op: OpcoesPalavra) {
    this.ctx = canvas.getContext("2d")!;
    this.montar();
  }

  private montar() {
    const { largura: W, altura: H, linhas, caixa } = this.op;
    const dpr = this.dpr;
    this.canvas.width = Math.round(W * dpr);
    this.canvas.height = Math.round(H * dpr);
    for (const c of [this.base, this.limpa, this.monte]) {
      c.width = this.canvas.width;
      c.height = this.canvas.height;
    }
    this.monteX = new Float32Array(Math.ceil(W / 4) + 2);

    // mede a fonte e encaixa as linhas na caixa
    const med = document.createElement("canvas").getContext("2d")!;
    med.font = `100px ${FONTE_PALAVRA}`;
    let maiorW = 0;
    let capaAlt = 60;
    for (const l of linhas) {
      const m = med.measureText(l);
      maiorW = Math.max(maiorW, m.actualBoundingBoxLeft + m.actualBoundingBoxRight);
      capaAlt = Math.max(capaAlt, m.actualBoundingBoxAscent);
    }
    const vao = 0.16; // vão entre linhas, em fração da altura da letra
    const altTotal100 = capaAlt * (linhas.length + vao * (linhas.length - 1));
    const fs = Math.min((caixa.w / maiorW) * 100, (caixa.h / altTotal100) * 100);
    const capa = (capaAlt * fs) / 100;
    const altBloco = capa * (linhas.length + vao * (linhas.length - 1));
    const topo = caixa.y + (caixa.h - altBloco) / 2;

    // máscara: letra numa tela de 1x, usada para plantar os fios
    const m = document.createElement("canvas");
    m.width = Math.ceil(W);
    m.height = Math.ceil(H);
    const mc = m.getContext("2d", { willReadFrequently: true })!;
    mc.font = `${fs}px ${FONTE_PALAVRA}`;
    mc.textBaseline = "alphabetic";
    let esq = Infinity;
    let dir = 0;
    const desenhar = (c: CanvasRenderingContext2D) => {
      linhas.forEach((l, i) => {
        const lm = c.measureText(l);
        const lw = lm.actualBoundingBoxLeft + lm.actualBoundingBoxRight;
        const x = caixa.x + (caixa.w - lw) / 2 + lm.actualBoundingBoxLeft;
        const y = topo + capa + i * capa * (1 + vao);
        c.fillText(l, x, y);
        esq = Math.min(esq, x - lm.actualBoundingBoxLeft);
        dir = Math.max(dir, x + lm.actualBoundingBoxRight);
      });
    };
    mc.fillStyle = "#000";
    desenhar(mc);
    this.bbox = { x: esq, y: topo, w: dir - esq, h: altBloco };

    // letra limpa e letra escura (o fundo por baixo dos fios)
    const lc = this.limpa.getContext("2d")!;
    lc.setTransform(dpr, 0, 0, dpr, 0, 0);
    lc.font = mc.font;
    lc.fillStyle = this.op.corLetra;
    desenhar(lc);
    this.pintarBaseEscura();

    // planta os fios numa grade com folga, em grupos de cor (um traço por cor é bem mais rápido)
    const dados = mc.getImageData(0, 0, m.width, m.height).data;
    let area = 0;
    for (let i = 3; i < dados.length; i += 4 * 3) if (dados[i] > 128) area += 3;
    const passo = Math.max(2.1, Math.sqrt(area / this.op.maxFios));
    const grupos: number[][] = FIOS.map(() => []);
    const compMin = capa * 0.07;
    const compMax = capa * 0.17;
    for (let y = 0; y < m.height; y += passo) {
      for (let x = 0; x < m.width; x += passo) {
        const jx = x + rnd(-passo, passo) * 0.5;
        const jy = y + rnd(-passo, passo) * 0.5;
        const ix = Math.round(jx);
        const iy = Math.round(jy);
        if (ix < 0 || iy < 0 || ix >= m.width || iy >= m.height) continue;
        if (dados[(iy * m.width + ix) * 4 + 3] < 128) continue;
        const r = Math.random();
        const cor = r < 0.42 ? 0 : r < 0.74 ? 1 : r < 0.93 ? 2 : 3;
        grupos[cor].push(jx, jy);
      }
    }
    const total = grupos.reduce((s, g) => s + g.length / 2, 0);
    this.n = total;
    this.sx = new Float32Array(total);
    this.sy = new Float32Array(total);
    this.cx = new Float32Array(total);
    this.cy = new Float32Array(total);
    this.ex = new Float32Array(total);
    this.ey = new Float32Array(total);
    this.atraso = new Float32Array(total);
    this.vivo = new Uint8Array(total).fill(1);
    this.vivos = total;
    this.inicioCor = [];
    let k = 0;
    grupos.forEach((g) => {
      this.inicioCor.push(k);
      for (let i = 0; i < g.length; i += 2) {
        const x = g[i];
        const y = g[i + 1];
        // os fios caem para baixo, penteados por um campo suave, com redemoinhos
        const ang = Math.PI / 2 + 0.6 * Math.sin(x * 0.013 + y * 0.008) + 0.25 * Math.sin(y * 0.031 + x * 0.004) + rnd(-0.22, 0.22);
        const comp = rnd(compMin, compMax);
        const curva = rnd(-0.28, 0.28) * comp;
        const dx = Math.cos(ang);
        const dy = Math.sin(ang);
        this.sx[k] = x;
        this.sy[k] = y;
        this.ex[k] = dx * comp;
        this.ey[k] = dy * comp;
        this.cx[k] = dx * comp * 0.5 - dy * curva;
        this.cy[k] = dy * comp * 0.5 + dx * curva;
        this.atraso[k] = Math.random() * 0.45;
        k++;
      }
    });
    this.inicioCor.push(k);
    this.espessura = clamp(capa / 170, 0.9, 1.7);

    // faixas da máquina
    const faixas = linhas.length * this.op.faixasPorLinha;
    this.alturaFaixa = altBloco / faixas;
    const margem = this.alturaFaixa * 0.4;
    this.rota = [];
    for (let i = 0; i < faixas; i++) {
      const y = topo + this.alturaFaixa * (i + 0.5);
      const a = esq - margem;
      const b = dir + margem;
      if (i % 2 === 0) this.rota.push({ x: a, y }, { x: b, y });
      else this.rota.push({ x: b, y }, { x: a, y });
    }
    this.velocidade = Math.max(this.bbox.w / 0.72, 500);
  }

  private pintarBaseEscura() {
    const b = this.base.getContext("2d")!;
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.clearRect(0, 0, this.base.width, this.base.height);
    b.drawImage(this.limpa, 0, 0);
    b.globalCompositeOperation = "source-in";
    b.fillStyle = FIOS[0];
    b.fillRect(0, 0, this.base.width, this.base.height);
    b.globalCompositeOperation = "source-over";
  }

  get alturaMaquina() {
    return this.alturaFaixa * 1.25;
  }

  /** Corta tudo o que está sob o pente da máquina, entre dois pontos. */
  private cortarEntre(x0: number, y0: number, x1: number, y1: number, dir: 1 | -1) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const passos = Math.max(1, Math.ceil(dist / (this.alturaFaixa * 0.35)));
    for (let p = 1; p <= passos; p++) {
      const t = p / passos;
      this.cortar(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, dir);
    }
  }

  private cortar(x: number, y: number, dir: 1 | -1) {
    const meia = this.alturaFaixa * 0.52;
    const fundo = this.alturaFaixa * 0.5;
    const xa = dir > 0 ? x - fundo : x;
    const xb = dir > 0 ? x : x + fundo;
    const ya = y - meia;
    const yb = y + meia;
    // revela a letra limpa
    const d = this.dpr;
    const b = this.base.getContext("2d")!;
    const sx = Math.max(0, xa * d);
    const sy = Math.max(0, ya * d);
    const sw = Math.max(1, (xb - xa) * d);
    const sh = Math.max(1, (yb - ya) * d);
    b.drawImage(this.limpa, sx, sy, sw, sh, sx, sy, sw, sh);
    // solta os fios
    const { sx: X, sy: Y } = this;
    for (let i = 0; i < this.n; i++) {
      if (!this.vivo[i]) continue;
      const fx = X[i];
      const fy = Y[i];
      if (fx < xa || fx > xb || fy < ya || fy > yb) continue;
      this.vivo[i] = 0;
      this.vivos--;
      if (Math.random() < 0.34) this.soltarFio(i, dir);
    }
  }

  private corDoFio(i: number) {
    for (let c = 0; c < FIOS.length; c++) if (i < this.inicioCor[c + 1]) return c;
    return 0;
  }

  private soltarFio(i: number, dir: number) {
    if (this.pAtivo >= this.maxP) return;
    const k = this.pAtivo++;
    this.px[k] = this.sx[i];
    this.py[k] = this.sy[i];
    this.pvx[k] = rnd(-30, 110) * dir;
    this.pvy[k] = rnd(-110, 30);
    this.pa[k] = Math.atan2(this.ey[i], this.ex[i]);
    this.pva[k] = rnd(-5, 5);
    this.pl[k] = Math.hypot(this.ex[i], this.ey[i]);
    this.pc[k] = this.corDoFio(i);
  }

  private pousar(k: number) {
    const { largura: W, altura: H } = this.op;
    const bin = clamp(Math.floor(this.px[k] / 4), 0, this.monteX.length - 1);
    const altura = this.monteX[bin];
    const y = H - 2 - altura * rnd(0.6, 1);
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
    if (altura < H * 0.075) {
      this.monteX[bin] += 0.9;
      if (bin > 0) this.monteX[bin - 1] += 0.45;
      if (bin < this.monteX.length - 1) this.monteX[bin + 1] += 0.45;
    }
    // troca com o último ativo
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

  private atualizar(dt: number, agora: number) {
    // crescimento
    if (this.crescendo) {
      this.crescendo.t += dt * 1000;
      const t = clamp(this.crescendo.t / this.crescendo.ms);
      this.crescimento = this.crescendo.de + (1 - this.crescendo.de) * t;
      if (t >= 1) {
        this.crescendo = null;
        this.monte.getContext("2d")!.clearRect(0, 0, this.monte.width, this.monte.height);
        this.monteX.fill(0);
      }
    }
    // máquina automática
    if (this.auto && agora - this.ultimoControle > 900) {
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
        // desce de uma faixa para a outra sem cortar (só corta na horizontal)
        if (Math.abs(dx) > Math.abs(dy)) this.cortarEntre(this.maq.x, this.maq.y, nx, ny, this.maq.dir);
        this.maq.x = nx;
        this.maq.y = ny;
        resta -= passo;
      }
      this.maq.visivel = true;
      if (this.iRota >= this.rota.length) {
        this.auto = false;
        this.limparResto();
        this.maq.visivel = false;
        const fim = this.aoTerminarAuto;
        this.aoTerminarAuto = null;
        fim?.();
      }
      this.avisarMaquina(true);
    } else if (this.maq.visivel && agora - this.ultimoControle > 700 && !this.auto) {
      this.maq.visivel = false;
      this.avisarMaquina(false);
    }
    // fios caindo
    const gravidade = 760;
    for (let k = this.pAtivo - 1; k >= 0; k--) {
      this.pvy[k] += gravidade * dt;
      this.pvy[k] = Math.min(this.pvy[k], 460);
      this.pvx[k] *= 0.985;
      this.px[k] += (this.pvx[k] + Math.sin(this.py[k] * 0.02 + k) * 28) * dt;
      this.py[k] += this.pvy[k] * dt;
      this.pa[k] += this.pva[k] * dt;
      const bin = clamp(Math.floor(this.px[k] / 4), 0, this.monteX.length - 1);
      if (this.py[k] >= this.op.altura - 2 - this.monteX[bin]) this.pousar(k);
    }
    if (!this.avisouCortado && this.vivos < this.n * 0.02) {
      this.avisouCortado = true;
      this.limparResto();
      this.op.onCortado?.();
    }
  }

  private limparResto() {
    if (!this.vivos) return;
    this.vivo.fill(0);
    this.vivos = 0;
    const b = this.base.getContext("2d")!;
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.drawImage(this.limpa, 0, 0);
  }

  private avisarMaquina(vibrar: boolean) {
    const j = vibrar ? 1.3 : 0;
    this.op.onMaquina?.({
      x: this.maq.x + rnd(-j, j),
      y: this.maq.y + rnd(-j, j),
      dir: this.maq.dir,
      visivel: this.maq.visivel,
      altura: this.alturaMaquina,
    });
  }

  desenhar() {
    const { ctx, dpr } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.crescendo) ctx.globalAlpha = 1 - this.crescimento;
    ctx.drawImage(this.monte, 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(this.base, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineWidth = this.espessura;
    const G = this.crescimento;
    if (this.vivos > 0 && G > 0.001) {
      for (let c = 0; c < FIOS.length; c++) {
        ctx.strokeStyle = FIOS[c];
        ctx.beginPath();
        for (let i = this.inicioCor[c]; i < this.inicioCor[c + 1]; i++) {
          if (!this.vivo[i]) continue;
          const g = G >= 1 ? 1 : clamp((G - this.atraso[i]) / (1 - this.atraso[i]));
          if (g <= 0) continue;
          const x = this.sx[i];
          const y = this.sy[i];
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(x + this.cx[i] * g, y + this.cy[i] * g, x + this.ex[i] * g, y + this.ey[i] * g);
        }
        ctx.stroke();
      }
    }
    // fios no ar
    for (let c = 0; c < FIOS.length; c++) {
      ctx.strokeStyle = FIOS[c];
      ctx.beginPath();
      for (let k = 0; k < this.pAtivo; k++) {
        if (this.pc[k] !== c) continue;
        const x = this.px[k];
        const y = this.py[k];
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(this.pa[k]) * this.pl[k], y + Math.sin(this.pa[k]) * this.pl[k]);
      }
      ctx.stroke();
    }
  }

  private laco = (agora: number) => {
    if (!this.rodando) return;
    const dt = Math.min(0.05, (agora - this.ultimo) / 1000 || 0.016);
    this.ultimo = agora;
    this.atualizar(dt, agora);
    this.desenhar();
    if (this.auto || this.pAtivo > 0 || this.crescendo || this.maq.visivel) {
      this.raf = requestAnimationFrame(this.laco);
    } else {
      this.rodando = false;
    }
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

  /** A máquina passa sozinha, faixa por faixa. */
  passarMaquina(aoTerminar?: () => void) {
    this.aoTerminarAuto = aoTerminar ?? null;
    this.iRota = 1;
    this.maq.x = this.rota[0].x;
    this.maq.y = this.rota[0].y;
    this.maq.dir = this.rota[1].x > this.rota[0].x ? 1 : -1;
    this.maq.visivel = true;
    this.auto = true;
    this.ultimoControle = 0;
    this.ligar();
  }

  /** O visitante segura a máquina. */
  controlar(x: number, y: number) {
    const agora = performance.now();
    if (!this.maq.visivel) { this.maq.x = x; this.maq.y = y; }
    const dx = x - this.maq.x;
    if (Math.abs(dx) > 1) this.maq.dir = dx > 0 ? 1 : -1;
    this.cortarEntre(this.maq.x, this.maq.y, x, y, this.maq.dir);
    this.maq.x = x;
    this.maq.y = y;
    this.maq.visivel = true;
    this.ultimoControle = agora;
    this.auto = false;
    this.aoTerminarAuto = null;
    this.avisarMaquina(true);
    this.ligar();
  }

  /** O cabelo cresce de novo, em lapso de tempo. */
  crescer(ms = 1100) {
    this.pintarBaseEscura();
    this.vivo.fill(1);
    this.vivos = this.n;
    this.avisouCortado = false;
    this.crescimento = 0;
    this.crescendo = { de: 0, ms, t: 0 };
    this.ligar();
  }

  /** Comprimento dos fios ligado à rolagem (rodapé). */
  definirCrescimento(g: number) {
    this.crescimento = clamp(g);
    this.desenhar();
  }

  /** Versão parada, para quem pediu menos movimento: letra limpa e um pouco de cabelo no chão. */
  estadoFinal() {
    this.limparResto();
    for (let i = 0; i < 700; i++) {
      this.px[0] = rnd(0, this.op.largura);
      this.pl[0] = this.alturaFaixa * rnd(0.12, 0.3);
      this.pc[0] = Math.floor(rnd(0, FIOS.length));
      this.pAtivo = 1;
      this.pousar(0);
    }
    this.avisouCortado = true;
    this.desenhar();
  }

  destruir() {
    this.rodando = false;
    cancelAnimationFrame(this.raf);
  }
}

/* ------------------------------------------------------------------ */

export const PENTES = [
  { nome: "Pente 3", medida: "9 mm", fim: 1 },
  { nome: "Pente 2", medida: "6 mm", fim: 0.66 },
  { nome: "Pente 1", medida: "3 mm", fim: 0.34 },
  { nome: "Pente 0", medida: "0,5 mm", fim: 0.1 },
  { nome: "Navalha", medida: "na pele", fim: 0 },
];

/**
 * Campo de fios em toda a tela. Conforme p vai de 0 a 1, a máquina sobe da nuca para o alto da cabeça,
 * uma faixa de cada vez, e cada faixa fica com o comprimento do seu pente. O degradê sai dos próprios fios
 * ficando curtos até aparecer a pele; nada é pintado.
 */
export class CampoDegrade {
  private ctx: CanvasRenderingContext2D;
  private dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  private inicioCor: number[] = [];
  private sx = new Float32Array(0);
  private sy = new Float32Array(0);
  private ex = new Float32Array(0);
  private ey = new Float32Array(0);
  private tCorte = new Float32Array(0);
  private alvo = new Float32Array(0);
  private espessura = 1.5;
  private readonly faixas = PENTES.length;
  private readonly inicioFade = 0.46;

  constructor(private canvas: HTMLCanvasElement, private W: number, private H: number, maxFios: number) {
    this.ctx = canvas.getContext("2d")!;
    canvas.width = Math.round(W * this.dpr);
    canvas.height = Math.round(H * this.dpr);
    const passo = Math.sqrt((W * H) / maxFios);
    const grupos: number[][] = FIOS.map(() => []);
    for (let y = -passo * 4; y < H; y += passo) {
      for (let x = 0; x < W; x += passo) {
        const r = Math.random();
        const c = r < 0.45 ? 0 : r < 0.76 ? 1 : r < 0.94 ? 2 : 3;
        grupos[c].push(x + rnd(-passo, passo) * 0.5, y + rnd(-passo, passo) * 0.5);
      }
    }
    const total = grupos.reduce((s, g) => s + g.length / 2, 0);
    this.sx = new Float32Array(total);
    this.sy = new Float32Array(total);
    this.ex = new Float32Array(total);
    this.ey = new Float32Array(total);
    this.tCorte = new Float32Array(total);
    this.alvo = new Float32Array(total);
    const comp = Math.max(46, Math.min(W, H) * 0.075);
    this.espessura = W < 700 ? 1.3 : 1.7;
    let k = 0;
    grupos.forEach((g) => {
      this.inicioCor.push(k);
      for (let i = 0; i < g.length; i += 2) {
        const x = g[i];
        const y = g[i + 1];
        const ang = Math.PI / 2 + 0.34 * Math.sin(x * 0.009 + y * 0.004) + rnd(-0.14, 0.14);
        const l = comp * rnd(0.8, 1.2);
        this.sx[k] = x;
        this.sy[k] = y;
        this.ex[k] = Math.cos(ang) * l;
        this.ey[k] = Math.sin(ang) * l;
        // a borda de cada faixa tem folga, para o degradê não sair em degraus
        const alt = clamp((y + rnd(-1, 1) * H * 0.05) / H);
        const u = clamp((alt - this.inicioFade) / (1 - this.inicioFade)); // 0 no topo do degradê, 1 na nuca
        const fx = u * (this.faixas - 1);
        const a = Math.floor(fx);
        const b = Math.min(a + 1, this.faixas - 1);
        this.alvo[k] = PENTES[a].fim + (PENTES[b].fim - PENTES[a].fim) * (fx - a);
        // a máquina passa da nuca para cima, da esquerda para a direita
        const ordem = (this.faixas - 1 - Math.round(fx)) / this.faixas;
        this.tCorte[k] = ordem + x / W / this.faixas;
        k++;
      }
    });
    this.inicioCor.push(k);
  }

  /** Onde está a máquina no progresso p (a peça é desenhada por fora, em HTML). */
  posicaoMaquina(p: number) {
    const f = clamp(p) * this.faixas;
    const i = Math.min(Math.floor(f), this.faixas - 1);
    const u = (this.faixas - 1 - i) / (this.faixas - 1);
    const y = (this.inicioFade + u * (1 - this.inicioFade)) * this.H;
    return { x: (f - i) * this.W, y, faixa: i, pente: this.faixas - 1 - i };
  }

  desenhar(p: number) {
    const { ctx, dpr } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    // primeira passada: os fios compridos, grossos e escuros, fecham o couro; é ela que escurece o alto da cabeça
    ctx.lineWidth = this.espessura * 2.9;
    ctx.strokeStyle = FIOS[1];
    ctx.beginPath();
    for (let i = 0; i < this.sx.length; i++) {
      const g = p > this.tCorte[i] ? this.alvo[i] : 1;
      if (g < 0.4) continue;
      const x = this.sx[i];
      const y = this.sy[i];
      ctx.moveTo(x, y);
      ctx.lineTo(x + this.ex[i] * g, y + this.ey[i] * g);
    }
    ctx.stroke();
    ctx.lineWidth = this.espessura;
    for (let c = 0; c < FIOS.length; c++) {
      ctx.strokeStyle = c === 0 ? FIOS[0] : FIOS[c];
      ctx.beginPath();
      for (let i = this.inicioCor[c]; i < this.inicioCor[c + 1]; i++) {
        const g = p > this.tCorte[i] ? this.alvo[i] : 1;
        if (g < 0.03) continue;
        const x = this.sx[i];
        const y = this.sy[i];
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.ex[i] * g, y + this.ey[i] * g);
      }
      ctx.stroke();
    }
  }
}
