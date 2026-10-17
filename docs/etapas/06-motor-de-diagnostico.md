# Etapa 06: Motor de diagnóstico (Fase 1, passo 3)

**Data:** 2026-10-17 · Base: [pesquisa 01](../pesquisa/01-metodo-de-decisao.md) e [04](../pesquisa/04-sons-e-movimento.md)

## Antes × depois

**Antes:** todo mundo recebia o mesmo diagnóstico ("Produtividade para Freelancers + Mini-curso").
**Agora:** o diagnóstico sai das respostas, por regras transparentes em `src/domain/diagnosis.ts`.

## Como o motor decide

| Saída | Regra | Base |
|---|---|---|
| **Nicho** (8 opções) | habilidade (o que pedem sua ajuda) × 3 + interesse (o que consome por prazer) × 2 + papel preferido × 1 | Encaixe pessoa-ambiente prediz persistência (Nye et al.) |
| **Produto** (escada: serviço → sessão 1:1 → guia/modelo → mini-curso) | pontos por prazo, tempo/semana, conforto com câmera, trabalhar sozinho × com pessoas, gostar de ensinar | Menor atrito até o 1º real (effectuation) |
| **Canal** | sempre começa pela **rede de contatos (WhatsApp)** + Instagram (se usa e topa aparecer) ou grupos/comunidades | "Pássaro na mão" (Sarasvathy) |
| **Prazo** | conforme a urgência informada | — |
| **Hipótese / teste / sinal** | "[Público] paga por [produto] para resolver [dor]" · teste com 5 pessoas · sinal: 2 de 5 em 14 dias | Abordagem científica (Camuffo et al.) |
| **Alternativas** | 2 opções (2º nicho; 2º formato), **recolhidas** | Sobrecarga de escolha (Chernev et al.) |
| **Avisos** | prazo curto para pouco tempo; meta de R$ 10 mil é longo prazo; respostas sem tema claro | Honestidade |

- **Tela de cálculo:** as etapas agora citam as respostas reais ("Cruzando sua facilidade com
  conselhos de vida & carreira", "Considerando seu tempo real: 3 a 5 h/semana"), como manda o
  estudo da "labor illusion".
- **Pivô:** "Explorar esta alternativa" troca o plano. O original vira uma das alternativas.
- **Coach:** recebe o diagnóstico real (nicho, produto, público, canal, prazo).
- **A IA não decide:** o motor funciona offline. Pôr a IA para redigir a justificativa
  com as palavras da pessoa fica para a Fase 2.

## Testes automáticos

`npm test` (Vitest) com 9 casos: design + sem câmera → guia; ensinar finanças + câmera →
mini-curso; aconselhar + conectar + pressa → sessão de carreira; habilidade pesa mais que interesse;
etapas citam respostas; aviso de prazo curto; respostas vazias não quebram; hipótese sempre
presente; pivô preserva o plano original ✅

Teste ponta a ponta: o robô escolhe a 1ª opção de cada pergunta e o resultado bate com a previsão
pela regra (nicho de carreira, guia + modelo, aviso de prazo curto); o pivô troca o nicho ✅

## Limitações conhecidas (próximos passos)

- As **tarefas do roteiro ainda são genéricas**: não mudam conforme o produto (serviço ×
  guia × curso). Precisam de modelos de tarefas por formato, junto do item "tarefas pessoais e edição".
- O catálogo de nichos tem 8 temas. Ele deve crescer com os dados das primeiras pessoas que usarem.
- Os pesos foram definidos por raciocínio sobre a pesquisa, não calibrados com usuários reais.
  O teste com 10 a 20 pessoas (Fase 5) é onde isso se ajusta.
