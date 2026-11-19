// Contato do site: formulário da análise gratuita em janela (com a agenda depois do envio),
// botão flutuante de WhatsApp e saída para o Gmail quando o mailto não abre nenhum app.
// É o mesmo formulário do site anterior (React), com os mesmos campos e textos, em JS puro:
// grava na tabela "formulario" do Supabase e marca a conversa pela function "agenda".

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const EMAIL = "moveaioficial@gmail.com";
// link oficial do botão flutuante do site anterior (src/lib/contato.ts, pedido pelo Rafa em 16/11/2026)
export const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=5511945689265&text=Ol%C3%A1%2C+tudo+bem%3F+Vim+pelo+site+da+Move+AI.+Quero+agilizar+processos+e+melhorar+o+desempenho+da+minha+empresa+com+IA.+Podemos+conversar%3F&type=phone_number&app_absent=0";
const WHATSAPP_AGENDA = "https://wa.me/5511945689265?text=" + encodeURIComponent("Olá! Preenchi o formulário no site da Move AI e quero marcar uma conversa.");
const TZ = "America/Sao_Paulo";
const FECHA_EM = 12;

const ICONE_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmt = (o) => new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...o });
const hora = (iso) => fmt({ hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const longo = (iso) => `${fmt({ weekday: "long", day: "numeric", month: "long" }).format(new Date(iso))}, às ${hora(iso)}`;
const rotuloDia = (d) => { const x = new Date(`${d}T12:00:00Z`); return [fmt({ weekday: "short" }).format(x).replace(".", ""), fmt({ day: "2-digit", month: "2-digit" }).format(x)]; };
const formataWhats = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const whatsOk = (v) => [10, 11].includes(v.replace(/\D/g, "").length);
const conta = (rota) => window.va?.("pageview", { route: rota, path: rota });

const cabecalhos = () => ({ apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" });
async function gravar(dados) {
  if (!SB_URL || !SB_KEY) throw new Error("sem configuração");
  const r = await fetch(`${SB_URL}/rest/v1/formulario`, { method: "POST", headers: { ...cabecalhos(), Prefer: "return=minimal" }, body: JSON.stringify(dados) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}
async function agenda(corpo) {
  let r;
  try { r = await fetch(`${SB_URL}/functions/v1/agenda`, { method: "POST", headers: cabecalhos(), body: JSON.stringify(corpo) }); }
  catch { throw { code: "rede" }; }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw { code: j.error || "erro_interno", extra: j };
  return j;
}

/* ---------- calendário (Google, Outlook, .ics) ---------- */
const carimbo = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
function linksAgenda(ev) {
  const g = new URLSearchParams({ action: "TEMPLATE", text: ev.title, dates: `${carimbo(ev.start)}/${carimbo(ev.end)}`, details: ev.description, ctz: TZ, location: ev.location });
  const o = new URLSearchParams({ path: "/calendar/action/compose", rru: "addevent", subject: ev.title, startdt: ev.start.toISOString(), enddt: ev.end.toISOString(), body: ev.description, location: ev.location });
  return { google: `https://calendar.google.com/calendar/render?${g}`, outlook: `https://outlook.live.com/calendar/0/deeplink/compose?${o}` };
}
function baixarIcs(ev) {
  const e = (t) => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Move AI//Agendamento//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT", `UID:${ev.start.getTime()}@moveai.tech`, `DTSTAMP:${carimbo(new Date())}`, `DTSTART:${carimbo(ev.start)}`, `DTEND:${carimbo(ev.end)}`, `SUMMARY:${e(ev.title)}`, `DESCRIPTION:${e(ev.description)}`, `LOCATION:${e(ev.location)}`, "BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", "DESCRIPTION:Lembrete", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n") + "\r\n";
  const url = URL.createObjectURL(new Blob([txt], { type: "text/calendar;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "reuniao-move-ai.ics" });
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- janela ---------- */
let janela, caixa, voltaFoco, aoAbrir = () => {}, aoFechar = () => {}, timerFecha;

function montarJanela() {
  janela = document.createElement("div");
  janela.className = "janela";
  janela.hidden = true;
  janela.innerHTML = `<div class="janela-fundo" data-fecha></div>
    <div class="janela-caixa" role="dialog" aria-modal="true" aria-labelledby="janela-titulo" tabindex="-1">
      <button type="button" class="janela-x" data-fecha aria-label="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <div class="janela-corpo"></div>
    </div>`;
  document.body.appendChild(janela);
  // o Esc fecha mesmo quando o foco saiu da janela (botão desativado durante o envio)
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !janela.hidden) { e.preventDefault(); fechar(); } });
  caixa = janela.querySelector(".janela-caixa");
  janela.addEventListener("click", (e) => { if (e.target.closest("[data-fecha]")) fechar(); });
  janela.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = [...caixa.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea, [tabindex="0"]')].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const [p, u] = [f[0], f[f.length - 1]];
    if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
    else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
  });
}

export function abrirFormulario() {
  if (!janela) montarJanela();
  clearTimeout(timerFecha);
  voltaFoco = document.activeElement;
  telaFormulario();
  janela.hidden = false;
  document.documentElement.classList.add("janela-aberta");
  requestAnimationFrame(() => janela.classList.add("on"));
  aoAbrir();
  setTimeout(() => caixa.querySelector("input:not([tabindex='-1'])")?.focus({ preventScroll: true }), 60);
}
function fechar() {
  if (!janela || janela.hidden) return;
  clearTimeout(timerFecha);
  janela.classList.remove("on");
  document.documentElement.classList.remove("janela-aberta");
  aoFechar();
  setTimeout(() => { janela.hidden = true; }, 260);
  voltaFoco?.focus?.({ preventScroll: true });
}
const corpo = () => janela.querySelector(".janela-corpo");

function telaFormulario() {
  caixa.classList.remove("larga");
  corpo().innerHTML = `<h2 class="janela-titulo" id="janela-titulo">Peça sua análise gratuita</h2>
    <p class="janela-sub">Conte rapidinho sobre a sua empresa. Depois você já escolhe um horário para conversar com a gente. A gente responde em até 24 horas úteis.</p>
    <form class="form" novalidate>
      <input class="form-isca" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <label class="campo"><span>Nome</span><input name="nome" type="text" required maxlength="120" autocomplete="name" placeholder="Seu nome" /></label>
      <label class="campo"><span>Empresa <small>(opcional)</small></span><input name="empresa" type="text" maxlength="160" autocomplete="organization" placeholder="Nome da sua empresa" /></label>
      <label class="campo"><span>E-mail</span><input name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" placeholder="seu@email.com" /><em class="campo-erro" data-erro="email"></em></label>
      <label class="campo"><span>WhatsApp</span><input name="whatsapp" type="tel" required autocomplete="tel" inputmode="tel" placeholder="(11) 99999-9999" /><em class="campo-erro" data-erro="whatsapp"></em></label>
      <label class="campo"><span>O que você precisa?</span><textarea name="problema" required minlength="3" maxlength="2000" rows="3" placeholder="Ex.: quero um site novo, minha marca precisa de cara nova, meu Instagram não passa confiança..."></textarea></label>
      <label class="aceite"><input name="aceite" type="checkbox" required /><span>Li e concordo com a <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>. Usamos os seus dados só para responder ao seu pedido e preparar a sua proposta.</span></label>
      <p class="form-erro" role="alert" hidden></p>
      <button type="submit" class="btn form-enviar">Enviar mensagem</button>
    </form>`;
  const form = corpo().querySelector("form"), erro = form.querySelector(".form-erro");
  const w = form.whatsapp, em = form.email;
  const marca = (campo, msg) => { const el = form.querySelector(`[data-erro="${campo}"]`); el.textContent = msg || ""; form[campo].toggleAttribute("aria-invalid", !!msg); };
  w.addEventListener("input", () => { w.value = formataWhats(w.value); marca("whatsapp"); });
  em.addEventListener("input", () => marca("email"));
  form.aceite.addEventListener("change", () => { if (form.aceite.checked) erro.hidden = true; });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim(), problema = form.problema.value.trim();
    let ruim = false;
    if (!nome) { form.nome.focus(); erro.textContent = "Informe o seu nome."; erro.hidden = false; return; }
    if (!emailOk(em.value.trim())) { marca("email", "Informe um e-mail válido (ex: nome@dominio.com)"); ruim = true; }
    if (!whatsOk(w.value)) { marca("whatsapp", "Número inválido. Use DDD + número (10 ou 11 dígitos)"); ruim = true; }
    if (ruim) { (form.querySelector("[aria-invalid]") || form.nome).focus(); return; }
    if (problema.length < 3) { form.problema.focus(); erro.textContent = "Conte em poucas palavras o que você precisa."; erro.hidden = false; return; }
    if (!form.aceite.checked) { erro.textContent = "Para enviar, marque que leu e concorda com a Política de Privacidade."; erro.hidden = false; return; }
    const lead = { nome, empresa: form.empresa.value.trim() || undefined, email: em.value.trim().toLowerCase(), whatsapp: w.value, descricao: problema };
    // campo isca preenchido = robô: finge sucesso e não grava nada
    if (form.website.value) { telaAgenda(lead, true); return; }
    const bt = form.querySelector(".form-enviar");
    bt.disabled = true; bt.textContent = "Enviando..."; erro.hidden = true;
    try {
      await gravar({ nome, empresa: lead.empresa || null, email: lead.email, whatsapp: lead.whatsapp, descricao: problema });
      conta("/obrigado");
      telaAgenda(lead);
    } catch {
      erro.innerHTML = `Não deu para enviar. Tente de novo ou chame a gente no <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">WhatsApp</a>.`;
      erro.hidden = false; bt.disabled = false; bt.textContent = "Enviar mensagem";
    }
  });
}

const ERROS = {
  horario_ocupado: "Esse horário acabou de ser ocupado. Escolha outro, por favor.",
  horario_invalido: "Esse horário não está mais disponível. Escolha outro, por favor.",
  limite_excedido: "Muitas tentativas de agendamento. Fale com a gente pelo WhatsApp.",
  dados_invalidos: "Não conseguimos validar seus dados. Fale com a gente pelo WhatsApp.",
};

function telaAgenda(lead, isca = false) {
  caixa.classList.add("larga");
  let dias = [], dia = null, slot = null, aviso = "";
  const topo = `<p class="agenda-ok">✓ Recebemos seus dados, ${esc(lead.nome.split(" ")[0])}!</p>
    <h2 class="janela-titulo" id="janela-titulo">Quer adiantar? Agende 30 min com a gente</h2>
    <p class="janela-sub">Escolha um horário (horário de Brasília). O convite com o link do Google Meet chega no seu e-mail.</p>`;
  const indisponivel = () => {
    corpo().innerHTML = `${topo}<div class="agenda-caixa"><p>Não conseguimos carregar a agenda agora. A gente vai entrar em contato com você. Se preferir, chame a gente no WhatsApp.</p>
      <div class="agenda-acoes"><a class="btn btn-wa" href="${WHATSAPP_AGENDA}" target="_blank" rel="noopener noreferrer">${ICONE_WA} Falar no WhatsApp</a><button type="button" class="link-seta" data-tenta>Tentar de novo</button></div></div>
      <button type="button" class="agenda-depois" data-fecha>Fechar</button>`;
    corpo().querySelector("[data-tenta]").addEventListener("click", carregar);
  };
  const desenhar = () => {
    const atual = dias.find((d) => d.date === dia);
    corpo().innerHTML = `${topo}
      <div class="agenda-dias" role="listbox" aria-label="Dias disponíveis">${dias.map((d) => { const [s, dm] = rotuloDia(d.date); return `<button type="button" role="option" data-dia="${d.date}" aria-selected="${d.date === dia}" ${d.slots.length ? "" : "disabled"}><span>${s}</span><b>${dm}</b></button>`; }).join("")}</div>
      <div class="agenda-horas" role="listbox" aria-label="Horários">${(atual?.slots || []).map((h) => `<button type="button" role="option" data-hora="${h}" aria-selected="${h === slot}">${hora(h)}</button>`).join("")}</div>
      ${aviso ? `<p class="form-erro" role="alert">${esc(aviso)}</p>` : ""}
      <button type="button" class="btn form-enviar" data-confirma ${slot ? "" : "disabled"}>${slot ? `Confirmar ${longo(slot)}` : "Escolha um horário"}</button>
      <button type="button" class="agenda-depois" data-fecha>Agora não, prefiro aguardar o contato</button>`;
    corpo().querySelectorAll("[data-dia]").forEach((b) => b.addEventListener("click", () => { dia = b.dataset.dia; slot = null; desenhar(); }));
    corpo().querySelectorAll("[data-hora]").forEach((b) => b.addEventListener("click", () => { slot = b.dataset.hora; desenhar(); corpo().querySelector(`[data-hora="${slot}"]`)?.focus(); }));
    corpo().querySelector("[data-confirma]").addEventListener("click", confirmar);
  };
  async function carregar(manter = false) {
    if (manter !== true) aviso = "";
    corpo().innerHTML = `${topo}<p class="agenda-carregando">Buscando horários disponíveis…</p>`;
    if (isca) { indisponivel(); return; }
    try {
      const r = await agenda({ action: "slots" });
      dias = r.days || [];
      const primeiro = dias.find((d) => d.slots.length);
      if (!primeiro) { indisponivel(); return; }
      if (!dias.some((d) => d.date === dia && d.slots.length)) dia = primeiro.date;
      slot = null; desenhar();
    } catch { indisponivel(); }
  }
  async function confirmar() {
    if (!slot) return;
    const bt = corpo().querySelector("[data-confirma]");
    bt.disabled = true; bt.textContent = "Confirmando…";
    try {
      const b = await agenda({ action: "book", start: slot, ...lead });
      feito(b);
    } catch (e) {
      if (e.code === "ja_agendado" && e.extra?.inicio) { aviso = `Você já tem uma reunião marcada para ${longo(e.extra.inicio)}. Confira o convite no seu e-mail.`; desenhar(); return; }
      if (e.code === "horario_ocupado" || e.code === "horario_invalido") { aviso = ERROS[e.code]; await carregar(true); return; }
      aviso = ERROS[e.code] || "Não foi possível confirmar agora. Tente de novo ou fale pelo WhatsApp."; desenhar();
    }
  }
  function feito(b) {
    const ev = { title: "Reunião com a Move AI", description: ["Conversa de 30 minutos com a equipe da Move AI.", b.meetLink ? `Google Meet: ${b.meetLink}` : "", "Dúvidas: https://wa.me/5511945689265"].filter(Boolean).join("\n"), location: b.meetLink || "Google Meet (link no convite por e-mail)", start: new Date(b.inicio), end: new Date(b.fim) };
    const l = linksAgenda(ev);
    let resta = FECHA_EM, pausa = false;
    corpo().innerHTML = `<div class="agenda-feito"><h2 class="janela-titulo" id="janela-titulo">Reunião marcada!</h2>
      <p class="agenda-quando">${longo(b.inicio)}</p><p class="janela-sub">30 minutos · horário de Brasília</p>
      ${b.meetLink ? `<a class="btn" href="${esc(b.meetLink)}" target="_blank" rel="noopener noreferrer">Link do Google Meet</a>` : ""}
      <p class="janela-sub">Enviamos o convite para <strong>${esc(lead.email)}</strong>. Se preferir, adicione na sua agenda:</p>
      <div class="agenda-acoes"><a class="link-seta" href="${l.google}" target="_blank" rel="noopener noreferrer">Google</a><a class="link-seta" href="${l.outlook}" target="_blank" rel="noopener noreferrer">Outlook</a><button type="button" class="link-seta" data-ics>Apple / .ics</button></div>
      <button type="button" class="agenda-depois" data-fecha>Voltando ao site em ${resta}s</button></div>`;
    const box = corpo().querySelector(".agenda-feito"), volta = box.querySelector(".agenda-depois");
    box.querySelector("[data-ics]").addEventListener("click", () => baixarIcs(ev));
    box.addEventListener("mouseenter", () => { pausa = true; volta.textContent = "Voltar ao site"; });
    box.addEventListener("mouseleave", () => { pausa = false; });
    const passo = () => { timerFecha = setTimeout(() => { if (!pausa) { resta--; volta.textContent = `Voltando ao site em ${resta}s`; } if (resta <= 0) fechar(); else passo(); }, 1000); };
    passo();
  }
  carregar();
}

/* ---------- mailto: se nenhum app de e-mail abrir, oferece o Gmail no navegador ---------- */
function saidaEmail() {
  let aviso;
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.('a[href^="mailto:"]');
    if (!a) return;
    conta("/contato/email");
    let saiu = false;
    const marca = () => { saiu = true; };
    addEventListener("blur", marca, { once: true });
    document.addEventListener("visibilitychange", marca, { once: true });
    setTimeout(() => {
      removeEventListener("blur", marca); document.removeEventListener("visibilitychange", marca);
      if (saiu || document.hidden) return;
      const u = new URL(a.href), assunto = u.searchParams.get("subject") || "";
      const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}${assunto ? `&su=${encodeURIComponent(assunto)}` : ""}`;
      aviso?.remove();
      aviso = document.createElement("div");
      aviso.className = "aviso-email";
      aviso.setAttribute("role", "status");
      aviso.innerHTML = `<p>Não abriu o seu app de e-mail?</p><a href="${gmail}" target="_blank" rel="noopener noreferrer">Escrever pelo Gmail</a><button type="button" data-copia>Copiar ${EMAIL}</button><button type="button" class="aviso-x" aria-label="Fechar aviso">×</button>`;
      document.body.appendChild(aviso);
      aviso.querySelector("[data-copia]").addEventListener("click", async (ev) => { try { await navigator.clipboard.writeText(EMAIL); ev.target.textContent = "Endereço copiado"; } catch { ev.target.textContent = EMAIL; } });
      aviso.querySelector(".aviso-x").addEventListener("click", () => aviso.remove());
      setTimeout(() => aviso?.remove(), 12000);
    }, 1400);
  });
}

/* ---------- botão flutuante de WhatsApp ---------- */
function botaoWhats() {
  const a = document.createElement("a");
  a.className = "wa-flutuante";
  a.href = WHATSAPP_URL; a.target = "_blank"; a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", "Falar pelo WhatsApp");
  a.innerHTML = ICONE_WA;
  document.body.appendChild(a);
}

export function iniciarContato(opcoes = {}) {
  aoAbrir = opcoes.aoAbrir || aoAbrir; aoFechar = opcoes.aoFechar || aoFechar;
  // todos os CTAs que pedem a análise abrem o formulário; sem JS, o link leva à seção
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("[data-formulario]");
    if (!a) return;
    e.preventDefault(); e.stopImmediatePropagation();
    abrirFormulario();
  }, true);
  document.addEventListener("click", (e) => { if (e.target.closest?.('a[href*="wa.me/"], a[href*="api.whatsapp.com"]')) conta("/contato/whatsapp"); });
  saidaEmail();
  botaoWhats();
  if (location.hash === "#analise-gratuita") { history.replaceState(null, "", location.pathname); setTimeout(abrirFormulario, 400); }
}
