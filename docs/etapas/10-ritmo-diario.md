# Etapa 10: Ritmo diário, sequência gentil e fim de capítulo (Fase 1, passo 7)

**Data:** 2026-10-17 · Base: [pesquisa 02](../pesquisa/02-habitos-e-engajamento.md)

## Regras (`src/domain/journey.ts`)

| Recurso | Regra | Base |
|---|---|---|
| **Ação do dia** | concluir tarefa do plano, concluir tarefa pessoal ou fazer o check-in | Harkin et al. 2016 (registrar o progresso) |
| **Sequência gentil** | conta dias com ação; **1 dia de descanso por semana** (seg–dom) não quebra nem soma | Silverman & Barasch 2023 |
| **Remendo** | se ontem ficou em branco sem descanso disponível, **2 ações hoje remendam ontem** e a sequência volta | Silverman & Barasch 2023 (quebra com conserto desmotiva menos) |
| **Volta após 2+ dias** | acolhimento ("acontece com todo mundo… só 5 minutos hoje?"). **Nunca** "você quebrou" | Breines & Chen 2012 |
| **Recomeço** | na volta, se for segunda-feira ou dia 1º, convida a recomeçar | Dai, Milkman & Riis 2014 |
| **Linha do tempo** | diagnóstico, cartas seladas, cada tarefa concluída (com data) e capítulos concluídos | Harkin et al. 2016 |
| **Fim de capítulo** | quando todas as tarefas do capítulo terminam: constelação completa + nome + convite para o próximo. **Uma vez por capítulo** | conceito de marca (pesquisa 04) |

## Na tela

- **Home:** cartão "Check-in de hoje" (humor + "o que você fez hoje, mesmo que pequeno?"), sequência
  "✦ N dias de prumo · com descanso", aviso de remendo "(1/2)" e acolhimento de volta.
- **Celebração de capítulo** sobre a home, com a constelação dourada completa.
- **Perfil:** "Sua linha do tempo".

## Verificação

- `npm test`: **44 testes** ✅ (13 novos: datas locais, semana de segunda a domingo, virada de mês,
  sequência, hoje aberto não zera, descanso não quebra, 2º branco na semana quebra mas remenda, remendo
  devolve a sequência, nada a remendar sem histórico, dias afastado, datas-marco, ordem da linha do tempo,
  capítulo concluído)
- Ponta a ponta: check-in ✅ · sequência ✅ · concluir o capítulo 1 → celebração ✅ → constelação do
  capítulo 2 ✅ · linha do tempo com 7 eventos ✅ · recarregar: check-in salvo e celebração não repete ✅
- Com datas simuladas: volta após 6 dias → acolhimento, sem "quebrou" ✅ · remendo oferecido (0/2 → 1/2)
  e, com 2 ações, a sequência volta (5 dias, com descanso) ✅ · sem erros de JavaScript ✅

## Decisão de projeto registrada

Ao desmarcar uma tarefa, a ação do dia **não** é descontada (simplicidade). O pior caso é alguém
"ganhar" um dia marcando e desmarcando, o que não prejudica ninguém num app sem ranking.
