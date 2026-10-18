# Etapa 14: Ferramentas complementares em 3 camadas (Fase 3, passo 2)

**Data:** 2026-10-17

## Decisão

Avaliamos deixar as indicações só por conta do coach de IA. **Rejeitado como camada única**, porque o modelo
sabe as coisas até a data de treino, não consulta a internet e, quando não sabe, **inventa com confiança**
(preços, planos gratuitos que acabaram, ferramentas que fecharam). Além disso, cada pessoa receberia uma resposta
diferente, nada poderia ser testado e o grátis tem 5 mensagens por semana.

**Adotado: 3 camadas.**

| Camada | O que faz | Onde |
|---|---|---|
| 1. Motor | Cada tarefa sugere **categorias** ("assistente de IA para rascunhos", "receber pagamentos"...), nunca marcas. A tarefa da versão mínima muda conforme o formato (sessão → agendamento + videochamada; curso → gravação...) | `src/domain/tasks.ts` |
| 2. Caixa curada | 9 categorias, cada uma com descrição, dica de uso e 1 a 4 exemplos conhecidos. **Sem preço, plano ou limite**, e a tela diz "Preços e condições mudam: confira no site" | `src/data/ferramentas.ts` |
| 3. Coach | Recebe a mesma caixa da tarefa atual. Regras no prompt: categoria primeiro, no máximo 2 exemplos, **nunca afirmar preço ou condição**, mandar conferir no site, IA como rascunho e sem dados de clientes | `server.ts` |

## Categorias

Assistente de IA para rascunhos · Editor de design · Documentos e planilhas · Receber pagamentos ·
Formulários e pesquisas · Agendamento · Videochamada · Gravar e editar vídeo curto · Conversas com clientes.

## Garantias (testes automáticos)

- Toda categoria sugerida por qualquer tarefa, em qualquer formato, **existe no catálogo e tem exemplo**.
- A versão mínima sugere as ferramentas do formato.
- **Os textos do catálogo não podem mencionar preço ou plano** ("R$", "grátis", "gratuito", "free", "pago",
  "premium", "/mês"...). Se alguém escrever, o teste quebra.
- Links de exemplo usam https.

## Segurança

O app manda ao servidor **só os códigos das categorias**. O texto que vai para o prompt sai do catálogo do
próprio servidor e códigos desconhecidos são descartados. Testado: um "código" com instrução injetada foi
ignorado.

## Transparência e manutenção

- **Nenhuma indicação é paga.** A tela diz isso. Se um dia houver link de afiliado, ele precisa ser identificado
  (confiança + CDC).
- **Revisão a cada 3 meses** (`TOOLBOX_REVISED_AT`): conferir se cada exemplo existe e serve para a categoria.
- Textos de tarefas que citavam marcas ("Notion", "Canva", "Kiwify"...) ficaram genéricos.

## Achado no caminho

A seção "Recursos de apoio" das tarefas listava materiais que **não existem** (ex.: "Fórmula da Promessa
Magnética (PDF)"). Agora está marcada como "em breve no kit de execução" até o kit ser criado.

## Verificação

`npm test`: **56 testes** ✅ · prompt do coach conferido com uma API falsa ✅ · injeção descartada ✅ ·
tela da tarefa de guia: 3 categorias, exemplos com link e aviso sem preço ✅
