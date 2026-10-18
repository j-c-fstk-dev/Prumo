# Etapa 01: Camada de IA genérica (Fase 2, adiantada)

**Data:** 2026-10-17

## Por quê

Ainda não está decidido se o coach usará Gemini, Claude ou Z.ai (GLM). Trocar de
provedor agora é **só configuração**, sem mudar código.

## Como funciona

`server/llm.ts` expõe uma única função, `generateReply(config, { system, messages })`.
Ela tem três adaptadores, todos com `fetch` puro (nenhum SDK de fornecedor):

| `LLM_PROVIDER` | Serve para | Modelo padrão |
|---|---|---|
| `gemini` | Google Gemini | `gemini-3.8-flash` |
| `anthropic` | Claude | `claude-haiku-5-5` |
| `openai` | Qualquer API compatível com OpenAI: **Z.ai**, OpenRouter, Groq, Ollama... (exige `LLM_BASE_URL`) | `glm-5.1` |

Variáveis: `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL` (opcional), `LLM_BASE_URL` (só `openai`).
Configurações antigas com só `GEMINI_API_KEY` continuam funcionando.

Outras mudanças:
- O histórico enviado é limpo para sempre começar pelo usuário (exigência dos provedores).
- Timeout de 30 s; em erro, o coach cai no modo offline e o erro vai para o log.
- `/api/health` mostra o provedor e o modelo ativos.
- Dependência `@google/genai` removida. O selo "Gemini 3.8" na tela do coach virou "IA".

## O que mudaria ao trocar de provedor

- **Variáveis:** sempre.
- **Código:** nada, para esses três formatos. Um provedor com formato próprio exigiria um
  novo adaptador de cerca de 20 linhas em `server/llm.ts`.
- **Prompt:** o mesmo serve para todos, mas vale comparar a qualidade das respostas em
  português antes de decidir.

## Verificação

- `tsc --noEmit` ✅
- Modo offline ✅
- API compatível com OpenAI (servidor falso local) ✅: chave, modelo e ordem das mensagens corretos
- Anthropic real com chave inválida ✅: recebeu 401 e caiu no fallback sem quebrar
- Gemini: **não testado ao vivo** (sem chave); o formato segue a API REST `generateContent`

## Licença: opções em aberto

Pedido: código aberto, porém mais restrito.

| Opção | É "open source" oficial? | Impede um concorrente de lucrar com o código? |
|---|---|---|
| **AGPL-3.0** | Sim (OSI) | Não impede, mas obriga quem usar (inclusive como serviço online) a abrir todo o código derivado |
| **PolyForm Noncommercial** | Não ("source-available") | Sim, proíbe uso comercial por terceiros |
| **Business Source License 1.1** | Não (vira open source após X anos) | Sim, até a data de conversão |

Em qualquer caso, como titular dos direitos você pode vender o app e mudar a licença
depois. A marca "Prumo" é protegida por **registro no INPI**, não pela licença.
