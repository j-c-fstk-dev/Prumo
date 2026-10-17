# Frente 6: Concorrentes e modelo freemium

**Pergunta:** contra o que o Prumo compete, quanto cobrar, e o que fica grátis × pago
de forma que o app se sustente **sem trair a missão** (ajudar quem muitas vezes ainda não tem renda)?

---

## 1. Concorrência real

| Alternativa | O que oferece | Modelo | Lição para o Prumo |
|---|---|---|---|
| **ChatGPT / Gemini / Claude grátis** | "me ajuda a achar um nicho" | grátis | **É o concorrente nº 1.** O Prumo precisa ganhar em **estrutura, continuidade e ritual**: diagnóstico guiado, plano em capítulos, rotina diária, memória do contexto. Uma resposta solta não oferece isso |
| **Fabulous** | hábitos com narrativa e "jornadas" | assinatura | Inspiração de tom; não encontrei preço oficial no Brasil |
| **Finch** | autocuidado com pet virtual | **freemium generoso**: os recursos principais são grátis, o premium é personalização (cerca de US$ 9,99/mês segundo análise da WhistleOut) | O hábito diário não deve ser bloqueado |
| **Duolingo** | streaks e gamificação | freemium; Super ≈ R$ 14,99/mês ou R$ 179,90/ano | Referência de preço e de sequência |
| **Headspace / Calm** | bem-estar | assinatura; ≈ R$ 15,99/mês ou R$ 109,99/ano (Headspace) e R$ 39,90/mês ou R$ 199,80/ano (Calm), segundo o Olhar Digital (mar/2026) | Faixa de preço que o brasileiro já paga em apps de bem-estar |
| **Cursos "como ganhar dinheiro na internet"** | conteúdo longo | venda única, muitas vezes cara | Contraponto: o Prumo é **15 min/dia**, personalizado e honesto (sem promessa de enriquecimento) |
| **Hotmart / Kiwify** | plataforma para vender infoproduto | taxa por venda | **Não são concorrentes, são aliados.** O usuário do Prumo vai vender lá. Há potencial futuro de parceria ou afiliação |
| **App de "mapa humano"** que você citou | autoconhecimento + plano | ? | **Preciso do nome** para analisar |

## 2. O que os dados de mercado dizem 🟡 (dados de indústria, não estudos)

**RevenueCat, State of Subscription Apps 2026** (115 mil apps):
- **Paywall rígido** (paga para usar) converte cerca de **10,7%** em 35 dias, contra **2,1%** no **freemium**,
  cerca de 5 vezes mais. Hard paywall gera US$ 3,09 por instalação em 60 dias, contra US$ 0,38 no freemium.
  As fontes divergem se a métrica é "trial→pago" ou "download→pago" **[conferir no relatório]**.
- A **retenção** de assinantes anuais após 1 ano é praticamente igual (28% × 27%).
- **Testes grátis mais longos convertem melhor:** testes de 17 a 32 dias tiveram mediana de **42,5%** de conversão,
  contra 25,5% nos de até 4 dias.
- Em Saúde & Fitness, **68% dos planos são anuais**.

**Leitura honesta:** o paywall rígido dá mais dinheiro por usuário, mas **bloqueia exatamente quem
o Prumo quer ajudar** e mata o boca a boca, que é o nosso marketing gratuito. Para um app de
missão no começo, que precisa de usuários, depoimentos e avaliações na loja, **freemium + teste
longo** é o caminho mais coerente. O paywall rígido pode ser testado depois, com dados.

## 3. Taxas da Google Play ⚠️

- Correção: eu havia dito 15% em assinaturas. **Não consegui confirmar isso para o Brasil em 2026.**
- O Google está separando a taxa de serviço da taxa de cobrança. Em EUA, UE e Reino Unido,
  a partir de 30/06/2026, a taxa de serviço é de 10% no primeiro US$ 1 milhão por ano + 5% de cobrança pelo
  Google Play Billing, com expansão global prevista até 30/09/2027.
- O Brasil está no piloto de **"user choice billing"** (cobrança alternativa dentro do app, com
  desconto de 4% na taxa padrão), o que abre a possibilidade de **Pix**.
- **Ação:** conferir no Play Console quando a conta estiver aberta.

## 4. Proposta de modelo (v1)

### Princípio: **o caminho é grátis; a aceleração é paga**

A pessoa consegue fazer **o plano inteiro de graça**. O premium dá **velocidade, profundidade
e companhia**. Isso preserva a missão e a confiança, e quem fatura o primeiro real com o
Prumo vira o cliente mais fiel e o melhor depoimento.

| Recurso | Grátis | Premium |
|---|---|---|
| Anamnese + diagnóstico completo | ✅ | ✅ |
| Roteiro com os 3 capítulos | ✅ | ✅ |
| Tarefas pessoais, check-in, constelação, sequência gentil | ✅ ilimitado | ✅ |
| Lembrete diário + citações | ✅ | ✅ |
| **Coach de IA** | 5 mensagens/semana (a IA custa por mensagem) | ilimitado |
| **Kit de execução**: modelos de mensagem para validar, roteiro de conversa, calculadora de preço, modelos de página de venda | 1 modelo por capítulo | todos |
| **Pivô**: refazer diagnóstico e trocar de hipótese | 1 vez | ilimitado |
| Micro-áudios guiados + ambiente sonoro de natureza | 1º capítulo | todos |
| Mais de um projeto ao mesmo tempo | — | ✅ |
| "Mapa humano" (pós-MVP) | resumo | completo |
| Exportar plano em PDF / cartão compartilhável | cartão ✅ | PDF |

> O **cartão compartilhável do diagnóstico fica grátis de propósito**: é divulgação gratuita.

### Preço sugerido (a validar)

| Plano | Preço | Comparação |
|---|---|---|
| Mensal | **R$ 19,90** | entre Headspace e Calm |
| Anual | **R$ 119,90** (≈ R$ 10/mês) | **destaque**; o mercado é majoritariamente anual |
| **Fundadores** (primeiros usuários) | anual com 50% de desconto **vitalício** | recompensa quem chegou cedo e gera comunidade |

### Teste grátis
- **30 dias de premium completo** para os primeiros usuários (o "período de teste" que você planejou),
  depois o app cai para o grátis automaticamente. Ninguém é cobrado sem escolher.
- Depois do lançamento, **testar 14 × 30 dias**. Os dados de mercado favorecem o teste longo.

### Como o paywall "liga" depois (arquitetura) — Fase 1
- Uma camada de **direitos** (`entitlements`): cada recurso pergunta "posso?" a uma função única.
- Uma chave `PAYWALL_ENABLED` (desligada no MVP): com ela desligada, todo mundo tem tudo.
- Os limites (ex.: 5 mensagens do coach) ficam num **único arquivo de configuração**, fácil de ajustar.
- A cobrança real (Google Play Billing, via plugin do Capacitor ou RevenueCat, que é grátis até
  certo faturamento **[conferir]**) entra só na Fase 4/5.

## 5. Riscos e honestidade

- **Nunca prometer renda.** Além de ético, a política da Play Store e o CDC punem promessas de
  ganho. Esse tema volta na frente 7.
- Limites do grátis precisam ser **claros desde o início** ("5 mensagens por semana"),
  sem surpresa no meio da jornada.
- O custo do coach de IA por usuário precisa ser medido antes de definir o limite final.

## Decisões propostas

- [ ] Adotar "caminho grátis, aceleração paga" (tabela acima)
- [ ] Preços iniciais: R$ 19,90/mês · R$ 119,90/ano · fundadores com 50% vitalício
- [ ] 30 dias de premium completo para os primeiros usuários
- [ ] Camada de direitos + `PAYWALL_ENABLED=false` (Fase 1)
- [ ] Medir o custo de IA por usuário (Fase 2)
- [ ] Você: me passar o nome do app de "mapa humano" para análise

## Fontes

- RevenueCat 2026: [relatório](https://www.revenuecat.com/state-of-subscription-apps) · [resumo do blog](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026) · [duração de teste grátis](https://www.revenuecat.com/blog/growth/free-trial-length) · [definição de métricas (PricePush)](https://pricepush.app/glossary/download-to-paid-conversion)
- Finch: [WhistleOut](https://www.whistleout.com/CellPhones/Apps/finch-self-care-app-review)
- Duolingo: [Fast Company Brasil](https://fastcompanybrasil.com/news/duolingo-lanca-recursos-de-ia-em-plano-max-veja-quanto-custa-no-brasil/) · [Canaltech](https://canaltech.com.br/apps/super-duolingo-veja-como-funciona-a-assinatura-e-os-beneficios/)
- Headspace / Calm: [Olhar Digital (mar/2026)](https://olhardigital.com.br/2026/03/19/dicas-e-tutoriais/conheca-os-5-melhores-aplicativos-de-meditacao-de-2026/)
- Taxas Google Play: [Google (user choice billing)](https://support.google.com/googleplay/android-developer/answer/12570971) · [PagBrasil (Brasil)](https://www.pagbrasil.com/blog/markets/gaming/google-play-alternative-billing-in-brazil-a-guide-to-d2c-monetization-on-android/) · [FoxData (novas taxas)](https://foxdata.com/en/blogs/google-play-opens-external-billing-cuts-fees-to-10-what-every-developer-must-know-before-june-30/)
