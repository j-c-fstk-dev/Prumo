export interface AnamneseQuestion {
  id: string;
  sectionId: number;
  sectionName: string;
  question: string;
  subtext: string;
  type: 'single' | 'multiple' | 'slider';
  maxChoices?: number;
  options: { id: string; label: string; icon?: string }[];
  sliderConfig?: { min: number; max: number; minLabel: string; maxLabel: string };
  reflectionPrompt?: string;
  reflectionPlaceholder?: string;
  /** Mostrado sob o campo aberto: para que usamos o que a pessoa escreve (transparência) */
  reflectionPurpose?: string;
}

export interface AnamneseSection {
  id: number;
  title: string;
  iconName: string;
  valueSignal: {
    title: string;
    subtitle: string;
    icon: string;
  };
  questions: AnamneseQuestion[];
}

export const ANAMNESE_SECTIONS: AnamneseSection[] = [
  {
    id: 1,
    title: 'O que você faz bem',
    iconName: 'Wrench',
    valueSignal: {
      title: 'Vamos começar pelo que você já sabe fazer',
      subtitle: 'Começar pelo que já é natural pra você deixa o primeiro passo mais leve. E ajuda a não desistir quando ficar difícil.',
      icon: '✨'
    },
    questions: [
      {
        id: 'q1_help',
        sectionId: 1,
        sectionName: 'Habilidades',
        question: 'Com o que as pessoas costumam te pedir ajuda?',
        subtext: 'Escolha até 3.',
        type: 'multiple',
        maxChoices: 3,
        options: [
          { id: 'conselhos', label: 'Conselhos sobre vida e trabalho', icon: '💬' },
          { id: 'design', label: 'Deixar coisas bonitas (design, fotos, artes)', icon: '🎨' },
          { id: 'planilhas', label: 'Planilhas e organização', icon: '📊' },
          { id: 'textos', label: 'Escrita e revisão de textos', icon: '✍️' },
          { id: 'ensinar', label: 'Explicar assuntos difíceis', icon: '💡' },
          { id: 'vendas', label: 'Negociar e vender', icon: '🤝' },
          { id: 'tecnologia', label: 'Resolver problemas no celular ou computador', icon: '💻' },
          { id: 'saude', label: 'Treino, alimentação e hábitos', icon: '🏃' }
        ],
        reflectionPrompt: 'Com suas palavras: com o que você gosta de ajudar? Vale algo que não está na lista.',
        reflectionPlaceholder: 'Ex: Adoro ajudar amigos a organizarem rotinas caóticas de trabalho...',
        reflectionPurpose: 'Usamos isso para sugerir seu nicho (você confirma) e escrever sua hipótese.'
      },
      {
        id: 'q1_preference',
        sectionId: 1,
        sectionName: 'Habilidades',
        question: 'Do que você mais gosta?',
        subtext: 'Pense no que você faz e nem vê o tempo passar.',
        type: 'single',
        options: [
          { id: 'criar', label: 'Criar coisas novas do zero', icon: '✨' },
          { id: 'ensinar', label: 'Ensinar e guiar outras pessoas', icon: '🎓' },
          { id: 'organizar', label: 'Organizar e deixar as coisas em ordem', icon: '📋' },
          { id: 'conectar', label: 'Conversar, conectar pessoas e convencer', icon: '🔗' }
        ],
        reflectionPrompt: 'Com suas palavras: o que você faz em que nem vê o tempo passar?',
        reflectionPlaceholder: 'Ex: Fico horas montando apresentações bonitas para o trabalho...',
        reflectionPurpose: 'Ajuda a sugerir a opção mais próxima (você confirma).'
      }
    ]
  },
  {
    id: 2,
    title: 'O que você curte',
    iconName: 'Compass',
    valueSignal: {
      title: 'Agora, o que te dá vontade',
      subtitle: 'Juntar o plano com o que você já gosta ajuda muito nos dias sem vontade.',
      icon: '🧭'
    },
    questions: [
      {
        id: 'q2_themes',
        sectionId: 2,
        sectionName: 'Interesses',
        question: 'Sobre o que você gosta de ler, ver ou ouvir?',
        subtext: 'Aquilo que você consome até no fim de semana. Escolha até 2.',
        type: 'multiple',
        maxChoices: 2,
        options: [
          { id: 'produtividade', label: 'Produtividade e foco pessoal', icon: '⏱️' },
          { id: 'negocios', label: 'Negócios e histórias de quem empreende', icon: '💼' },
          { id: 'financas', label: 'Finanças pessoais e investimentos', icon: '💰' },
          { id: 'desenvolvimento', label: 'Psicologia e autoconhecimento', icon: '🧠' },
          { id: 'comunicacao', label: 'Marketing, redes sociais e comunicação', icon: '📢' },
          { id: 'artes', label: 'Artes, criação e design', icon: '🖌️' }
        ],
        reflectionPrompt: 'Algum outro tema que você consome por prazer?',
        reflectionPlaceholder: 'Ex: culinária, jardinagem, games, maternidade...',
        reflectionPurpose: 'Usamos isso para sugerir seu nicho (você confirma).'
      },
      {
        id: 'q2_community',
        sectionId: 2,
        sectionName: 'Interesses',
        question: 'Como você prefere trabalhar?',
        subtext: 'Seja sincero: o que você aguenta no dia a dia?',
        type: 'single',
        options: [
          { id: 'solo', label: 'Mais nos bastidores, criando no meu tempo', icon: '👤' },
          { id: 'comunidade', label: 'Junto das pessoas, conversando e atendendo', icon: '👥' },
          { id: 'misto', label: 'Um pouco de cada', icon: '⚖️' }
        ],
        reflectionPrompt: 'Com suas palavras: como seria um dia de trabalho bom para você?',
        reflectionPlaceholder: 'Ex: Gosto de conversar, mas preciso de tempo sozinho para criar...',
        reflectionPurpose: 'Ajuda a sugerir a opção mais próxima (você confirma).'
      }
    ]
  },
  {
    id: 3,
    title: 'Seu tempo',
    iconName: 'Clock',
    valueSignal: {
      title: 'Agora, sobre o seu tempo',
      subtitle: 'Os passos vão caber na sua vida de verdade. Nada de começar com tudo e cansar na primeira semana.',
      icon: '⏳'
    },
    questions: [
      {
        id: 'q3_hours',
        sectionId: 3,
        sectionName: 'Disponibilidade',
        question: 'Quantas horas por semana você tem, de verdade?',
        subtext: 'Conte as noites e o fim de semana. Melhor pouco e real do que muito no papel.',
        type: 'single',
        options: [
          { id: 'pouco', label: '3 a 5 horas (mais ou menos 1h por noite)', icon: '🌙' },
          { id: 'medio', label: '6 a 12 horas (noites e sábado)', icon: '⚡' },
          { id: 'muito', label: '15 horas ou mais (meio período ou mais)', icon: '🚀' }
        ],
        reflectionPrompt: 'Com suas palavras: o que mais rouba seu tempo na semana?',
        reflectionPlaceholder: 'Ex: Horas extras no trabalho e cansaço mental depois do expediente...',
        reflectionPurpose: 'Usamos isso para sugerir horários para suas tarefas e no coach.'
      },
      {
        id: 'q3_investment',
        sectionId: 3,
        sectionName: 'Disponibilidade',
        question: 'Quanto dinheiro você topa arriscar no começo?',
        subtext: 'Pense no que você pode perder sem se arrepender, se o teste não der certo. Dá pra começar com R$ 0.',
        type: 'single',
        options: [
          { id: 'zero', label: 'R$ 0: só com coisas gratuitas', icon: '🆓' },
          { id: 'ate_200', label: 'Até R$ 200, sem me arrepender', icon: '🌱' },
          { id: 'mais_500', label: 'R$ 500 ou mais, se for preciso', icon: '💼' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Sua meta',
    iconName: 'Target',
    valueSignal: {
      title: 'Qual vai ser a sua primeira vitória?',
      subtitle: 'Uma meta clara e pequena dá alívio e mostra logo que o esforço está valendo.',
      icon: '🎯'
    },
    questions: [
      {
        id: 'q4_goal',
        sectionId: 4,
        sectionName: 'Objetivos',
        question: 'Quanto você quer ganhar no começo?',
        subtext: 'A meta que vai te fazer comemorar. Não é promessa: é aonde você quer chegar.',
        type: 'single',
        options: [
          { id: 'primeiro_real', label: 'Os primeiros R$ 500 a R$ 1.000 por mês', icon: '🎯' },
          { id: 'substituir', label: 'R$ 3.000 a R$ 5.000 por mês (parte da minha renda)', icon: '📈' },
          { id: 'escala', label: 'R$ 10.000 ou mais por mês (virar meu negócio)', icon: '🏰' }
        ]
      },
      {
        id: 'q4_timeline',
        sectionId: 4,
        sectionName: 'Objetivos',
        question: 'Em quanto tempo você precisa ganhar o primeiro dinheiro?',
        subtext: 'Isso muda a velocidade da sua jornada.',
        type: 'single',
        options: [
          { id: 'rapido', label: '30 a 45 dias (tenho pressa)', icon: '⚡' },
          { id: 'medio', label: '60 a 90 dias (com calma, mas sem enrolar)', icon: '🧭' },
          { id: 'longo', label: '6 a 12 meses (sem pressa, quero construir direito)', icon: '🧱' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Seu jeito',
    iconName: 'Brain',
    valueSignal: {
      title: 'Agora, um pouco sobre o seu jeito',
      subtitle: 'Não tem fórmula única. Dá pra construir algo sério até sem aparecer em vídeo.',
      icon: '🛡️'
    },
    questions: [
      {
        id: 'q5_exposure',
        sectionId: 5,
        sectionName: 'Perfil',
        question: 'Como você se sente aparecendo (vídeo, voz, stories)?',
        subtext: 'Não tem certo nem errado: dá pra começar sem aparecer.',
        type: 'single',
        options: [
          { id: 'sem_camera', label: 'Nada de câmera: prefiro texto ou bastidores', icon: '🙈' },
          { id: 'moderado', label: 'Apareço se precisar, sem forçar', icon: '🎙️' },
          { id: 'confortavel', label: 'De boa: gosto de falar em vídeo', icon: '📹' }
        ],
        reflectionPrompt: 'Com suas palavras: como você se sente aparecendo para os outros?',
        reflectionPlaceholder: 'Ex: Gravo áudio de boa, mas vídeo me trava...',
        reflectionPurpose: 'Ajuda a sugerir a opção mais próxima (você confirma).'
      },
      {
        id: 'q5_rejection',
        sectionId: 5,
        sectionName: 'Perfil',
        question: 'Como você fica quando ouve um "não" ou ninguém curte o post?',
        subtext: 'Isso ajuda a escolher entre falar direto com as pessoas ou postar conteúdo.',
        type: 'single',
        options: [
          { id: 'sensivel', label: 'Desanimo fácil, preciso de passos bem guiados', icon: '🛡️' },
          { id: 'resiliente', label: 'Chateia, mas sei que faz parte', icon: '🌱' }
        ],
        reflectionPrompt: 'Com suas palavras: o que acontece com você quando ouve um "não"?',
        reflectionPlaceholder: 'Ex: Fico chateado no dia, mas no outro tento de novo...',
        reflectionPurpose: 'Ajuda a sugerir a opção mais próxima (você confirma).'
      },
      {
        id: 'q5_obstacle',
        sectionId: 5,
        sectionName: 'Perfil',
        question: 'O que tem mais chance de te atrapalhar?',
        subtext: 'Saber disso agora ajuda: a gente já combina o que fazer quando acontecer.',
        type: 'single',
        options: [
          { id: 'tempo', label: 'Falta de tempo ou cansaço no fim do dia', icon: '🔋' },
          { id: 'medo', label: 'Medo de julgamento ou de oferecer meu trabalho', icon: '🫣' },
          { id: 'perfeccionismo', label: 'Querer deixar tudo perfeito antes de mostrar', icon: '🔍' },
          { id: 'dispersao', label: 'Me distrair com novas ideias e não terminar', icon: '🦋' }
        ],
        reflectionPrompt: 'Com suas palavras: o que costuma te fazer parar?',
        reflectionPlaceholder: 'Ex: Começo animado, mas na segunda semana a rotina me engole...',
        reflectionPurpose: 'Usamos isso no seu "Se travar, eu…" e no coach.'
      }
    ]
  },
  {
    id: 6,
    title: 'Suas ferramentas',
    iconName: 'Smartphone',
    valueSignal: {
      title: 'Vamos usar o que você já conhece',
      subtitle: 'Nada de aprender um monte de programa novo. A gente parte do que você já usa.',
      icon: '📱'
    },
    questions: [
      {
        id: 'q6_tools',
        sectionId: 6,
        sectionName: 'Experiência',
        question: 'O que você já usa sem sofrer?',
        subtext: 'Marque tudo o que você já mexeu, mesmo que pouco.',
        type: 'multiple',
        options: [
          { id: 'instagram', label: 'Instagram / Redes Sociais', icon: '📱' },
          { id: 'canva', label: 'Canva (criação de artes)', icon: '🎨' },
          { id: 'notion', label: 'Notion / Docs / Planilhas', icon: '📝' },
          { id: 'whatsapp_biz', label: 'WhatsApp Business', icon: '💬' },
          { id: 'nenhuma', label: 'Ainda não uso quase nada disso', icon: '🌱' }
        ],
        reflectionPrompt: 'Usa outra ferramenta? Conte aqui.',
        reflectionPlaceholder: 'Ex: TikTok, YouTube, Google Agenda...',
        reflectionPurpose: 'Ajuda a sugerir a opção mais próxima (você confirma).'
      }
    ]
  },
  {
    id: 7,
    title: 'Você daqui a 90 dias',
    iconName: 'Sparkles',
    valueSignal: {
      title: 'Por último: a sua âncora',
      subtitle: 'A vontade vai e vem. Uma frase sobre quem você quer ser segura a onda nos dias difíceis.',
      icon: '🌿'
    },
    questions: [
      {
        id: 'q7_pride',
        sectionId: 7,
        sectionName: 'Identidade',
        question: 'Daqui a 90 dias, do que você quer se orgulhar?',
        subtext: 'Essa frase vira a sua âncora: ela fica no topo do app pra te lembrar por que você começou.',
        type: 'single',
        options: [
          { id: 'autor_metodo', label: 'Criei do zero algo meu e vi que funciona', icon: '🌱' },
          { id: 'primeira_renda', label: 'Recebi meus primeiros pagamentos, de forma honesta', icon: '💎' },
          { id: 'rotina_livre', label: 'Criei uma rotina leve, sem me esgotar', icon: '🕊️' },
          { id: 'impacto_real', label: 'Ajudei de verdade pelo menos 3 pessoas', icon: '🤝' }
        ],
        reflectionPrompt: 'Com suas palavras, complete: "Daqui a 90 dias, eu..."',
        reflectionPlaceholder: 'Ex: ...recebi meus primeiros pagamentos e confio no meu próprio jeito de trabalhar.',
        reflectionPurpose: 'Usamos isso como sua âncora e na carta do seu eu futuro.'
      }
    ]
  }
];

export interface DiagnosisProfile {
  niche: string;
  nicheDescription: string;
  product: string;
  productDescription: string;
  audience: string;
  audienceDescription: string;
  channel: string;
  channelDescription: string;
  timeline: string;
  justification: string;
  personalAnchor: string;
  futureSelfLetter: string;
  chapterTitle?: string;
  radarScores: {
    skills: number;
    interest: number;
    availability: number;
    goals: number;
    behavior: number;
    tech: number;
  };
}

export const DEFAULT_DIAGNOSIS: DiagnosisProfile = {
  niche: 'Produtividade e Rotina para Freelancers',
  nicheDescription: 'Ajudar pessoas que trabalham por conta própria a organizarem seu tempo e entregas sem esgotamento.',
  product: 'Mini-curso prático + modelo pronto',
  productDescription: 'Um material digital gravado em vídeo curto (10-15 min) acompanhado de checklist prático que você cria uma única vez.',
  audience: 'Freelancers e Profissionais CLT em transição',
  audienceDescription: 'Pessoas com rotina corrida que sofrem com dispersão e precisam de um método simples de organização.',
  channel: 'Instagram e WhatsApp Direto',
  channelDescription: 'Conteúdo rápido focado em dores reais e conversas consultivas no 1 a 1 para as primeiras validações.',
  timeline: '60 dias até a 1ª validação',
  personalAnchor: 'Criei e validei meu próprio mini-produto digital do zero, com rotina serena e sem burnout.',
  futureSelfLetter: 'Oi, sou você daqui a 90 dias. Escrevo para te lembrar do dia em que você segurou a tela e assumiu seu prumo. Naquele momento você não sabia bem por onde começar, mas decidiu dar um passo pequeno por vez. Hoje nosso mini-curso está validado, ajudamos 3 pessoas de verdade e aquela sensação de paralisia ficou para trás. Continue firme, seu prumo é real.',
  chapterTitle: 'Capítulo 1: Entender o problema',
  justification: 'Você indicou facilidade para ensinar, tempo moderado (1h/dia) e prefere formatos práticos. Por isso sugerimos um mini-curso gravado com modelo pronto: você cria uma vez, valida com 3 pessoas reais e não se torna refém de horários de atendimento.',
  radarScores: {
    skills: 85,
    interest: 90,
    availability: 65,
    goals: 75,
    behavior: 70,
    tech: 60
  }
};

export interface TaskItem {
  id: string;
  phaseId: 'fundacao' | 'marketing' | 'lancamento' | 'ritmo';
  phaseName: string;
  chapterId: number;
  chapterTitle: string;
  /** Semana sugerida da jornada (1 a 13). Só sugere: dá para adiantar (etapa 42) */
  week?: number;
  title: string;
  description: string;
  durationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed';
  whatToDo: string;
  /** "Você fez": o que depende só da pessoa e marca o passo como feito (etapa 52) */
  howToKnowItIsGood: string[];
  /** "O que o mundo respondeu": o sinal, que não depende só da pessoa */
  signals?: string[];
  /** O que fazer se o sinal não veio */
  ifNoSignal?: string;
  /** Passo longo quebrado em partes de 15 a 20 minutos (etapa 53); durationMinutes é a soma */
  parts?: { title: string; minutes: number }[];
  /** A pessoa pulou este passo (etapa 53) */
  skipped?: boolean;
  /** Partes já feitas (índices), vindas do que ficou salvo */
  partsDone?: number[];
  /** Contador que vem do Caderno → Pessoas (ex.: 3 de 5 conversas) */
  counter?: { kind: 'names' | 'talked' | 'presented'; target: number };
  resources: { title: string; type: string }[];
  userNotes?: string;
  isLocked?: boolean;
  /** Intenção de implementação: "quando eu ___, faço esta tarefa" (docs/pesquisa/02) */
  when?: string;
  /** Categorias da caixa de ferramentas que ajudam nesta tarefa (src/data/ferramentas.ts) */
  toolCategories?: import('./ferramentas').ToolCategoryId[];
  anchorIllustration: {
    title: string;
    symbol: string;
    meaning: string;
    badge: string;
    color: string;
    bgGradient: string;
  };
  audioCoach?: {
    title: string;
    duration: string;
    narrator: string;
    transcript: string;
    audioWaveHeights: number[];
  };
}

/** Passos do roteiro, na ordem em que foram escritos; INITIAL_TASKS é a mesma lista ordenada pela semana */
const ROADMAP: TaskItem[] = [
  {
    id: 't1',
    week: 1,
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Entender o problema',
    title: 'Rascunhar em 1 frase o que você resolve',
    description: 'Um rascunho simples: o que você resolve, e pra quem. Você vai reescrever depois das conversas.',
    durationMinutes: 15,
    status: 'completed',
    whatToDo: 'Complete a frase: "Eu ajudo [quem] a [conseguir o quê], mesmo que [a maior dificuldade dessa pessoa]". Use palavras simples, do jeito que você falaria com um amigo. É um rascunho: na semana 2 você reescreve com as palavras de quem tem o problema.',
    howToKnowItIsGood: [
      'Qualquer pessoa da sua família consegue entender ao ouvir',
      'Resolve exatamente 1 dor central, não 5 coisas diferentes',
      'Não promete dinheiro fácil nem prazos milagrosos'
    ],
    resources: [
      { title: 'Fórmula da Promessa Magnética (PDF)', type: 'PDF' },
      { title: '3 Exemplos de promessas validadas', type: 'Guia' }
    ],
    userNotes: 'Minha promessa: "Ajudo freelancers iniciantes a organizarem sua semana de trabalho em até 30 minutos sem surtar com prazos."',
    anchorIllustration: {
      title: 'A Bússola da Clareza',
      symbol: '🧭',
      meaning: 'O primeiro ponto cardeal do seu prumo',
      badge: 'Origem',
      color: '#1F6F5C',
      bgGradient: 'from-[#E3F2ED] to-[#C8E6DC]'
    },
    audioCoach: {
      title: 'O poder de uma promessa simples',
      duration: '1:10 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'Quando tentamos falar com todo mundo, ninguém ouve. Uma frase simples não é limitar seu talento: é estender a mão para quem está perdido exatamente onde você já esteve. Respire fundo e escreva o óbvio.',
      audioWaveHeights: [25, 45, 60, 80, 50, 70, 95, 60, 40, 55, 75, 40, 30]
    }
  },
  {
    id: 't2',
    week: 3,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Criar a versão mais simples do que você vai oferecer',
    description: 'Só o básico, montado com o que as pessoas te contaram.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Releia as palavras exatas das conversas e monte o menor formato que resolve o problema que elas descreveram: um checklist em PDF, um documento bem estruturado ou um vídeo direto de 10 minutos.',
    howToKnowItIsGood: [
      'Dá para ser consumido e aplicado em menos de 1 dia',
      'Resolve 1 problema de ponta a ponta',
      'Você ficaria confortável em entregar de graça para alguém testar'
    ],
    resources: [
      { title: 'Template de Checklist Mínimo', type: 'Template' },
      { title: 'Estrutura de Vídeo de 10 Minutos', type: 'Roteiro' }
    ],
    userNotes: '',
    anchorIllustration: {
      title: 'A Semente Mínima',
      symbol: '🌱',
      meaning: 'Pequena o bastante para nascer hoje',
      badge: 'Materialização',
      color: '#2E8B73',
      bgGradient: 'from-[#EAF5F0] to-[#D5EDE3]'
    },
    audioCoach: {
      title: 'Por que perfeito é o inimigo do feito',
      duration: '1:18 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'Você não precisa de estúdio, iluminação ou 40 aulas. Uma semente bem plantada gera mais vida do que um palácio imaginário. 20 minutos focados em resolver uma dor real. Você já sabe o que colocar aí.',
      audioWaveHeights: [30, 50, 70, 60, 85, 90, 65, 45, 55, 70, 50, 35, 20]
    }
  },
  {
    id: 't3',
    week: 3,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Mostrar pra 5 pessoas e pedir um próximo passo',
    description: 'Mostrar a versão mínima e pedir algo concreto: marcar, pagar o teste ou indicar alguém.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Mostre sua versão mínima (o desenho do serviço, o roteiro da sessão, o esboço do guia ou a aula 1) para 5 pessoas que têm o problema, de preferência as das conversas. Pergunte "o que ficou confuso?" e, no fim, peça um próximo passo concreto: marcar a entrega, pagar o teste ou indicar alguém. Marque cada uma como "Viu a proposta" no Caderno e anote as palavras exatas.',
    howToKnowItIsGood: [
      'Você mostrou para 5 pessoas',
      'Pediu um próximo passo concreto a cada uma',
      'Anotou as palavras exatas que elas usaram'
    ],
    signals: [
      'Alguém marcou uma data, pagou ou indicou outra pessoa (marque o compromisso no Caderno)'
    ],
    ifNoSignal: 'Elogio sem compromisso não conta, mas também não é fracasso: anote o que travou e use no próximo passo.',
    counter: { kind: 'presented', target: 5 },
    parts: [
      { title: 'Preparar o que você vai mostrar', minutes: 15 },
      { title: 'Mostrar e pedir um próximo passo (uma pessoa por vez)', minutes: 15 }
    ],
    resources: [
      { title: 'Script de abordagem no WhatsApp sem ser chato', type: 'Script' }
    ],
    userNotes: '',
    anchorIllustration: {
      title: 'O Eco das 3 Vozes',
      symbol: '🌿',
      meaning: 'Ouvir o mundo com coração aberto',
      badge: 'Conexão',
      color: '#D97746',
      bgGradient: 'from-[#FDF2EC] to-[#F9E2D2]'
    },
    audioCoach: {
      title: 'A coragem de ouvir o outro',
      duration: '1:25 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'Dar a cara a tapa assusta todo mundo. Mas lembre-se: você não está pedindo aprovação pessoal, está oferecendo um atalho que você construiu com carinho. Três mensagens calmas. O que vier de resposta é ouro.',
      audioWaveHeights: [20, 40, 55, 75, 80, 60, 85, 90, 70, 50, 65, 40, 25]
    }
  },
  {
    id: 't4',
    week: 3,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Escolher o preço de teste, como receber e como devolver',
    description: 'Quanto cobrar no teste, como a pessoa paga e como devolve se não gostar.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Defina o preço de fundador do teste (ex: R$ 27 a R$ 47): barato, e dito como preço de teste. Para receber, a chave Pix ou o QR code do seu banco já bastam; link de pagamento é opcional. Escreva também como devolve: quem compra pela internet pode desistir em até 7 dias e receber tudo de volta (Código de Defesa do Consumidor, art. 49).',
    howToKnowItIsGood: [
      'A pessoa consegue te pagar pelo celular em segundos (chave Pix, QR code ou link)',
      'Você escreveu como devolve o dinheiro em até 7 dias',
      'O preço não dá medo de cobrar nem parece golpe'
    ],
    resources: [
      { title: 'Checklist de plataformas gratuitas no Brasil', type: 'Guia' }
    ],
    anchorIllustration: {
      title: 'A Chave do Valor',
      symbol: '🗝️',
      meaning: 'Abrindo o portal da reciprocidade justa',
      badge: 'Compromisso',
      color: '#C86638',
      bgGradient: 'from-[#FCEDE7] to-[#F5D8CC]'
    },
    audioCoach: {
      title: 'Cobrar é um ato de respeito mútuo',
      duration: '1:05 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'Cobrar um valor simbólico não é ambição desmedida: é o filtro que faz as pessoas se comprometerem com o próprio resultado. R$ 27 ou R$ 47 é leve para quem paga e sagrado para o seu primeiro marco.',
      audioWaveHeights: [25, 45, 65, 70, 85, 60, 50, 75, 80, 55, 40, 30, 20]
    }
  },
  // Tarefas de Marketing (Capítulo 2)
  {
    id: 't5',
    week: 4,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Publicar 3 posts sobre o problema que você resolve',
    description: 'Um por vez, no seu canal: posts que mostram que você entende o que essas pessoas passam.',
    durationMinutes: 60,
    status: 'pending',
    whatToDo: 'Faça um post por vez, em dias diferentes (uns 20 minutos cada): 1) um erro comum que essas pessoas cometem, 2) uma ideia errada que muita gente acredita, 3) uma solução simples. Use as palavras exatas das conversas.',
    howToKnowItIsGood: [
      'Publicou os 3 posts, um por vez',
      'Usou as palavras exatas das conversas'
    ],
    signals: [
      'Alguém respondeu, salvou ou encaminhou'
    ],
    ifNoSignal: 'No começo é normal ninguém responder. Mande o post para 1 ou 2 pessoas da sua lista e pergunte o que acharam.',
    parts: [
      { title: 'Post 1: um erro comum', minutes: 20 },
      { title: 'Post 2: uma ideia errada', minutes: 20 },
      { title: 'Post 3: uma solução simples', minutes: 20 }
    ],
    resources: [
      { title: '5 Modelos de Carrossel que Geram Directs', type: 'Templates' }
    ],
    isLocked: true,
    anchorIllustration: {
      title: 'A Lamparina de Conexão',
      symbol: '🏮',
      meaning: 'Iluminando o caminho para quem está na penumbra',
      badge: 'Visibilidade',
      color: '#6B46C1',
      bgGradient: 'from-[#F3E8FF] to-[#E9D5FF]'
    },
    audioCoach: {
      title: 'Falar de dor sem apelação',
      duration: '1:15 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'Você não precisa viralizar com dancinhas. Quando você descreve com precisão a frustração que alguém sente às 23h da noite, essa pessoa sabe que você é o guia certo.',
      audioWaveHeights: [30, 60, 75, 90, 80, 65, 70, 85, 60, 50, 40, 30, 25]
    }
  },
  {
    id: 't6',
    week: 4,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Convidar 10 pessoas para o teste pago',
    description: 'Oferecer o teste com preço de fundador para quem tem o problema.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Chame, uma de cada vez, quem curtiu, comentou, conversou com você ou já te pediu ajuda. Ofereça o teste com o preço de fundador, dito como teste. Se você ainda não tem coragem de cobrar, pode fazer de graça para 1 ou 2 pessoas, mas só em troca de um compromisso combinado antes: data marcada, depoimento autorizado ou uma indicação. Esse compromisso conta como tempo ou indicação, nunca como dinheiro. Grátis "pra ver se gosta" não conta.',
    howToKnowItIsGood: [
      'Você mandou 10 convites, um de cada vez',
      'Disse com clareza que é um teste e quanto custa'
    ],
    signals: [
      'Alguém perguntou como pagar, pagou, deu um sinal ou marcou uma data'
    ],
    ifNoSignal: 'Se ninguém perguntou como pagar, mude uma coisa só (o preço, a promessa ou o formato) e convide mais 5.',
    parts: [
      { title: 'Convidar as 5 primeiras pessoas', minutes: 15 },
      { title: 'Convidar mais 5', minutes: 15 }
    ],
    resources: [
      { title: 'Fluxo de conversa consultiva no 1 a 1', type: 'Roteiro' }
    ],
    isLocked: true,
    anchorIllustration: {
      title: 'A Ponte de Confiança',
      symbol: '🌉',
      meaning: 'Unindo duas margens com diálogo sincero',
      badge: 'Relacionamento',
      color: '#3182CE',
      bgGradient: 'from-[#EBF8FF] to-[#BEE3F8]'
    },
    audioCoach: {
      title: 'Conversar em vez de empurrar',
      duration: '1:12 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'O melhor marketing do mundo ainda é a conversa sincera entre dois seres humanos. Chame com curiosidade e humildade: você está aqui para resolver, não para bajular.',
      audioWaveHeights: [25, 45, 65, 80, 70, 85, 90, 65, 55, 40, 30, 20, 15]
    }
  },
  // Tarefa de Lançamento (Capítulo 3)
  {
    id: 't7',
    week: 8,
    phaseId: 'lancamento',
    phaseName: 'Vendas',
    chapterId: 3,
    chapterTitle: 'Capítulo 3: As primeiras vendas',
    title: 'Abrir as vendas e pedir depoimentos',
    description: 'Avise que está vendendo, com prazo, e peça a opinião de quem comprou.',
    durationMinutes: 45,
    status: 'pending',
    whatToDo: 'Conte que abriu as vendas e acompanhe cada pessoa de perto. Só ofereça bônus ou vagas limitadas se for verdade. A quem comprou, peça um depoimento com autorização por escrito para usar.',
    howToKnowItIsGood: [
      'Você avisou que abriu as vendas',
      'Acompanhou quem perguntou',
      'Pediu depoimento, com autorização, a quem comprou'
    ],
    signals: [
      'Pelo menos 1 venda'
    ],
    ifNoSignal: 'Sem venda ainda? Retome quem viu a proposta (a maioria das vendas sai da segunda mensagem) e confira se o preço e o jeito de pagar estão claros.',
    parts: [
      { title: 'Avisar que abriu as vendas', minutes: 15 },
      { title: 'Acompanhar quem perguntou', minutes: 15 },
      { title: 'Pedir depoimento a quem comprou', minutes: 15 }
    ],
    resources: [
      { title: 'Script de coleta de depoimento espontâneo', type: 'Guia' }
    ],
    isLocked: true,
    anchorIllustration: {
      title: 'A Colheita da Promessa',
      symbol: '🌾',
      meaning: 'Celebrando o fruto da coragem consistente',
      badge: 'Realização',
      color: '#D69E2E',
      bgGradient: 'from-[#FEFCBF] to-[#FAF089]'
    },
    audioCoach: {
      title: 'O primeiro sim muda quem você é',
      duration: '1:30 min',
      narrator: 'Coach Prumo · voz sintética',
      transcript: 'A primeira notificação de venda não é sobre o dinheiro em si: é a confirmação de que sua mente é capaz de gerar valor no mundo real. Guarde esse momento.',
      audioWaveHeights: [30, 50, 75, 95, 80, 85, 100, 75, 60, 45, 35, 25, 20]
    }
  },
  // Etapa 43: passos que completam os 90 dias (4 capítulos, 13 semanas)
  {
    id: 't8',
    week: 1,
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Entender o problema',
    title: 'Listar 20 pessoas que podem ter esse problema',
    description: 'Gente que você conhece, que já te pediu ajuda ou que está em grupos do tema.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Abra o Caderno → Pessoas e adicione pelo menos 10 nomes hoje (no Android, dá pra puxar da agenda; no iPhone, é digitando mesmo). Na nota de cada um, escreva em poucas palavras por que você acha que essa pessoa tem o problema. Ao longo da semana, chegue a 20. Guarde só o nome e o contato: são dados de outras pessoas, para você falar com uma de cada vez.',
    howToKnowItIsGood: [
      'Pelo menos 10 nomes no Caderno',
      'Cada nome tem um "por que" na nota',
      'Tem gente de fora do seu círculo mais próximo'
    ],
    counter: { kind: 'names', target: 20 },
    resources: [],
    anchorIllustration: {
      title: 'O Mapa das Pessoas',
      symbol: '📇',
      meaning: 'Quem pode precisar do que você sabe',
      badge: 'Mapa',
      color: '#2E8B73',
      bgGradient: 'from-[#EAF5F0] to-[#D5EDE3]'
    }
  },
  {
    id: 't9',
    week: 2,
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Entender o problema',
    title: 'Escrever o convite para conversar sobre o problema',
    description: 'Uma mensagem curta para pedir 10 minutos de conversa, sem mostrar a sua ideia.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Abra a mensagem pronta (Caderno → Pessoas → toque num nome → Mensagem pronta) e reescreva com as suas palavras: quem você é, que está estudando esse problema e um pedido pequeno, como 10 minutos de conversa. Não fale da sua ideia ainda. Mande de um em um, com o nome da pessoa, nunca em massa.',
    howToKnowItIsGood: [
      'Cabe numa tela de celular',
      'Pede uma conversa, não uma compra',
      'Não conta a sua ideia',
      'Você mandaria para um conhecido sem vergonha'
    ],
    resources: [],
    anchorIllustration: {
      title: 'A Carta Leve',
      symbol: '✉️',
      meaning: 'Um convite que não pesa',
      badge: 'Convite',
      color: '#C86638',
      bgGradient: 'from-[#FCEDE7] to-[#F5D8CC]'
    }
  },
  {
    id: 't10',
    week: 4,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Ajustar com o que você ouviu',
    description: 'Mudar uma coisa na sua oferta a partir das apresentações.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Releia o que as pessoas disseram e fizeram (anote no Caderno, se ainda não anotou). Mude uma coisa só: o nome, a promessa, o formato ou o preço.',
    howToKnowItIsGood: [
      'Você sabe dizer o que mudou e por quê',
      'A sua frase do passo 1 ficou mais clara'
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Ajuste Fino',
      symbol: '🔧',
      meaning: 'Ouvir e mudar o que precisa',
      badge: 'Escuta',
      color: '#3182CE',
      bgGradient: 'from-[#EBF8FF] to-[#BEE3F8]'
    }
  },
  {
    id: 't11',
    week: 5,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Fazer a primeira entrega de teste',
    description: 'Entregar para quem se comprometeu, mesmo que ainda simples.',
    durationMinutes: 60,
    status: 'pending',
    whatToDo: 'Combine uma data e entregue para a primeira pessoa que se comprometeu. Depois, pergunte: o que ajudou? o que faltou? Anote as respostas no Caderno, na pessoa. No fim, peça por escrito se pode usar o comentário dela como depoimento (uma mensagem dizendo "pode usar" já serve como registro).',
    howToKnowItIsGood: [
      'Você fez a entrega',
      'Anotou o que ajudou e o que faltou',
      'Pediu autorização por escrito para usar o depoimento'
    ],
    signals: [
      'A pessoa autorizou o depoimento ou indicou alguém'
    ],
    parts: [
      { title: 'Combinar a data e preparar', minutes: 20 },
      { title: 'Fazer a entrega', minutes: 20 },
      { title: 'Perguntar o que ajudou e pedir a autorização do depoimento', minutes: 20 }
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Primeiro Presente',
      symbol: '📦',
      meaning: 'A ideia virando algo nas mãos de alguém',
      badge: 'Entrega',
      color: '#6B46C1',
      bgGradient: 'from-[#F3E8FF] to-[#E9D5FF]'
    }
  },
  {
    id: 't12',
    week: 6,
    phaseId: 'marketing',
    phaseName: 'Teste',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Testar a solução',
    title: 'Decidir: seguir, ajustar ou trocar',
    description: 'Olhar o teste com honestidade e escolher o próximo passo.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Veja o funil no Caderno → Pessoas. Conte compromissos, não "sins": quem marcou uma data, indicou alguém ou pagou. Seguir: 2 compromissos ou mais em 5 apresentações, com pelo menos 1 em dinheiro (pagamento ou sinal); hora das vendas. Ajustar: qualquer outro caso com pelo menos 1 compromisso; a dor existe, então mude uma coisa só (a oferta ou o preço) e faça mais uma rodada. Trocar: nenhum compromisso. Antes de trocar a ideia, confira se as 5 pessoas eram mesmo o público certo: muitas vezes eram as pessoas erradas, e não a ideia errada. Se eram, tudo bem: na aba Você, abra o resultado e escolha outro caminho.',
    howToKnowItIsGood: [
      'Você decidiu pelo que as pessoas fizeram, não pelo que disseram',
      'Anotou no Caderno o que aprendeu com o teste'
    ],
    resources: [],
    anchorIllustration: {
      title: 'A Balança Honesta',
      symbol: '⚖️',
      meaning: 'Decidir com o que aconteceu de verdade',
      badge: 'Decisão',
      color: '#D69E2E',
      bgGradient: 'from-[#FEFCBF] to-[#FAF089]'
    }
  },
  {
    id: 't13',
    week: 7,
    phaseId: 'lancamento',
    phaseName: 'Vendas',
    chapterId: 3,
    chapterTitle: 'Capítulo 3: As primeiras vendas',
    title: 'Montar sua mensagem de venda',
    description: 'Explicar a oferta numa mensagem ou página simples.',
    durationMinutes: 40,
    status: 'pending',
    whatToDo: 'Use o modelo de página de venda: o problema, o que você entrega, como funciona, o preço, como comprar, como devolver em até 7 dias e um contato para dúvidas. Pode ser uma mensagem longa no WhatsApp ou uma página grátis.',
    howToKnowItIsGood: [
      'Alguém que não te conhece entende o que é e quanto custa',
      'Tem um jeito claro de pagar',
      'Diz como devolver em até 7 dias e onde tirar dúvidas'
    ],
    parts: [
      { title: 'Escrever o problema e o que você entrega', minutes: 20 },
      { title: 'Preço, como pagar, devolução e contato', minutes: 20 }
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Mapa da Oferta',
      symbol: '🗺️',
      meaning: 'Tudo o que a pessoa precisa saber, num lugar só',
      badge: 'Oferta',
      color: '#C86638',
      bgGradient: 'from-[#FCEDE7] to-[#F5D8CC]'
    }
  },
  {
    id: 't14',
    week: 9,
    phaseId: 'lancamento',
    phaseName: 'Vendas',
    chapterId: 3,
    chapterTitle: 'Capítulo 3: As primeiras vendas',
    title: 'Pedir indicações',
    description: 'Quem gostou conhece outras pessoas com o mesmo problema.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Pergunte para quem comprou ou gostou: "você conhece alguém que também passa por isso?". Se fizer sentido, ofereça algo simples em troca, como um desconto na próxima.',
    howToKnowItIsGood: [
      'Você pediu para pelo menos 3 pessoas'
    ],
    signals: [
      'Entrou pelo menos 1 nome novo no Caderno'
    ],
    resources: [],
    anchorIllustration: {
      title: 'Os Galhos que Crescem',
      symbol: '🌳',
      meaning: 'Uma pessoa leva a outra',
      badge: 'Indicação',
      color: '#2E8B73',
      bgGradient: 'from-[#EAF5F0] to-[#D5EDE3]'
    }
  },
  {
    id: 't15',
    week: 9,
    phaseId: 'lancamento',
    phaseName: 'Vendas',
    chapterId: 3,
    chapterTitle: 'Capítulo 3: As primeiras vendas',
    title: 'Organizar como você entrega',
    description: 'Um passo a passo para entregar sempre igual, sem reinventar.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Escreva o passo a passo da sua entrega, do "paguei" ao "recebi". Crie modelos para o que se repete: mensagem de boas-vindas, checklist, arquivos.',
    howToKnowItIsGood: [
      'Outra pessoa conseguiria seguir o seu passo a passo',
      'A entrega seguinte levou menos tempo'
    ],
    parts: [
      { title: 'Escrever o passo a passo da entrega', minutes: 15 },
      { title: 'Criar os modelos do que se repete', minutes: 15 }
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Cesto Arrumado',
      symbol: '🧺',
      meaning: 'Cada coisa no seu lugar',
      badge: 'Processo',
      color: '#3182CE',
      bgGradient: 'from-[#EBF8FF] to-[#BEE3F8]'
    }
  },
  {
    id: 't16',
    week: 10,
    phaseId: 'lancamento',
    phaseName: 'Vendas',
    chapterId: 3,
    chapterTitle: 'Capítulo 3: As primeiras vendas',
    title: 'Revisar o preço',
    description: 'Com o que você aprendeu, o preço dos próximos clientes.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Recalcule com a calculadora: quanto tempo leva cada entrega e quanto ela vale. Desconte a taxa do meio de pagamento (Pix entre pessoas costuma ser grátis; links e plataformas cobram) e separe uma parte para imposto. Se as pessoas compram fácil e você está ficando sem tempo, é sinal de que o preço pode subir para os próximos.',
    howToKnowItIsGood: [
      'Você sabe quanto sobra por hora, depois de taxas e imposto',
      'Decidiu o preço dos próximos clientes'
    ],
    resources: [],
    anchorIllustration: {
      title: 'A Moeda Justa',
      symbol: '🪙',
      meaning: 'Um valor bom pra você e pra quem compra',
      badge: 'Valor',
      color: '#D69E2E',
      bgGradient: 'from-[#FEFCBF] to-[#FAF089]'
    }
  },
  {
    id: 't17',
    week: 1,
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Entender o problema',
    title: 'Montar a sua semana leve',
    description: 'Dias e horários para o Prumo caber na sua semana de verdade.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Escolha 2 ou 3 momentos fixos da semana para o Prumo, com dia, hora e lugar (ex.: "terça e quinta, 7h, na mesa da cozinha"). Anote no "Quando vou fazer" dos próximos passos. Deixe pelo menos um dia sem nada: ritmo que cansa não dura.',
    howToKnowItIsGood: [
      'Você escolheu dia, hora e lugar',
      'Cabe na sua semana de verdade, com folga',
      'Tem pelo menos um dia de descanso'
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Calendário Sereno',
      symbol: '🗓️',
      meaning: 'Constância sem esgotamento',
      badge: 'Ritmo',
      color: '#6B46C1',
      bgGradient: 'from-[#F3E8FF] to-[#E9D5FF]'
    }
  },
  {
    id: 't18',
    week: 11,
    phaseId: 'ritmo',
    phaseName: 'Ritmo',
    chapterId: 4,
    chapterTitle: 'Capítulo 4: Criar ritmo',
    title: 'Juntar depoimentos e resultados',
    description: 'As provas do que você já fez, num lugar só.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Reúna no Caderno os depoimentos autorizados, prints e números. O funil do Caderno → Pessoas já mostra quantas pessoas conversaram, viram a proposta, se comprometeram e compraram. Isso vira prova para quem ainda não te conhece.',
    howToKnowItIsGood: [
      'Depoimentos guardados, só os autorizados',
      'Você sabe os seus números destes 90 dias'
    ],
    parts: [
      { title: 'Juntar os depoimentos autorizados', minutes: 15 },
      { title: 'Anotar os números do funil', minutes: 15 }
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Baú de Provas',
      symbol: '🏺',
      meaning: 'O que você construiu, guardado com cuidado',
      badge: 'Prova',
      color: '#C86638',
      bgGradient: 'from-[#FCEDE7] to-[#F5D8CC]'
    }
  },
  {
    id: 't19',
    week: 12,
    phaseId: 'ritmo',
    phaseName: 'Ritmo',
    chapterId: 4,
    chapterTitle: 'Capítulo 4: Criar ritmo',
    title: 'Planejar os próximos 30 dias',
    description: 'Uma meta para o mês que vem e o que repetir para chegar lá.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Escolha uma meta para o próximo mês (ex.: 5 clientes) e o que vai repetir toda semana para chegar nela. Pequeno e possível ganha de grande e bonito.',
    howToKnowItIsGood: [
      'Uma meta só, com número',
      'Você sabe o que faz toda semana para chegar nela'
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Telescópio',
      symbol: '🔭',
      meaning: 'Olhar um pouco mais longe',
      badge: 'Próximo ciclo',
      color: '#3182CE',
      bgGradient: 'from-[#EBF8FF] to-[#BEE3F8]'
    }
  },
  {
    id: 't20',
    week: 13,
    phaseId: 'ritmo',
    phaseName: 'Ritmo',
    chapterId: 4,
    chapterTitle: 'Capítulo 4: Criar ritmo',
    title: 'Reler a carta e responder o seu eu do começo',
    description: 'Fechar os 90 dias com o que aconteceu de verdade.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Abra a carta que você escreveu no começo (Início → Sua carta). Escreva no Caderno o que aconteceu, o que aprendeu e o que quer para os próximos meses. Depois, responda como se fosse o seu eu do futuro: o que ele diria para você agora?',
    howToKnowItIsGood: [
      'Você reconheceu pelo menos uma coisa que conquistou',
      'Escreveu com honestidade, sem se cobrar'
    ],
    resources: [],
    anchorIllustration: {
      title: 'A Carta Respondida',
      symbol: '📜',
      meaning: 'O círculo que se fecha',
      badge: 'Colheita',
      color: '#D69E2E',
      bgGradient: 'from-[#FEFCBF] to-[#FAF089]'
    }
  },
  // Etapa 52: passos novos da revisão do roteiro
  {
    id: 't21',
    week: 2,
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Entender o problema',
    title: 'Conversar com 5 pessoas sobre o problema',
    description: 'Ouvir como as pessoas vivem o problema hoje, sem mostrar a sua ideia.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Uma conversa de 15 minutos por vez, com quem está na sua lista. Não fale da sua ideia: pergunte sobre o passado. "Quando foi a última vez que isso aconteceu?", "O que você tentou?", "Gastou tempo ou dinheiro com isso?". Anote as palavras exatas na nota da pessoa e marque como "Conversou" no Caderno. Depois da quinta, reescreva a sua frase do passo 1 com as palavras delas.',
    howToKnowItIsGood: [
      'Você conversou com 5 pessoas',
      'Não mostrou a sua ideia em nenhuma conversa',
      'Anotou as palavras exatas de cada uma',
      'Reescreveu a sua frase com as palavras delas'
    ],
    signals: ['Alguém contou que já gastou tempo ou dinheiro tentando resolver isso'],
    ifNoSignal: 'Se ninguém se importa muito com o problema, isso também é uma descoberta: talvez seja outro problema, ou outro público. Anote e converse sobre isso na revisão da semana.',
    counter: { kind: 'talked', target: 5 },
    resources: [],
    anchorIllustration: {
      title: 'O Ouvido Atento',
      symbol: '👂',
      meaning: 'Entender antes de oferecer',
      badge: 'Escuta',
      color: '#1F6F5C',
      bgGradient: 'from-[#E3F2ED] to-[#C8E6DC]'
    }
  },
  {
    id: 't22',
    week: 11,
    phaseId: 'ritmo',
    phaseName: 'Ritmo',
    chapterId: 4,
    chapterTitle: 'Capítulo 4: Criar ritmo',
    title: 'Revisar a sua semana padrão',
    description: 'Ajustar os dias e horários com o que você aprendeu nestes meses.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Olhe a semana leve que você montou no começo e o que de fato aconteceu. Mantenha o que funcionou, tire o que nunca coube e garanta dias e horários para conversar com pessoas, entregar e descansar.',
    howToKnowItIsGood: [
      'Cabe na sua semana de verdade, com folga',
      'Tem um horário fixo para falar com pessoas novas',
      'Tem pelo menos um momento de descanso'
    ],
    resources: [],
    anchorIllustration: {
      title: 'O Calendário Sereno',
      symbol: '🗓️',
      meaning: 'Constância sem esgotamento',
      badge: 'Ritmo',
      color: '#2E8B73',
      bgGradient: 'from-[#EAF5F0] to-[#D5EDE3]'
    }
  },
  {
    id: 't23',
    week: 12,
    phaseId: 'ritmo',
    phaseName: 'Ritmo',
    chapterId: 4,
    chapterTitle: 'Capítulo 4: Criar ritmo',
    title: 'Ver se vale formalizar',
    description: 'Quando as vendas se repetem, entender o básico para trabalhar no formal.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'No teste não precisava. Agora, se as vendas se repetem, veja se a sua atividade cabe no MEI: o enquadramento depende do que você faz de verdade (dar aulas e cursos costuma ter ocupação própria; criador de conteúdo e influenciador não podem ser MEI). Confira no Portal do Empreendedor (gov.br/mei) quanto custa por mês e, na dúvida, converse com um contador. Isto é uma orientação geral, não aconselhamento jurídico nem contábil.',
    howToKnowItIsGood: [
      'Você sabe se a sua atividade cabe no MEI',
      'Sabe quanto custaria por mês',
      'Decidiu: formalizar agora, mais pra frente ou conversar com um contador'
    ],
    resources: [],
    anchorIllustration: {
      title: 'A Casa em Ordem',
      symbol: '🏠',
      meaning: 'Crescer com o pé no chão',
      badge: 'Base',
      color: '#2E8B73',
      bgGradient: 'from-[#EAF5F0] to-[#D5EDE3]'
    }
  }
];

/**
 * A ordem da jornada (etapa 52): primeiro o problema, depois a solução. Dentro da semana, na ordem
 * desta lista. A semana só sugere: dá para adiantar.
 */
const ORDER = ['t1', 't8', 't17', 't9', 't21', 't2', 't4', 't3', 't10', 't5', 't6', 't11', 't12', 't13', 't7', 't14', 't15', 't16', 't22', 't18', 't23', 't19', 't20'];

/** O roteiro na ordem da jornada: pela semana sugerida e, dentro dela, pela ordem acima */
export const INITIAL_TASKS: TaskItem[] = [...ROADMAP].sort((a, b) => (a.week ?? 1) - (b.week ?? 1) || ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
