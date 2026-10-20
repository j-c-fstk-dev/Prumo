# 🧭 Prumo — Encontre seu prumo no digital sem paralisia

> **Em 15 minutos, saiba o que criar, para quem e como dar o primeiro passo.**
> Um app mobile que une acolhimento emocional com a objetividade do Menor Esforço Viável (MEV).

**Status:** MVP em construção (PWA). Plano em [`docs/ROADMAP.md`](docs/ROADMAP.md), pesquisa em [`docs/pesquisa/`](docs/pesquisa/).

## O que é

O Prumo conduz a pessoa por uma anamnese curta (7 dimensões), gera um diagnóstico
(nicho, produto inicial, público e canal) e transforma isso num roteiro de 90 dias em
4 capítulos (entender o problema, testar a solução, as primeiras vendas e criar ritmo),
com passos curtos, um coach de IA contextual e uma carta ao "eu futuro".

## Stack

| Camada | Tecnologia |
|---|---|
| App (PWA) | React 19, TypeScript, Tailwind CSS v4, Vite |
| Áudio de interface | Web Audio API (síntese em tempo real, sem arquivos) |
| Backend | Node.js + Express (`server.ts`) |
| IA | Provedor configurável: Gemini, Claude ou API compatível com OpenAI (`server/llm.ts`) |
| Android | Planejado: empacotamento do PWA (Capacitor ou TWA) |

## Rodando localmente

Pré-requisito: Node.js 20+.

```bash
npm install
cp .env.example .env   # opcional: configure o provedor de IA
npm run dev            # http://localhost:3000
```

Sem provedor de IA configurado, o coach responde em modo offline com mensagens prontas.

Para testar no celular, acesse `http://<ip-do-seu-computador>:3000` na mesma rede Wi-Fi.

## Rotas

- `/`: o app Prumo (tela cheia no celular, moldura de preview no desktop)
- `/devhub`: guias de engenharia Android e o código Kotlin de referência
  (exploração inicial, não é o caminho atual do produto)

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção em `dist/`
- `npm run lint`: checagem de tipos (`tsc --noEmit`)
- `npm test`: testes automáticos das regras de negócio (Vitest)
- `npm run test:e2e`: testes ponta a ponta no navegador (Playwright; na 1ª vez: `npx playwright install chromium`)

## Licença

Copyright (C) 2026 os autores do Prumo.

Este programa é software livre sob a [GNU Affero General Public License v3.0 ou posterior](LICENSE)
(AGPL-3.0-or-later). Quem modificar o código e oferecê-lo a outras pessoas, inclusive como
serviço pela internet, deve disponibilizar o código-fonte modificado sob a mesma licença.

A marca e o nome "Prumo" não são cobertos por esta licença.
