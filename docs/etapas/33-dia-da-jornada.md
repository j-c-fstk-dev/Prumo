# Etapa 33: dia da jornada, dias de prumo e tarefas à parte

**Pedido:** mostrar as duas contagens ("Dia X de 90" e "dias de prumo") sem prender as tarefas ao dia, porque a pessoa pode querer fazer mais de uma por dia. Virar o dia às 4h.

## Três medidas separadas
| Na tela | Mede | Avança quando |
|---|---|---|
| **Dia X de 90** (topo da Início) | o tempo da jornada | sozinho, pelo calendário, desde o dia em que a pessoa começou |
| **✦ N dias de prumo** (check-in) | a constância | em cada dia com pelo menos uma ação (check-in ou tarefa). Várias tarefas no mesmo dia continuam valendo 1 |
| **Estrelas / passos** | o progresso no roteiro | a cada tarefa concluída, sem limite por dia |

## O que mudou
- **O dia vira às 4h** (`journeyDayKey`). Quem registra à 0h30 ainda está no "hoje". Isso vale para a sequência, o check-in, o remendo e o limite semanal do coach.
- **Correção:** os dias desde o início contavam blocos de 24h. Quem começava às 22h continuava no "dia 0" na manhã seguinte. Agora a conta usa o calendário (`journeyDayNumber`).
- **Depois do Dia 90**, o texto vira "Dia 95 · além dos 90 ✨", e não "Dia 95 de 90".
- **No Dia 90 em diante**, com a carta selada, aparece na Início um cartão para reler a carta.
- **A partir de 3 tarefas no mesmo dia**, aparece um aviso gentil. Ele não bloqueia nada, só lembra de descansar (âncora "sem burnout").
- **Apresentação inicial:** "um por dia" virou "no seu ritmo: um por dia já é ótimo, e dá pra fazer mais se quiser".

## Arquivos
- `src/domain/journey.ts`: `journeyDayKey`, `daysBetween`, `journeyDayNumber`, `journeyDayLabel`, `tasksDoneOn` e as constantes.
- `src/app/state/AppStore.tsx`, `src/app/screens/HomeTab.tsx`, `src/app/components/DailyRhythm.tsx`, `src/app/screens/CarouselScreen.tsx`.
- Testes: `src/domain/journey.test.ts` (+4) e `e2e/ritmo.spec.ts` (+1). O `dayKey` do helper de e2e também passou a virar às 4h.

## Verificação
138 testes de unidade e 19 de ponta a ponta passando, mais um print da Início no Dia 90.
