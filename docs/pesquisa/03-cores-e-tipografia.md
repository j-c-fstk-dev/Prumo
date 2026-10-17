# Frente 3: Cores e tipografia

**Pergunta:** como deixar o Prumo com uma atmosfera mais "mística", acolhedora e de casa,
sem perder legibilidade e com base no que a ciência realmente sustenta?

## Aviso honesto

**A "psicologia das cores" popular ("azul acalma", "verde gera confiança") tem evidência
fraca.** A própria revisão de referência da área (Elliot & Maier, 2014, *Annual Review of
Psychology*) descreve o campo como incipiente e com problemas metodológicos. O que tem
evidência sólida é **contraste, polaridade e tamanho de texto**. Por isso, "místico" aqui é
**escolha de marca ⚪**, executada dentro de regras de legibilidade 🟢.

---

## Achados

### 1. Associações cor-emoção existem e são parecidas entre culturas 🟢
**Jonauskaite et al. (2020), *Psychological Science*.** 4.598 pessoas, 30 países, 22 línguas:
há alta concordância entre países nas associações cor-emoção (r médio = 0,88), com
variação local. A maioria das cores se associa a emoções **positivas**. Só as cores escuras
e apagadas (marrom, cinza, preto) puxam emoções negativas. **Roxo** gerou menos
associações que outras cores, mas aparece ligado a *prazer*, junto com rosa, amarelo e turquesa.
O amarelo se liga a alegria (estudo do mesmo grupo em 55 países).

→ **Para o Prumo:** violeta/índigo + dourado não carrega associações negativas conhecidas.
É uma escolha segura para o "místico". Devemos evitar fundos marrom/cinza apagados
nas telas emocionais (carta, compromisso).

Atenção: essas são associações **declaradas** a palavras de cor. Isso não significa que ver
a cor *muda* o humor de alguém (esse efeito é muito menos comprovado).

### 2. Texto escuro sobre fundo claro é lido melhor 🟢
**Piepenbrock et al. (2013), *Ergonomics*,** e trabalhos do mesmo grupo: a "polaridade
positiva" (texto escuro em fundo claro) melhora a acuidade e a revisão de texto em todas as
idades, provavelmente porque a tela mais clara contrai a pupila e deixa a imagem mais nítida.
O efeito é considerado bem estabelecido em ergonomia.

→ **Para o Prumo:** o **tema claro é o padrão para leitura**. O **tema escuro "Noite"** é
oferecido para uso noturno e para quem prefere, seguindo a configuração do sistema por padrão.
O tema escuro é onde o "místico" brilha mais, mas não deve ser imposto.

### 3. Contraste mínimo (WCAG 2.2) 🟢 (norma)
Texto normal ≥ **4,5:1**; texto grande e componentes de interface ≥ **3:1**. É também o
que a Play Store e o Android Accessibility Scanner verificam.

### 4. Fontes: sem serifa e sem itálico para o texto corrido 🟡
**Rello & Baeza-Yates (2013), ASSETS.** Eye-tracking com 48 pessoas com dislexia:
fontes sem serifa, monoespaçadas e romanas (sem itálico) foram as melhores. **Itálico foi o
pior.** Fontes "especiais" como OpenDyslexic **não** ajudaram.

→ **Para o Prumo:** Inter (sem serifa) para o corpo do texto **está certo**. Fraunces (com serifa)
só em títulos e na carta, que são textos curtos. **Evitar itálico em textos longos**, inclusive
na carta, onde é tentador usar.

### 5. Tamanho do texto 🟢 (normas) / 🟡 (estudos)
Material Design recomenda corpo de **14–16 sp** e alvos de toque de **48 dp**. Estudos
com leitores com dislexia sugerem que tamanhos maiores aceleram a leitura.

**Problema encontrado no app atual:** dos cerca de 143 usos de tamanho de texto no
simulador, **cerca de 122 são de 12 px ou menos** (`text-xs`, 11 px, 10 px e até 9 px). Isso funcionava
dentro da moldura do desktop, mas **no celular real fica pequeno demais**.

→ **Para o Prumo:** corpo mínimo de **16 px**, secundário de 14 px, e 12 px só para rótulos
curtos. Respeitar o tamanho de fonte do sistema (usar `rem`).

---

## Proposta de paleta (v1): "Pergaminho & Noite"

Todos os contrastes foram calculados pela fórmula WCAG.

### Tema claro: "Pergaminho" (padrão de dia)

| Papel | Cor | Contraste | Uso |
|---|---|---|---|
| Fundo | `#FBF8F2` areia/pergaminho | — | telas |
| Texto | `#1E1B2E` tinta índigo | 15,8:1 AAA | corpo |
| Texto secundário | `#5E5873` | 6,4:1 AA | legendas |
| Primária | `#4B3F8C` índigo-violeta | 8,3:1 AAA | botões, links |
| Texto em botão | `#FFFFFF` sobre primária | 8,8:1 AAA | |
| Dourado texto | `#8A6416` | 5,1:1 AA | selos, destaques em texto |
| Dourado decorativo | `#C9A04A` | 2,3:1 ❌ | **só ornamento**, nunca texto |
| Sucesso / natureza | `#2F6B5E` sálvia | 5,9:1 AA | conclusão (mantém o verde original do Prumo) |
| Card | `#EFEAF7` lavanda clara | 14,2:1 com texto | superfícies |

### Tema escuro: "Noite" (sistema escuro / noite)

| Papel | Cor | Contraste |
|---|---|---|
| Fundo | `#15122A` céu noturno | — |
| Card | `#211C3D` | 13,5:1 com texto |
| Texto | `#EDE8F7` | 15,2:1 AAA |
| Secundário | `#A9A2C2` | 7,5:1 AAA |
| Primária | `#B9A6FF` lavanda | 8,7:1 AAA |
| Dourado | `#E3B860` | 9,8:1 AAA |
| Sálvia | `#7FC8B2` | 9,4:1 AAA |

Para comparação, a paleta atual (verde `#1F6F5C`) também passa no AA. A troca é de
**identidade**, não de correção.

### Tipografia

| Uso | Fonte | Regra |
|---|---|---|
| Títulos, capítulos, carta | **Fraunces** (serifa, já carregada) | textos curtos; sem itálico longo |
| Corpo, botões, inputs | **Inter** (já carregada) | ≥ 16 px corpo, ≥ 14 px secundário |
| Opção de acessibilidade | **Atkinson Hyperlegible** (Braille Institute, licença OFL) | alternativa nas configurações. Foi criada para baixa visão, mas não encontrei teste independente de velocidade de leitura 🔴 |

### Elementos "místicos" sem prejudicar a leitura ⚪
- Gradientes sutis índigo → violeta **só no fundo** de telas de ritual (compromisso, carta, conclusões de capítulo)
- Ornamentos em dourado decorativo: estrelas, linhas finas, um selo de cera na carta
- Mapa de constelação como metáfora do progresso (cada tarefa concluída acende uma estrela). Essa é uma ideia de marca, a validar com usuários

## Decisões propostas

- [ ] Adotar a paleta "Pergaminho & Noite" como tokens CSS, com tema automático pelo sistema e troca manual
- [ ] Escala tipográfica nova: corpo 16 px, secundário 14 px, rótulo 12 px; tudo em `rem`
- [ ] Alvos de toque ≥ 48 px
- [ ] Remover itálico de textos longos (carta)
- [ ] Opção de fonte Atkinson Hyperlegible nas configurações (baixo custo)
- [ ] Testar a constelação de progresso como protótipo

## Fontes

- Jonauskaite et al. 2020: [PDF (BI Open)](https://biopen.bi.no/bi-xmlui/bitstream/11250/2761614/1/Jonauskaite_etal_2020_PsychScience.pdf) · [EPFL](https://infoscience.epfl.ch/record/280269) · [Psychology Today (Jonauskaite & Mohr)](https://www.psychologytoday.com/ca/blog/color-psychology/202202/why-links-between-colors-and-emotions-may-be-universal) · [APA podcast](https://www.apa.org/news/podcasts/speaking-of-psychology/color-emotion)
- Elliot & Maier 2014: [Scinapse](https://www.scinapse.io/papers/2164901293) · [Elliot 2015, Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2015.00368/pdf)
- Piepenbrock et al. 2013: [Fundación Mapfre (registro)](https://documentacion.fundacionmapfre.org/documentacion/publico/pt/bib/143702.do?format=xml) · [Mathôt, cogsci.nl](https://cogsci.nl/blog/is-bright-text-on-a-dark-background-a-good-idea)
- Rello & Baeza-Yates 2013: [BYU Editing Research](https://editingresearch.byu.edu/2020/05/28/which-fonts-are-best-for-dyslexia/) · [Change Dyslexia (PDF)](https://www.changedyslexia.org/publications/pdfs/2013-ASSETS-An%20iOS%20Reader%20Dyslexia.pdf)
- Atkinson Hyperlegible: [GitHub googlefonts](https://github.com/googlefonts/atkinson-hyperlegible)
- WCAG 2.2: [W3C](https://www.w3.org/TR/WCAG22/) · Material Design: [m3.material.io](https://m3.material.io/)
