// Publica no Instagram da Move AI os carrosséis da agenda (public/ig/agenda.json) que já passaram do horário.
// Roda no GitHub Actions (.github/workflows/instagram-agendado.yml), sem depender de nenhum PC ligado.
//
// agenda.json: [{ "slug": "teste-do-eleitor", "quando": "2026-10-25T11:00:00-03:00" }, ...]
// As imagens e vídeos (01.jpg, 02.mp4...) ou um reel.mp4, e a legenda-instagram.txt, ficam em public/ig/<slug>/ e são servidos por www.moveai.tech.
// O token vem do segredo IG_TOKEN do repositório e nunca é impresso.
//
// Segurança contra post duplicado: antes de publicar, confere as legendas dos últimos 25 posts do perfil.
// Se a 1ª linha da legenda já foi publicada, pula. Por isso não precisa gravar nada de volta no repositório.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// Aceita o segredo colado com espaços, quebras de linha ou com o prefixo "IG_TOKEN=".
const TOKEN = (process.env.IG_TOKEN || "").trim().replace(/^IG_TOKEN\s*=\s*/, "").replace(/^["']|["']$/g, "").trim();
const VER = process.env.IG_API_VERSION || 'v26.0';
const BASE = process.env.SITE_URL || 'https://www.moveai.tech';
const JANELA_H = 6; // só publica itens atrasados até 6 h (evita postar algo velho de surpresa)
const API = `https://graph.instagram.com/${VER}`;
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// No GitHub, "::notice::" e "::error::" viram avisos visíveis no resumo do run (o log completo exige login).
const GH = !!process.env.GITHUB_ACTIONS;
const aviso = msg => console.log(GH ? `::notice::${msg}` : msg);
const erro = msg => console.error(GH ? `::error::${msg}` : msg);

if (!TOKEN) { erro('Segredo IG_TOKEN não configurado (vazio). Confira em Settings > Secrets and variables > Actions.'); process.exit(1); }
aviso(`Segredo lido: ${TOKEN.length} caracteres, começa com ${TOKEN.slice(0, 4)}.`);

async function call(method, endpoint, params = {}) {
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const url = `${API}/${endpoint}`;
  const res = method === 'GET' ? await fetch(`${url}?${body}`) : await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (json.error) throw new Error(`${endpoint}: ${json.error.message} (código ${json.error.code})`);
  return json;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function esperar(id) {
  for (let i = 0; i < 40; i++) {  // vídeo demora mais para processar que foto
    const s = await call('GET', id, { fields: 'status_code' });
    if (s.status_code === 'FINISHED') return;
    if (['ERROR', 'EXPIRED'].includes(s.status_code)) throw new Error(`container ${id}: ${s.status_code}`);
    await sleep(6000);
  }
  throw new Error(`container ${id} não terminou de processar`);
}

// Confere o token em toda execução, mesmo sem nada para publicar, para o problema aparecer antes do horário do post.
let conta;
try { conta = await call('GET', 'me', { fields: 'username' }); }
catch (e) { erro(`Token recusado pelo Instagram: ${e.message}`); process.exit(1); }
aviso(`Token válido para @${conta.username}.`);

// Vigília: com ESPERA_MIN, o script fica acordado e confere a agenda a cada minuto, para publicar no minuto certo
// (o cron do GitHub atrasa horas). No fim da vigília, se ainda houver post marcado, ele chama a próxima rodada.
// ATRASO_MIN (PC local): só publica o que já passou desse tanto da hora, para não disputar com o GitHub.
const ESPERA_MIN = +(process.env.ESPERA_MIN || 0);
const ATRASO_MIN = +(process.env.ATRASO_MIN || 0);
const inicio = Date.now();
const feitos = new Set();

// lê a agenda publicada no site (sempre a mais nova); se o site falhar, usa a cópia do repositório
async function lerAgenda() {
  try {
    const r = await fetch(`${BASE}/ig/agenda.json?v=${Date.now()}`, { cache: 'no-store' });
    if (r.ok) return await r.json();
  } catch {}
  return JSON.parse(fs.readFileSync(path.join(raiz, 'public/ig/agenda.json'), 'utf8'));
}

const me = await call('GET', 'me', { fields: 'user_id,username' });
const id = me.user_id || me.id;

async function publicar(item) {
  const recentes = await call('GET', `${id}/media`, { fields: 'caption,permalink,timestamp', limit: '25' });
  const jaPostadas = new Set((recentes.data || []).map(m => (m.caption || '').split('\n')[0].trim()).filter(Boolean));
  const pasta = path.join(raiz, 'public/ig', item.slug);
  const legenda = (await (await fetch(`${BASE}/ig/${item.slug}/legenda-instagram.txt`)).text()).replace(/\r\n/g, '\n').trim();
  if (jaPostadas.has(legenda.split('\n')[0].trim())) { console.log(`${item.slug}: já publicado, pulando.`); return; }
  // Reel: a pasta tem um reel.mp4. Carrossel: 01.jpg, 02.mp4, 03.jpg... (fotos e vídeos na ordem do número).
  // A lista de arquivos vem do repositório; os arquivos em si são lidos do site.
  // post agendado depois que a vigília começou: atualiza a cópia do repositório para achar a pasta
  if (!fs.existsSync(pasta)) { try { execSync('git pull --ff-only -q', { cwd: raiz, stdio: 'ignore' }); } catch {} }
  const local = fs.existsSync(pasta) ? fs.readdirSync(pasta) : [];
  const reel = local.includes('reel.mp4');
  const itens = reel ? ['reel.mp4'] : local.filter(f => /^\d+\.(jpe?g|mp4)$/i.test(f)).sort();
  if (!reel && (itens.length < 2 || itens.length > 20)) throw new Error(`precisa de 2 a 20 itens (JPEG ou MP4), achei ${itens.length}`);
  const urls = itens.map(f => `${BASE}/ig/${item.slug}/${f}`);
  for (const u of urls) {
    const r = await fetch(u, { method: 'HEAD' });
    if (!r.ok) throw new Error(`arquivo fora do ar: ${u} (${r.status})`);
  }
  let criacao;
  if (reel) {
    criacao = (await call('POST', `${id}/media`, { media_type: 'REELS', video_url: urls[0], caption: legenda, share_to_feed: 'true' })).id;
  } else {
    const filhos = [];
    for (const u of urls) {
      const video = /\.mp4$/i.test(u);
      filhos.push((await call('POST', `${id}/media`, video ? { media_type: 'VIDEO', video_url: u, is_carousel_item: 'true' } : { image_url: u, is_carousel_item: 'true' })).id);
    }
    for (const f of filhos) await esperar(f);
    criacao = (await call('POST', `${id}/media`, { media_type: 'CAROUSEL', children: filhos.join(','), caption: legenda })).id;
  }
  await esperar(criacao);
  const pub = await call('POST', `${id}/media_publish`, { creation_id: criacao });
  const post = await call('GET', pub.id, { fields: 'permalink' });
  aviso(`${item.slug}: publicado em ${post.permalink}`);
}

let falhou = false, agenda = [];
while (true) {
  agenda = await lerAgenda();
  const agora = Date.now();
  const devidos = agenda.filter(i => {
    const t = Date.parse(i.quando);
    return !feitos.has(i.slug) && t + ATRASO_MIN * 60e3 <= agora && agora - t <= JANELA_H * 3600e3;
  });
  for (const item of devidos) {
    feitos.add(item.slug);
    // até 3 tentativas, para uma falha passageira da API não derrubar o post
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try { await publicar(item); break; }
      catch (e) {
        erro(`${item.slug}: tentativa ${tentativa} falhou: ${e.message}`);
        if (tentativa === 3) falhou = true; else await sleep(60e3);
      }
    }
  }
  const restante = ESPERA_MIN * 60e3 - (Date.now() - inicio);
  const proximo = agenda.map(i => Date.parse(i.quando)).filter(t => t > Date.now()).sort((a, b) => a - b)[0];
  if (restante <= 0 || !proximo) break;
  if (!devidos.length && Date.now() % (30 * 60e3) < 60e3) console.log(`Vigiando. Próximo post: ${new Date(proximo).toISOString()}.`);
  await sleep(Math.min(60e3, Math.max(5e3, proximo - Date.now())));
}

// encadeia a próxima vigília no GitHub enquanto houver post marcado para depois
const futuro = agenda.some(i => Date.parse(i.quando) > Date.now());
if (GH && ESPERA_MIN && futuro && process.env.GITHUB_TOKEN) {
  const r = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/workflows/instagram-agendado.yml/dispatches`, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json' },
    body: JSON.stringify({ ref: 'main' }),
  });
  if (r.ok) aviso('Próxima vigília chamada.'); else erro(`Não consegui chamar a próxima vigília (${r.status}).`);
}
if (!agenda.some(i => Date.parse(i.quando) > Date.now() - JANELA_H * 3600e3)) console.log('Nada para publicar agora.');
process.exit(falhou ? 1 : 0);
