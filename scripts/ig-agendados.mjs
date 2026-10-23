// Publica no Instagram da Move AI os carrosséis da agenda (public/ig/agenda.json) que já passaram do horário.
// Roda no GitHub Actions (.github/workflows/instagram-agendado.yml), sem depender de nenhum PC ligado.
//
// agenda.json: [{ "slug": "teste-do-eleitor", "quando": "2026-10-25T11:00:00-03:00" }, ...]
// As imagens (01.jpg, 02.jpg...) e a legenda-instagram.txt ficam em public/ig/<slug>/ e são servidas por www.moveai.tech.
// O token vem do segredo IG_TOKEN do repositório e nunca é impresso.
//
// Segurança contra post duplicado: antes de publicar, confere as legendas dos últimos 25 posts do perfil.
// Se a 1ª linha da legenda já foi publicada, pula. Por isso não precisa gravar nada de volta no repositório.
import fs from 'node:fs';
import path from 'node:path';

// Aceita o segredo colado com espaços, quebras de linha ou com o prefixo "IG_TOKEN=".
const TOKEN = (process.env.IG_TOKEN || "").trim().replace(/^IG_TOKENs*=s*/, "").replace(/^["']|["']$/g, "").trim();
const VER = process.env.IG_API_VERSION || 'v26.0';
const BASE = process.env.SITE_URL || 'https://www.moveai.tech';
const JANELA_H = 6; // só publica itens atrasados até 6 h (evita postar algo velho de surpresa)
const API = `https://graph.instagram.com/${VER}`;
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

if (!TOKEN) { console.error('Segredo IG_TOKEN não configurado (vazio). Confira em Settings > Secrets and variables > Actions.'); process.exit(1); }
console.log(`Segredo lido: ${TOKEN.length} caracteres, começa com ${TOKEN.slice(0, 4)}.`);

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
  for (let i = 0; i < 10; i++) {
    const s = await call('GET', id, { fields: 'status_code' });
    if (s.status_code === 'FINISHED') return;
    if (['ERROR', 'EXPIRED'].includes(s.status_code)) throw new Error(`container ${id}: ${s.status_code}`);
    await sleep(6000);
  }
  throw new Error(`container ${id} não terminou de processar`);
}

// Confere o token em toda execução, mesmo sem nada para publicar, para o problema aparecer antes do horário do post.
const conta = await call('GET', 'me', { fields: 'username' });
console.log(`Token válido para @${conta.username}.`);

const agenda = JSON.parse(fs.readFileSync(path.join(raiz, 'public/ig/agenda.json'), 'utf8'));
const agora = Date.now();
const devidos = agenda.filter(i => {
  const t = Date.parse(i.quando);
  return t <= agora && agora - t <= JANELA_H * 3600e3;
});
if (!devidos.length) { console.log('Nada para publicar agora.'); process.exit(0); }

const me = await call('GET', 'me', { fields: 'user_id,username' });
const id = me.user_id || me.id;
const recentes = await call('GET', `${id}/media`, { fields: 'caption,permalink,timestamp', limit: '25' });
const jaPostadas = new Set((recentes.data || []).map(m => (m.caption || '').split('\n')[0].trim()).filter(Boolean));

let falhou = false;
for (const item of devidos) {
  try {
    const pasta = path.join(raiz, 'public/ig', item.slug);
    const legenda = fs.readFileSync(path.join(pasta, 'legenda-instagram.txt'), 'utf8').replace(/\r\n/g, '\n').trim();
    if (jaPostadas.has(legenda.split('\n')[0].trim())) { console.log(`${item.slug}: já publicado, pulando.`); continue; }
    const fotos = fs.readdirSync(pasta).filter(f => /^\d+\.jpe?g$/i.test(f)).sort();
    if (fotos.length < 2 || fotos.length > 20) throw new Error(`precisa de 2 a 20 JPEGs, achei ${fotos.length}`);
    const urls = fotos.map(f => `${BASE}/ig/${item.slug}/${f}`);
    for (const u of urls) {
      const r = await fetch(u, { method: 'HEAD' });
      if (!r.ok) throw new Error(`imagem fora do ar: ${u} (${r.status})`);
    }
    const filhos = [];
    for (const u of urls) filhos.push((await call('POST', `${id}/media`, { image_url: u, is_carousel_item: 'true' })).id);
    for (const f of filhos) await esperar(f);
    const car = await call('POST', `${id}/media`, { media_type: 'CAROUSEL', children: filhos.join(','), caption: legenda });
    await esperar(car.id);
    const pub = await call('POST', `${id}/media_publish`, { creation_id: car.id });
    const post = await call('GET', pub.id, { fields: 'permalink' });
    console.log(`${item.slug}: publicado em ${post.permalink}`);
  } catch (e) {
    falhou = true;
    console.error(`${item.slug}: ERRO ${e.message}`);
  }
}
process.exit(falhou ? 1 : 0);
