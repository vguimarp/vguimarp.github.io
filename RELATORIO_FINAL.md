# Relatório final — Utiliza BR

Data: 13 de outubro de 2026

## Veredito

**Primeira entrega concluída e publicada.** O portal tem 27 ferramentas funcionais, acima da faixa de 20 a 30 prevista para a primeira entrega. A meta total de 120 ferramentas **não está concluída**: existe uma matriz de 120 candidatas, mas 93 ainda estão em estado de candidata e não são anunciadas no site.

Classificação do produto: portal gratuito autocontido, publicado e utilizável sem assistência. Monetização está preparada visualmente, mas não ativada.

## Projeto e publicação

- Nome: Utiliza BR
- Repositório: https://github.com/vguimarp/vguimarp.github.io
- Produção: https://vguimarp.github.io/
- Arquitetura: HTML/CSS/JavaScript estático, ES modules, build em Node.js, hospedagem GitHub Pages
- Banco de dados: nenhum
- APIs externas: nenhuma nas ferramentas publicadas
- Custo operacional conhecido: R$ 0 na hospedagem GitHub Pages pública, sujeito aos limites e termos do GitHub
- Backup recuperado: `docs/backup-original-2026-10-10.zip`

## Ferramentas publicadas (27)

1. Calculadora de porcentagem
2. Calculadora de desconto
3. Variação percentual
4. Regra de três
5. Juros simples
6. Juros compostos
7. Simulador de parcelas Price
8. Custo de combustível
9. Calculadora de idade
10. Dias entre datas
11. Calculadora de IMC adulto
12. Contador de palavras
13. Maiúsculas e minúsculas
14. Remover espaços extras
15. Ordenar linhas
16. Comparar textos
17. Gerador de senha segura
18. Conversor de comprimento
19. Conversor de massa
20. Conversor de temperatura
21. Conversor de área
22. Conversor de volume
23. Conversor de tempo
24. Formatador e validador JSON
25. Codificador Base64
26. Codificador de URL
27. Gerador de UUID

## Evidências de teste

- `npm run check`: aprovado
- Testes unitários: 10/10 aprovados
- Build: 27 ferramentas e 32 URLs indexáveis
- Verificação estática: 27/27 páginas com title, canonical, JSON-LD e formulário
- E2E local: aprovado em desktop e em viewport iPhone 13
- E2E em produção: aprovado em `https://vguimarp.github.io/`
- Fluxos E2E: busca, navegação, resultado correto, erro de entrada, 27 rotas, responsividade e ausência de overflow horizontal
- Acessibilidade: axe-core WCAG 2 A/AA sem violações nas páginas testadas (home e ferramenta)
- Dependências: `npm audit --audit-level=high` encontrou 0 vulnerabilidades
- Referência independente: exemplo de juros compostos de R$ 1.000 a 5% por 6 meses confere com R$ 1.340,10, conforme material de educação financeira do Banco Central
- Limitação de teste: o controle do navegador visível estava sem a extensão conectada; o E2E foi executado com Chromium isolado do Playwright. A URL pública e os fluxos foram efetivamente testados.

## SEO

Concluído:

- uma URL descritiva por ferramenta;
- title e meta description individuais;
- canonical e Open Graph;
- sitemap.xml e robots.txt;
- dados estruturados `WebSite` e `WebApplication`;
- breadcrumbs e links relacionados;
- conteúdo de uso e limitações em cada ferramenta;
- HTML responsivo sem dependências de terceiros no carregamento.

Pendente:

- conectar Google Search Console, pois exige confirmação da conta/propriedade;
- domínio próprio, opcional e não comprado;
- pesquisa de palavras-chave e concorrência com métricas verificadas;
- medir Core Web Vitals com tráfego real.

## Monetização

Parcial:

- espaços discretos reservados para anúncios futuros;
- política de privacidade e termos publicados;
- nenhuma publicidade falsa, rastreamento ou cookie ativado.

Bloqueado por dados do proprietário:

- definir e publicar o e-mail verdadeiro na página de contato;
- solicitar e obter aprovação real do Google AdSense;
- inserir identificadores de anúncios somente após aprovação;
- decidir sobre domínio próprio, sem necessidade técnica imediata.

## Administração e retomada

```bash
git clone https://github.com/vguimarp/vguimarp.github.io.git
cd vguimarp.github.io
npm ci
npm run check
npm run serve
```

Arquivos principais:

- `data/tools.js`: ferramentas publicadas e campos da interface;
- `lib/calculations.js`: regras, validações e cálculos;
- `scripts/build.mjs`: geração das páginas e SEO;
- `scripts/e2e.mjs`: validação de interface local ou pública;
- `docs/catalogo-120.csv`: matriz de 120 candidatas;
- `.github/workflows/deploy-pages.yml`: teste, build e publicação automática.

Para adicionar uma ferramenta: cadastrar seus metadados e campos em `data/tools.js`, implementar a função com o mesmo slug em `lib/calculations.js`, adicionar casos válidos e inválidos em `tests/calculations.test.mjs`, executar `npm run check` e `npm run test:e2e`. Um push na branch `main` publica automaticamente após os testes do workflow.

## Decisões técnicas e fontes

- O MVP estático recuperado foi preservado e evoluído porque já fornecia 12 ferramentas locais e não exigia backend.
- Não foram incorporados projetos ou bibliotecas de concorrentes.
- Operações locais foram priorizadas para privacidade, desempenho e custo zero.
- As simulações financeiras deixam explícito que não incluem impostos, seguros, tarifas ou CET.
- Fonte financeira: Banco Central, Calculadora do Cidadão e Caderno de Educação Financeira — https://www.bcb.gov.br/calculadora/ e https://www.bcb.gov.br/pre/pef/port/caderno_cidadania_financeira.pdf
- Fonte de IMC adulto e limitações: Ministério da Saúde — https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sobrepeso-e-obesidade-em-adultos

## Próxima ação para avançar até 120

Implementar a segunda entrega até 60 ferramentas, começando pelas operações locais de menor risco da matriz: remover duplicadas, inverter texto, extratores, CSV/JSON, hashes via Web Crypto, conversores restantes, sorteios e utilitários de data. Depois, introduzir PDF e imagens em lotes menores, com auditoria de licença, testes com arquivos reais e limites de tamanho. Calculadoras CLT, tributárias e de indicadores devem aguardar regras e fontes oficiais datadas, testes independentes e revisão do aviso legal.

Antes de promover monetização, substituir `[E-MAIL DO RESPONSÁVEL]` na página de contato por um canal verdadeiro e concluir a verificação de propriedade no Search Console e no AdSense.
