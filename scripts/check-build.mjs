import { access, readFile } from 'node:fs/promises';
import { tools } from '../data/tools.js';

const failures = [];
for (const tool of tools) {
  const path = new URL(`../dist/ferramentas/${tool.slug}/index.html`, import.meta.url);
  try {
    await access(path);
    const html = await readFile(path,'utf8');
    for (const required of ['<title>','rel="canonical"','application/ld+json','id="tool-form"']) if (!html.includes(required)) failures.push(`${tool.slug}: ausente ${required}`);
  } catch { failures.push(`${tool.slug}: página ausente`); }
}
for (const file of ['index.html','sitemap.xml','robots.txt','_headers']) {
  try { await access(new URL(`../dist/${file}`,import.meta.url)); } catch { failures.push(`${file}: ausente`); }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Verificação estática aprovada: ${tools.length} páginas de ferramentas.`);
