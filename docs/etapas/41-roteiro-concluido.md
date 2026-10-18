# Etapa 41: roteiro concluído e rever o resultado

Primeira de 4 etapas do plano "90 dias de verdade" (41 a 44).

## Erros corrigidos
1. **"Ver meu resultado completo" levava de novo ao compromisso e às cartas.** Para quem já está na jornada, o botão agora diz **"Voltar para a jornada"**. Quem ainda não começou continua vendo "Assumir meu prumo".
2. **Com 100% feito, a Início mostrava a tarefa 1 como próximo passo.** O app usava a 1ª tarefa quando não havia pendente. Agora:
   - existe `journeyComplete`;
   - a Início mostra o cartão **"✦ Roteiro concluído"**, com ver as pessoas no Caderno e reler a carta;
   - o subtítulo diz "Roteiro concluído ✦";
   - o "próximo passo" de referência (para o coach e o capítulo) passa a ser o último.

## Arquivos
`AppStore.tsx` (`journeyComplete`), `ResultScreen.tsx`, `HomeTab.tsx` e `components/JourneyComplete.tsx`. Teste novo em `e2e/ritmo.spec.ts`.
