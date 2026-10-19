# Etapas 45 a 48: o que é prumo, coach digitando, guia do app e abertura com música

Observações do segundo teste com usuários.

## 45 · O que é prumo
- O texto da apresentação ficou mais claro:
  - o fio de prumo é **um fio com um peso na ponta**;
  - a gravidade puxa o peso sempre para baixo, e o fio mostra a linha reta;
  - o pedreiro confere o prumo antes de cada fileira de tijolos, e daí vem "estar no prumo".
  - No app, o prumo é **a direção que você escolheu**: "tijolo por tijolo, passo por passo".
- **Ilustração nova** (`PlumbLine`): o fio com o peso balança e para na vertical, ao lado de uma parede de tijolos.
- O mesmo texto aparece em **Você → Sobre o Prumo → "O que é prumo?"**.

## 46 · Coach digitando a mensagem
- No modal "Pedir ajuda ao coach" (Pessoas), a sugestão **aparece sendo digitada**, em cerca de 1,6 s qualquer que seja o tamanho, com um cursor ▍ e o aviso "✨ O coach está escrevendo… mostrar tudo".
- Os botões de envio só aparecem quando o texto termina, para ninguém enviar uma mensagem pela metade.
- Tocar no texto ou em "mostrar tudo" mostra tudo na hora.
- Quem pede menos movimento vê o texto inteiro direto (`useTypewriter`).

## 47 · Guia interativo do app
- **8 passos:** boas-vindas, check-in, próximo passo, rotinas, Roteiro, Coach, Caderno e Você.
- Cada passo **destaca a parte da tela** (o resto escurece), com uma explicação curta e os botões "Voltar", "Próximo" e "Pular o guia".
- **Abre sozinho na 1ª visita à Início.** Quem já usava o app também vê uma vez, por causa das novidades.
- **Para rever:** Você → Sobre o Prumo → 🧭 Guia do app.
- Fica salvo em `guideSeenAt`. Métricas: `guia_aberto`, `guia_concluido` e `guia_pulado`.

## 48 · Abertura: céu por mais tempo e música
- **Duração:** o céu com o bonequinho fica **~6 s** (antes eram 3,2 s), com mais estrelas e **2 estrelas cadentes**, e depois vem a bússola (1,7 s). Quem pede menos movimento vê a versão curta.
- **Música:** os navegadores só deixam tocar som sem um toque em alguns casos.
  - O **Chrome no Android com o app instalado** na tela de início costuma deixar, e então a música toca sozinha em toda abertura.
  - O **Safari (iPhone)** quase nunca deixa.
  - Agora o app **tenta tocar sozinho**. Quando o navegador não deixa, aparece um botão discreto **"♪ Ouvir a música"**, que toca sem pular a abertura.
  - Na 1ª abertura continua o "Toque para começar".
  - Com o som desligado em Você, nunca toca.

## Testes
- Novos testes de ponta a ponta:
  - a digitação, com animações ligadas;
  - o guia inteiro, que não repete e abre pelo Sobre;
  - o céu de ~6 s antes da bússola;
  - o texto do prumo.
- O teste que faz o onboarding completo agora pula o guia, e o estado semeado nos testes já marca o guia como visto.

## Achado nos testes
O helper `passSplash` às vezes olhava a tela antes de o app montar a abertura. "Nenhuma abertura" parecia "a abertura já passou", e o toque da 1ª vez não acontecia. Agora ele espera a abertura aparecer. A abertura também passou a sair antes de tocar a música, para o som nunca travar a entrada. Foram 10 de 10 repetições passando e 30 testes de ponta a ponta no total.
