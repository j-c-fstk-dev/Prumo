# Etapa 08: Tarefas por formato, tarefas pessoais e "quando vou fazer" (Fase 1, passo 5)

**Data:** 2026-10-17

## Roteiro adaptado ao diagnóstico (`src/domain/tasks.ts`)

| Tarefa | Muda conforme | Exemplo |
|---|---|---|
| t2 Versão mínima | formato do produto | serviço: "Desenhar seu serviço mínimo" · sessão: "Montar o roteiro da sua sessão de 1 hora" · guia: "Montar o esboço do seu guia + modelo" · curso: "Roteirizar as aulas" (gravar só a aula 1) |
| t3 Validar com 3 pessoas | texto geral para os 4 formatos | "o desenho do serviço, o roteiro da sessão, o esboço do guia ou a aula 1" |
| t4 Preço de teste | formato | serviço R$ 50–150 · sessão R$ 50–120 · guia R$ 19–47 · curso R$ 47–97 (**referência inicial**, não regra) |
| t5 Atrair desconhecidos | canal | com Instagram: 3 posts de dor real · sem: ajudar em 2 grupos/comunidades sem vender |
| t6 Teste | hipótese do diagnóstico | usa o mesmo teste e o mesmo sinal de sucesso (2 de 5 em 14 dias) |

**Capítulos 2 e 3 destrancados:** no modelo aprovado ("caminho grátis, aceleração paga")
o roteiro inteiro é grátis.

## "Quando vou fazer" (intenção de implementação, Gollwitzer & Sheeran, d = 0,65)

- Componente `WhenPicker`: gatilhos da rotina ("depois do café", "no almoço", "depois do trabalho",
  "antes de dormir") ou texto livre "quando eu...". Mostra "⏰ Combinado: no almoço, eu faço isso".
- Lembra o que a pessoa disse que **rouba seu tempo** (campo aberto da anamnese) na hora de escolher.
- Disponível no **detalhe de cada tarefa do plano** e em **cada tarefa pessoal**. Aparece no cartão do
  próximo passo da home.

## Tarefas pessoais

- Criar (com "quando vou fazer"), concluir, **editar**, **apagar** e **reordenar** (subir/descer).
- Aparecem na home ("Suas tarefas de hoje") e no roteiro ("Minhas tarefas, fora do plano").
- As tarefas do plano podem ter o **título editado**. **Não podem ser reordenadas:** a ordem dos capítulos
  é pedagógica (promessa → contato → retorno), e trocar a ordem quebraria o método.

## Verificação

- `npm test`: **27 testes** ✅ (5 novos: roteiro base sem cadeados; 4 versões mínimas diferentes;
  preço por formato; troca da tarefa de Instagram por grupos; teste da hipótese na tarefa 6)
- Ponta a ponta: guia → tarefa t2 "Montar o esboço do seu guia + modelo" ✅ · 0 cadeados ✅ ·
  tarefa pessoal "Pagar a conta de luz / antes de dormir" ✅ · "no almoço" combinado na tarefa do plano
  aparece na home ✅ · tudo preservado ao recarregar ✅ · sem erros de JavaScript ✅
