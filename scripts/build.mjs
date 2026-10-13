import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tools } from '../data/tools.js';

const dist = new URL('../dist/', import.meta.url);
const origin = process.env.SITE_URL || 'https://utiliza-br.pages.dev';
await rm(dist, { recursive:true, force:true });
await mkdir(dist, { recursive:true });
for (const file of ['app.js','style.css']) await cp(new URL(`../${file}`, import.meta.url), new URL(file, dist));
await mkdir(new URL('data/', dist)); await mkdir(new URL('lib/', dist));
await cp(new URL('../data/tools.js', import.meta.url), new URL('data/tools.js', dist));
await cp(new URL('../lib/calculations.js', import.meta.url), new URL('lib/calculations.js', dist));

const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const shell = ({ title, description, canonical, body, schema = '' }) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#155eef"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><link rel="stylesheet" href="/style.css">${schema}</head><body><header class="site-header"><div class="wrap top"><a class="brand" href="/"><span class="logo">U</span><span>Utiliza<span class="accent">BR</span></span></a><nav aria-label="Principal"><a href="/#ferramentas">Ferramentas</a><a href="/sobre/">Sobre</a><a href="/contato/">Contato</a></nav></div></header>${body}<footer class="site-footer"><div class="wrap foot"><span>© <span id="year"></span> Utiliza BR</span><div class="footer-links"><a href="/privacidade/">Privacidade</a><a href="/termos/">Termos</a><a href="/contato/">Contato</a></div></div></footer><script type="module" src="/app.js"></script></body></html>`;

const homeSchema = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'Utiliza BR',url:origin,potentialAction:{'@type':'SearchAction',target:`${origin}/?q={search_term_string}`,'query-input':'required name=search_term_string'}})}</script>`;
const home = shell({ title:'Utiliza BR — ferramentas online grátis', description:`${tools.length} calculadoras, conversores e utilitários gratuitos em português. Sem cadastro e com processamento local.`, canonical:`${origin}/`, schema:homeSchema, body:`<main><section class="hero wrap"><div class="eyebrow">Grátis · sem cadastro · privacidade por padrão</div><h1>Ferramentas úteis.<br><span class="accent">Resultado em segundos.</span></h1><p class="lead">Calculadoras, conversores e utilitários para trabalho e dia a dia. As ferramentas funcionam diretamente no navegador.</p><a class="cta" href="#ferramentas">Explorar ferramentas</a></section><section id="ferramentas" class="wrap"><div class="section-head"><div><h2>Ferramentas gratuitas</h2><p>Busque pelo que você precisa.</p></div><span class="count">${tools.length} disponíveis</span></div><label class="search-label" for="search">Buscar ferramenta</label><input id="search" class="search" type="search" placeholder="Ex.: desconto, JSON, temperatura" autocomplete="off"><div id="cards" class="cards"></div><p id="empty-search" class="empty" hidden>Nenhuma ferramenta encontrada.</p></section></main>` });
await writeFile(new URL('index.html', dist), home);

for (const tool of tools) {
  const directory = new URL(`ferramentas/${tool.slug}/`, dist);
  await mkdir(directory, { recursive:true });
  const url = `${origin}/ferramentas/${tool.slug}/`;
  const schema = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:tool.name,description:tool.summary,applicationCategory:'UtilitiesApplication',operatingSystem:'Web',offers:{'@type':'Offer',price:'0',priceCurrency:'BRL'},url})}</script>`;
  const related = tools.filter(item => item.category === tool.category && item.slug !== tool.slug).slice(0,3);
  const body = `<main id="tool-root" class="tool-page wrap" data-tool="${tool.slug}"><div class="breadcrumbs"><a href="/">Início</a> / <a href="/#ferramentas">${tool.category}</a> / ${tool.name}</div><div class="tool-layout"><article class="panel"><div class="work-head"><span class="tool-icon" aria-hidden="true">${tool.icon}</span><div><h1>${tool.name}</h1><p>${tool.summary}</p></div></div><form id="tool-form" novalidate></form><div id="result" class="result" tabindex="-1" aria-live="polite" hidden></div><p class="explanation">${tool.example}</p></article><aside class="content-card"><h2>Como usar</h2><ol><li>Preencha os campos solicitados.</li><li>Selecione a operação quando houver opções.</li><li>Confira o resultado exibido nesta página.</li></ol><p>O processamento ocorre no navegador. Não armazenamos os valores informados.</p>${related.length ? `<h2>Relacionadas</h2><ul>${related.map(item=>`<li><a href="/ferramentas/${item.slug}/">${item.name}</a></li>`).join('')}</ul>` : ''}<div class="ad-slot" aria-label="Espaço reservado para publicidade futura">Espaço preparado para publicidade futura</div></aside></div></main>`;
  await writeFile(new URL('index.html', directory), shell({ title:`${tool.name} grátis | Utiliza BR`, description:tool.summary, canonical:url, schema, body }));
}

const pages = {
  sobre:['Sobre o Utiliza BR','O Utiliza BR é um portal brasileiro independente de ferramentas gratuitas. O objetivo é resolver tarefas comuns com rapidez, sem cadastro e com processamento local sempre que possível.'],
  privacidade:['Política de privacidade','As ferramentas processam os dados inseridos no próprio navegador e não enviam esses dados a um servidor do portal. Nesta versão não há conta, cookies de publicidade ou análise de comportamento. Se isso mudar, esta política será atualizada antes da ativação.'],
  termos:['Termos de uso','As ferramentas são oferecidas gratuitamente para fins informativos. Resultados financeiros e de saúde são simulações e não substituem orientação profissional. O usuário deve conferir dados e condições reais antes de tomar decisões.'],
  contato:['Contato','O canal de contato do responsável ainda precisa ser definido antes da divulgação comercial. Campo pendente: [E-MAIL DO RESPONSÁVEL].']
};
for (const [slug,[heading,text]] of Object.entries(pages)) {
  const directory = new URL(`${slug}/`, dist); await mkdir(directory,{recursive:true});
  await writeFile(new URL('index.html', directory), shell({title:`${heading} | Utiliza BR`,description:text.slice(0,155),canonical:`${origin}/${slug}/`,body:`<main class="institutional wrap"><article class="content-card"><h1>${heading}</h1><p>${text}</p></article></main>`}));
}

const urls = ['/',...tools.map(tool=>`/ferramentas/${tool.slug}/`),...Object.keys(pages).map(page=>`/${page}/`)];
await writeFile(new URL('sitemap.xml',dist),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path=>`<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`);
await writeFile(new URL('robots.txt',dist),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(new URL('_headers',dist),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'\n`);
console.log(`Build concluído: ${tools.length} ferramentas, ${urls.length} URLs indexáveis.`);
