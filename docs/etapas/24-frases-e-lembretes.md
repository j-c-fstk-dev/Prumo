# Etapa 24: Bloco D, parte 1 (frases que mudam e lembretes no momento certo)

**Data:** 2026-10-18 · Plano: [etapa 19](19-ajustes-do-teste.md)

## Achados do teste
- "Fazer as frases de forma rotacional nas etapas da anamnese, ao invés de frases fixas (precisamos de muito mais frases)."
- "Lembrete e 'Você sabia' estão estáticos: sincronizar com a etapa. Ex.: a mensagem de segunda só na segunda."
- "As frases inspiradoras repetiram."

## O que mudou
| Onde | Como era | Como ficou |
|---|---|---|
| Perguntas da anamnese | Nenhuma frase de apoio | Cada pergunta mostra uma frase curta de encorajamento ("Não tem resposta errada aqui."). Banco de **40 frases**, sorteado cada vez que o app abre, sem repetir numa rodada |
| "Lembrete gentil" no início | Uma frase fixa para sempre | **"Lembrete do dia"** escolhido pelo momento: primeiro dia, volta depois de uns dias, segunda-feira, sexta, fim de semana, dia 1º do mês e capítulo atual, misturado com 12 lembretes gerais. Muda todo dia |
| Citação por tema (telas entre etapas, compromisso, tarefas) | Sempre a primeira citação do tema | Troca a cada dia entre as citações verificadas do tema |

Todas as frases são escritas pelo Prumo (não são citações), seguem o [guia de voz](../guia-de-voz.md) e
um teste garante que não usam jargão nem prometem renda.

## Ainda no bloco D
Citações de autores de livros famosos: a pesquisa está em andamento, com a mesma regra de sempre (só
entra frase localizada na obra, com fonte).

## Testes
- 113 testes de regra (novos: tamanho do banco, sem jargão, mensagem de segunda só na segunda, primeiro
  dia e volta, muda de um dia para o outro)
- 12 testes ponta a ponta
