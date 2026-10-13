# Utiliza BR

Portal brasileiro estático com 27 ferramentas gratuitas que executam no navegador. Não exige cadastro, banco de dados ou APIs externas.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm test
npm run build
npm run serve
```

O build publicável é criado em `dist/`. Defina `SITE_URL=https://seu-dominio` durante o build para gerar canonical, sitemap e robots com o domínio definitivo.

## Arquitetura

- `data/tools.js`: catálogo das ferramentas publicadas e campos da interface.
- `lib/calculations.js`: regras puras, validações e cálculos.
- `scripts/build.mjs`: páginas individuais, metadados, sitemap e cabeçalhos.
- `tests/`: testes determinísticos das regras.
- `docs/catalogo-120.csv`: matriz priorizada das 120 candidatas.

Sem cookies, rastreamento ou envio dos valores digitados. Os espaços de publicidade são apenas reservas visuais; anúncios não estão ativados.
