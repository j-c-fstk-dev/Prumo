# Etapa 22: Limite de uso do coach no servidor (Fase 2.4)

**Data:** 2026-10-18

## Por quê
Sem limite, qualquer pessoa (ou um robô) poderia gastar toda a cota da chave da IA. O limite no próprio
app (freemium) não basta: dá para burlar chamando a API direto.

## Como funciona
| Regra | Padrão | Variável para mudar (secret do Worker) |
|---|---|---|
| Por aparelho, por dia | 30 mensagens | `COACH_LIMIT_DEVICE_DAY` |
| Por aparelho, por minuto | 5 mensagens | `COACH_LIMIT_DEVICE_MINUTE` |
| Por IP, por dia | 100 mensagens | `COACH_LIMIT_IP_DAY` |
| Total do app, por dia | 1.500 mensagens | `COACH_LIMIT_TOTAL_DAY` |

- O dia vira à **meia-noite UTC** (21h em Brasília).
- **Só conta quando a IA vai ser chamada.** Mensagem de crise sempre recebe acolhimento e o CVV, mesmo
  com o limite estourado. Modo "respostas prontas" e mensagem inválida também não gastam a cota.
- Ao atingir o limite, o coach responde com carinho ("por hoje a gente já conversou bastante… volta
  amanhã") e o cabeçalho mostra "Conversas de hoje esgotadas · volta amanhã".
- O app manda um **código aleatório do aparelho** (sem nome nem contato). Trocar esse código não burla:
  o limite por IP e o total do dia continuam valendo. A tela de consentimento do coach agora avisa isso.
- Se o contador falhar, o coach continua funcionando (e o erro vai para o log).

## Onde ficam os contadores
Num **Durable Object com SQLite** (`worker/limiter.ts`), que está no plano grátis da Cloudflare
(100 mil gravações por dia; cada mensagem grava 4). Uma única instância processa uma chamada por vez,
então a contagem é exata. Contadores de dias anteriores são apagados automaticamente. Ele é criado
sozinho no deploy (`wrangler.jsonc`: `durable_objects` + `migrations`), sem passo manual.

Descartados: KV (só 1.000 gravações por dia no plano grátis) e o limitador nativo de taxa dos Workers
(só janelas de 10 ou 60 segundos, sem cota diária, e não confirmei se está no plano grátis).

## Custo real por pessoa
Cada chamada à IA grava no log um registro só com números:
`{"type":"coach_usage","provider":"openai","model":"glm-4.5-flash","inputTokens":…,"outputTokens":…}`.
Nenhum texto da conversa. Para ver: painel da Cloudflare → Workers & Pages → prumo → Logs, filtrando
por `coach_usage`.

## Também nesta etapa
Respostas prontas do coach reescritas pelo guia de voz (saíram "Menor Esforço Viável (MEV)", "regra de
ouro" e "Criador").

## Testes
- 101 testes de regra (novos: regras do limite, crise e offline não passam pelo limite, falha do contador,
  registro de custo sem texto)
- Worker local (`wrangler dev`) com IA simulada e limite de 2 por dia: 2 respostas ao vivo, a 3ª limitada;
  outro aparelho segue atendido; crise sempre atendida
