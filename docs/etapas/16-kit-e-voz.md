# Etapa 16: Kit de execução e voz sintética (Fase 3, passos 6 e 7)

**Data:** 2026-10-17

## Kit de execução (`src/domain/kit.ts`)

Substitui os "Recursos de apoio", que listavam materiais inexistentes. São 5 modelos montados com o
diagnóstico da pessoa (público, dor, produto, nome), sempre **editáveis**:

| Modelo | Tarefa | Destaques |
|---|---|---|
| Mensagem de convite | t3, t6 | "não vou te vender nada"; botões **Copiar** e **Abrir no WhatsApp** |
| Roteiro de conversa de escuta | t3 | perguntas sobre o que a pessoa **já viveu**; avisa para evitar "você compraria?" |
| Calculadora de preço de teste | t4 | horas por venda × valor da hora + custos, comparado com a faixa do formato; sugestão terminando em 7, **nunca abaixo do custo nem da faixa** |
| Página de venda simples | t6, t7 | usa a promessa da pessoa se houver; seções com [colchetes] para completar |
| Pedido de depoimento | t7 | 3 perguntas + **pede permissão** para usar a resposta |

- **Limite do grátis:** 1 modelo por capítulo (só com o paywall ligado). Abrir de novo o mesmo modelo não conta.
- O diagnóstico ganhou o campo `pain` (a dor do público), usado nos textos.

### Bugs achados pelos testes

- **Preço abaixo da faixa:** o arredondamento para "terminar em 7" puxava para baixo (R$ 17 para uma faixa que
  começa em R$ 19). E o primeiro teste que escrevi esperava o valor errado. Corrigido: arredonda para cima, o começo
  da faixa usa o próprio valor da faixa, e um teste novo varre 13 cenários garantindo que a sugestão nunca fica
  abaixo do custo nem fora da faixa.
- **Frase truncada:** "ajudar profissionais… com não saber como se apresentar". As dores são frases com verbo;
  os modelos agora usam "que passam por isto: [dor]".

## Voz sintética (`src/utils/voice.ts`)

- Os micro-áudios **leem de verdade** a transcrição de encorajamento, com a voz em português do próprio aparelho
  (Web Speech API): grátis, offline, nada é enviado.
- A duração mostrada é **estimada pelas palavras** (antes eram durações fixas, como "1:18 min", que não
  correspondiam a nada).
- O narrador "Helena · Coach Prumo" virou **"Coach Prumo · voz sintética"**: com voz de máquina, um nome de pessoa
  daria a entender que existe alguém real gravando.
- **Sem voz no aparelho:** o app detecta a falha (`synthesis-failed`), avisa ("Sem voz neste aparelho") e abre a
  transcrição. Antes de corrigir, ele simplesmente parava em silêncio.
- **Fase 4:** o WebView do Android (Capacitor) pode não ter esse recurso. Lá entra um plugin nativo de
  text-to-speech com a mesma interface.

## Verificação

- `npm test`: **74 testes** ✅ (14 novos: textos do kit, tarefas do kit, calculadora em 5 cenários + varredura,
  limite de 1 modelo por capítulo, duração e formato da voz)
- Ponta a ponta: convite personalizado ✅ · copiar para a área de transferência ✅ · link do WhatsApp ✅ ·
  calculadora (0,5 h × R$ 40 → sugere R$ 27, faixa R$ 19–47) ✅ · aviso de voz indisponível ✅ ·
  regressão completa ✅ · build ✅
