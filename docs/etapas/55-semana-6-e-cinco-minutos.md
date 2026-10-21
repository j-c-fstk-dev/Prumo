# Etapa 55: semana 6 sem cara de fracasso e "Hoje só tenho 5 minutos"

**Prazo:** os primeiros testadores chegam à semana 6 em cerca de seis semanas, então isto precisava estar pronto antes.

## O que o teste te mostrou (passo "Decidir")
No topo do passo da semana 6, antes da decisão, entra um cartão com:
- **os números do funil:** conversas sobre o problema, apresentações e compromissos, quantos deles em dinheiro;
- **até 3 anotações das conversas:** as notas das pessoas que já conversaram e as notas dos passos de conversa;
- **a frase no começo e a frase agora:** a do passo 1 e a da ficha;
- **um aviso, se não teve nenhum compromisso:** conferir se as pessoas eram o público certo antes de trocar;
- **o botão "Decidi trocar de caminho"**, ali mesmo.

O texto do passo também passou a apontar para esse botão.

## Trocar de caminho sem começar do zero
- **Vão junto:** o Caderno, as pessoas, as cartas, as rotinas e a linha do tempo.
- **Antes de trocar, o app pergunta se o novo caminho é para o mesmo público:**
  - **mesmo público:** as conversas sobre o problema continuam valendo. O capítulo 1 fica feito, e a semana sugerida já começa na 3 (`paceShiftDays: -14`);
  - **público novo:** o roteiro começa da semana 1, com conversas sobre o problema desse público. Os contatos continuam no Caderno.
- **Vale nos dois lugares:** no passo "Decidir" e no fim do roteiro ou do ciclo (`SwitchPath`).
- **Métrica:** `caminho_trocado {depois_do_roteiro, mesmo_publico}`.

## "Hoje só tenho 5 minutos"
- **Onde:** um botão na Início, logo abaixo do próximo passo.
- **O que oferece:** uma coisa só (`fiveMinutePlan`). Por ordem:
  1. retomar uma conversa que ficou para hoje;
  2. mandar a mensagem pronta para alguém da lista;
  3. anotar 1 nome novo;
  4. fazer o check-in.
- **"Fiz!"** conta como ação do dia.
- **Métrica:** `cinco_minutos {tipo}`.
