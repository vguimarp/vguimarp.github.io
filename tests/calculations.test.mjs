import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, calculators } from '../lib/calculations.js';

test('todas as ferramentas publicadas têm cálculo', async () => {
  const { tools } = await import('../data/tools.js');
  assert.equal(tools.length, 27);
  for (const tool of tools) assert.equal(typeof calculators[tool.slug], 'function', tool.slug);
});

test('porcentagem, desconto e variação percentual', () => {
  assert.match(calculate('porcentagem',{valor:200,taxa:15}), /30/);
  assert.match(calculate('desconto',{preco:100,desconto:20}), /80,00/);
  assert.match(calculate('variacao-percentual',{inicial:100,final:120}), /20%/);
  assert.throws(()=>calculate('variacao-percentual',{inicial:0,final:10}),/não pode ser zero/);
});

test('juros compostos confere com exemplo independente do BCB', () => {
  const result = calculate('juros-compostos',{capital:1000,taxa:5,meses:6});
  assert.match(result,/1\.340,10/);
});

test('Price sem juros divide o principal', () => {
  const result = calculate('parcelas',{valor:1200,taxa:0,meses:12});
  assert.match(result,/100,00/);
});

test('combustível valida divisão por zero', () => {
  assert.match(calculate('combustivel',{km:300,consumo:12,litro:6}),/150,00/);
  assert.throws(()=>calculate('combustivel',{km:300,consumo:0,litro:6}),/maior que zero/);
});

test('idade e diferença de datas são determinísticas', () => {
  assert.equal(calculate('idade',{nascimento:'2000-01-10',referencia:'2026-03-15'}),'26 anos, 2 meses e 5 dias.');
  assert.match(calculate('dias-entre-datas',{inicio:'2026-01-01',fim:'2026-01-31'}),/^30 dias/);
});

test('IMC usa peso dividido pela altura ao quadrado', () => {
  assert.match(calculate('imc',{peso:90,altura:170}),/31,14/);
});

test('texto, JSON e URLs tratam sucesso e erro', () => {
  assert.match(calculate('palavras',{texto:'olá mundo\nsegunda linha'}),/Palavras: 4/);
  assert.equal(calculate('remover-espacos',{texto:'  a   b  '}),'a b');
  assert.equal(calculate('url',{texto:'a b&c',modo:'encode'}),'a%20b%26c');
  assert.equal(calculate('json',{texto:'{"b":2}',modo:'min'}),'{"b":2}');
  assert.throws(()=>calculate('json',{texto:'{',modo:'format'}),/JSON inválido/);
});

test('conversores usam fatores exatos conhecidos', () => {
  assert.match(calculate('comprimento',{valor:1,origem:'km',destino:'m'}),/^1\.000 m$/);
  assert.match(calculate('massa',{valor:1,origem:'lb',destino:'kg'}),/^0,45359237 kg$/);
  assert.match(calculate('temperatura',{valor:32,origem:'f',destino:'c'}),/^0 °C$/);
  assert.match(calculate('area',{valor:1,origem:'ha',destino:'m2'}),/^10\.000 m2$/);
  assert.match(calculate('volume',{valor:1,origem:'m3',destino:'l'}),/^1\.000 l$/);
  assert.match(calculate('tempo',{valor:1,origem:'d',destino:'h'}),/^24 h$/);
});

test('senha e UUID usam aleatoriedade criptográfica', () => {
  const password = calculate('senha',{tamanho:16,simbolos:'sim'});
  assert.equal(password.length,16);
  assert.match(calculate('uuid',{}),/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});
