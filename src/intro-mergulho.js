import gsap from "gsap";

// Intro "mergulho" (~3,2 s): a TV aparece inteira, só o vidro dela trinca com o golpe,
// e a câmera entra pela tela quebrada até o escuro da Move, onde o site aparece.
// Mais leve que a versão "estilhaço": só transform e opacidade, sem canvas de cacos.
// A versão anterior continua intacta em intro-estilhaco.js.
const SVGNS = "http://www.w3.org/2000/svg";
const rnd = (a, b) => a + Math.random() * (b - a);

function teia(cx, cy, raioMax, nRaios, aneis) {
  const angs = Array.from({ length: nRaios }, (_, i) => (i / nRaios) * Math.PI * 2 + rnd(-0.18, 0.18));
  const pts = angs.map((a) => aneis.map((r, j) => {
    const rr = r * raioMax * rnd(0.85, 1.15), aa = a + (j ? rnd(-0.08, 0.08) : 0);
    return [cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr];
  }));
  return { pts, nRaios, nAneis: aneis.length, cx, cy };
}
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
const pathD = (l) => l.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
function desenharTeia(svg, t, espessura) {
  const frag = document.createDocumentFragment();
  const add = (d, w, cls) => { const p = document.createElementNS(SVGNS, "path"); p.setAttribute("d", d); p.setAttribute("pathLength", "1"); p.setAttribute("stroke-width", w); p.setAttribute("class", cls); frag.append(p); };
  for (let i = 0; i < t.nRaios; i++) {
    const linha = [[t.cx, t.cy], ...t.pts[i]];
    add(pathD(linha.flatMap((p, k) => (k ? serrilha(linha[k - 1], p, 3).slice(1) : [p]))), espessura * rnd(0.7, 1.3), "raio");
  }
  for (let j = 0; j < t.nAneis; j++) for (let i = 0; i < t.nRaios; i++) {
    if (Math.random() < 0.3) continue;
    add(pathD(serrilha(t.pts[i][j], t.pts[(i + 1) % t.nRaios][j], 2, 0.1)), espessura * 0.7, "anel");
  }
  svg.append(frag);
  return [...svg.querySelectorAll("path")];
}

export function rodarIntro({ aoRevelar, aoFim }) {
  const raiz = document.documentElement;
  const el = document.getElementById("intro");
  const q = (s) => el.querySelector(s);
  const palco = q(".intro-palco"), tela = q(".intro-tela");
  const pequeno = innerWidth < 700;
  try { localStorage.setItem("move-intro", "1"); } catch (e) {}
  el.classList.add("mergulho");

  const rc = q(".tv-ruido"), rcx = rc.getContext("2d"), img = rcx.createImageData(rc.width, rc.height);
  const ruido = () => { const d = img.data; for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } rcx.putImageData(img, 0, 0); };
  gsap.ticker.add(ruido);

  // as trincas ficam só dentro da tela da TV (coordenadas 0..100 da tela)
  const svg = q(".tv-racha");
  const golpe1 = desenharTeia(svg, teia(62, 42, 62, pequeno ? 8 : 10, [0.08, 0.24, 0.5, 0.9, 1.5]), 1.3);
  const golpe2 = desenharTeia(svg, teia(28, 68, 48, 7, [0.12, 0.35, 0.8, 1.4]), 1);

  // quanto ampliar para a tela da TV cobrir a janela inteira (com folga)
  const escalaFinal = () => { const r = tela.getBoundingClientRect(); return Math.max(innerWidth / r.width, innerHeight / r.height) * 1.25; };

  const tl = gsap.timeline({ onComplete: fim });
  tl.fromTo(palco, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
    .fromTo(palco, { scale: 1 }, { scale: 1.06, duration: 1.9, ease: "none" }, 0)
    .fromTo(".tv-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.4 }, 0.35)
    .from(".tv-site", { scaleY: 0.02, duration: 0.35, ease: "expo.out" }, 0.35)

    // o golpe: a TV treme e o vidro trinca
    .addLabel("g1", 1.3)
    .to(palco, { keyframes: [{ x: 22, y: -5, rotation: -1.2, duration: 0.05 }, { x: -12, y: 3, rotation: 0.7, duration: 0.1 }, { x: 0, y: 0, rotation: 0, duration: 0.3, ease: "elastic.out(1, 0.4)" }] }, "g1")
    .add(() => tela.classList.add("glitch"), "g1")
    .to(golpe1, { strokeDashoffset: 0, duration: 0.2, stagger: 0.008, ease: "power4.out" }, "g1")
    .to(".tv-ruido", { opacity: 0.5, duration: 0.05 }, "g1")
    .fromTo(".tv-flash", { opacity: 0.6 }, { opacity: 0, duration: 0.2 }, "g1")
    .set(".tv-barras", { opacity: 1 }, "g1+=0.26").set(".tv-barras", { opacity: 0 }, "g1+=0.36")
    .add(() => { tela.classList.remove("glitch"); tela.classList.add("quebrada"); }, "g1+=0.4")
    .addLabel("g2", 1.75)
    .to(palco, { keyframes: [{ x: -14, y: 4, rotation: 0.8, duration: 0.05 }, { x: 0, y: 0, rotation: 0, duration: 0.25 }] }, "g2")
    .to(golpe2, { strokeDashoffset: 0, duration: 0.16, stagger: 0.006, ease: "power4.out" }, "g2")

    // a câmera entra pela tela: a imagem se apaga no escuro da Move
    .addLabel("entra", 2.05)
    .to(".tv-imagem", { opacity: 0, duration: 0.35, ease: "power2.in" }, "entra")
    .to(".intro-tela", { backgroundColor: "#0a0710", duration: 0.35 }, "entra")
    .to(palco, { scale: () => gsap.getProperty(palco, "scale") * escalaFinal(), duration: 0.85, ease: "power3.in" }, "entra")
    .to(".tv-racha", { opacity: 0, duration: 0.3 }, "entra+=0.5")
    .addLabel("revela", "entra+=0.78")
    .add(() => { gsap.ticker.remove(ruido); aoRevelar?.(); }, "revela")
    .to(el, { opacity: 0, duration: 0.45, ease: "power1.out" }, "revela")
    .to(".intro-pular", { opacity: 0, duration: 0.2 }, "entra");

  let pulou = false;
  function pular() {
    if (pulou) return;
    pulou = true;
    if (tl.time() < tl.labels.entra) tl.seek(tl.labels.entra - 0.01);
    tl.timeScale(1.5);
  }
  q(".intro-pular").addEventListener("click", pular);
  const tecla = (e) => e.key === "Escape" && pular();
  addEventListener("keydown", tecla);

  function fim() {
    gsap.ticker.remove(ruido);
    removeEventListener("keydown", tecla);
    el.remove();
    raiz.classList.remove("com-intro");
    aoFim?.();
  }
  return tl;
}
