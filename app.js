import { tools, toolBySlug } from './data/tools.js';
import { calculate } from './lib/calculations.js';

const $ = id => document.getElementById(id);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function card(tool) {
  const article = document.createElement('article');
  article.className = 'tool-card';
  article.dataset.search = normalize(`${tool.name} ${tool.summary} ${tool.category}`);
  article.innerHTML = `<span class="tool-icon" aria-hidden="true">${tool.icon}</span><div><span class="tag">${tool.category}</span><h3>${tool.name}</h3><p>${tool.summary}</p><a href="/ferramentas/${tool.slug}/">Abrir ferramenta <span aria-hidden="true">→</span></a></div>`;
  return article;
}

function renderHome() {
  const cards = $('cards');
  if (!cards) return;
  tools.forEach(tool => cards.append(card(tool)));
  const search = $('search');
  const empty = $('empty-search');
  search?.addEventListener('input', () => {
    let visible = 0;
    for (const item of cards.children) {
      const match = item.dataset.search.includes(normalize(search.value));
      item.hidden = !match;
      if (match) visible += 1;
    }
    empty.hidden = visible > 0;
  });
}

function inputFor(field) {
  let input;
  if (field.type === 'select') {
    input = document.createElement('select');
    for (const [value, label] of field.options) input.add(new Option(label, value));
  } else if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 6;
    input.placeholder = field.placeholder || '';
  } else {
    input = document.createElement('input');
    input.type = field.type;
    if (field.type === 'number') input.step = 'any';
  }
  input.id = `field-${field.id}`;
  input.name = field.id;
  input.required = !field.optional;
  return input;
}

function renderTool() {
  const root = $('tool-root');
  if (!root) return;
  const tool = toolBySlug(root.dataset.tool);
  if (!tool) return;
  const form = $('tool-form');
  const fields = document.createElement('div');
  fields.className = 'fields';
  for (const field of tool.fields) {
    const label = document.createElement('label');
    if (field.type === 'textarea') label.className = 'full';
    const labelText = document.createElement('span');
    labelText.textContent = `${field.label}${field.optional ? ' (opcional)' : ''}`;
    label.append(labelText, inputFor(field));
    fields.append(label);
  }
  const button = document.createElement('button');
  button.className = 'primary';
  button.type = 'submit';
  button.textContent = tool.slug === 'uuid' ? 'Gerar UUID' : 'Calcular / converter';
  form.append(fields, button);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = $('result');
    try {
      const values = Object.fromEntries(new FormData(form));
      result.textContent = calculate(tool.slug, values);
      result.className = 'result success';
    } catch (error) {
      result.textContent = error instanceof Error ? error.message : 'Não foi possível concluir.';
      result.className = 'result error';
    }
    result.hidden = false;
    result.focus();
  });
}

renderHome();
renderTool();
const year = $('year');
if (year) year.textContent = String(new Date().getFullYear());
