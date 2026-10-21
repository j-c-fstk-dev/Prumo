# Etapa 54: menos abandono (agenda, primeira vitória e parceiro de prumo)

Vem da conversa sobre o abandono, com a pesquisa trazida pelo assistente do documento de revisão:
- **Acompanhamento:** programas digitais seguidos sozinhos têm adesão média de cerca de 26%; com alguém acompanhando, cerca de 72%. Segundo o modelo de Mohr e colegas, quem segura a pessoa é alguém confiável a quem ela presta contas.
- **Lembretes:** lembretes personalizados têm efeito pequeno, mas real, quando chegam na hora que a pessoa escolheu.
- **Primeiro uso:** mais de 80% das pessoas usam um app uma vez só.

Tudo aqui funciona sem conta e sem servidor de usuários: os dados continuam só no celular.

## 1. Lembrete pela agenda do celular
- **"📅 Pôr na minha agenda"** no "quando vou fazer":
  - de cada passo, com dia e hora;
  - de cada rotina, com os dias da semana e a hora, repetindo toda semana.
- **Duas saídas:**
  - **Google Agenda:** um link que abre o evento pronto para salvar;
  - **Calendário do celular:** um arquivo `.ics` que abre no calendário do iPhone, do Android ou do computador.
- **O alarme toca 10 minutos antes.** O evento tem o link do app.
- **Sem servidor e sem permissão de notificação** (`src/domain/calendar.ts`). Notificação do próprio app fica para depois: precisa de servidor e, no iPhone, só funciona com o app na tela de início.
- **Métrica:** `agenda_adicionada {tipo, como}`.

## 2. Vitória na primeira visita
- **Quando aparece:** na Início, enquanto a pessoa não tem nenhum passo feito nem nenhuma pessoa no Caderno.
- **O cartão "Seu primeiro passo, agora · 5 minutos"** tem duas partes:
  1. **a frase:** vem com o público do resultado. Só libera depois de trocar os [colchetes];
  2. **até 3 nomes** de quem pode ter o problema.
- **"Pronto: primeiro passo feito":**
  - a frase vai para a ficha (Minha frase) e para a nota do passo 1;
  - os nomes vão para o Caderno como "Novo";
  - o passo 1 fica feito e conta como o primeiro dia de prumo.
- **"Depois"** esconde o cartão.
- **Métrica:** `primeira_sessao_completa {nomes}`.

## 3. Parceiro de prumo e resumo da semana
- **Ao concluir um passo**, junto da pergunta do tempo, aparece "📣 Contar pro meu parceiro de prumo". O WhatsApp abre com "Concluí mais um passo no Prumo ✅", e a pessoa escolhe o contato.
- **Na revisão da semana:** "Mandar o resumo pro meu parceiro (só números)".
- **"Sua semana passada", na Início:**
  - aparece de segunda a quarta, se a semana anterior teve alguma coisa;
  - mostra passos, rotinas, conversas que avançaram e compromissos novos (`weekStats`);
  - tem o botão "Mandar pro meu parceiro" e "Ok" para esconder até a semana seguinte (`summarySeenWeek`).
- **Os resumos levam só números e títulos de passo.** Nunca nomes ou telefones de contatos.
- **Serve para:** o parceiro, a turma no WhatsApp e o check-in semanal do coach no piloto.
- **Métrica:** `parceiro_avisado {o_que}`.

## Fora do app (piloto)
- Turmas de 5 a 8 pessoas que começam na mesma segunda, com um encontro curto por semana.
- Check-in semanal de 10 minutos feito pelo fundador nas primeiras pessoas. O resumo da semana chega pelo WhatsApp.
- Isso pode virar a parte paga: acompanhamento humano ou em turma.

## Próximos possíveis
- Cartão do que a pessoa aprendeu ao concluir "Decidir".
- Trocar de caminho mantendo o Caderno e, com o mesmo público, começar na semana 3.
- "Hoje só tenho 5 minutos".
