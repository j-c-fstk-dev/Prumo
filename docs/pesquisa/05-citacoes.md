# Frente 5: Citações com fonte verificada

**Pergunta:** como usar citações para motivar e dar credibilidade sem cair em frase falsa,
que é o jeito mais rápido de perder a confiança de quem checa?

## O problema é real

- O **Instituto Moreira Salles**, que guarda o acervo de Clarice Lispector, identificou
  **milhares de trechos apócrifos** atribuídos a ela na internet. Há frases que não existem
  em livro nenhum e frases reais alteradas até mudar de sentido.
- Sites de frases copiam uns dos outros. **Só vale a frase encontrada na obra**.

## Política de curadoria do Prumo

1. **Só entra com obra + localização** (capítulo, carta, verso, ano) **conferidas** numa
   fonte primária ou num verificador sério (Quote Investigator, edições acadêmicas, acervos oficiais).
2. **Preferência por domínio público.** No Brasil, a obra cai em domínio público 70 anos
   após 1º de janeiro do ano seguinte à morte do autor (Lei 9.610/98, art. 41).
   Autores vivos ou recentes (Clarice, Guimarães Rosa, Paulo Freire, Brené Brown...) estão protegidos.
3. **Obras protegidas:** a lei permite **citação curta, com autor e obra indicados**
   (art. 46, III), mas pensando em "estudo, crítica ou polêmica". O uso decorativo num app
   comercial é **zona cinzenta**, então essas frases ficam com status `pendente` até termos
   orientação jurídica. **Não sou advogado**, e esse ponto vale confirmar.
4. **Tradução nossa** para textos estrangeiros em domínio público, feita a partir do original ou
   de tradução também em domínio público. Evitamos copiar traduções modernas, que são protegidas
   (ex.: a famosa "o obstáculo é o caminho" é da tradução de Gregory Hays, de 2002).
5. **A ciência também vira citação.** Cartões "Você sabia?" com achados das frentes 1 a 4,
   com o estudo indicado. São factuais, livres de direito autoral e reforçam o método.
6. Cada citação tem **temas** ligados aos momentos do app (começar, medo, perfeccionismo,
   obstáculo, hábito, propósito, recursos).

**Nota:** os links de verificação foram confirmados por busca; a rede do ambiente de desenvolvimento bloqueia o acesso direto a esses sites.

Implementação: [`src/data/citacoes.ts`](../../src/data/citacoes.ts). Só as citações com status
`verificada` aparecem no app (`citacoesPublicaveis()`).

---

## Acervo inicial

| Citação | Autor · obra | Tema | Status |
|---|---|---|---|
| "Uma jornada de mil léguas começa sob os seus pés." | Laozi · *Tao Te Ching*, cap. 64 | começar | ✅ |
| "Não é por serem difíceis que não ousamos; é por não ousarmos que as coisas são difíceis." | Sêneca · *Cartas a Lucílio* 104.26 | medo | ✅ |
| "Faça o que puder, com o que você tem, onde você está." | Bill Widener, citado por Theodore Roosevelt · *Autobiografia* (1913) | recursos | ✅ |
| "O melhor é inimigo do bom." | Voltaire, citando provérbio italiano · *La Bégueule* (1772) | perfeccionismo | ✅ |
| "Aquilo que é obstáculo no caminho nos ajuda a seguir por ele." | Marco Aurélio · *Meditações* 5.20 | obstáculo | ✅ |
| "Tornamo-nos justos praticando atos justos [...] corajosos praticando atos de coragem." | Aristóteles · *Ética a Nicômaco* II.1 | hábito | ✅ |
| "Tudo vale a pena / Se a alma não é pequena." | Fernando Pessoa · *Mensagem*, "Mar Português" (1934) | propósito | ⏳ conferir edição |
| "O que ela quer da gente é coragem." | Guimarães Rosa · *Grande Sertão: Veredas* (1956) | medo | ⏳ obra protegida |

A frase de Widener é praticamente a definição do princípio "pássaro na mão" da effectuation
(frente 1). Citação e ciência dizem a mesma coisa, o que é ótimo para credibilidade.

## ❌ Lista de "não usar": atribuições falsas famosas

| Frase | Atribuição falsa | O que se sabe |
|---|---|---|
| "O segredo para progredir é começar." | Mark Twain | Anônima; variante num anúncio de banco de 1923. Atribuição a Twain é tardia e sem base (Quote Investigator) |
| "O que você pode fazer, ou sonha que pode, comece. A ousadia tem gênio, poder e magia." | Goethe | Tradução **livre** de John Anster (1835), popularizada por W. H. Murray (1951). Não é Goethe literal |
| "Somos o que repetidamente fazemos. A excelência não é um ato, mas um hábito." | Aristóteles | É **Will Durant** resumindo Aristóteles em *A História da Filosofia* (1926) |
| Frases de autoconhecimento "da Clarice" sem livro indicado | Clarice Lispector | Milhares de apócrifas (IMS). Só com livro e página |
| "Insanidade é fazer a mesma coisa e esperar resultados diferentes." | Einstein | Atribuição sem fonte **[a verificar no Quote Investigator]** |

Usar a de Aristóteles **corretamente** (a frase verdadeira da *Ética*, que está no acervo)
e, num cartão, contar a história da atribuição errada é conteúdo interessante e reforça a
honestidade da marca.

## Cartões "Você sabia?" (ciência) — rascunho

Linguagem simples e honesta, sem inflar números:

- "Dizer **quando e onde** você vai fazer algo aumenta bastante a chance de fazer.
  (94 estudos; Gollwitzer & Sheeran, 2006)"
- "Criar um hábito leva **cerca de 2 meses**, e varia muito de pessoa para pessoa. Os '21 dias' são mito.
  (Lally et al., 2010)"
- "Ser gentil consigo depois de uma falha **aumenta** a motivação para melhorar.
  (Breines & Chen, 2012)"
- "Segunda-feira, início de mês e aniversário são ótimos momentos para recomeçar.
  (Dai, Milkman & Riis, 2014)"
- "Registrar o progresso ajuda a chegar lá, e anotar de verdade ajuda mais.
  (138 estudos; Harkin et al., 2016)"
- "Sons de água e de pássaros reduzem o estresse. (Buxton et al., 2021)"

## Onde as citações aparecem

| Momento | Tema |
|---|---|
| Tela de boas-vindas da anamnese | começar / recursos |
| Antes do ritual de compromisso | medo |
| Tarefa com prazo vencendo / "travei" | perfeccionismo / obstáculo |
| Notificação diária | rotação de todos, sem repetir na semana |
| Retorno após dias sumido | (cartão de autocompaixão em vez de citação) |
| Fim de capítulo | propósito |

## Decisões propostas

- [x] Arquivo de dados com status de verificação (`src/data/citacoes.ts`)
- [ ] Conferir Pessoa numa edição de *Mensagem* e liberar
- [ ] Conferir Aristóteles na tradução Rackham (Perseus), II.1 1103a–b, onde está a frase, e não em 1105b, onde há uma parecida
- [ ] Orientação jurídica sobre citações curtas de obras protegidas
- [ ] Ampliar o acervo para cerca de 40 citações (meta para a notificação diária não repetir em um mês)
- [ ] Componente de cartão de citação (Fase 3)

## Fontes

- Mark Twain / "getting started": [Quote Investigator](https://quoteinvestigator.com/2018/02/03/start/)
- Widener / Roosevelt: [Quote Investigator](https://quoteinvestigator.com/2022/12/17/what-you-can/)
- Goethe / Anster / Murray: [Quote Investigator](https://quoteinvestigator.com/2016/02/09/boldness/)
- Durant / Aristóteles: [Check Your Fact](https://checkyourfact.com/2019/06/26/fact-check-aristotle-excellence-habit-repeatedly-do/) · [Philosophy for Life](https://www.philosophyforlife.org/blog/fake-quotes)
- Sêneca 104.26: [Correio Braziliense](https://www.correiobraziliense.com.br/cbradar/seneca-licao-coragem-ousar-estoicismo/) · [Sententiae Antiquae](https://sententiaeantiquae.com/2022/10/25/dont-make-a-fuss-quote-seneca-like-truss/)
- Marco Aurélio 5.20 (Long): [Lexundria](https://lexundria.com/m_aur_med/5.20/lg)
- Voltaire: [Wikisource (Garnier)](https://fr.wikisource.org/wiki/Page:Voltaire_-_%C5%92uvres_compl%C3%A8tes_Garnier_tome10.djvu/60) · [Wikipedia](https://en.wikipedia.org/wiki/Perfect_is_the_enemy_of_good)
- Clarice apócrifa: [UFMG Espaço do Conhecimento](https://www.ufmg.br/espacodoconhecimento/blog-espaco/textos-apocrifos-autoria-errada-e-atribuicao-trocada/) · [O Antagonista](https://oantagonista.com.br/ladooa/entretenimento/clarice-lispector-que-ninguem-se-engane-so-consigo-a-simplicidade-atraves-de-muito-trabalho-a-frase-real-de-a-hora-da-estrela-diferente-da-que-circula-na-internet/)
- Laozi 64: [Wikipedia](https://en.wikipedia.org/wiki/A_journey_of_a_thousand_miles_begins_with_a_single_step)
- Aristóteles, *Ética a Nicômaco* (Rackham): [Perseus](https://catalog.perseus.org/catalog/urn:cts:greekLit:tlg0086.tlg010.perseus-eng1)
- Pessoa, *Mensagem*: [USP Estudos Pessoanos](https://estudospessoanos.fflch.usp.br/sites/estudospessoanos.fflch.usp.br/files/CG_Intro_Mensagem.pdf)
- Lei 9.610/98 (direitos autorais): [Planalto](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm)
