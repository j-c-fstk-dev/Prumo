# Fechamento da Fase 1: núcleo funcional

**Data:** 2026-10-17

## O que o app faz agora (tudo offline, salvo no aparelho)

1. **Anamnese** de 13 perguntas em 7 blocos, com 5 campos abertos que têm finalidade explícita, sugestões
   confirmadas pela pessoa, perda aceitável e obstáculo ([etapa 07](07-campos-abertos.md)).
2. **Diagnóstico real:** nicho × produto × canal, hipótese/teste/sinal, avisos honestos,
   2 alternativas e pivô ([etapa 06](06-motor-de-diagnostico.md)).
3. **Ritual de compromisso** com plano B + **carta em duas vias** escrita pela pessoa ([etapa 09](09-carta-em-duas-vias.md)).
4. **Roteiro adaptado** ao formato e ao canal, com "quando vou fazer", e **tarefas pessoais**
   ([etapa 08](08-tarefas.md)).
5. **Ritmo diário:** check-in, sequência gentil, remendo, acolhimento, linha do tempo e fim de capítulo
   ([etapa 10](10-ritmo-diario.md)).
6. **Paywall pronto e desligado**, seguindo o modelo aprovado ([etapa 11](11-paywall.md)).

## Qualidade

- **52 testes automáticos** das regras de negócio (`npm test`): diagnóstico, leitura do texto livre,
  roteiro, carta, ritmo diário e direitos.
- Testes ponta a ponta (Playwright) percorrendo o app inteiro, com recarga e datas simuladas.
  Ainda são scripts locais da sessão de desenvolvimento: **levar para o repositório** é um item da Fase 2.

## O que ficou para as próximas fases

- **Fase 2:** backend no ar (deploy gratuito), limite de uso por usuário no servidor, logs de erro do coach,
  botão "denunciar resposta", protocolo de crise (CVV 188), consentimento antes do 1º uso do coach.
- **Fase 3:** paleta "Pergaminho & Noite" em todas as telas, **texto maior** (hoje cerca de 85% está em 12 px
  ou menos), duas velocidades de animação, sons com ataque suave, citações nas telas, áudios reais, kit de execução.
- **Fase 4:** termos e privacidade, exportar/apagar dados, PWA instalável, Capacitor + AAB, notificações.
