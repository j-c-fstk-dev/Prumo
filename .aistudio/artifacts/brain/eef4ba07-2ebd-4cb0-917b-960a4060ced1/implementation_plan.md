# Prumo: Experiência Narrativa, Conexão Emocional & Anamnese Reflexiva

Um plano abrangente para elevar o aplicativo Prumo de uma lista técnica de tarefas a uma jornada narrativa de transformação pessoal, combinando o poder emocional do Fabulous com a serenidade, clareza e respeito ao foco que definem a identidade do Prumo.

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões de experiência a seguir foram alinhadas e confirmadas na fase de clarificação para guiar esta evolução:

- **Estrutura de Respostas Abertas**: Múltipla escolha intuitiva combinada com campo aberto opcional em momentos de reflexão pessoal (como a fonte de orgulho, a maior trava e o formato de trabalho ideal), injetando as palavras do usuário na carta do Eu Futuro e nos cards de ação.
- **Ritual de Compromisso (Commitment Contract)**: Interação tátil de pressionar e segurar por 3 segundos o botão *"Assumir meu prumo"*, com animação circular de preenchimento que culmina na revelação solene da Carta do seu Eu Futuro daqui a 90 dias.
- **Presença Sonora com Serenidade**: Player minimalista com ondas sonoras suaves e transcrição inspiradora nos cards de tarefas e reflexões diárias, oferecendo micro-áudios de 60 a 90 segundos com voz serena sem criar sobrecarga sensorial.
- **Novas Etapas no Android DevHub**: Expansão do Roadmap de Engenharia com as etapas 9 e 10 (Etapa 9: Onboarding Narrativo, Ritual de Compromisso & Gestos Hápticos; Etapa 10: Player de Áudio, Visualização de Formas de Onda e Persistência de Reflexões Pessoais).

---

### 1. Overview & Core Concept

- **O que faz**: Transforma o fluxo de entrada e o dia a dia do Prumo em uma história contada em capítulos. Em vez de preencher formulários e riscar itens de um checklist mecânico, o usuário passa por micro-telas de valor que explicam o porquê de cada pergunta, expressa suas dores e anseios em texto aberto, firma um compromisso consciente com seu "Eu Futuro" através de um ritual de pressão contínua e acompanha uma jornada dividida em capítulos com ilustrações-âncora e pílulas de áudio acolhedoras.
- **Público-Alvo**: Pessoas em transição profissional ou buscando sua primeira fonte de renda digital, que frequentemente sofrem com paralisia por análise, ansiedade produtivista e sensação de solidão na execução.
- **Valor Central**: Substituir a culpa numérica (streaks punitivos, placares vazios) por um senso de progresso com significado. O usuário não "cumpre metas", ele "avança no capítulo da sua própria promessa".

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **Anamnese com Sinalização de Valor & Campos Abertos**:
   - Antes de cada bloco temático (Habilidades, Interesses, Disponibilidade, Recursos, Identidade), o usuário vê um breve prelúdio: *"Agora vamos entender seu tempo real. Isso muda tudo no seu roteiro."*
   - O usuário seleciona opções rápidas e tem a oportunidade de escrever em um campo expansível sutil: *"Quer detalhar com suas palavras? Conte o que te daria orgulho de dizer 'eu faço isso' daqui a 3 meses."*
2. **O Ritual de Compromisso com o Eu Futuro**:
   - Após o cálculo do perfil diagnóstico, surge uma tela de pausa e presença.
   - O usuário pressiona e segura o botão *"Assumir meu prumo"* (3 segundos de preenchimento orgânico).
   - A tela se abre suavemente para revelar a **Carta do seu Eu daqui a 90 dias**, escrita em primeira pessoa a partir das respostas e palavras fornecidas na anamnese.
3. **Roteiro em Capítulos Narrativos**:
   - O roteiro é estruturado em capítulos:
     - *Capítulo 1: Onde você encontra sua promessa*
     - *Capítulo 2: Onde sua ideia ganha corpo e primeiro contato*
     - *Capítulo 3: Onde o valor se torna realidade e primeiro retorno*
   - No topo do roteiro, fica em destaque permanente a **Âncora Emocional**: a frase de orgulho escrita pelo próprio usuário.
4. **Ilustrações-Âncora & Micro-Áudios Contextuais**:
   - Cada capítulo e tarefa principal recebe uma ilustração estilizada que evoca a sensação daquela etapa (ex.: plantar uma semente, acender uma lamparina na escuridão, abrir uma janela).
   - Um botão de áudio discreto permite ouvir uma voz de encorajamento de 60 segundos com player de ondas sonoras serenas e transcrição.

#### Visual Identity & Theme

- **Direção Estética**: Editorial sereno, acolhedor e focado. Rejeita o ruído visual e os pop-ups excessivos, preservando a calma visual do Prumo.
- **Paleta de Cores**:
  - *Canvas Neutro (60%)*: Bege orgânico / areia suave (`#FDFCF9` e `#F7F5F0`), transmitindo sensação de caderno de notas e clareza mental.
  - *Superfícies Estruturais (30%)*: Verde musgo florestal (`#1F6F5C`), verde sage suave (`#E3F2ED`) e ardósia terrosa (`#2D3748`).
  - *Acentos de Calor e Compromisso (10%)*: Terracota caloroso (`#D97746` / `#C86638`) e dourado suave para selos de compromisso.
- **Tipografia**:
  - *Display / Títulos*: Serif clássico com alma e calor (`Lora` ou `Fraunces`) para títulos de capítulos e cartas do Eu Futuro.
  - *Corpo de Texto*: Neo-grotesque neutro e de altíssima legibilidade (`Plus Jakarta Sans`) para instruções, inputs e opções.
- **Micro-Interações & Animações**:
  - Animação de preenchimento no botão de compromisso (3000ms com barra e anel de progresso contínuo).
  - Transição de desvanecimento e revelação em estilo pergaminho para a carta do Eu Futuro.
  - Visualizador de áudio simulando forma de onda orgânica que reage à reprodução.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Perguntas fechadas com reflexão aberta opcional vs. Anamnese 100% dissertativa**
  - *Abordagem escolhida*: Manter as opções estruturadas para cálculo algorítmico rápido, permitindo campo aberto opcional nas perguntas mais profundas.
  - *Por quê*: Evita a fricção e o abandono de formulários longos em dispositivos móveis, coletando o vocabulário emocional autêntico da pessoa.
- **Decisão 2: Ritual de pressão contínua ("Hold to Sign") vs. Clique simples de botão**
  - *Abordagem escolhida*: Implementar o gesto de segurar por 3 segundos com preenchimento visual e feedback imediato.
  - *Por quê*: Cria um ponto de inflexão psicológico real, transformando a transição em um pacto consciente com o próprio futuro.
- **Decisão 3: Áudio como incentivo opcional vs. Notificação push forçada**
  - *Abordagem escolhida*: Player compacto com transcrição rápida integrado aos cartões de capítulo e tarefas.
  - *Por quê*: Respeita o contexto de quem está em silêncio ou prefere ler, sem gerar sobrecarga sensorial.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRUMO INTERACTIVE APP                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐         ┌────────────────────────────────┐  │
│  │ Anamnese com Valor    │         │ Ritual de Compromisso          │  │
│  │ • Micro-telas intro   │ ──────> │ • Gesto "Hold to Commit"       │  │
│  │ • Seleção rápida      │         │ • Carta do Eu Futuro (90 dias) │  │
│  │ • Reflexão em texto   │         │ • Âncora Emocional capturada   │  │
│  └───────────────────────┘         └────────────────────────────────┘  │
│             │                                       │                  │
│             ▼                                       ▼                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Roteiro Narrativo em Capítulos                                   │  │
│  │ • Capítulo 1: Encontrar sua promessa (com ilustração-âncora)     │  │
│  │ • Âncora do Eu Futuro fixada no topo                             │  │
│  │ • Micro-player de áudio com ondas sonoras e transcrição          │  │
│  │ • Coach reflexivo usando as palavras exatas do usuário           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Novas Etapas no Android Studio DevHub

- **Etapa 9: Onboarding Narrativo, Ritual de Compromisso & Gestos Hápticos no Android Compose**:
  - Detecção de pressão contínua com `detectTapGestures` e `Animatable` para barra de preenchimento.
  - Disparo de vibrações táteis sutis via `LocalHapticFeedback`.
  - Persistência da carta do Eu Futuro e respostas abertas no Room Database (`FutureLetterEntity`).
- **Etapa 10: Player de Áudio, Visualização de Formas de Onda e Persistência de Reflexões**:
  - Integração do `ExoPlayer` / `Media3` com suporte a reprodução e controle de estado em segundo plano.
  - Canvas customizado no Jetpack Compose para desenho de ondas sonoras dinâmicas.
  - Injeção das reflexões abertas no cálculo do roteiro e personalização contextual do coach.

---

### 5. Plan Execution Phases & Status

- [x] **Fase 1: Atualização dos Modelos de Dados & Anamnese Reflexiva** *(Concluída)*
  - Expandido `prumoData.ts` com suporte a `valueSignal` em todas as seções, `reflectionPrompt` e `reflectionPlaceholder` para respostas com as próprias palavras, Seção 7 ("Identidade & Eu Futuro") e campos de `personalAnchor`, `futureSelfLetter`, `chapterTitle`, `anchorIllustration` e `audioCoach`.
  - Simulador interativo (`PrumoAppSimulator.tsx`) atualizado com micro-telas de valor serenas antes de cada seção e campos abertos opcionais com debounce.

- [x] **Fase 2: Tela do Ritual de Compromisso & Carta do Eu Futuro** *(Concluída)*
  - Criada a tela de ritual de compromisso (`commitment`) com botão tátil de pressão sustentada (Hold-to-Sign por 3 segundos), anel de progresso radial SVG, vibração e disparo comemorativo com confetes.
  - Desenvolvida a tela editorial da Carta do Eu Futuro (`future_letter`), com formato de pergaminho, selo de compromisso e citação direta das palavras de orgulho do usuário daqui a 90 dias.

- [x] **Fase 3: Roteiro Narrativo em Capítulos & Ilustrações-Âncora** *(Concluída)*
  - Roteiro e Home reestruturados em Capítulos da Jornada (*Capítulo 1: Onde você encontra sua promessa*, *Capítulo 2: Onde sua ideia ganha corpo*, *Capítulo 3: Onde o valor se torna realidade*).
  - Fixação permanente do card de Âncora Emocional do Eu Futuro no topo da Home e do Roteiro.
  - Ilustrações-âncora temáticas em cada card de tarefa (*A Semente*, *O Alvo*, *O Espelho*, *A Rota*) comunicando a essência antes do texto.
  - Player minimalista de micro-áudio com ondas sonoras dinâmicas e transcrição inspiradora expansível.

- [x] **Fase 4: Expansão do DevHub Android (Etapas 9 e 10 Concluídas)** *(Concluída)*
  - Adicionado o componente `Step9NarrativeGuide.tsx` (Onboarding Narrativo, Ritual de Compromisso & Gestos Hápticos no Jetpack Compose com simulador tátil).
  - Adicionado o componente `Step10AudioGuide.tsx` (Presença em Áudio com Media3/ExoPlayer, Visualizador de Formas de Onda no Canvas e Roteiro em Capítulos).
  - Incluídos os arquivos nativos Kotlin (`CommitmentContractScreen.kt`, `FutureLetterScreen.kt`, `AudioCoachPlayer.kt`) no visualizador de código e no empacotador ZIP de download para Android Studio.
  - Atualizado o roadmap oficial para 10 etapas concluídas (100% de progresso).
