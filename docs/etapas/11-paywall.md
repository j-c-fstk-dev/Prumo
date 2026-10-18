# Etapa 11: Estrutura do paywall, desligada (Fase 1, passo 8)

**Data:** 2026-10-17 · Modelo aprovado: [pesquisa 06](../pesquisa/06-concorrentes-e-freemium.md)

## Princípio

**O caminho é grátis; a aceleração é paga.** O roteiro (diagnóstico, 3 capítulos, tarefas, check-in,
constelação) **nunca** é bloqueado. O código nem tem um "recurso" de capítulo para bloquear.

## Como funciona (`src/domain/entitlements.ts`)

- **Um lugar só para os limites** (`FREE_LIMITS`): coach com 5 mensagens/semana · 1 troca de plano ·
  1 modelo do kit por capítulo · áudios guiados no Capítulo 1. Os preços ficam em `PRICES` (R$ 19,90/mês,
  R$ 119,90/ano, 50% vitalício para fundadores).
- **`can(recurso)`** responde se pode, quanto resta e o motivo. O app pergunta antes de usar
  (`guard`). Se não pode, abre a tela de planos **mostrando o motivo**.
- **Planos:** `open_beta` (paywall desligado: tudo liberado) · `founder_trial` (primeiros **30 dias** após
  o onboarding) · `premium` · `free`.
- **Chave:** `VITE_PAYWALL_ENABLED=false` no `.env` (padrão). Para ligar, troque para `true` e publique.

## O que já é medido

- Mensagens ao coach **por semana** (renovam na segunda).
- Trocas de plano: "explorar alternativa" e refazer a anamnese **depois** de entrar na jornada.
  Refazer durante o onboarding não conta.

O kit de execução, os áudios por capítulo, os múltiplos projetos e o PDF já têm regra,
mas os recursos em si ainda não existem (Fase 3/pós-MVP).

## Telas

- **Planos:** benefícios do Premium, o que é grátis para sempre, preços aprovados, aviso "fase de testes:
  tudo liberado" e botão **"Assinaturas em breve"**. A cobrança real (Google Play Billing) entra
  na Fase 4/5.
- **Perfil:** mostra o plano ("Acesso completo · fase de testes", "Premium de fundador · N dias
  restantes"...). O texto antigo "desbloqueie as fases de Marketing e Lançamento" foi removido.

## Verificação

- `npm test`: **52 testes** ✅ (8 novos: teste aberto, fundador nos 30 dias, assinante, tudo liberado com
  paywall desligado, limite semanal do coach, 1 troca de plano, áudios do Capítulo 1, dias restantes)
- Ponta a ponta com o paywall **desligado:** fluxo inteiro sem bloqueio ✅
- Com o paywall **ligado** e dados simulados: plano grátis no perfil ✅ · 6ª mensagem da semana abre
  os planos com o motivo e o preço anual ✅ · fundador (5 dias) vê "25 dias restantes" e usa o coach
  sem bloqueio ✅
