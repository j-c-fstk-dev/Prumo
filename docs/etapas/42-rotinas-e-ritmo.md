# Etapa 42: rotinas, revisão da semana e ritmo pelo calendário

Segunda de 4 etapas do plano "90 dias de verdade".

## Por quê
Com só 7 passos únicos, a jornada de 90 dias acabava na 1ª semana. Apps que sustentam programas longos combinam **marcos** (feitos uma vez) com **rotinas** (que se repetem) e um **ritmo pela semana**:
- **Couch to 5K:** treinos que se repetem por 9 semanas.
- **Noom:** lição do dia e hábito diário por 16 semanas.
- **Fabulous:** um hábito novo por semana, que se acumula.
- **Duolingo:** prática e revisão depois das unidades.

## Rotinas (`src/domain/routines.ts`)
- Cada rotina tem uma **meta por semana** (de 1 a 7 vezes), no máximo uma marcação por dia, e vale **a partir do capítulo dela** (continua nos seguintes).

| Rotina | Desde | Meta |
|---|---|---|
| 🧭 Revisão da semana | Cap. 1 | 1×/semana |
| 🌱 15 minutos no que você vai oferecer | Cap. 1 | 3× |
| 💬 Falar com 1 pessoa nova (abre Pessoas) | Cap. 2 | 5× |
| 🏮 Mostrar algo útil | Cap. 2 | 2× |
| 🔁 Retomar quem ficou de responder (abre Pessoas) | Cap. 3 | 3× |
| 🤝 Cuidar de quem já comprou (abre Pessoas) | Cap. 3 | 1× |

- **Marcar uma rotina conta como ação do dia**, igual a concluir um passo: entra nos "dias de prumo" e no remendo.
- **Na tela:** o cartão "Rotina da semana" na Início (depois do próximo passo) e o bloco "Rotinas" no topo do Roteiro.
- Depois do roteiro concluído, todas as rotinas valem.

## Revisão da semana
- Três perguntas curtas: o que funcionou, o que mudar, e uma meta para a próxima semana.
- Mostra um resumo dos últimos 7 dias: passos, rotinas e pessoas que avançaram no Caderno.
- **A meta aparece no cartão de rotinas** até a próxima revisão.
- Fica no aparelho, em `weeklyReviews`, guardada pela segunda-feira da semana. Refazer na mesma semana abre o que já foi escrito.

## Ritmo pelo calendário (`src/domain/pacing.ts`)
- Os 90 dias viram **13 semanas**. Cada passo tem uma **semana sugerida** (`week`).
- **Só sugere, nada trava** (decisão do teste com usuários):
  - "Sugerido pra esta semana";
  - "Da semana 5 · dá pra adiantar";
  - "Era da semana 2 · sem pressa, segue daqui".
- O **Roteiro** agrupa os passos por semana ("● esta semana") e os filtros de capítulo vêm das próprias tarefas.

## Outros
- O "Ver minhas pessoas" (roteiro concluído) e as rotinas de conversa abrem o Caderno **direto em Pessoas** (`openPeople`).
- Métricas: `rotina_feita` (com o id da rotina) e `revisao_semana` (com ou sem meta).
- O teste da etapa 41 passou a importar `INITIAL_TASKS` direto, para o `tsc` (lint) passar.
