import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { iniciarRede } from "./rede.js";
import { inject as medirVisitas } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

// estatísticas de visita e de velocidade da Vercel (sem cookie)
medirVisitas();
injectSpeedInsights();
import { rodarIntro as introEstilhaco } from "./intro-estilhaco.js";
import { rodarIntro as introMergulho } from "./intro-mergulho.js";
// qual intro roda: "mergulho" (nova) ou "estilhaco" (a anterior). Para comparar: ?intro=quebra ou ?intro=mergulho
const INTRO_PADRAO = "mergulho";
const pedida = new URLSearchParams(location.search).get("intro");
const rodarIntro = (pedida === "quebra" ? "estilhaco" : pedida === "mergulho" ? "mergulho" : INTRO_PADRAO) === "estilhaco" ? introEstilhaco : introMergulho;

gsap.registerPlugin(ScrollTrigger);
const raiz = document.documentElement;
const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fino = matchMedia("(pointer: fine)").matches;
const comIntro = raiz.classList.contains("com-intro");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- rolagem suave ---------- */
let lenis = null;
if (!reduzido) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  if (comIntro) lenis.stop();
}
const velocidade = () => (lenis ? lenis.velocity : 0);
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const alvo = $(a.getAttribute("href"));
    if (!alvo) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(alvo, { offset: -10, duration: 1.6 }) : alvo.scrollIntoView();
  })
);

/* ---------- atmosferas: a cor do fundo muda com a rolagem ---------- */
const escuro = { "--fg": "#f4f1ec", "--muted": "rgba(244,241,236,0.72)", "--dim": "rgba(244,241,236,0.46)", "--line": "rgba(244,241,236,0.14)" };
const PAL = {
  noite: { tema: "escuro", v: { ...escuro, "--bg": "#0a0710", "--surface": "rgba(255,255,255,0.045)", "--acento": "#b58cf0", "--trilha": "#00c3d0", "--glow": "rgba(91,31,142,0.32)" } },
  roxo: { tema: "escuro", v: { ...escuro, "--bg": "#2a0b47", "--surface": "rgba(255,255,255,0.06)", "--acento": "#d4b6ff", "--trilha": "#00c3d0", "--glow": "rgba(0,195,208,0.16)" } },
  azul: { tema: "escuro", v: { ...escuro, "--bg": "#0c2a5e", "--surface": "rgba(255,255,255,0.06)", "--acento": "#7fe9f0", "--trilha": "#00c3d0", "--glow": "rgba(164,92,255,0.24)" } },
  papel: { tema: "claro", v: { "--fg": "#140f1c", "--muted": "rgba(20,15,28,0.68)", "--dim": "rgba(20,15,28,0.45)", "--line": "rgba(20,15,28,0.13)", "--bg": "#f2efe9", "--surface": "#fbfaf7", "--acento": "#5b1f8e", "--trilha": "#5b1f8e", "--glow": "rgba(0,195,208,0.10)" } },
};
const paraNum = (c) => (c.startsWith("#") ? [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1] : c.match(/[\d.]+/g).map(Number));
Object.entries(PAL).forEach(([nome, p]) => ((p.nome = nome), (p.n = Object.fromEntries(Object.entries(p.v).map(([k, c]) => [k, paraNum(c)])))));
const atmos = (() => {
  const secoes = $$("[data-atmos]");
  let viradas = [], ultimo = "";
  function medir() {
    viradas = [];
    secoes.forEach((sec, i) => {
      if (!i || sec.dataset.atmos === secoes[i - 1].dataset.atmos) return;
      const topo = sec.getBoundingClientRect().top + scrollY;
      viradas.push({ de: PAL[secoes[i - 1].dataset.atmos], para: PAL[sec.dataset.atmos], ini: topo - innerHeight * 0.8, fim: topo - innerHeight * 0.25 });
    });
    ultimo = "";
  }
  function aplicar() {
    const y = scrollY;
    let de = PAL[secoes[0].dataset.atmos], para = de, t = 0;
    for (const v of viradas) {
      if (y >= v.fim) { de = para = v.para; continue; }
      if (y > v.ini) { de = v.de; para = v.para; t = (y - v.ini) / (v.fim - v.ini); }
      break;
    }
    const e = t * t * (3 - 2 * t);
    const chave = de === para ? para.nome : `${de.nome}>${para.nome}:${e.toFixed(3)}`;
    if (chave === ultimo) return;
    ultimo = chave;
    for (const k in de.n) {
      const a = de.n[k], b = para.n[k];
      const m = a.map((x, i) => x + (b[i] - x) * e);
      raiz.style.setProperty(k, `rgba(${m[0] | 0},${m[1] | 0},${m[2] | 0},${m[3].toFixed(3)})`);
    }
    raiz.dataset.tema = e < 0.5 ? de.tema : para.tema;
  }
  return { medir, aplicar };
})();
atmos.medir(); atmos.aplicar();
gsap.ticker.add(atmos.aplicar);
ScrollTrigger.addEventListener("refresh", atmos.medir);

/* ---------- fonte larga: cada letra vira um span com largura e peso próprios ---------- */
const BASE = { "ht-1": [62, 820], "ht-2": [100, 540], "ht-3": [150, 900], "fr-1": [72, 820], "fr-2": [96, 560], "fr-3": [125, 900] };
$$(".ht").forEach((linha) => {
  const [w, g] = BASE[[...linha.classList].find((c) => BASE[c])];
  [...linha.childNodes].forEach((n) => {
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    [...n.textContent].forEach((c) => {
      const s = document.createElement("span");
      s.className = c === " " ? "ch esp" : "ch"; s.textContent = c === " " ? " " : c;
      s.style.setProperty("--w", w); s.style.setProperty("--g", g);
      s._w = w; s._g = g; s._bw = w; s._bg = g;
      frag.append(s);
    });
    n.replaceWith(frag);
  });
});
const letrasHero = $$(".hero-titulo .ch");
const pinta = (s) => { s.style.setProperty("--w", s._w.toFixed(1)); s.style.setProperty("--g", s._g.toFixed(0)); };

/* ---------- abertura ---------- */
let redeLigada = false;
const evitarNaRede = () => {
  const c = $(".rede").getBoundingClientRect();
  return $$(".hero-titulo, .hero-sub, .hero-acoes, .topo-barra").map((el) => { const r = el.getBoundingClientRect(); return [r.left - c.left, r.top - c.top, r.right - c.left, r.bottom - c.top]; });
};
const ligarRede = () => { if (redeLigada) return; redeLigada = true; iniciarRede($(".rede"), velocidade, { reduzido, evitar: evitarNaRede }); };

function esconderTitulo() {
  letrasHero.forEach((s) => { s._w = 36; s._g = 300; pinta(s); });
  gsap.set(".hero-titulo .ch, .hero-titulo .ponto-final", { yPercent: 115 });
  $(".hero-titulo").style.opacity = 1;
}
let proximidadeLigada = false;
function entradaHero() {
  if (raiz.classList.contains("sem-intro")) { esconderTitulo(); gsap.set(".hero .h-anima", { opacity: 0 }); }
  raiz.classList.remove("sem-intro");
  ligarRede();
  if (reduzido) { letrasHero.forEach((s) => { s._w = s._bw; s._g = s._bg; pinta(s); }); gsap.set(".hero-titulo .ch, .hero-titulo .ponto-final, .hero .h-anima", { clearProps: "all" }); trilha.ligar(); return; }
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.to(".hero-titulo .ch, .hero-titulo .ponto-final", { yPercent: 0, duration: 1.1, stagger: 0.035 }, 0)
    .to(letrasHero, { _w: (i, s) => s._bw, _g: (i, s) => s._bg, duration: 1.6, stagger: 0.04, ease: "expo.inOut", onUpdate() { this.targets().forEach(pinta); } }, 0.1)
    .fromTo(".hero-sub", { y: 24 }, { y: 0, duration: 1.1 }, 0.3)
    .fromTo(".hero .h-anima", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.6)
    .add(() => lenis?.start(), 0.5)
    .add(() => { trilha.ligar(); proximidadeLigada = true; medirLetras(); if (!fino) ondaToque(); }, 1.5)
    .add(() => ScrollTrigger.refresh(), 1.75);
}

// as letras do título reagem ao mouse: as largas se encolhem, as estreitas se abrem
let centros = [], mouse = null;
function medirLetras() { centros = letrasHero.map((s) => { const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2 + scrollY]; }); }
addEventListener("resize", () => proximidadeLigada && medirLetras(), { passive: true });
if (fino && !reduzido) {
  addEventListener("pointermove", (e) => { mouse = [e.clientX, e.clientY + scrollY]; }, { passive: true });
  document.addEventListener("pointerleave", () => (mouse = null));
  gsap.ticker.add(() => {
    if (!proximidadeLigada || scrollY > innerHeight) return;
    letrasHero.forEach((s, i) => {
      let k = 0;
      if (mouse && centros[i] && scrollY < 8) { const d = Math.hypot(mouse[0] - centros[i][0], mouse[1] - centros[i][1]); k = Math.exp(-((d / 190) ** 2)); }
      const larga = s._bw > 120;
      const tw = larga ? s._bw - 78 * k : s._bw + 64 * k, tg = s._bg - 380 * k;
      const nw = s._w + (tw - s._w) * 0.14, ng = s._g + (tg - s._g) * 0.14;
      if (Math.abs(nw - s._w) > 0.05 || Math.abs(ng - s._g) > 0.5) { s._w = nw; s._g = ng; pinta(s); }
    });
  });
}
// no toque, uma onda passa pelas letras uma vez
function ondaToque() {
  gsap.to(letrasHero, { keyframes: [{ _w: (i, s) => (s._bw > 100 ? 80 : 110), _g: 500, duration: 0.45 }, { _w: (i, s) => s._bw, _g: (i, s) => s._bg, duration: 0.7 }], stagger: 0.06, ease: "sine.inOut", onUpdate() { this.targets().forEach(pinta); } });
}

/* ---------- o problema: a pesquisa roda sozinha, sem prender a rolagem ---------- */
// empresas, notas e números fictícios (a tela avisa isso)
const SEGMENTOS = [
  { q: "dentista perto de mim", cat: "Dentista", emp: [
    ["Odonto Prisma", "4,9", 312, "Centro", "Fecha às 20h", "#5b1f8e"], ["Clínica Lumiar", "4,8", 205, "Vila Augusta", "Fecha às 19h", "#225c9e"],
    ["Instituto Arco Odontologia", "4,8", 167, "Macedo", "Fecha às 18h", "#0a7d86"], ["Sorrisa Clínica Dental", "4,7", 140, "Gopoúva", "Fecha às 19h", "#7b3fbf"],
    ["Dentalis Vila Rio", "4,7", 98, "Vila Rio", "Fecha às 18h", "#2f6fd0"], ["OdontoNorte 24h", "4,6", 233, "Bonsucesso", "Aberto 24 horas", "#3a0a5d"],
    ["Clínica Bem Dental", "4,6", 76, "Maia", "Fecha às 17h", "#1e6f9e"], ["Ortho Picanço", "4,5", 54, "Picanço", "Fecha às 18h", "#6a2fa0"] ] },
  { q: "cabeleireiro aberto agora", cat: "Cabeleireiro", emp: [
    ["Studio Lume Cabelos", "4,9", 268, "Centro", "Fecha às 21h", "#7b3fbf"], ["Atelier Fio de Ouro", "4,8", 190, "Vila Augusta", "Fecha às 20h", "#225c9e"],
    ["Espaço Trama Hair", "4,8", 143, "Macedo", "Fecha às 19h", "#0a7d86"], ["Salão Nuance", "4,7", 121, "Maia", "Fecha às 20h", "#5b1f8e"],
    ["Corte Fino Studio", "4,7", 88, "Gopoúva", "Fecha às 19h", "#2f6fd0"], ["Casa Mecha", "4,6", 65, "Vila Rio", "Fecha às 18h", "#3a0a5d"],
    ["Studio Vértice", "4,6", 47, "Picanço", "Fecha às 20h", "#1e6f9e"] ] },
  { q: "doceria para encomenda", cat: "Doceria", emp: [
    ["Doce Alecrim", "4,9", 402, "Centro", "Fecha às 19h", "#a14a8a"], ["Ateliê Açúcar Mascavo", "4,9", 251, "Vila Augusta", "Fecha às 18h", "#5b1f8e"],
    ["Confeitaria Três Camadas", "4,8", 188, "Maia", "Fecha às 20h", "#225c9e"], ["Fornada Doce", "4,8", 132, "Macedo", "Fecha às 19h", "#7b3fbf"],
    ["Mel e Cacau", "4,7", 97, "Gopoúva", "Fecha às 18h", "#0a7d86"], ["Casa do Bolo Alto", "4,7", 81, "Bonsucesso", "Fecha às 17h", "#3a0a5d"],
    ["Doçaria Ponto Firme", "4,6", 59, "Vila Rio", "Fecha às 18h", "#2f6fd0"], ["Brigadeiro Lunar", "4,6", 44, "Picanço", "Fecha às 19h", "#6a2fa0"],
    ["Confeitaria Vila Doce", "4,5", 38, "Maia", "Fecha às 18h", "#1e6f9e"] ] },
];
const estrelas = (n) => { const v = parseFloat(n.replace(",", ".")); const c = v >= 4.75 ? 5 : v >= 3.75 ? 4 : 3; return "★".repeat(c) + "☆".repeat(5 - c); };
const abaQ = $(".serp-aba-q"), urlQ = $(".serp-url-q");
const serp = $(".serp"), janela = $(".serp-janela"), listaEl = $(".serp-lista"), lista = $(".serp-res"), q = $(".serp-q"), posEl = $(".serp-pos");
let voceEl = null;
function montar(seg) {
  lista.textContent = "";
  seg.emp.forEach(([nome, nota, qt, bairro, hora, cor]) => {
    const li = document.createElement("li"); li.className = "res";
    li.innerHTML = `<div class="res-info"><b></b><small>${nota} <span class="nota">${estrelas(nota)}</span> (${qt}) · ${seg.cat}</small><small>${bairro} · Guarulhos</small><small><span class="aberto">Aberto</span> · ${hora}</small></div><span class="res-foto" style="background:linear-gradient(135deg,${cor},#2a1c3c)"></span><div class="res-acoes"><span>Site</span><span>Rotas</span></div>`;
    li.querySelector("b").textContent = nome;
    lista.append(li);
  });
  voceEl = document.createElement("li"); voceEl.className = "res voce";
  voceEl.innerHTML = `<div class="res-info"><b>Sua empresa</b><small>3,0 <span class="nota">${estrelas("3,0")}</span> (2) · ${seg.cat}</small><small>Guarulhos</small><small>Horário não informado</small></div><span class="res-foto"></span><div class="res-acoes"><span>Rotas</span></div>`;
  lista.append(voceEl);
  posEl.textContent = `${seg.emp.length + 1}º lugar. Quase ninguém rola até aqui.`;
}
const alvoY = () => -Math.max(0, voceEl.offsetTop - janela.clientHeight * 0.3);
let cicloBusca = null, segAtual = 0, buscaVisivel = false;
function rodarSegmento() {
  const seg = SEGMENTOS[segAtual++ % SEGMENTOS.length];
  const txt = { n: 0 };
  cicloBusca = gsap.timeline({ onComplete: rodarSegmento, paused: !buscaVisivel })
    .call(() => { listaEl.classList.add("saindo"); serp.classList.remove("foco"); })
    .to({}, { duration: 0.45 })
    .call(() => { montar(seg); gsap.set(listaEl, { y: 0 }); q.textContent = ""; abaQ.textContent = seg.q; urlQ.textContent = seg.q.replace(/ /g, "+"); })
    .to(txt, { n: seg.q.length, duration: seg.q.length * 0.045, ease: "none", onUpdate: () => (q.textContent = seg.q.slice(0, Math.round(txt.n))) })
    .call(() => listaEl.classList.remove("saindo"))
    .to(listaEl, { y: alvoY, duration: 3.4, ease: "power2.inOut" }, "+=0.6")
    .call(() => serp.classList.add("foco"))
    .to({}, { duration: 3 });
}
if (reduzido) {
  montar(SEGMENTOS[0]); q.textContent = SEGMENTOS[0].q; serp.classList.add("foco");
  requestAnimationFrame(() => gsap.set(listaEl, { y: alvoY() }));
} else {
  // só anima enquanto a janela da busca está na tela
  new IntersectionObserver(([e]) => {
    buscaVisivel = e.isIntersecting;
    if (!cicloBusca) { if (buscaVisivel) rodarSegmento(); return; }
    buscaVisivel ? cicloBusca.play() : cicloBusca.pause();
  }, { threshold: 0.25 }).observe(serp);
}

/* ---------- a linha: nasce do ponto ciano do "PARADO." e passeia pelo site ---------- */
const trilha = (() => {
  const wrap = $(".trilha"), svg = $("#trilha-svg");
  const path = $("#trilha-path"), fantasma = $("#trilha-fantasma"), cabeca = $(".trilha-cabeca");
  const ponto = $(".ht-3 .ponto-final");
  const ancoras = $$("[data-ancora]");
  const alvosEl = $$("[data-alvo]");
  let tabela = [], ymax = [], total = 0, atual = 0, ligada = reduzido, alvos = [], obst = [], partiu = false;

  // as entradas deixam o texto deslocado até aparecer; a linha mede o lugar final
  const desvio = (el) => { let s = 0; for (let e = el; e && e !== document.body; e = e.parentElement) if (e._gsap) s += +gsap.getProperty(e, "y") || 0; return s; };
  function lerObstaculos() {
    const sel = "h1,h2,h3,p,li,.btn,.link-seta,.serp,.flip,.estado,.hero-acoes,.faq-painel,.frase-texto > span";
    obst = $$(sel).filter((el) => !el.closest(".intro, .trilha, .rodape, .topo") && !el.matches(".frase-texto")).map((el) => {
      const r = el.getBoundingClientRect(), d = desvio(el);
      return [r.left - 18, r.right + 18, r.top + scrollY - d - 18, r.bottom + scrollY - d + 18, el];
    }).filter((o) => o[1] - o[0] > 4);
  }
  const bate = (pts) => pts.some(([x, y]) => obst.some((o) => x > o[0] && x < o[1] && y > o[2] && y < o[3]));
  const suave = (t) => t * t * (3 - 2 * t);

  // trecho vertical: ondula para dentro da página onde há espaço livre
  function vertical(a, b, W, reto) {
    const H = b.y - a.y;
    if (H <= 2 || reto) return [[b.x, b.y]];
    const dentro = a.x > W * 0.6 ? -1 : a.x < W * 0.4 ? 1 : 0;
    const n = Math.max(1, Math.round(H / rnd(220, 380)));
    const out = [];
    for (let k = 0; k < n; k++) {
      const y0 = a.y + (H * k) / n, y1 = a.y + (H * (k + 1)) / n;
      let amp = rnd(60, Math.min(W * 0.26, 320)) * (dentro || (k % 2 ? 1 : -1));
      const torce = rnd(-0.4, 0.4);
      let seg;
      for (let tent = 0; tent < 6; tent++) {
        seg = [];
        for (let y = y0 + 6; y <= y1; y += 6) {
          const t = (y - y0) / (y1 - y0);
          seg.push([a.x + amp * (Math.sin(Math.PI * t) + torce * Math.sin(2 * Math.PI * t)), y]);
        }
        if (!bate(seg)) break;
        amp *= tent === 4 ? 0 : 0.6;
      }
      out.push(...seg);
    }
    out.push([b.x, b.y]);
    return out;
  }
  // travessia: curva livre, com uma laçada quando o espaço deixa
  function cruzar(a, b, semLaco) {
    const gap = Math.max(40, b.y - a.y), dir = Math.sign(b.x - a.x) || 1;
    const amostra = (r) => {
      const pts = [];
      for (let i = 1; i <= 100; i++) {
        const t = i / 100, u = 1 - t, dy = gap * 0.5;
        let x = u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x;
        let y = u * u * u * a.y + 3 * u * u * t * (a.y + dy) + 3 * u * t * t * (b.y - dy) + t * t * t * b.y;
        if (r && t > 0.3 && t < 0.7) { const s = suave((t - 0.3) / 0.4); x += r * Math.sin(2 * Math.PI * s) * dir; y -= r * (1 - Math.cos(2 * Math.PI * s)) * 0.9; }
        pts.push([x, y]);
      }
      return pts;
    };
    const raios = semLaco ? [0] : [Math.min(90, gap * 0.28), Math.min(45, gap * 0.16), 0];
    for (const r of raios) { const p = amostra(r); if (!bate(p) || !r) return p; }
  }
  // a volta em torno de "PARADA", medida com as letras já esticadas
  function medirCirculo(linhaEl) {
    const chs = $$(".ch", linhaEl), esp = chs.findIndex((c) => c.classList.contains("esp"));
    const palavra = [...chs.slice(esp + 1), $(".ponto-final", linhaEl)].filter(Boolean);
    const guarda = palavra.map((c) => [c._w, c._g]);
    palavra.forEach((c) => { if (c._bw) { c._w = c._bw; c._g = c._bg; pinta(c); } });
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    palavra.forEach((c) => { const r = c.getBoundingClientRect(); x0 = Math.min(x0, r.left); x1 = Math.max(x1, r.right); y0 = Math.min(y0, r.top); y1 = Math.max(y1, r.bottom); });
    palavra.forEach((c, i) => { if (c._bw) { [c._w, c._g] = guarda[i]; pinta(c); } });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + scrollY;
    const N = 4.5, a = (x1 - x0) / 2, b = (y1 - y0) * 0.43, rx = a + Math.max(26, a * 0.08), ry = b / Math.pow(1 - Math.pow(a / rx, N), 1 / N) + 6;
    return { tipo: "circulo", cx, cy: cy + (y1 - y0) * 0.05, rx, ry };
  }
  function elipse(c) {
    const pts = [], voltas = 1.08, n = 180;
    for (let i = 0; i <= n; i++) {
      const th = -(i / n) * Math.PI * 2 * voltas, k = 1 + 0.025 * Math.sin(th * 3) + 0.035 * (i / n);
      const co = Math.cos(th), si = Math.sin(th), e = 2 / 4.5;
      pts.push([c.cx + Math.sign(co) * Math.pow(Math.abs(co), e) * c.rx * k, c.cy + Math.sign(si) * Math.pow(Math.abs(si), e) * c.ry * k]);
    }
    [c.fx, c.fy] = pts[pts.length - 1];
    return pts;
  }

  // onde o quadradinho do ponto final está pintado (o span é maior que o glifo)
  let tamanhoPonto = 12, inicioY = 0, fimScroll = 1e9;
  function medirPonto() {
    const guarda = letrasHero.map((c) => [c._w, c._g]);
    letrasHero.forEach((c) => { c._w = c._bw; c._g = c._bg; pinta(c); });
    const r = ponto.getBoundingClientRect(), cs = getComputedStyle(ponto.parentElement), fs = parseFloat(cs.fontSize);
    letrasHero.forEach((c, i) => { [c._w, c._g] = guarda[i]; pinta(c); });
    const c = document.createElement("canvas").getContext("2d");
    try { c.fontStretch = "extra-expanded"; } catch (e) {}
    c.font = `900 ${fs}px Anybody`;
    const m = c.measureText(".");
    if (!m.fontBoundingBoxAscent) return { x: r.left + r.width / 2, y: r.top + r.height * 0.72, lado: fs * 0.16 };
    const base = r.top + (r.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    const gw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    return { x: r.left + (r.width - m.width) / 2 + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2 + m.width / 2 - m.width / 2, y: base - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2, lado: Math.max(gw, gh) };
  }
  function construir() {
    wrap.style.height = "0px";
    const H = document.documentElement.scrollHeight, W = document.documentElement.clientWidth;
    wrap.style.height = H + "px";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    lerObstaculos();
    const estreito = W < 900, margem = estreito ? 10 : 26;
    const gp = medirPonto();
    tamanhoPonto = gp.lado; inicioY = gp.y + scrollY;
    const pts = [{ x: gp.x, y: gp.y + scrollY }];
    ancoras.forEach((el) => {
      const r = el.getBoundingClientRect();
      const y = (el.dataset.y === "base" ? r.bottom + scrollY + 30 : r.top + scrollY - 10) + (+el.dataset.off || 0) - desvio(el);
      let lado = el.dataset.ancora;
      if (estreito && lado === "centro" && !el.matches(".analise")) lado = "esq";
      if (estreito && el.matches(".paradas")) { pts.push({ x: 30, y, reto: true }); return; }
      const x = lado === "esq" ? margem : lado === "dir" ? W - margem : W / 2;
      pts.push({ x, y, reto: el.matches(".paradas, .analise") });
      if (el.dataset.circula) { const c = medirCirculo($(el.dataset.circula, el)); pts.push(c, { x, y: c.cy + c.ry + 60 }); }
    });
    let chegada = [];
    const btn = $(".analise .btn");
    if (btn) {
      const br = btn.getBoundingClientRect(), dv = desvio(btn), bb = br.bottom + scrollY - dv, cy = (br.top + br.bottom) / 2 + scrollY - dv, cx = (br.left + br.right) / 2;
      const xd = W - margem, acoes = btn.parentElement;
      const fora = obst.filter((o) => o[4] !== btn && o[4] !== acoes);
      const livre = (p) => !p.some(([px, py]) => fora.some((o) => px > o[0] && px < o[1] && py > o[2] && py < o[3]));
      const curva = (a, c1, c2, e) => Array.from({ length: 80 }, (_, i) => {
        const t = (i + 1) / 80, u = 1 - t;
        return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * e[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * e[1]];
      });
      // por baixo: desce pela direita, faz a curva sob os botões e sobe até o centro do botão
      const yA = bb + 64, porBaixo = curva([xd, yA], [xd, yA + 70], [cx, bb + 118], [cx, bb + 16]);
      // pelo lado (quando o link de e-mail fica embaixo do botão, no celular)
      const yB = cy + 36, peloLado = curva([xd, yB], [xd, yB + 46], [br.right + 64, cy], [br.right + 16, cy]);
      const lado = !livre(porBaixo) && livre(peloLado);
      pts.push({ x: xd, y: lado ? yB : yA });
      chegada = lado ? peloLado : porBaixo;
    }
    const amostras = [[pts[0].x, pts[0].y]];
    for (let i = 1; i < pts.length; i++) {
      const b = pts[i];
      let a = pts[i - 1];
      if (a.tipo === "circulo") a = { x: a.fx, y: a.fy };
      if (b.tipo === "circulo") { amostras.push(...cruzar(a, { x: b.cx + b.rx, y: b.cy }, true), ...elipse(b)); continue; }
      amostras.push(...(i === 1 || Math.abs(a.x - b.x) >= 2 ? cruzar(a, b) : vertical(a, b, W, a.reto)));
    }
    amostras.push(...chegada);
    fimScroll = H - innerHeight - 4;
    pontosTxt = amostras.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
    fantasma.setAttribute("d", "M" + pontosTxt.join("L"));
    tabela = []; ymax = []; total = 0;
    amostras.forEach(([x, y], i) => {
      if (i) total += Math.hypot(x - amostras[i - 1][0], y - amostras[i - 1][1]);
      tabela.push([total, x, y]);
      ymax.push(Math.max(y, i ? ymax[i - 1] : y));
    });
    alvos = alvosEl.map((el) => ({ el, y: el.getBoundingClientRect().top + scrollY - desvio(el) + 30 }));
  }

  function noComprimento(L) {
    let lo = 0, hi = tabela.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; tabela[m][0] < L ? (lo = m + 1) : (hi = m); }
    const b = tabela[lo], a = tabela[Math.max(0, lo - 1)], f = b[0] - a[0] ? (L - a[0]) / (b[0] - a[0]) : 0;
    return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, lo];
  }
  function comprimentoNoY(y) {
    let lo = 0, hi = ymax.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; ymax[m] < y ? (lo = m + 1) : (hi = m); }
    return tabela[lo][0];
  }
  let ultimoOffset = -1, pontosTxt = [];
  function quadro() {
    if (!tabela.length) return;
    const f = Math.max(0, 1 - scrollY / (innerHeight * 0.6)), celular = innerWidth < 900;
    let yAlvo = scrollY + innerHeight * 0.62 + (inicioY - innerHeight * 0.62) * f;
    // no celular a linha corre reta pela borda; se acompanhasse a rolagem ponto a ponto, pareceria parada.
    // Ela avança em trechos de meia tela e se desenha com animação a cada trecho.
    if (celular) { const passo = innerHeight * 0.45; yAlvo = Math.max(inicioY, Math.floor((yAlvo + innerHeight * 0.2 * (1 - f)) / passo) * passo); }
    const alvo = ligada ? (scrollY >= fimScroll ? total : comprimentoNoY(yAlvo)) : 0;
    const novo = atual + (alvo - atual) * (reduzido ? 1 : celular ? 0.06 : 0.12);
    if (Math.abs(novo - atual) < 0.05 && ultimoOffset >= 0) return; // parado: não mexe no DOM
    atual = novo;
    ultimoOffset = atual;
    const [x, y, i] = noComprimento(atual);
    // desenha só o trecho já percorrido; o tracejado do SVG (stroke-dasharray) falha
    // em alguns celulares numa linha tão longa e mostrava o caminho inteiro
    path.setAttribute("d", i > 0 && atual > 0.5 ? "M" + pontosTxt.slice(0, i).join("L") + `L${x.toFixed(1)},${y.toFixed(1)}` : "");
    cabeca.style.transform = `translate(${x}px, ${y}px)`;
    // o ponto sai do lugar e vira a cabeça da linha: começa quadrado, do tamanho do ponto, e vai virando bolinha
    const andando = ligada && atual > 1.5;
    if (andando !== partiu) { partiu = andando; ponto.classList.toggle("partiu", andando); cabeca.classList.toggle("on", andando); }
    const k = Math.min(1, atual / 90), lado = tamanhoPonto + (12 - tamanhoPonto) * k;
    cabeca.style.width = cabeca.style.height = lado + "px";
    cabeca.style.margin = `${-lado / 2}px 0 0 ${-lado / 2}px`;
    cabeca.style.borderRadius = k * 50 + "%";
    cabeca.style.setProperty("--brilho", k);
    alvos.forEach(({ el, y: ya }) => {
      const passou = y >= ya;
      el.classList.toggle("tocado", passou);
      if (el.classList.contains("parada")) el.classList.toggle("movida", passou);
    });
  }

  ScrollTrigger.addEventListener("refresh", () => { construir(); ultimoOffset = -1; lenis?.resize(); });
  addEventListener("load", () => ScrollTrigger.refresh());
  gsap.ticker.add(quadro);
  construir();
  return { ligar: () => (ligada = true) };
})();

/* ---------- intro ou entrada direta ---------- */
function semIntro() { $("#intro")?.remove(); raiz.classList.remove("com-intro"); lenis?.start(); entradaHero(); }
if (comIntro && !reduzido) {
  esconderTitulo();
  gsap.set(".hero .h-anima", { opacity: 0 });
  const sala = $(".intro-sala");
  const espera = new Promise((ok, falha) => { setTimeout(() => falha(new Error("demorou")), 2500); (sala.complete && sala.naturalWidth ? Promise.resolve() : new Promise((r, f) => { sala.onload = r; sala.onerror = f; })).then(() => sala.decode()).then(ok, falha); });
  espera.then(() => rodarIntro({ aoRevelar: entradaHero, aoFim: () => { lenis?.start(); ScrollTrigger.refresh(); } }))
    .catch(() => { gsap.set(".hero .h-anima", { opacity: 1 }); semIntro(); });
} else {
  semIntro();
}

/* ---------- entradas ---------- */
if (!reduzido) {
  $$(".sec-cabeca, .busca-texto, .faq-cabeca, .analise-texto, .analise-lado").forEach((c) => {
    gsap.from(c.children, { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: c, start: "top 82%" } });
  });
  ScrollTrigger.batch(".sol, .flip, .faq-item", { start: "top 90%", onEnter: (els) => gsap.from(els, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }) });
  // frase: as letras se esticam com a rolagem, como quem sai do lugar
  [".fr-1", ".fr-2", ".fr-3"].forEach((sel, n) => {
    const chs = $$(`${sel} .ch`);
    gsap.fromTo(chs, { _w: 40, _g: 300 }, { _w: (i, s) => s._bw, _g: (i, s) => s._bg, stagger: 0.04, ease: "none", onUpdate() { this.targets().forEach(pinta); }, scrollTrigger: { trigger: ".frase", start: `top ${88 - n * 8}%`, end: "center 55%", scrub: true } });
  });
}

/* ---------- cards que viram ---------- */
$$(".flip").forEach((card) => {
  const btn = $(".flip-toque", card);
  btn.addEventListener("click", () => { const v = card.classList.toggle("virado"); btn.setAttribute("aria-pressed", v); });
});
if (!fino) $$(".face-dica span").forEach((s) => (s.textContent = "Toque para virar"));

let refazer, alturaMain = 0;
new ResizeObserver(([e]) => {
  const h = Math.round(e.contentRect.height), primeira = !alturaMain;
  if (Math.abs(h - alturaMain) < 3) return;
  alturaMain = h;
  if (primeira) return;
  clearTimeout(refazer); refazer = setTimeout(() => ScrollTrigger.refresh(), 160);
}).observe($("main"));
document.fonts?.ready.then(() => { ScrollTrigger.refresh(); proximidadeLigada && medirLetras(); });

/* ---------- conversão: clique no WhatsApp ou no e-mail vira uma visita em /obrigado no Vercel Analytics (sem cookie) ---------- */
document.addEventListener("click", (e) => {
  if (e.target.closest?.('a[href*="wa.me/"], a[href^="mailto:"]')) window.va?.("pageview", { route: "/obrigado", path: "/obrigado" });
});
