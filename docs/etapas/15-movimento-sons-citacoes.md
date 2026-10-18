# Etapa 15: Movimento, toque, sons e citações (Fase 3, passos 3 a 5)

**Data:** 2026-10-17 · Base: [pesquisa 04](../pesquisa/04-sons-e-movimento.md) e [05](../pesquisa/05-citacoes.md)

## Movimento: duas velocidades

| Uso | Antes | Agora |
|---|---|---|
| Trocar de aba, de pergunta, abrir tarefa, elementos pequenos | 500–650 ms | **250–320 ms** |
| Rituais (sinal de valor, compromisso, carta, fim de capítulo, splash, bússola) | 550–1.700 ms | mantidos |

Com "reduzir movimento" ligado no sistema, **todas** as animações de entrada ficam praticamente instantâneas
(antes isso valia só para a bússola e a constelação).

## Toque

Botões só de ícone eram de cerca de 24–28 px. Agora: **voltar = 44 px**; ações da linha de tarefa pessoal
(concluir, subir, descer, editar, apagar) = **40 px**. São 4 lado a lado e 48 px espremeria o título.
Os dois tamanhos superam o mínimo do WCAG 2.2 (24 px).

## Sons

- **Ataque suave:** todas as 9 notas sobem do quase-silêncio em 8 ms (sem estalo no início).
- **Som só em momentos com significado:** concluir tarefa, compromisso, pulsos do "segurar" e player de áudio.
  Os **sons de toque** (botões, opções, trocas de tela) ficam **desligados por padrão**. Perfil → "Sons de
  toque" liga. A repetição em toda interação cansa (psicoacústica, pesquisa 04).

## Citações e ciência nas telas

| Onde | O quê |
|---|---|
| Abertura dos blocos 1, 3, 5 e 7 da anamnese | Laozi (começar) · Widener/Roosevelt (recursos) · Sêneca (medo) · Aristóteles (hábito) |
| Ritual de compromisso, junto do plano B | Marco Aurélio (obstáculo) |
| Tarefa da versão mínima / tarefa do teste | Voltaire (perfeccionismo) / Sêneca (medo) |
| Fim de capítulo | Aristóteles (hábito) |
| Home: "Inspiração do dia" | rotação diária entre as 6 citações verificadas e 8 cartões "Você sabia?" |

- Cada citação mostra **autor, obra e localização com link para a fonte** e "tradução nossa" quando for o caso.
- Cada cartão de ciência mostra o **estudo com link**.
- **Só aparecem citações com status `verificada`** (Pessoa e Guimarães Rosa continuam fora).

## Revisão de textos (achados)

Ao colocar as citações, encontramos textos do protótipo original que **contradiziam a nossa pesquisa**:

| Antes | Problema | Agora |
|---|---|---|
| "reduz em 80% o atrito para começar" | número inventado, sem fonte | "deixa o primeiro passo mais leve, e ajuda a continuar quando ficar difícil" |
| "há modelos altamente lucrativos… sem aparecer" | promessa de lucro (CDC, pesquisa 07) | "dá para construir algo sério e respeitado sem aparecer" |
| "Quando o assunto te fascina, a disciplina deixa de ser sacrifício" | é o mito da "paixão fixa" (O'Keefe et al.) | "Interesse se fortalece fazendo…" |

## Verificação

- `npm test`: **60 testes** ✅ (4 novos: só verificadas são publicáveis; fontes https; a inspiração muda a
  cada dia em 14 dias seguidos sem repetir e nunca é pendente; o mesmo dia mostra o mesmo item)
- Prints nos dois temas da abertura de bloco, do compromisso, da inspiração do dia e da tarefa ✅
- Ponta a ponta completo + cenários de datas ✅ · build ✅
