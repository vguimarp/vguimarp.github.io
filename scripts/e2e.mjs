import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { tools } from '../data/tools.js';

const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const errors = [];
await mkdir('test-results',{recursive:true});

try {
  const desktop = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await desktop.newPage();
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  const homeA11y = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  if (homeA11y.violations.length) throw new Error(`Acessibilidade home: ${homeA11y.violations.map(item=>item.id).join(', ')}`);
  if (await page.locator('.tool-card').count() !== tools.length) throw new Error('Quantidade incorreta de cards na home.');
  await page.getByLabel('Buscar ferramenta').fill('temperatura');
  if (await page.locator('.tool-card:visible').count() !== 1) throw new Error('Busca não filtrou para um resultado.');
  await page.getByRole('link',{name:/Abrir ferramenta/}).click();
  await page.getByLabel('Temperatura').fill('32');
  await page.locator('#field-origem').selectOption('f');
  await page.locator('#field-destino').selectOption('c');
  await page.getByRole('button',{name:/Calcular/}).click();
  if (!/^0 °C$/.test(await page.locator('#result').innerText())) throw new Error('Conversão de temperatura incorreta.');

  await page.goto(`${base}/ferramentas/json/`);
  await page.getByLabel('JSON').fill('{');
  await page.getByRole('button',{name:/Calcular/}).click();
  if (!/JSON inválido/.test(await page.locator('#result').innerText())) throw new Error('Erro de JSON não foi exibido.');
  const toolA11y = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  if (toolA11y.violations.length) throw new Error(`Acessibilidade ferramenta: ${toolA11y.violations.flatMap(item=>item.nodes.map(node=>`${item.id} ${node.target.join(' ')}`)).join(', ')}`);

  for (const tool of tools) {
    const response = await page.goto(`${base}/ferramentas/${tool.slug}/`);
    if (!response?.ok()) throw new Error(`${tool.slug} retornou HTTP ${response?.status()}.`);
    if (await page.locator('h1').innerText() !== tool.name) throw new Error(`${tool.slug} exibiu título incorreto.`);
    if (await page.locator('form#tool-form button').count() !== 1) throw new Error(`${tool.slug} sem ação principal.`);
  }
  await desktop.close();

  const mobile = await browser.newContext({...devices['iPhone 13']});
  const mobilePage = await mobile.newPage();
  mobilePage.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await mobilePage.goto(`${base}/ferramentas/juros-compostos/`,{waitUntil:'networkidle'});
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error('Página móvel tem rolagem horizontal.');
  await mobilePage.getByLabel('Capital inicial (R$)').fill('1000');
  await mobilePage.getByLabel('Taxa ao mês (%)').fill('5');
  await mobilePage.getByLabel('Meses').fill('6');
  await mobilePage.getByRole('button',{name:/Calcular/}).click();
  if (!/1\.340,10/.test(await mobilePage.locator('#result').innerText())) throw new Error('Fluxo financeiro móvel falhou.');
  await mobilePage.screenshot({path:'test-results/mobile-juros-compostos.png',fullPage:true});
  await mobile.close();
  if (errors.length) throw new Error(`Erros de console: ${errors.join(' | ')}`);
  console.log(`E2E aprovado: busca, sucesso, erro, ${tools.length} rotas e viewport móvel.`);
} finally {
  await browser.close();
}
