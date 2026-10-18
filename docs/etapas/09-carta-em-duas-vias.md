# Etapa 09: Carta do eu futuro em duas vias (Fase 1, passo 6)

**Data:** 2026-10-17 · Base: Chishima & Wilson (Self and Identity), [pesquisa 02](../pesquisa/02-habitos-e-engajamento.md)

## Por que mudou

Antes, **o app escrevia a carta pela pessoa**. O estudo mostra que o efeito (mais conexão com o
eu futuro e mais planejamento um mês depois) veio de **escrever a carta e a resposta**. Escrever só a
ida não teve efeito.

## Fluxo novo (depois do ritual de compromisso)

1. **Carta 1, para você daqui a 90 dias:** começa com um **rascunho editável** montado com o produto,
   o obstáculo marcado na anamnese, o plano B e a âncora (`src/domain/letter.ts`).
2. **Carta 2, a resposta do seu eu de 90 dias:** só a primeira linha vem pronta ("Oi, Jo. Sou você daqui a 90 dias.").
   O botão **"Selar as cartas" só libera depois de pelo menos 30 caracteres escritos pela pessoa**.
3. **Cartas seladas:** as duas no pergaminho, com a data. Dá para reler pela home ("Carta do Futuro")
   e editar.

As cartas ficam **salvas só no aparelho** e não são enviadas ao coach.

## Verificação

- `npm test`: **31 testes** ✅ (rascunho usa produto, obstáculo, plano B e âncora; funciona sem obstáculo;
  não sela só com a frase inicial; sela com resposta própria)
- Ponta a ponta: rascunho com o plano ✅ · selar bloqueado só com a frase inicial ✅ · resposta própria
  aparece no pergaminho ✅ · relida após recarregar ✅ · sem erros de JavaScript ✅
