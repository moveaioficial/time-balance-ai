import gsap from "gsap";

// Intro de ~3,2 s: a sala antiga, a TV liga num site parado no tempo, leva dois golpes,
// o vidro trinca até tomar a tela inteira e estilhaça, revelando a Move por trás.
const SVGNS = "http://www.w3.org/2000/svg";
const rnd = (a, b) => a + Math.random() * (b - a);

// teia de rachaduras: raios tortos saindo do impacto e anéis ligando os raios
function teia(cx, cy, raioMax, nRaios, aneis) {
  const angs = Array.from({ length: nRaios }, (_, i) => (i / nRaios) * Math.PI * 2 + rnd(-0.18, 0.18));
  // pontos[i][j] = ponto do raio i no anel j
  const pts = angs.map((a) => aneis.map((r, j) => {
    const rr = r * raioMax * rnd(0.85, 1.15), aa = a + (j ? rnd(-0.08, 0.08) : 0);
    return [cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr];
  }));
  return { pts, nRaios, nAneis: aneis.length, cx, cy };
}
// linha quebradiça entre dois pontos
function serrilha(a, b, passos = 3, amp = 0.06) {
  const out = [a];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  for (let k = 1; k < passos; k++) {
    const t = k / passos, off = rnd(-amp, amp) * len;
    out.push([a[0] + dx * t - (dy / len) * off, a[1] + dy * t + (dx / len) * off]);
  }
  out.push(b);
  return out;
}
const pathD = (lista) => lista.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");

function desenharTeia(svg, t, { anelMax = t.nAneis, espessura = 1.4 } = {}) {
  const frag = document.createDocumentFragment();
  const add = (d, w, cls) => { const p = document.createElementNS(SVGNS, "path"); p.setAttribute("d", d); p.setAttribute("pathLength", "1"); p.setAttribute("stroke-width", w); p.setAttribute("class", cls); frag.append(p); };
  for (let i = 0; i < t.nRaios; i++) {
    const linha = [[t.cx, t.cy], ...t.pts[i].slice(0, anelMax)];
    add(pathD(linha.flatMap((p, k) => (k ? serrilha(linha[k - 1], p, 3).slice(1) : [p]))), espessura * rnd(0.7, 1.3), "raio");
  }
  for (let j = 0; j < anelMax; j++) {
    if (Math.random() < 0.25 && j > 0) continue;
    for (let i = 0; i < t.nRaios; i++) {
      if (Math.random() < 0.3) continue;
      add(pathD(serrilha(t.pts[i][j], t.pts[(i + 1) % t.nRaios][j], 2, 0.1)), espessura * 0.7, "anel");
    }
  }
  svg.append(frag);
  return [...svg.querySelectorAll("path")];
}

export function rodarIntro({ aoRevelar, aoFim }) {
  const raiz = document.documentElement;
  const el = document.getElementById("intro");
  const q = (s) => el.querySelector(s);
  const palco = q(".intro-palco"), tela = q(".intro-tela"), sala = q(".intro-sala");
  const svgTela = q(".tv-racha"), svgTudo = q(".intro-rachas"), cv = q(".intro-cacos");
  const pequeno = innerWidth < 700;
  try { localStorage.setItem("move-intro", "1"); } catch (e) {}

  // chiado da TV, só enquanto a intro roda
  const rc = q(".tv-ruido"), rcx = rc.getContext("2d"), img = rcx.createImageData(rc.width, rc.height);
  const ruido = () => { const d = img.data; for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } rcx.putImageData(img, 0, 0); };
  gsap.ticker.add(ruido);

  // trincas na tela (coordenadas 0..100 da tela)
  const tTela = teia(64, 40, 70, pequeno ? 8 : 11, [0.08, 0.22, 0.45, 0.8, 1.3]);
  const trincas1 = desenharTeia(svgTela, tTela, { anelMax: 3, espessura: 1.2 });
  const tTela2 = teia(30, 66, 60, 7, [0.1, 0.3, 0.7, 1.2]);
  const trincas2 = desenharTeia(svgTela, tTela2, { espessura: 1 });

  // aparelho fraco: menos cacos e menos trincas animadas
  const fraco = pequeno || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;

  // trincas na tela inteira e os cacos, preparados aos poucos enquanto a TV ainda treme
  let teiaTudo = null, trincas3 = [], cacos = [], foto = null, fila = [];
  function prepararTudo() {
    const r = tela.getBoundingClientRect();
    const W = innerWidth, H = innerHeight;
    svgTudo.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const cx = r.left + r.width * 0.64, cy = r.top + r.height * 0.4;
    teiaTudo = teia(cx, cy, Math.hypot(W, H), fraco ? 8 : 11, [0.05, 0.14, 0.3, 0.56, 1.0]);
    trincas3 = desenharTeia(svgTudo, teiaTudo, { espessura: pequeno ? 1.2 : 1.6 });
    // foto do momento: a sala e a tela estourada em branco (as trincas viram as bordas dos cacos)
    foto = document.createElement("canvas"); foto.width = W; foto.height = H;
    const f = foto.getContext("2d");
    const rp = palco.getBoundingClientRect(); f.drawImage(sala, rp.left, rp.top, rp.width, rp.height);
    const g = f.createRadialGradient(cx, cy, 4, r.left + r.width / 2, r.top + r.height / 2, r.width * 0.7);
    g.addColorStop(0, "rgba(255,255,255,0.98)"); g.addColorStop(1, "rgba(200,230,240,0.75)");
    f.fillStyle = g; f.fillRect(r.left, r.top, r.width, r.height);
    const t = teiaTudo;
    for (let i = 0; i < t.nRaios; i++) for (let j = -1; j < t.nAneis - 1; j++) fila.push([i, j]);
    gsap.ticker.add(fatiar);
  }
  // cria poucos cacos por quadro, para não travar
  function fatiar() {
    const W = innerWidth, H = innerHeight, t = teiaTudo;
    for (let n = 0; n < 8 && fila.length; n++) {
      const [i, j] = fila.shift();
      const a = t.pts[i], b = t.pts[(i + 1) % t.nRaios];
      const poli = j < 0 ? [[t.cx, t.cy], a[0], b[0]] : [a[j], a[j + 1], b[j + 1], b[j]];
      const xs = poli.map((p) => p[0]), ys = poli.map((p) => p[1]);
      const x0 = Math.max(0, Math.min(...xs)), y0 = Math.max(0, Math.min(...ys)), x1 = Math.min(W, Math.max(...xs)), y1 = Math.min(H, Math.max(...ys));
      if (x1 - x0 < 2 || y1 - y0 < 2) continue;
      const c = document.createElement("canvas");
      c.width = Math.ceil(x1 - x0); c.height = Math.ceil(y1 - y0);
      const k = c.getContext("2d");
      k.translate(-x0, -y0);
      k.beginPath(); poli.forEach((p, m) => (m ? k.lineTo(p[0], p[1]) : k.moveTo(p[0], p[1]))); k.closePath(); k.clip();
      k.drawImage(foto, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
      k.strokeStyle = "rgba(255,255,255,0.6)"; k.lineWidth = 1.2; k.stroke();
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = mx - t.cx, dy = my - t.cy, d = Math.hypot(dx, dy) || 1, D = Math.hypot(W, H);
      const forca = rnd(0.6, 1.2) * (1 - Math.min(d / (D * 0.9), 0.7));
      cacos.push({ c, w: x1 - x0, h: y1 - y0, mx, my, vx: (dx / d) * forca * 1400, vy: (dy / d) * forca * 1400 - rnd(0, 300), vr: rnd(-4, 4), atraso: (d / D) * 0.12 });
    }
    if (!fila.length) gsap.ticker.remove(fatiar);
  }

  function estilhacar() {
    while (fila.length) fatiar(); // se pulou a intro, termina o que faltava de uma vez
    gsap.ticker.remove(fatiar);
    gsap.ticker.remove(ruido);
    const dpr = Math.min(devicePixelRatio || 1, fraco ? 1 : 1.5), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext("2d");
    palco.style.visibility = "hidden"; svgTudo.style.visibility = "hidden";
    el.classList.add("quebrou");
    const estado = { t: 0 };
    gsap.to(estado, {
      t: 1, duration: 1, ease: "none",
      onUpdate: () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
        const T = estado.t;
        for (const s of cacos) {
          const tt = Math.max(0, T - s.atraso);
          const a = 1 - tt * 1.25;
          if (a <= 0) continue;
          const x = s.mx + s.vx * tt * 0.55, y = s.my + s.vy * tt * 0.55 + 1100 * tt * tt;
          if (x < -400 || x > W + 400 || y > H + 400) continue;
          const esc = 1 + tt * 0.9, ang = s.vr * tt, co = Math.cos(ang) * esc, si = Math.sin(ang) * esc;
          ctx.globalAlpha = a;
          ctx.setTransform(co * dpr, si * dpr, -si * dpr, co * dpr, x * dpr, y * dpr);
          ctx.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
        }
        ctx.globalAlpha = 1;
      },
    });
  }

  const tl = gsap.timeline({ onComplete: fim });
  tl.fromTo(palco, { opacity: 0, scale: 1.0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
    .to(palco, { scale: "+=0.05", duration: 2.1, ease: "none" }, 0)
    .fromTo(".tv-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.4 }, 0.35)
    .from(".tv-site", { scaleY: 0.02, duration: 0.35, ease: "expo.out" }, 0.35)

    // primeiro golpe
    .addLabel("g1", 1.25)
    .to(palco, { keyframes: [{ x: 26, y: -6, rotation: -1.4, duration: 0.05 }, { x: -14, y: 4, rotation: 0.8, duration: 0.1 }, { x: 0, y: 0, rotation: 0, duration: 0.3, ease: "elastic.out(1, 0.4)" }] }, "g1")
    .add(() => tela.classList.add("glitch"), "g1")
    .to(trincas1, { strokeDashoffset: 0, duration: 0.18, stagger: 0.008, ease: "power4.out" }, "g1")
    .to(".tv-ruido", { opacity: 0.5, duration: 0.05 }, "g1")
    .fromTo(".tv-flash", { opacity: 0.6 }, { opacity: 0, duration: 0.2 }, "g1")
    .set(".tv-barras", { opacity: 1 }, "g1+=0.28").set(".tv-barras", { opacity: 0 }, "g1+=0.38")
    .add(() => { tela.classList.remove("glitch"); tela.classList.add("quebrada"); }, "g1+=0.4")

    // segundo golpe, mais forte: a trinca sai da TV e toma a tela inteira
    .addLabel("g2", 1.72)
    .add(prepararTudo, "g2-=0.01")
    .to(palco, { keyframes: [{ x: -40, y: 10, rotation: 2.2, scale: "+=0.04", duration: 0.05 }, { x: 22, y: -6, rotation: -1.2, duration: 0.1 }, { x: 0, y: 0, rotation: 0, duration: 0.28 }] }, "g2")
    .add(() => { tela.classList.add("glitch", "estourada"); }, "g2")
    .to(trincas2, { strokeDashoffset: 0, duration: 0.15, stagger: 0.006, ease: "power4.out" }, "g2")
    .to(".tv-ruido", { opacity: 0.85, duration: 0.05 }, "g2")
    .fromTo(".intro-clarao", { opacity: 0.55 }, { opacity: 0, duration: 0.25 }, "g2")
    .add(() => (fraco ? gsap.set(trincas3, { strokeDashoffset: 0 }) : gsap.to(trincas3, { strokeDashoffset: 0, duration: 0.3, stagger: 0.004, ease: "power3.out" })), "g2+=0.04")

    // estilhaça e revela
    .addLabel("quebra", 2.2)
    .add(estilhacar, "quebra")
    .add(() => aoRevelar?.(), "quebra+=0.05")
    .to(".intro-pular", { opacity: 0, duration: 0.2 }, "quebra")
    .set({}, {}, "quebra+=1.02");

  let pulou = false;
  function pular() {
    if (pulou) return;
    pulou = true;
    if (tl.time() < tl.labels.g2) { tl.seek(tl.labels.g2 - 0.02); }
    tl.timeScale(1.6);
  }
  q(".intro-pular").addEventListener("click", pular);
  const tecla = (e) => e.key === "Escape" && pular();
  addEventListener("keydown", tecla);

  function fim() {
    gsap.ticker.remove(ruido); gsap.ticker.remove(fatiar);
    removeEventListener("keydown", tecla);
    el.remove();
    raiz.classList.remove("com-intro");
    aoFim?.();
  }
  return tl;
}
