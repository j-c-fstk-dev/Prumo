# Etapa 52: roteiro revisado (parte 1)

Mudanças que vieram da "Revisão do Roteiro de 90 dias do Prumo" (out/2026), aprovadas com quatro ajustes.

**O problema que a revisão apontou:** o roteiro criava o produto e escolhia o preço antes de ouvir alguém falar do problema. E decidia "seguir" contando quem disse sim, não quem se comprometeu.

**Progresso salvo:** os passos mantêm o mesmo id, então nada do que a pessoa já concluiu se perde. Os passos novos entram como pendentes.

## Caderno: um funil só
- **Etapas:**
  1. 👋 Novo
  2. 💬 Conversou (sobre o problema, sem mostrar a ideia)
  3. 👀 Viu a proposta
  4. 🤝 Se comprometeu
  5. ⭐ Cliente
  6. 🌙 Agora não
- **Pular etapas:** dá. Alguém da rede pode comprar direto.
- **Tipo de compromisso:** é uma etiqueta da pessoa, não uma etapa.
  - Os tipos são 📅 Marcou uma data (tempo), 🙋 Indicou alguém (reputação) e 💰 Pagou ou deu sinal (dinheiro).
  - Marcar uma etiqueta leva a pessoa para "Se comprometeu", se ela ainda estava antes.
- **Dados antigos:** "Interessado" vira "Viu a proposta", porque interesse não é compromisso. Isso vale no histórico e nos backups antigos (`normalizePerson`, chamado no `migrate`).
- **O card "Seu funil":** nomes → conversas → viram a proposta → compromissos. Cada pessoa conta até a etapa mais longe a que chegou (`funnel`).
- **Decisão da semana 6** (`testVerdict`):
  - **seguir:** 2 compromissos, sendo pelo menos 1 em dinheiro;
  - **ajustar:** teve compromisso, mas nenhum em dinheiro. A dor existe: mude a oferta ou o preço;
  - **trocar de caminho:** nenhum compromisso em 5 apresentações.
- **Coach:** as orientações de mensagem seguem as etapas novas. O servidor ainda aceita `interessado`, para as versões do app que estão em cache.

## Roteiro: primeiro o problema
Agora são 23 passos, com 3 novos.

| Sem. | Passo |
| --- | --- |
| 1 | Rascunhar a frase · Listar 20 pessoas (com o "por que") · **Montar a semana leve** (era da semana 11) |
| 2 | Convite para conversar sobre o problema · **Conversar com 5 pessoas sobre o problema** (novo, com contador) |
| 3 | Criar a versão mínima · Preço, como receber e como devolver em 7 dias · Mostrar para 5 e pedir um próximo passo |
| 4 | Ajustar · 3 posts no seu canal · Convidar 10 para o teste pago |
| 5–6 | Primeira entrega (com depoimento autorizado) · Decidir pelos compromissos |
| 7–10 | Mensagem de venda (devolução e contato) · Abrir vendas · Indicações · Organizar a entrega · Preço com taxas e imposto |
| 11–13 | **Revisar a semana padrão** (novo) · Depoimentos e números do funil · **Ver se vale formalizar** (novo) · Próximos 30 dias · Carta |

- **Nomes dos capítulos:**
  1. Entender o problema
  2. Testar a solução
  3. As primeiras vendas
  4. Criar ritmo
- **Duas camadas por passo:**
  - **"Você fez"** marca o passo como feito e só depende da pessoa;
  - **"O que o mundo respondeu"** traz o sinal e o que fazer se ele não veio. O passo conta como feito mesmo sem resposta.
- **Contadores do Caderno nos passos:**
  - 20 nomes;
  - 5 conversas sobre o problema;
  - 5 pessoas que viram a proposta.
- **Teste do usuário com os clientes dele:** pago e barato por padrão, com o "preço de fundador".
  - Grátis só para 1 ou 2 pessoas, e só com um compromisso combinado antes: data marcada, depoimento autorizado ou uma indicação.
- **O básico do Brasil:** é uma orientação geral, não aconselhamento jurídico nem contábil. O passo de formalizar diz isso.
  - devolução em 7 dias (CDC, art. 49) no preço e na mensagem de venda;
  - autorização por escrito para usar depoimentos;
  - bônus só se for verdade;
  - taxas e imposto na revisão do preço;
  - MEI no capítulo 4.
- **Convite:** a mensagem pronta para quem está em "Novo" pede uma conversa sobre o problema, sem mostrar a ideia.
- **Ordem dos passos:** fica explícita em `ORDER` (`src/data/prumoData.ts`).

## Carta ao eu futuro
- O padrão agora é **daqui a 10 anos**. A pessoa pode trocar para 3, 5, 15 ou 20 anos.
- Trocar o número atualiza a primeira linha do rascunho. O resto do texto é da pessoa e não muda.
- Cartas antigas, sem o número de anos, continuam como "daqui a 90 dias".
- O passo da semana 13 continua sendo reler e responder.

## Fica para a parte 2
- **Ritmo leve ou firme:**
  - a pessoa escolhe na entrada;
  - "15 min no que vai oferecer" acaba no capítulo 3;
  - "Mostrar algo útil" passa para 1× por semana nessa fase.
- **"Quando vou fazer":** pedir dia e hora ao começar cada passo.
- **Recomeço:** "Recomeçar a partir de hoje" logo na volta, depois de 7 dias ou mais parada. Segunda-feira e dia 1 ficam como um empurrão extra.
- **Passos longos:** quebrar os de 30 a 60 minutos em partes de 15 a 20.
- **Métricas:**
  - primeira conversa em até 7 dias;
  - decisão na semana 6;
  - primeira venda até o dia 70;
  - volta depois de uma pausa;
  - tempo real ÷ tempo estimado;
  - botão "pular" com motivo.
