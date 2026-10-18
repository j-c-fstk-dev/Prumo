# Etapa 20: Bloco B, parte 1 (apresentação, blocos um por vez, telas do compromisso)

**Data:** 2026-10-18 · Plano: [etapa 19](19-ajustes-do-teste.md) · Regras de texto: [guia de voz](../guia-de-voz.md)

## O que mudou
| Achado do teste | Mudança |
|---|---|
| Muitos blocos de texto de uma vez, rolando a tela | Componente `Reveal`: os blocos **surgem um por vez** quando a tela carrega (650 ms cada, 260 ms entre eles, no máximo 7 degraus). Só na entrada. Quem pede menos movimento vê tudo de uma vez. Usado em: apresentação, resultado, compromisso, painel inicial e tarefa |
| Não explica o que é prumo nem a constelação | Nova apresentação em 4 telas: "Mas afinal, o que é prumo?" (o fio do pedreiro), "Cada passo acende uma estrela", "Como funciona" (perguntas → caminho → 3 capítulos), "E isso é só o começo" |
| Linguagem de quem fez o app | Resultado: "Seu caminho", "O que oferecer", "Pra quem", "Onde achar essas pessoas", "Primeiro resultado", "Sua aposta" (com explicação de por que testar), "Como testar", "Deu certo se". Botões: "Assumir meu prumo", "Refazer as perguntas", "Travei aqui: falar com o coach" |
| 90 dias sem contexto | Explicado no compromisso: tempo para testar algumas vezes e ajustar. **Dito como escolha do Prumo, não regra científica** |
| Plano B confuso | Virou **"Se travar, eu…"**: "Quando [obstáculo], eu [ação]" + "Não é plano pra desistir…" |
| Âncora sem explicação | "Sua âncora: a frase que vai te lembrar por que você começou" |
| Tarefa com ordem estranha | Primeiro "O que fazer" e "Como saber que ficou bom", depois "Quando vou fazer" |

## Fica para a parte 2
Revisão dos textos restantes pelo guia de voz: perguntas e telas entre etapas, painel, roteiro, perfil,
textos das tarefas e do diagnóstico (justificativa, avisos, aposta).

## Testes
- 90 testes de regra; 10 ponta a ponta (novo: apresentação inicial)
- Conferido à parte com animação ligada: o bloco começa invisível e termina visível
