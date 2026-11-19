// Fundo da abertura: trajetórias pontilhadas em perspectiva, cada uma girando para um lado,
// cometas correndo por elas e nós ligados por linhas finas. De tempos em tempos, uma palavra
// curta aparece num estouro discreto, longe do título.
// Leve: 30 quadros por segundo, menos pontos no celular, pausa fora da tela e com a aba escondida.
export function iniciarRede(canvas, getVel, { reduzido = false, evitar = () => [] } = {}) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const pequeno = matchMedia("(max-width: 700px)").matches;
  const fino = matchMedia("(pointer: fine)").matches;
  const PONTOS = pequeno ? 48 : 80;
  let w = 0, h = 0, visivel = true, mx = 0, my = 0, tx = 0, ty = 0, impulso = 0, tempo = 0;

  const orbitas = [
    { r: 1.9, incl: [0.35, 0.2], vel: 0.035, cor: "180,150,240" },
    { r: 2.4, incl: [-0.9, 0.5], vel: -0.025, cor: "120,170,255" },
    { r: 1.6, incl: [1.25, -0.3], vel: 0.04, cor: "0,195,208" },
    { r: 2.8, incl: [0.1, 1.1], vel: -0.02, cor: "200,170,255" },
  ].slice(0, pequeno ? 3 : 4);
  orbitas.forEach((o) => (o.fase = Math.random() * 6));
  const CENTRO_Z = 2.6;
  const nos = Array.from({ length: pequeno ? 6 : 10 }, (_, i) => ({ o: i % orbitas.length, a: Math.random() * Math.PI * 2, pulso: Math.random() * 6 }));

  // de tempos em tempos uma bolinha estoura e mostra uma palavra curta, uma de cada vez,
  // em rodízio, sempre num ponto livre (longe do título, do texto e dos botões)
  const PALAVRAS = ["MOVE AI", "ANÁLISE GRATUITA", "PRESENÇA DIGITAL", "EM MOVIMENTO"];
  const CORES = ["#ff8fc4", "#ffd27a", "#8ff2b6", "#8fdcff"];
  const rndr = (a, b) => a + Math.random() * (b - a);
  let palavra = null, proxima = 3.2, vez = 0, quadrante = (Math.random() * 4) | 0;
  function iniciarPalavra() {
    const txt = PALAVRAS[vez % PALAVRAS.length], cor = CORES[vez % CORES.length];
    ctx.font = "600 13px 'Space Grotesk', sans-serif";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "2px";
    const meia = ctx.measureText(txt).width / 2 + 34, alto = 58;
    const proibido = evitar().map(([l, t, r, b]) => [l - meia - (pequeno ? 0 : 80), t - alto - (pequeno ? 6 : 30), r + meia + (pequeno ? 0 : 80), b + alto + (pequeno ? 6 : 30)]);
    const livre = (x, y) => x > meia + 12 && x < w - meia - 12 && y > 112 && y < h - 70 && !proibido.some(([l, t, r, b]) => x > l && x < r && y > t && y < b);
    // um quadrante diferente a cada vez, para as palavras não se repetirem no mesmo canto
    for (let q = 0; q < 4; q++) {
      const k = (quadrante + q) % 4, dir = k % 2, baixo = k > 1;
      for (let i = 0; i < 30; i++) {
        const x = w * (dir ? rndr(0.62, 0.95) : rndr(0.05, 0.38)), y = h * (baixo ? rndr(0.55, 0.9) : rndr(0.12, 0.45));
        if (livre(x, y)) { palavra = { x, y, t: 0, txt, cor, ang: Array.from({ length: 14 }, (_, j) => (j / 14) * 6.283 + Math.random() * 0.3) }; quadrante = (k + 1 + ((Math.random() * 2) | 0)) % 4; vez++; return; }
      }
    }
    proxima = 4; // sem espaço livre agora: tenta de novo mais tarde
  }
  function desenharPalavra(dt) {
    if (!palavra) { proxima -= dt; if (proxima <= 0) iniciarPalavra(); return; }
    const p = palavra; p.t += dt; const t = p.t;
    if (t < 0.45) { // a bolinha chega
      const k = t / 0.45, x = p.x - 110 * (1 - k), y = p.y + 40 * (1 - k);
      ctx.globalAlpha = 0.9; ctx.fillStyle = p.cor; ctx.fillRect(x - 2, y - 2, 4, 4);
    } else { // estoura e mostra a palavra por um instante
      const e = t - 0.45, r = 8 + e * 70, a = Math.max(0, 1 - e / 0.6);
      if (a > 0) { ctx.globalAlpha = a * 0.8; ctx.fillStyle = p.cor; p.ang.forEach((g) => ctx.fillRect(p.x + Math.cos(g) * r - 1.2, p.y + Math.sin(g) * r - 1.2, 2.4, 2.4)); }
      const ta = e < 0.2 ? e / 0.2 : e > 1.6 ? Math.max(0, 1 - (e - 1.6) / 0.4) : 1;
      if (ta > 0) {
        ctx.globalAlpha = ta * 0.85; ctx.fillStyle = p.cor; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "600 13px 'Space Grotesk', sans-serif";
        if ("letterSpacing" in ctx) ctx.letterSpacing = "2px";
        ctx.fillText(p.txt, p.x, p.y);
      }
    }
    if (t > 2.6) { palavra = null; proxima = rndr(6, 9); }
  }

  function medir() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const rot = (p, ax, ay) => {
    let [x, y, z] = p;
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    [x, z] = [x * cy + z * sy, -x * sy + z * cy];
    return [x, y, z];
  };
  function projetar(x, y, z) {
    const zz = z + CENTRO_Z;
    if (zz < 0.15) return null;
    const F = Math.min(w, h) * 0.9;
    return [w / 2 + (x / zz) * F, h / 2 + (y / zz) * F, zz];
  }
  const pontoOrbita = (o, a) => rot([Math.cos(a) * o.r, 0, Math.sin(a) * o.r], o.incl[0] + my * 0.2, o.incl[1] + mx * 0.3 + tempo * 0.015);

  function desenhar(dt) {
    tempo += dt;
    impulso += (Math.min(Math.abs(getVel()), 80) * 0.003 - impulso) * 0.1;
    mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
    ctx.clearRect(0, 0, w, h);

    for (const o of orbitas) {
      o.fase += o.vel * dt * (1 + impulso);
      ctx.fillStyle = `rgb(${o.cor})`;
      for (let i = 0; i < PONTOS; i++) {
        const pr = projetar(...pontoOrbita(o, (i / PONTOS) * Math.PI * 2 + o.fase));
        if (!pr) continue;
        const perto = Math.min(1, 1.6 / pr[2]);
        ctx.globalAlpha = 0.18 + perto * 0.5;
        const s = 1 + perto * 1.8;
        ctx.fillRect(pr[0] - s / 2, pr[1] - s / 2, s, s);
      }
      const cab = o.fase * 6;
      for (let k = 0; k < 12; k++) {
        const pr = projetar(...pontoOrbita(o, cab - k * 0.014 * Math.sign(o.vel)));
        if (!pr) continue;
        const perto = Math.min(1, 1.6 / pr[2]);
        ctx.globalAlpha = (1 - k / 12) * (0.35 + perto * 0.55);
        ctx.fillStyle = k ? `rgb(${o.cor})` : "#ffffff";
        const s = (2.6 - k * 0.15) * (0.6 + perto);
        ctx.fillRect(pr[0] - s / 2, pr[1] - s / 2, s, s);
      }
    }

    const lim = Math.min(w, h) * 0.45;
    const pos = nos.map((n) => { n.pulso += dt; return projetar(...pontoOrbita(orbitas[n.o], n.a + orbitas[n.o].fase)); });
    ctx.lineWidth = 0.7; ctx.strokeStyle = "#9fdcff";
    for (let i = 0; i < pos.length; i++) {
      const a = pos[i]; if (!a) continue;
      for (let j = i + 1; j < pos.length; j++) {
        const b = pos[j]; if (!b) continue;
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (d > lim) continue;
        ctx.globalAlpha = 0.2 * (1 - d / lim);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    }
    ctx.fillStyle = "#00c3d0";
    pos.forEach((p, i) => {
      if (!p) return;
      const pul = 0.5 + 0.5 * Math.sin(nos[i].pulso * 2);
      ctx.globalAlpha = 0.2 + pul * 0.25;
      ctx.beginPath(); ctx.arc(p[0], p[1], 2 + pul * 3.5, 0, 6.283); ctx.fill();
    });
    desenharPalavra(dt);
    ctx.globalAlpha = 1;
  }

  let ultimo = 0, acumulado = 0;
  const PASSO = 1 / 30;
  function quadro(t) {
    if (!visivel) return;
    const dt = ultimo ? Math.min((t - ultimo) / 1000, 0.1) : PASSO;
    ultimo = t; acumulado += dt;
    if (acumulado >= PASSO) { desenhar(Math.min(acumulado, 0.1)); acumulado = 0; }
    requestAnimationFrame(quadro);
  }
  const ligar = () => { if (!visivel && !document.hidden) { visivel = true; ultimo = 0; requestAnimationFrame(quadro); } };

  medir();
  addEventListener("resize", medir, { passive: true });
  if (reduzido) { desenhar(0); return; }
  if (fino) addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  new IntersectionObserver(([e]) => (e.isIntersecting ? ligar() : (visivel = false))).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? (visivel = false) : ligar()));
  requestAnimationFrame(quadro);
}
