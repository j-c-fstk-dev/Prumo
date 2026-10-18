# Frente 1: Método de decisão (nicho, produto, canal)

**Pergunta:** como o Prumo deve transformar as respostas da anamnese num plano
(nicho, produto, público, canal) de forma defensável?

## Aviso honesto

**Não existe estudo científico que diga "quem sabe X deve vender Y no nicho Z".**
O que existe é evidência sobre *como decidir sob incerteza*, *o que prediz desempenho
e persistência* e *como apresentar escolhas*. Por isso o motor do Prumo deve ser uma
**heurística transparente**, e o diagnóstico deve ser apresentado como **hipótese a testar**,
não como veredito.

---

## Achados

### 1. Decidir como cientista: hipótese → teste → evidência 🟢/🟡
**Camuffo, Cordova, Gambardella & Spina (2020), *Management Science*.** RCT com 116
startups italianas acompanhadas por cerca de 1 ano. Os empreendedores treinados a formular
hipóteses e testá-las tiveram melhor desempenho e pivotaram mais cedo para ideias melhores,
sem abandonar mais. Uma replicação maior (759 empresas, 4 RCTs) confirma o ganho de
desempenho, mas encontrou *menos* pivôs, então o mecanismo do pivô ainda está em discussão.

→ **Para o Prumo:** cada diagnóstico vira *"Hipótese: [público] paga por [produto] para
resolver [dor]. Teste: [ação]. Sinal de sucesso: [critério]."* O Capítulo 2 (Primeiro Contato)
é exatamente essa etapa de teste.

### 2. Comece com o que você já tem (Effectuation) 🟡
**Sarasvathy (2001), *Academy of Management Review*, "Causation and effectuation".**
É baseado em estudos com empreendedores experientes. Os princípios que importam aqui:
- **Pássaro na mão:** comece por *quem você é, o que sabe e quem conhece*.
- **Perda aceitável:** decida pelo que você pode perder (tempo e dinheiro), não pelo lucro esperado.
- **Colcha de retalhos:** parcerias e pré-compromissos com pessoas reais moldam o produto.

A evidência é teórica e qualitativa, mas amplamente usada no ensino de empreendedorismo.

→ **Para o Prumo:** a anamnese de 7 dimensões já cobre "quem sou, o que sei, quem conheço".
**Falta perguntar a perda aceitável** ("quantas horas por semana e quantos R$ você pode
investir *sem sofrer* se não der certo?") e usar isso como teto do plano.

### 3. Interesse + encaixe predizem desempenho e persistência 🟢
**Nye, Su, Rounds & Drasgow (2012), *Perspectives on Psychological Science*.** Meta-análise
com 60 estudos: interesses predizem desempenho e persistência no trabalho e nos estudos,
e o *encaixe* pessoa-ambiente prediz melhor que o interesse isolado. Uma meta-análise de
2017 (92 estudos) encontrou r = 0,32 para o encaixe contra 0,16 para o interesse sozinho.

→ **Para o Prumo:** o motor deve **cruzar** habilidade × interesse × formato preferido,
e não recomendar só pelo que a pessoa sabe fazer. Uma habilidade sem interesse leva ao abandono.

### 4. "Paixão se desenvolve, não se encontra" 🟡
**O'Keefe, Dweck & Walton (2018), *Psychological Science*.** Em 5 estudos, quem acredita
que interesses são fixos ("achar sua paixão") explora menos, espera motivação ilimitada
e perde o interesse mais rápido quando a tarefa fica difícil.

→ **Para o Prumo:** a linguagem do app deve dizer *"seu interesse cresce enquanto você
faz"* e **avisar antes** que haverá uma parte chata. Não devemos prometer que "você vai
amar cada passo".

### 5. Menos opções quando há incerteza 🟢 (com moderadores)
**Chernev, Böckenholt & Goodman (2015), *Journal of Consumer Psychology*.** Meta-análise:
a sobrecarga de escolha existe, mas depende de moderadores. Ela é maior quando a decisão é
difícil, as opções são complexas e **a pessoa não sabe o que prefere**. Esse é o retrato do
nosso usuário. (Uma meta-análise anterior, Scheibehenne et al. 2010, achou um efeito médio
próximo de zero, e a briga entre as duas é justamente sobre os moderadores.)

→ **Para o Prumo:** mostrar **1 recomendação principal**, com "ver 2 alternativas"
recolhido. Isso valida a proposta original de "1 nicho, 1 produto, 1 canal".

---

## Proposta de motor de diagnóstico (v1)

Esta parte é raciocínio meu sobre os achados acima, não um resultado de estudo:

1. **Pontuação local e determinística** (funciona offline e é testável). É uma matriz que
   cruza as respostas: habilidades × interesses × formato confortável × tempo disponível ×
   conforto com exposição × perda aceitável. Ela gera o ranking dos 3 melhores
   pares nicho+produto.
2. **Escada de produtos por menor atrito até o 1º real.** Vai de serviço feito pela pessoa →
   sessão 1:1 → guia/template → mini-curso. Para quem tem pouco tempo e zero audiência,
   **serviço ou 1:1 costumam gerar o primeiro real mais rápido** que um curso (é consenso de
   praticantes 🔴, mas coerente com effectuation). O diagnóstico padrão atual ("mini-curso +
   template Notion") deveria ser só um dos possíveis resultados.
3. **A IA (Gemini) escreve, não decide.** Ela recebe o resultado da matriz e redige a
   justificativa personalizada com as palavras do próprio usuário. Se a IA falhar, a matriz
   continua entregando o diagnóstico.
4. **Diagnóstico = hipótese.** O app mostra o critério de validação e permite trocar para
   uma alternativa se o teste falhar (o pivô).

## Decisões propostas

- [ ] Adicionar pergunta de **perda aceitável** (tempo/dinheiro) na anamnese
- [ ] Implementar matriz de pontuação + escada de produtos (Fase 1)
- [ ] Apresentar 1 recomendação + 2 alternativas recolhidas
- [ ] Reescrever o diagnóstico no formato hipótese / teste / sinal de sucesso
- [ ] Ajustar textos: "interesse se desenvolve" e aviso honesto sobre a parte difícil

## Lacunas

- Taxas reais de conversão de pequenos infoprodutos ou serviços no Brasil (frente 6)
- Validar a matriz com 10 a 20 pessoas reais antes do lançamento (teste de usabilidade)

## Fontes

- Camuffo et al. 2020: [Bocconi IRIS](https://iris.unibocconi.it/handle/11565/4013977) · [PDF](https://www.gwern.net/doc/economics/2019-camuffo.pdf) · [replicação](https://causalclaims.trfetzer.com/paper/DP15972.html)
- Sarasvathy 2001: [resumo KU](https://innovationenglish.sites.ku.dk/model/sarasvathy-effectuation/) · [TU Delft](https://tudelft.nl/tbm/dce/student-resources/effectuation-and-the-entrepreneurial-mindset)
- Nye et al. 2012: [Perspectives on Psych. Science](https://journals.sagepub.com/doi/10.1177/1745691612449021) · [2017 congruence](https://experts.illinois.edu/en/publications/interest-congruence-and-performance-revisiting-recent-meta-analyt/)
- O'Keefe, Dweck & Walton 2018: [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6180666) · [Stanford News](https://news.stanford.edu/2018/06/18/find-passion-may-bad-advice/)
- Chernev et al. 2015: [Kellogg](https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual) · [réplica Scheibehenne 2011](https://abcwest.cogs.indiana.edu/pmwiki/pdf/scheibehenne.reply.2011.pdf)
