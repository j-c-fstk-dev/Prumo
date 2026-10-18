# Frente 4: Sons e movimento

**Pergunta:** que sons e animações ajudam a pessoa a se sentir em casa e motivada, sem
cansar, irritar ou atrapalhar, e o que é mito?

## Aviso honesto

Assim como as cores, o universo do "som que cura" está cheio de promessas sem base
(432 Hz, frequências solfeggio). Vamos usar o que tem evidência e deixar o resto de fora,
ou marcado como escolha de marca.

---

## Sons

### 1. Sons da natureza reduzem estresse 🟢
**Buxton et al. (2021), *PNAS*.** Revisão sistemática com 36 publicações e meta-análise com 18:
sons naturais reduzem estresse e incômodo (g = −0,60) e melhoram humor e cognição.
**Água** teve os maiores efeitos gerais, e **pássaros** o maior alívio do estresse.
A maior parte dos estudos foi feita em laboratório ou hospital.

→ **Para o Prumo:** um **ambiente sonoro opcional** (água/chuva leve, pássaros) durante
tarefas de foco de 15 minutos e nos micro-áudios. É o recurso sonoro com melhor evidência.

### 2. Gostar de acordes "consonantes" é cultural, mas vale para o nosso público 🟡
**McDermott et al. (2016), *Nature*.** O povo Tsimane' (Amazônia boliviana, pouca exposição
à música ocidental) não preferiu acordes consonantes aos dissonantes. A preferência cresce
com a exposição à música ocidental. Todos os grupos, porém, rejeitaram a **aspereza**
(*roughness*) do som.

→ **Para o Prumo:** nosso público brasileiro cresceu ouvindo harmonia ocidental, então
acordes consonantes (como os que o app já usa) são uma boa escolha. A regra universal é
**evitar sons ásperos e estridentes**.

### 3. Batidas binaurais: efeito moderado, evidência mista 🟡
**Garcia-Argibay et al. (2019), *Psychological Research*.** Meta-análise com 22 estudos:
g = 0,45 em memória, atenção, ansiedade e dor, melhor quando ouvidas **antes** da tarefa.
Uma meta-análise de 2023 só sobre memória e atenção achou resultados **mistos**.
Elas exigem fone de ouvido.

→ **Para o Prumo:** **não** no MVP. Pode virar um modo "foco" opcional no futuro, sem
promessas exageradas.

### 4. 432 Hz e frequências "de cura": evidência fraca 🔴
O estudo mais citado (Calamassi & Pomponi, 2019) é um **piloto com 33 pessoas** que
encontrou uma pequena queda de batimentos. Os próprios autores pedem estudos maiores.

→ **Para o Prumo:** **não** usar como argumento de venda. Afinação de marca é escolha livre ⚪.

### 5. Psicoacústica do som de interface 🟡 (consenso técnico)
Sons agudos e estridentes (*sharpness*), ásperos (*roughness*) e altos irritam. Começos
abruptos geram "cliques". Repetir o mesmo som em toda interação causa fadiga.

**Diagnóstico do `soundEffects.ts` atual:** ondas senoidais suaves, faixa de 180 a 1.300 Hz,
volume baixo (master 0,35) e duração curta. **Está bem alinhado.** Os ajustes que faltam:
- **Ataque suave** de 5 a 10 ms em cada nota (hoje o volume começa no máximo, o que pode estalar)
- **Menos sons em toques frequentes:** som só em momentos com significado (concluir,
  compromisso, capítulo). O toque comum fica opcional ou é substituído por vibração leve
- Respeitar o modo silencioso do celular (possível no app Android via Capacitor)

---

## Movimento (animações)

### 6. Mostrar o "trabalho" aumenta o valor percebido 🟡
**Buell & Norton (2011), *Management Science* ("labor illusion").** Em 5 experimentos,
mostrar o trabalho feito durante uma espera aumentou o valor percebido do serviço
(+8% no estudo de passagens aéreas), **mesmo com resultados idênticos**. Segundo um resumo
secundário **[a verificar]**, o efeito depende de mostrar etapas **específicas**: uma barra
de progresso genérica não basta.

→ **Para o Prumo:** a tela de cálculo com storytelling **é sustentada pela evidência**, mas
só se as etapas citarem **as respostas reais da pessoa** ("cruzando sua facilidade com
planilhas com suas 3 h por semana..."). Hoje o texto é fixo.

### 7. Duração das animações 🟢 (normas de design)
O Material Design 3 define durações curtas (50–200 ms) para micro-interações, médias
(250–400 ms) para trocas de tela e longas (450–1.000 ms) para momentos especiais.
**O app atual usa 500–900 ms em quase tudo**, o que dá serenidade nos rituais mas deixa a
navegação do dia a dia lenta.

→ **Para o Prumo:** **duas velocidades.** Navegação do dia a dia fica em 200–350 ms.
**Rituais** (splash, compromisso, carta, fim de capítulo) podem ser lentos e cerimoniais.

### 8. Respeitar quem pede menos movimento 🟢 (norma)
WCAG 2.3.3 e a configuração "reduzir movimento" do sistema (`prefers-reduced-motion`).
Animações grandes, giros e zoom podem causar enjoo em pessoas com distúrbios vestibulares.

→ **Para o Prumo:** todas as animações de bússola e constelação têm uma **versão estática**
quando o sistema pede menos movimento.

### 9. Splash curto 🟡
O Android (API SplashScreen, desde a versão 12) mostra o ícone na abertura e recomenda
animação curta, em torno de 1 s **[a verificar]**. Uma splash longa em toda abertura vira
espera, não ritual.

→ **Para o Prumo:** **na 1ª abertura**, ritual completo da bússola (cerca de 2,5 s, com opção de pular).
**Nas aberturas seguintes**, uma versão curta (cerca de 0,8 s).

---

## Conceito de marca: bússola + constelação ⚪

**Prumo** é o fio de prumo que mostra a vertical verdadeira, e é também "rumo". A bússola
traduz a ideia de **encontrar a direção**, e a constelação traduz **o caminho percorrido**.
Navegantes usavam as estrelas para se orientar, então as duas imagens conversam.

| Momento | Animação |
|---|---|
| Splash | Céu noturno; a agulha da bússola oscila e **se assenta no norte** ("encontrou o prumo"); o nome aparece |
| Fim da anamnese → cálculo | A agulha gira procurando e depois aponta; etapas específicas do cálculo aparecem |
| Diagnóstico revelado | A bússola vira estrela-guia |
| Dia a dia | Cada tarefa concluída **acende uma estrela**, e as estrelas acesas se ligam em linhas |
| Fim de capítulo | A constelação completa brilha e ganha nome (ex.: "A Promessa") |

## Decisões propostas

- [x] Componentes de bússola, splash, transição e constelação (etapa 03)
- [ ] Ataque suave em todas as notas do `soundEffects.ts` (Fase 3)
- [ ] Som só em momentos com significado; toque comum opcional (Fase 3)
- [ ] Ambiente sonoro de natureza opcional nas tarefas de foco (Fase 3)
- [ ] Etapas do cálculo citando as respostas reais (Fase 1)
- [ ] Duas velocidades de animação: dia a dia (200–350 ms) e rituais (Fase 3)
- [ ] Versão estática de todas as animações com `prefers-reduced-motion` (sempre)

## Fontes

- Buxton et al. 2021: [PMC8040792](https://pmc.ncbi.nlm.nih.gov/articles/PMC8040792) · [Colorado State](https://newsmediarelations.colostate.edu/2021/03/22/want-to-improve-your-health-head-to-a-national-park-and-absorb-the-sounds/)
- McDermott et al. 2016: [MIT News](https://news.mit.edu/2016/music-tastes-cultural-not-hardwired-brain-0713)
- Garcia-Argibay et al. 2019: [PubMed](https://pubmed.ncbi.nlm.nih.gov/30073406/) · [meta 2023](https://pubmed.ncbi.nlm.nih.gov/35842538/)
- Calamassi & Pomponi 2019: [Univ. Firenze (registro)](https://flore.unifi.it/handle/2158/1285819)
- Buell & Norton 2011: [INFORMS](https://pubsonline.informs.org/doi/references/10.1287/mnsc.1110.1376) · [resumo "Kayak effect"](https://digitalwellbeing.org/the-kayak-effect-why-making-customers-wait-drives-satisfaction/) **[a verificar]**
- Material Design 3 Motion: [m3.material.io/styles/motion](https://m3.material.io/styles/motion/easing-and-duration)
- WCAG 2.3.3: [W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
