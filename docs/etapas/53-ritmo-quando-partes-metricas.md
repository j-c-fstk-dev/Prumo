# Etapa 53: roteiro revisado (parte 2)

Segunda parte da "Revisão do Roteiro de 90 dias do Prumo". A primeira é a etapa 52.

## Ritmo leve ou firme
- **Onde escolher:** na entrada (tela "Assumir seu prumo") e, depois, em Você → Seu ritmo. Sem escolha, vale o firme, que era o ritmo de antes (`pace`).
- **Rotinas por semana em cada ritmo** (`activeRoutines(capítulo, tudo, ritmo)`):

| Rotina | Firme | Leve |
| --- | --- | --- |
| Revisão da semana | 1× | 1× |
| 15 min no que vai oferecer (só capítulos 1 e 2) | 3× | 2× |
| Falar com 1 pessoa nova | 5× | 3× |
| Mostrar algo útil (1× a partir do capítulo 3) | 2× | 1× |
| Retomar quem ficou de responder | 3× | 2× |
| Cuidar de quem já comprou | 1× | 1× |

- **Carga das rotinas:**
  - leve: cerca de 1h40 por semana em qualquer capítulo;
  - firme: 2h45 no pico (capítulo 2), mais os passos.
- **"Falar com 1 pessoa nova"** continua a principal nos dois ritmos.

## Quando e onde
- **Sem combinado, a pergunta vem logo no começo do passo:** "Antes de começar: quando e onde você vai fazer?". A posição do cartão é decidida ao abrir a tela, para ele não pular de lugar enquanto a pessoa escolhe.
- **No cartão da Início:** "⏰ Combinar quando e onde".
- **Nas rotinas:** cada uma tem o seu "⏰ combinar quando" (`routineWhen`).
- **O campo livre** sugere dia, hora e lugar: "terça, 7h, na cozinha".

## Passos longos em partes
- **Todo passo de 30 minutos ou mais** vira 2 ou 3 partes de 15 a 20 minutos:
  - mostrar para 5;
  - os 3 posts (ou os grupos, para quem não usa Instagram);
  - convidar 10;
  - primeira entrega;
  - mensagem de venda;
  - abrir vendas;
  - organizar a entrega;
  - depoimentos e números.
- **Cada parte:**
  - se marca sozinha e fica salva (`partsDone`);
  - conta como ação do dia.
- **O passo ainda é marcado como feito à mão.** Quando todas as partes estão feitas, o app avisa.
- **A duração aparece como "3 × 20 min"** (`durationLabel`).

## Métricas (Umami, sem dados pessoais)

| Evento | O que mostra |
| --- | --- |
| `primeira_conversa` `{dia}` | Se a entrada destrava: alguém chegou a "Conversou", com o dia da jornada em que aconteceu |
| `primeira_venda` `{dia}` | Se a parte de vendas funciona |
| `decisao_registrada` `{veredito, dia}` | Se o roteiro leva a uma conclusão: o passo "Decidir" concluído, com o que o funil dizia |
| `volta_apos_pausa` `{dias}` | Quem abre o app depois de 7 dias ou mais parado (junto com `recomeco`) |
| `tempo_do_passo` `{passo, estimado, resposta}` | Ao concluir: "levou menos, mais ou menos isso, ou mais?". A resposta é opcional |
| `passo_pulado` `{passo, motivo}` | Quais passos não fazem sentido. O motivo é opcional, entre 4 opções fixas |
| `ritmo_escolhido` `{ritmo}` | Leve ou firme |

- **Os marcos** são registrados uma vez só (`milestones`).
- **Pular um passo:**
  - conta como resolvido para seguir o roteiro;
  - não conta como ação do dia;
  - aparece como "pulado" no Roteiro;
  - "Marcar como pendente" desfaz.
- **Nenhum evento leva nome, contato ou texto escrito pela pessoa.**
