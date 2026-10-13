const finite = (value, label = 'valor') => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Informe ${label} válido.`);
  return number;
};

const positive = (value, label) => {
  const number = finite(value, label);
  if (number <= 0) throw new Error(`${label} deve ser maior que zero.`);
  return number;
};

const nonNegative = (value, label) => {
  const number = finite(value, label);
  if (number < 0) throw new Error(`${label} não pode ser negativo.`);
  return number;
};

const integer = (value, label, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const number = finite(value, label);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${label} deve ser um número inteiro entre ${min} e ${max}.`);
  }
  return number;
};

const dateAtNoon = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Informe uma data válida.');
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error('Informe uma data válida.');
  return date;
};

export const money = number => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
export const formatNumber = (number, digits = 2) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(number);

export const calculators = {
  porcentagem: ({ valor, taxa }) => {
    const base = finite(valor, 'valor');
    const percent = finite(taxa, 'porcentagem');
    return `${formatNumber(base * percent / 100)} corresponde a ${formatNumber(percent)}% de ${formatNumber(base)}.`;
  },
  desconto: ({ preco, desconto }) => {
    const price = nonNegative(preco, 'Preço');
    const rate = finite(desconto, 'desconto');
    if (rate < 0 || rate > 100) throw new Error('O desconto deve estar entre 0% e 100%.');
    return `Preço final: ${money(price * (1 - rate / 100))}\nEconomia: ${money(price * rate / 100)}`;
  },
  'variacao-percentual': ({ inicial, final }) => {
    const start = finite(inicial, 'valor inicial');
    const end = finite(final, 'valor final');
    if (start === 0) throw new Error('O valor inicial não pode ser zero.');
    const result = (end - start) / Math.abs(start) * 100;
    return `Variação: ${formatNumber(result)}% (${result >= 0 ? 'aumento' : 'redução'}).`;
  },
  'regra-de-tres': ({ a, b, c }) => {
    const first = finite(a, 'primeiro valor');
    if (first === 0) throw new Error('O primeiro valor não pode ser zero.');
    return `Resultado: ${formatNumber(finite(b, 'segundo valor') * finite(c, 'terceiro valor') / first, 6)}`;
  },
  'juros-simples': ({ capital, taxa, meses }) => {
    const principal = nonNegative(capital, 'Capital');
    const rate = nonNegative(taxa, 'Taxa');
    const periods = integer(meses, 'Meses', 0, 1200);
    const interest = principal * rate / 100 * periods;
    return `Montante: ${money(principal + interest)}\nJuros: ${money(interest)}\nFórmula: M = C × (1 + i × n).`;
  },
  'juros-compostos': ({ capital, taxa, meses }) => {
    const principal = nonNegative(capital, 'Capital');
    const rate = nonNegative(taxa, 'Taxa');
    const periods = integer(meses, 'Meses', 0, 1200);
    const total = principal * (1 + rate / 100) ** periods;
    return `Montante: ${money(total)}\nJuros: ${money(total - principal)}\nFórmula: M = C × (1 + i)ⁿ.`;
  },
  parcelas: ({ valor, taxa, meses }) => {
    const principal = nonNegative(valor, 'Valor financiado');
    const rate = nonNegative(taxa, 'Taxa') / 100;
    const periods = integer(meses, 'Parcelas', 1, 600);
    const installment = rate === 0 ? principal / periods : principal * rate / (1 - (1 + rate) ** -periods);
    return `Parcela aproximada: ${money(installment)}\nTotal pago: ${money(installment * periods)}\nJuros totais: ${money(installment * periods - principal)}\nNão inclui IOF, seguros ou tarifas.`;
  },
  combustivel: ({ km, consumo, litro }) => {
    const distance = nonNegative(km, 'Distância');
    const efficiency = positive(consumo, 'Consumo');
    const price = nonNegative(litro, 'Preço do litro');
    return `Combustível necessário: ${formatNumber(distance / efficiency)} litros\nCusto estimado: ${money(distance / efficiency * price)}`;
  },
  idade: ({ nascimento, referencia }) => {
    const birth = dateAtNoon(nascimento);
    const today = referencia ? dateAtNoon(referencia) : new Date();
    if (birth > today) throw new Error('A data de nascimento não pode estar no futuro.');
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) { months -= 1; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years -= 1; months += 12; }
    return `${years} anos, ${months} meses e ${days} dias.`;
  },
  'dias-entre-datas': ({ inicio, fim }) => {
    const start = dateAtNoon(inicio);
    const end = dateAtNoon(fim);
    return `${formatNumber(Math.abs(Math.round((end - start) / 86400000)), 0)} dias de diferença.`;
  },
  imc: ({ peso, altura }) => {
    const bmi = positive(peso, 'Peso') / (positive(altura, 'Altura') / 100) ** 2;
    const classification = bmi < 18.5 ? 'abaixo do peso' : bmi < 25 ? 'faixa adequada' : bmi < 30 ? 'sobrepeso' : bmi < 35 ? 'obesidade grau I' : bmi < 40 ? 'obesidade grau II' : 'obesidade grau III';
    return `IMC: ${formatNumber(bmi)} — ${classification}.\nTriagem para adultos; não é diagnóstico.`;
  },
  palavras: ({ texto = '' }) => {
    const trimmed = texto.trim();
    return `Palavras: ${trimmed ? trimmed.split(/\s+/u).length : 0}\nCaracteres: ${texto.length}\nCaracteres sem espaços: ${texto.replace(/\s/gu, '').length}\nLinhas: ${texto ? texto.split(/\r\n|\n|\r/u).length : 0}`;
  },
  'transformar-texto': ({ texto = '', modo }) => modo === 'upper' ? texto.toLocaleUpperCase('pt-BR') : modo === 'lower' ? texto.toLocaleLowerCase('pt-BR') : texto.toLocaleLowerCase('pt-BR').replace(/(^|\s)\p{L}/gu, match => match.toLocaleUpperCase('pt-BR')),
  'remover-espacos': ({ texto = '' }) => texto.replace(/[ \t]+/gu, ' ').replace(/ *\n */gu, '\n').trim(),
  'ordenar-linhas': ({ texto = '', ordem }) => texto.split(/\r?\n/u).filter(line => line.trim()).sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }) * (ordem === 'desc' ? -1 : 1)).join('\n'),
  'comparar-textos': ({ textoA = '', textoB = '' }) => textoA === textoB ? 'Os textos são idênticos.' : `Os textos são diferentes.\nTamanho A: ${textoA.length}\nTamanho B: ${textoB.length}`,
  senha: ({ tamanho, simbolos }) => {
    const length = integer(tamanho, 'Tamanho', 12, 64);
    const chars = `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789${simbolos === 'sim' ? '!@#$%&*?-_' : ''}`;
    const values = new Uint32Array(length);
    globalThis.crypto.getRandomValues(values);
    return Array.from(values, value => chars[value % chars.length]).join('');
  },
  comprimento: ({ valor, origem, destino }) => convert(valor, origem, destino, { mm: .001, cm: .01, m: 1, km: 1000, in: .0254, ft: .3048 }),
  massa: ({ valor, origem, destino }) => convert(valor, origem, destino, { mg: .000001, g: .001, kg: 1, t: 1000, lb: .45359237 }),
  temperatura: ({ valor, origem, destino }) => {
    const value = finite(valor, 'valor');
    const celsius = origem === 'c' ? value : origem === 'f' ? (value - 32) * 5 / 9 : value - 273.15;
    const result = destino === 'c' ? celsius : destino === 'f' ? celsius * 9 / 5 + 32 : celsius + 273.15;
    if (result < (destino === 'k' ? 0 : destino === 'c' ? -273.15 : -459.67)) throw new Error('Temperatura abaixo do zero absoluto.');
    return `${formatNumber(result, 6)} °${destino.toUpperCase()}`;
  },
  area: ({ valor, origem, destino }) => convert(valor, origem, destino, { cm2: .0001, m2: 1, ha: 10000, km2: 1000000 }),
  volume: ({ valor, origem, destino }) => convert(valor, origem, destino, { ml: .001, l: 1, m3: 1000 }),
  tempo: ({ valor, origem, destino }) => convert(valor, origem, destino, { s: 1, min: 60, h: 3600, d: 86400 }),
  json: ({ texto = '', modo }) => {
    let parsed;
    try { parsed = JSON.parse(texto); } catch (error) { throw new Error(`JSON inválido: ${error.message}`); }
    return modo === 'min' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
  },
  base64: ({ texto = '', modo }) => {
    try {
      return modo === 'encode' ? btoa(unescape(encodeURIComponent(texto))) : decodeURIComponent(escape(atob(texto)));
    } catch { throw new Error('Conteúdo Base64 inválido.'); }
  },
  url: ({ texto = '', modo }) => {
    try { return modo === 'encode' ? encodeURIComponent(texto) : decodeURIComponent(texto); }
    catch { throw new Error('Texto codificado inválido.'); }
  },
  uuid: () => globalThis.crypto.randomUUID()
};

function convert(value, from, to, scales) {
  const number = finite(value, 'valor');
  if (!(from in scales) || !(to in scales)) throw new Error('Unidade inválida.');
  return `${formatNumber(number * scales[from] / scales[to], 8)} ${to}`;
}

export function calculate(slug, values) {
  const calculator = calculators[slug];
  if (!calculator) throw new Error('Ferramenta não encontrada.');
  return calculator(values);
}
