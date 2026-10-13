import { writeFile } from 'node:fs/promises';
import { categories } from '../data/catalog.mjs';
import { tools } from '../data/tools.js';

const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const implemented = new Set(tools.map(tool=>normalize(tool.name)));
const localCategories = new Set(['Texto e produtividade','Imagens','Desenvolvimento','Conversores e utilidades']);
const headers = ['id','nome','categoria','finalidade','publico_alvo','intencao_de_busca','concorrencia_estimada','complexidade_tecnica','dependencias','execucao_local','api_externa','fonte_de_dados','potencial_monetizacao','prioridade','estado','resultado_testes'];
const rows = [];
let id = 1;
for (const [category,names] of Object.entries(categories)) for (const name of names) {
  const done = implemented.has(normalize(name)) || tools.some(tool=>normalize(name).includes(normalize(tool.name)) || normalize(tool.name).includes(normalize(name)));
  const local = localCategories.has(category) || !/(INSS|Imposto|FGTS|salário|Férias|Rescisão|Adicional)/i.test(name);
  const complexity = /PDF|imagem|CLT|INSS|Imposto|QR Code/i.test(name) ? 'alta' : /conversor|calculadora|formatador/i.test(name) ? 'média' : 'baixa';
  rows.push([id++,name,category,`Resolver a tarefa: ${name.toLowerCase()}`,'Usuários brasileiros',`Usar ${name.toLowerCase()} online`,'não verificada',complexity,complexity==='alta'?'a selecionar e auditar':'nenhuma','sim',local?'não':'possivelmente','Entrada do usuário ou fonte oficial a definir','a validar',done?'P0':'P1/P2',done?'implementada':'candidata',done?'unitário e build':'não executado']);
}
const quote = value => `"${String(value).replaceAll('"','""')}"`;
await writeFile(new URL('../docs/catalogo-120.csv',import.meta.url),[headers,...rows].map(row=>row.map(quote).join(',')).join('\n')+'\n');
console.log(`Catálogo gerado: ${rows.length} candidatas.`);
