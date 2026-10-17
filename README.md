# 🧭 Prumo — Encontre seu prumo no digital sem paralisia

> **Em 15 minutos, saiba o que criar, para quem e como dar o primeiro passo.**
> Um app mobile que une acolhimento emocional com a objetividade do Menor Esforço Viável (MEV).

**Status:** MVP em construção (PWA). Veja o plano em [`docs/`](docs/).

## O que é

O Prumo conduz a pessoa por uma anamnese curta (7 dimensões), gera um diagnóstico
(nicho, produto inicial, público e canal) e transforma isso num roteiro em 3 capítulos,
com micro-tarefas de 15 minutos, um coach de IA contextual e um ritual de compromisso
com o "eu futuro" de 90 dias.

## Stack

| Camada | Tecnologia |
|---|---|
| App (PWA) | React 19, TypeScript, Tailwind CSS v4, Vite |
| Áudio de interface | Web Audio API (síntese em tempo real, sem arquivos) |
| Backend | Node.js + Express (`server.ts`) |
| IA | Google Gemini (`@google/genai`) |
| Android | Planejado: empacotamento do PWA (Capacitor ou TWA) |

## Rodando localmente

Pré-requisito: Node.js 20+.

```bash
npm install
cp .env.example .env   # opcional: coloque sua GEMINI_API_KEY
npm run dev            # http://localhost:3000
```

Sem `GEMINI_API_KEY`, o coach responde em modo offline com mensagens prontas.

Para testar no celular, acesse `http://<ip-do-seu-computador>:3000` na mesma rede Wi-Fi.

## Rotas

- `/`: o app Prumo (tela cheia no celular, moldura de preview no desktop)
- `/devhub`: guias de engenharia Android e o código Kotlin de referência
  (exploração inicial, não é o caminho atual do produto)

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção em `dist/`
- `npm run lint`: checagem de tipos (`tsc --noEmit`)
