# Etapa 04: App dividido em telas + dados salvos no aparelho (Fase 1, passo 1)

**Data:** 2026-10-17

## Antes × depois

| | Antes | Depois |
|---|---|---|
| Estrutura | 1 arquivo com cerca de 2.040 linhas e 30 estados misturados | 16 telas em `src/app/screens/` + estado central em `src/app/state/` |
| Dados | perdidos ao recarregar | **salvos no aparelho (IndexedDB)**, com plano B em memória |
| Ao reabrir | sempre do início | vai **direto para a home** se o onboarding já foi feito |
| Tarefa aberta | cópia "congelada" (status desatualizado no detalhe) | lida pelo id: sempre atual |
| Coach | enviava as reflexões brutas ao servidor | envia só o **contexto mínimo** (decisão LGPD, pesquisa 07) |
| "Reiniciar" (preview desktop) | só voltava à tela inicial | apaga os dados salvos (com confirmação) |

## Arquitetura

```
src/app/
  state/
    storage.ts     IndexedDB (get/set/clear) com fallback em memória
    AppStore.tsx   estado do app, navegação, ações e salvamento automático (300 ms)
  screens/         uma tela por arquivo (Welcome, Register, Carousel, ValueSignal,
                   Anamnese, Calculating, Result, Commitment, FutureLetter, Home,
                   Roadmap, TaskDetail, Coach, Profile, Paywall, BottomNav)
src/components/prototype/PrumoAppSimulator.tsx   moldura + troca de telas
```

- **O que é salvo:** nome, objetivo, respostas, reflexões, **só o status** das tarefas
  (o conteúdo vem do código, então dá para melhorar os textos sem apagar o progresso), conversa
  do coach e se o onboarding foi concluído.
- **Versão do formato** (`version: 1`) + função `migrate`, para futuras mudanças não quebrarem
  os dados de quem já usa.

## Verificação

- `tsc --noEmit` ✅ · `vite build` ✅
- Teste ponta a ponta automatizado (Playwright, 390 px): boas-vindas → cadastro → carrossel →
  12 perguntas → cálculo → resultado → segurar 3 s → carta → home → concluir tarefa
  (1 → 2 estrelas) → coach responde → **recarregar** → abre na home com 2 estrelas e a
  conversa preservada ✅ · nenhum erro de JavaScript ✅

## Ainda igual (próximos passos)

Os dados de exemplo ("Ana", respostas pré-marcadas) continuam como valores iniciais.
Eles serão removidos no passo 2.
