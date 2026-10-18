# Etapa 27: Caderno do projeto e copiar respostas do coach

**Data:** 2026-10-18

## Pedido
- "Um botão pra copiar as mensagens do coach, porque às vezes tem coisas relevantes."
- "Se a pessoa quiser anotar coisas sobre o produto ela vai ter que usar outro app. Como manter tudo aqui?"

Decisões do dono: Caderno como **aba própria**; registro de conversas do teste fica para uma 2ª rodada.

## O que entrou
| Onde | O quê |
|---|---|
| **Coach** | Em cada resposta: **Copiar** (área de transferência, com plano B para navegadores antigos) e **Salvar no caderno** (guarda com a data e a tarefa atual). Não aparece na mensagem de crise |
| **Aba Caderno** (nova, entre Coach e Você) | **Ficha do meu produto**: o que ofereço, pra quem, problema, preço de teste, onde acho clientes e "minha frase". Vem preenchida pelo resultado e a pessoa edita (o que ela escreve tem prioridade, inclusive apagar) |
| | **Anotar** com etiquetas: 💡 Ideias, 🗣️ Conversas, 📚 Aprendizados (🧭 Do coach vem do chat). Cada anotação guarda a tarefa em que a pessoa estava |
| | **Minhas anotações**: busca (sem ligar para acento), filtro por etiqueta, copiar, editar e apagar (com confirmação) |
| | **Anotações das tarefas**: o que foi escrito dentro de cada tarefa; toque para abrir a tarefa |
| | **Exportar**: no celular abre o "compartilhar" (WhatsApp, e-mail, Drive); no computador baixa `caderno-prumo.txt` |
| **Tarefa** | Campo "✍️ Minhas anotações desta tarefa", que salva sozinho e aparece no Caderno |

## Privacidade e limite honesto
Tudo fica **só no celular** (IndexedDB), como as reflexões. Nada vai para a IA sozinho. Se a pessoa limpar
os dados do navegador, as anotações somem: a tela avisa e sugere "Exportar" de vez em quando. Backup
automático só quando virar app instalado (Fase 4).

## Testes
- 3 testes de regra novos (ficha com prioridade da pessoa, busca e filtro, exportação)
- Novo teste ponta a ponta: nota na tarefa, salvar e copiar resposta do coach, editar a ficha, anotar,
  buscar e conferir que tudo continua lá depois de recarregar
