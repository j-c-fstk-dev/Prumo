# Etapa 19: Ajustes do 1º teste com usuários, bloco A (correções rápidas)

**Data:** 2026-10-18 · Origem: teste do dono do projeto e da esposa no app publicado (17/10)

## Achados do teste e plano

Os achados foram organizados em 6 blocos, aprovados nesta ordem:

| Bloco | Conteúdo | Status |
|---|---|---|
| **A** | Correções rápidas (esta etapa) | ✅ |
| **B** | Guia de voz e revisão de todos os textos; apresentação inicial (o que é prumo, por que a constelação, como é a jornada, "é só o começo"); blocos de texto surgindo um por vez na tela (animação só ao carregar); 90 dias explicados com honestidade; plano B renomeado para "Se travar, eu…" | próximo |
| 2.4 | Limite de uso por pessoa no servidor (destrava o bloco C) | |
| **C** | 3 prumos totalmente diferentes + "Quero criar o meu" com ajuda da IA | |
| **D** | ~60 citações verificadas de autores de livros famosos (com nome do livro); banco grande de frases de encorajamento rotativas na anamnese; lembretes e "Você sabia" sincronizados com o dia e a etapa | |
| **E** | Ilustração da pessoa com a bússola olhando o céu; música no splash (clima do app Fabulous, a pesquisar); comemoração mais mágica; sons gravados (CC0) mais delicados | |
| **F** | Leitura com nome completo, data e hora de nascimento ("mapa humano"), opcional | depois do MVP |

Causas confirmadas no código: só 9 citações (repetição inevitável); âncora com corte em uma linha;
2ª alternativa usava o mesmo nicho da sugestão principal; "90 dias" sem estudo por trás (escolha nossa);
instrução de segurar o botão pequena e fora dele.

## O que mudou no bloco A

| Achado | Mudança |
|---|---|
| Âncora cortada no painel | Aparece **inteira**, com quebra de linha e letra maior (início e roteiro) |
| "Bug" ao escrever com as próprias palavras; só existia "Ocultar" | Botão **Salvar**; depois de salvar aparece "Salvo ✓" e o começo do texto; o link vira "Editar" |
| Pergunta 2 muito limitada | Texto livre também em: papel preferido, jeito de atuar, câmera, lidar com "não", obstáculo e ferramentas. O app sugere a opção mais próxima pelo texto e, em pergunta de escolha única, "Sim" já marca a resposta. Perguntas de número (horas, investimento, meta, prazo) continuam só com opções |
| Não entenderam que era para segurar o botão | "Segure aqui" **dentro** do botão, que pulsa; abaixo, "Aperte e segure o dedo…"; toque rápido mostra "Quase! Mantenha o dedo apertado…"; menu de toque longo do Android bloqueado no botão |
| "Tarefas de hoje" confundia com a jornada | "Pra hoje · fora da jornada" (início) e "Minha lista · fora da jornada" (roteiro) |
| Splash e transições rápidas | Splash de 2,6 s para 4,2 s (1ª vez) e de 0,9 s para 1,6 s (volta); transições do dia a dia de 250–320 ms para 450–550 ms; quem pede menos movimento no celular continua sem animação |
| Voz ruim | Voz **desligada** (`VOICE_ENABLED = false` em `src/utils/voice.ts`); as palavras de encorajamento aparecem como texto na tarefa. Ideia para depois: gerar os áudios uma vez com voz neural e guardar como arquivo |

## Testes
- 90 testes de regra (novos: sugestão por texto nas perguntas de escolha única)
- 9 testes ponta a ponta (novo `e2e/ajustes.spec.ts`: Salvar, sugestão que vira resposta, aviso do botão, âncora sem corte)
