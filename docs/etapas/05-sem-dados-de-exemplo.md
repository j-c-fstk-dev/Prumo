# Etapa 05: Sem dados de exemplo (Fase 1, passo 2)

**Data:** 2026-10-17

## O que mudou

- O app começa **em branco**: sem nome "Ana", sem respostas pré-marcadas, sem reflexão escrita
  e sem tarefa já concluída.
- **"Continuar" bloqueado sem nome** no cadastro. Nas perguntas ele já ficava bloqueado sem resposta.
- **Saudação do coach gerada na hora**, sempre citando a tarefa atual. Não é salva no histórico.
- **Contexto do coach:** a última tarefa aberta, se ainda estiver pendente; senão, o próximo passo.
  Antes, era sempre a tarefa 2.
- **Textos sem gênero presumido:** "Querida {nome}" → "Olá, {nome}"; "você estava insegura" →
  "você não sabia bem por onde começar"; "Ana" removido do áudio e da carta.
- Botão **"Já tenho conta · Entrar"** removido: o MVP não tem contas (os dados ficam no aparelho).

## Verificação

Teste ponta a ponta do zero: "Continuar" bloqueado sem nome ✅ e sem resposta ✅ → 12 perguntas
respondidas → resultado → compromisso → carta "Olá, Jo," → home 0 → 1 estrela → coach →
recarregar mantém tudo ✅

## Ainda fixo

O **diagnóstico** (nicho, produto, canal) continua o mesmo para todos. Ele será trocado pelo
motor de diagnóstico no passo 3.
