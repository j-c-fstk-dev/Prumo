# Etapa 18: Deploy na Cloudflare (Fase 2, passo 3)

**Data:** 2026-10-17

## O que foi feito

| Arquivo | Para quê |
|---|---|
| `worker/index.ts` | Worker da Cloudflare. Responde `/api/health`, `/api/coach/chat` e `/api/coach/report` chamando **a mesma lógica** do servidor local (`server/coach.ts`). Todo o resto é servido como arquivo estático (o app) |
| `wrangler.jsonc` | Configuração do Worker `prumo`: pasta `dist`, rotas do app caem no `index.html` (SPA), só `/api/*` passa pelo código, logs ligados no painel |
| `.github/workflows/deploy.yml` | Publica automaticamente a cada push na `main` (ou à mão, na aba Actions). Antes de publicar, roda checagem de tipos, testes e build. Sem os secrets, o deploy é pulado com um aviso, sem falhar |
| `package.json` | `npm run deploy` (publicar do seu computador) e `npm run dev:worker` (rodar o Worker localmente) |
| `playwright.config.ts` | `E2E_BASE_URL=https://...` roda os testes ponta a ponta contra outro endereço (Worker local ou site publicado) |

Proteções no Worker: só aceita POST nas rotas do coach (405), corpo até 64 KB (413), JSON inválido (400),
outras rotas `/api/*` dão 404.

## Como foi verificado

- `wrangler dev` local: health, rotas do app (200), crise, modo offline, 405, 404 e 413.
- **Os 7 testes ponta a ponta passaram rodando contra o Worker.**
- Com uma IA simulada (API compatível com OpenAI): o Worker enviou a chave e o modelo corretos, as
  ferramentas sugeridas entraram no prompt e a resposta voltou em modo "ao vivo".
- Ainda **não** foi publicado de verdade: depende das suas credenciais (passos abaixo).

## O que você precisa fazer (uma vez)

### 1. Token e Account ID da Cloudflare
1. Painel da Cloudflare → ícone de perfil → **My Profile → API Tokens → Create Token**.
2. Use o modelo **"Edit Cloudflare Workers"**. Em *Account Resources*, escolha só a sua conta; em
   *Zone Resources*, só o domínio que vai usar (ou "All zones" da conta). Crie e **copie o token** (ele só
   aparece uma vez).
3. O **Account ID** aparece na página inicial da conta (Workers & Pages → lado direito) ou na URL do painel.

### 2. Secrets no GitHub
Repositório → **Settings → Secrets and variables → Actions → New repository secret**:
- `CLOUDFLARE_API_TOKEN` = o token do passo 1
- `CLOUDFLARE_ACCOUNT_ID` = o Account ID

### 3. Publicar
- **Automático:** quando esta branch for para a `main`, o workflow "Deploy (Cloudflare)" publica sozinho.
  O botão "Run workflow" da aba Actions só aparece depois que o arquivo estiver na `main` (regra do GitHub).
- **Do seu computador (alternativa):** `npx wrangler@4 login` e depois `npm run deploy`.

O endereço inicial será `https://prumo.<seu-subdominio>.workers.dev`.

### 4. Chave da IA (secrets do Worker, nunca no código)
Painel → **Workers & Pages → prumo → Settings → Variables and Secrets → Add** (tipo *Secret*), ou pelo terminal:

```bash
npx wrangler@4 secret put LLM_PROVIDER   # gemini | anthropic | openai
npx wrangler@4 secret put LLM_API_KEY
npx wrangler@4 secret put LLM_MODEL      # opcional
npx wrangler@4 secret put LLM_BASE_URL   # só para "openai" (Z.ai, OpenRouter...)
```

**Z.ai (escolha atual, testada com a chave do dono em 2026-10-18):**

| Secret | Valor |
|---|---|
| `LLM_PROVIDER` | `openai` (= formato compatível com OpenAI) |
| `LLM_BASE_URL` | `https://api.z.ai/api/paas/v4` |
| `LLM_MODEL` | `glm-4.5-flash` (gratuito; `glm-5.3-flash` exige saldo: erro 1113) |
| `LLM_EXTRA_BODY` | `{"thinking":{"type":"disabled"}}` (confirmado: 179 → 12 tokens na mesma resposta) |
| `LLM_API_KEY` | a chave da Z.ai |

O teste mostrou que o `glm-4.5-flash` "pensa" antes de responder (179 tokens para um "Olá"). Para isso
existe a variável genérica `LLM_EXTRA_BODY`: um JSON com campos extras que vão no corpo da requisição ao
provedor, sem nunca trocar modelo, mensagens ou prompt. Se a resposta vier vazia, o coach cai em
"respostas prontas" e o erro vai para o log, em vez de fingir que a IA respondeu.

**Antes do lançamento público:** conferir na política de privacidade da Z.ai se o uso do modelo gratuito
permite treinar com os dados (LGPD). Para testes, tudo bem.

Sem esses secrets o app funciona normalmente e o coach fica em modo "respostas prontas", avisando a pessoa.

### 5. Domínio próprio
Já configurado no `wrangler.jsonc`: **prumo.jardimdofazer.com.br** (`custom_domain: true`). No deploy, a
Cloudflare cria o DNS e o certificado sozinha; o endereço `*.workers.dev` continua funcionando.
- O token precisa ter acesso à zona `jardimdofazer.com.br` (Zone Resources).
- Se já existir um registro DNS `prumo` nessa zona (ex.: de um túnel), o deploy falha: apague-o antes.
- Os túneis não são necessários.

## Próximo passo (2.4)
Limite de uso por pessoa no servidor (para proteger a chave e o custo da IA) e medição do custo real por
usuário. O KV gratuito só permite 1.000 gravações por dia, então vou comparar com D1 e com o limitador de
taxa nativo dos Workers antes de escolher.
