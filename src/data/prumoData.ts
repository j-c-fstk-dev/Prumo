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
  chapterTitle: 'Capítulo 1: Deixar a ideia clara',
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
  phaseId: 'fundacao' | 'marketing' | 'lancamento';
  phaseName: string;
  chapterId: number;
  chapterTitle: string;
  title: string;
  description: string;
  durationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed';
  whatToDo: string;
  howToKnowItIsGood: string[];
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

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't1',
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Deixar a ideia clara',
    title: 'Dizer em 1 frase o que você resolve',
    description: 'Uma frase simples: o que você resolve, e pra quem.',
    durationMinutes: 15,
    status: 'completed',
    whatToDo: 'Complete a frase: "Eu ajudo [quem] a [conseguir o quê], mesmo que [a maior dificuldade dessa pessoa]". Use palavras simples, do jeito que você falaria com um amigo.',
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
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Deixar a ideia clara',
    title: 'Criar a versão mais simples do que você vai oferecer',
    description: 'Só o básico, pra testar se alguém se interessa.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Pegue o tema que você mais domina e monte o menor formato possível: um checklist em PDF, um documento bem estruturado ou um vídeo direto de 10 minutos.',
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
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Deixar a ideia clara',
    title: 'Mostrar pra 3 pessoas e ouvir o que acham',
    description: 'Converse com 3 pessoas que têm esse problema e peça uma opinião sincera.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Mostre sua versão mínima (o desenho do serviço, o roteiro da sessão, o esboço do guia ou a aula 1) para 3 pessoas que já expressaram dificuldade no tema. Faça duas perguntas: "O que ficou confuso?" e "Isso resolveria seu problema?".',
    howToKnowItIsGood: [
      'Pelo menos 2 pessoas confirmaram que aplicaram o conselho',
      'Você anotou as palavras exatas que elas usaram para descrever o alívio'
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
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Deixar a ideia clara',
    title: 'Escolher o preço de teste e como receber',
    description: 'Quanto cobrar no teste e como a pessoa vai te pagar.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Defina o preço inicial de validação (ex: R$ 27 a R$ 47) e escolha como vai receber. O Pix do seu banco já basta no teste.',
    howToKnowItIsGood: [
      'O link de pagamento abre no celular e aceita Pix em segundos',
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
    phaseId: 'marketing',
    phaseName: 'Marketing',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Mostrar pra quem precisa',
    title: 'Fazer 3 posts no Instagram sobre o problema que você resolve',
    description: 'Posts que mostram que você entende o que essas pessoas passam.',
    durationMinutes: 40,
    status: 'pending',
    whatToDo: 'Faça 3 posts (carrossel ou vídeo curto): 1) um erro comum que essas pessoas cometem, 2) uma ideia errada que muita gente acredita, 3) uma solução simples.',
    howToKnowItIsGood: [
      'Pelo menos 1 pessoa respondeu com "nossa, eu passo por isso!"'
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
    phaseId: 'marketing',
    phaseName: 'Marketing',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Mostrar pra quem precisa',
    title: 'Convidar 10 pessoas pra conhecer o que você criou',
    description: 'Conversar com quem já demonstrou interesse.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Puxe conversa com quem curtiu, comentou ou já te pediu ajuda, e ofereça com uma condição especial de teste.',
    howToKnowItIsGood: [
      'Conversas respeitosas que geraram perguntas sobre como comprar'
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
    phaseId: 'lancamento',
    phaseName: 'Lançamento',
    chapterId: 3,
    chapterTitle: 'Capítulo 3: As primeiras vendas',
    title: 'Abrir as vendas e pedir depoimentos',
    description: 'Avise que está vendendo, com prazo, e peça a opinião de quem comprou.',
    durationMinutes: 45,
    status: 'pending',
    whatToDo: 'Conte que abriu as vendas, com um bônus pros 5 primeiros, e acompanhe cada pessoa de perto.',
    howToKnowItIsGood: [
      'Pelo menos 1 venda realizada e feedback positivo registrado'
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
  }
];
