# Raphael Elias — Apps

Hub dos aplicativos e projetos públicos de Raphael Elias, com Next.js e Cloudflare Workers.

## Funcionalidades

Catálogo de repositórios públicos fixados no GitHub, detalhes com README em Markdown, temas claro e escuro e interface responsiva. Publicação com Next.js, OpenNext e Cloudflare Workers.

## Pré-requisitos

Node.js 22, Bun 1.4.2 e uma credencial GitHub de leitura para consultas GraphQL. Para publicar: conta Cloudflare e Wrangler autenticado.

## Instalação

```sh
bun install --frozen-lockfile
cp .dev.vars.example .dev.vars
```

## Configuração

Preencha `GITHUB_TOKEN` no arquivo local `.dev.vars` e ajuste `GITHUB_USERNAME` se necessário. Nunca versione credenciais nem use `NEXT_PUBLIC_*` para tokens. Sem token, o catálogo apresenta um estado de configuração pendente.

Em produção, configure o token no Worker:

```sh
bunx wrangler secret put GITHUB_TOKEN
```

No environment `production` do GitHub Actions, cadastre `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. O token Cloudflare precisa de permissão para publicar Workers na conta de destino; ele é independente do token GitHub da aplicação.

## Uso

```sh
bun run dev
```

Acesse http://localhost:3000. Os repositórios fixados definem a seleção e a ordem. Configure Website/About no GitHub para habilitar a abertura do aplicativo. O catálogo tem cache de 15 minutos e pode usar a última resposta válida por até 24 horas em falhas do GitHub.

Para testar no runtime Workers e publicar:

```sh
bun run preview
bunx wrangler login
bun run deploy
```

O workflow valida PRs e publica pushes na `main` após as verificações. Também permite execução manual na `main`. Configure o domínio `apps.raphaelelias.dev` no painel Cloudflare após o primeiro deploy. Para reverter uma publicação, use `bunx wrangler rollback`.

## Desenvolvimento

`src/app` contém as páginas e a API; `src/components`, a interface; `src/lib`, a integração GitHub e os metadados. `/api/projects` expõe somente o catálogo público e retorna 503 quando indisponível.

```sh
bun run format
bun run typecheck
```

## Testes

```sh
bun run lint
bun run typecheck
bun test
bun run build:worker
```
