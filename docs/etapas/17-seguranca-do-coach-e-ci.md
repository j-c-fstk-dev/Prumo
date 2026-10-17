# Etapa 17: Segurança do coach e testes automáticos no GitHub (Fase 2, passos 1 e 2)

**Data:** 2026-10-17 · Base: [pesquisa 07](../pesquisa/07-lgpd-e-play-store.md)

## Coach: lógica única para servidor local e Cloudflare

`server/coach.ts` concentra toda a lógica (prompt, limites, crise, fallback, denúncia). O `server.ts`
(Express, uso local) caiu de cerca de 150 para 57 linhas e só repassa as requisições. O Worker da Cloudflare
(próxima etapa) vai chamar as mesmas funções. `server/llm.ts` passou a receber as variáveis de ambiente
como parâmetro (no Worker elas não vêm de `process.env`).

## Segurança

| Item | Como funciona |
|---|---|
| **Protocolo de crise** (`server/safety.ts`) | Expressões de alto sinal ("não quero mais viver", "me matar", "suicídio"...). Se detectar, **o servidor não chama a IA** e responde com acolhimento + **CVV 188** (ligação e chat) + **SAMU 192**, com links clicáveis. Testado para não disparar em conversa de negócio ("estou sem saída com o preço", "morro de vergonha de vender"...) |
| **Prompt** | Regras novas: não é terapeuta, indica o CVV em sofrimento, sem conselho médico/jurídico/financeiro específico, nunca promete renda |
| **Consentimento** | Antes do 1º uso: o que vai para a IA (mensagem, primeiro nome, resumo do plano, tarefa atual), o que **não** vai (reflexões, cartas, tarefas pessoais), processamento possivelmente fora do Brasil, "não é terapia". Fica salvo |
| **Denunciar resposta** | Em cada resposta da IA: ofensiva / perigosa / errada / outro. O servidor registra no log **só a resposta e o motivo**, nunca a mensagem da pessoa (política de IA generativa da Google Play) |
| **Status honesto** | O cabeçalho dizia sempre "Online · IA em Tempo Real". Agora mostra "IA indisponível agora · respostas prontas" quando for o caso, e cada resposta pronta vem marcada |
| **Limites** | Mensagem até 1.000 caracteres (413 acima disso), histórico de 6 mensagens × 1.000 caracteres, campos de contexto cortados e sem quebras de linha, corpo da requisição até 64 KB |

## Bugs achados pelos testes ponta a ponta

1. **Perda da última ação ao fechar o app:** o salvamento esperava 300 ms para agrupar a digitação. Concluir
   algo e fechar o app logo em seguida perdia a ação (aconteceu com o consentimento e com a celebração de
   capítulo). Agora o app **salva imediatamente**; as gravações no IndexedDB são ordenadas.
2. **Regravação desnecessária ao abrir:** o app regravava o estado que tinha acabado de ler. Isso poderia
   sobrescrever dados vindos de outra aba. Agora só grava quando algo muda.

## Testes no repositório e CI

- **Playwright Test** em `e2e/` (`npm run test:e2e`), com 7 testes: jornada completa (sugestão confirmada
  muda o nicho, cartas, "quando vou fazer", tarefa pessoal, check-in, fim de capítulo, recarga) · consentimento
  salvo · resposta pronta marcada · protocolo de crise com links · denúncia chegando ao servidor · acolhimento
  na volta · remendo.
- Rodados **3 vezes seguidas sem falha**.
- **Vitest:** 86 testes, sendo 12 novos do coach e da crise (a IA não é chamada em crise; limites; corte de contexto
  e histórico; fallback quando a IA falha; denúncia sem a mensagem da pessoa).
- **GitHub Actions** (`.github/workflows/ci.yml`): a cada push roda tipos → testes → build → ponta a ponta,
  com relatório anexado se falhar.
