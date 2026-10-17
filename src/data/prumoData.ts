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
    title: 'Habilidades',
    iconName: 'Wrench',
    valueSignal: {
      title: 'Mapeando sua facilidade natural',
      subtitle: 'Construir sobre o que você já faz bem sem esforço reduz em 80% o atrito para começar.',
      icon: '✨'
    },
    questions: [
      {
        id: 'q1_help',
        sectionId: 1,
        sectionName: 'Habilidades',
        question: 'O que as pessoas costumam pedir a sua ajuda para resolver?',
        subtext: 'Escolha até 3 opções que mais combinam com seu dia a dia.',
        type: 'multiple',
        maxChoices: 3,
        options: [
          { id: 'conselhos', label: 'Conselhos de vida & carreira', icon: '💬' },
          { id: 'design', label: 'Design e estética visual', icon: '🎨' },
          { id: 'planilhas', label: 'Planilhas e organização', icon: '📊' },
          { id: 'textos', label: 'Escrita e revisão de textos', icon: '✍️' },
          { id: 'ensinar', label: 'Explicar assuntos difíceis', icon: '💡' },
          { id: 'vendas', label: 'Negociar e vender', icon: '🤝' },
          { id: 'tecnologia', label: 'Resolver problemas no computador/celular', icon: '💻' },
          { id: 'saude', label: 'Treino, alimentação e hábitos', icon: '🏃' }
        ],
        reflectionPrompt: 'Em suas próprias palavras: qual problema você tem prazer genuíno em descomplicar para alguém?',
        reflectionPlaceholder: 'Ex: Adoro ajudar amigos a organizarem rotinas caóticas de trabalho...'
      },
      {
        id: 'q1_preference',
        sectionId: 1,
        sectionName: 'Habilidades',
        question: 'No seu íntimo, qual papel você mais gosta de exercer?',
        subtext: 'Selecione a atividade em que o tempo passa mais rápido.',
        type: 'single',
        options: [
          { id: 'criar', label: 'Criar coisas novas do zero', icon: '✨' },
          { id: 'ensinar', label: 'Ensinar e guiar outras pessoas', icon: '🎓' },
          { id: 'organizar', label: 'Organizar processos e estruturar rotinas', icon: '📋' },
          { id: 'conectar', label: 'Conectar pessoas e vender ideias', icon: '🔗' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Interesses e Propósito',
    iconName: 'Compass',
    valueSignal: {
      title: 'Identificando sua energia sustentável',
      subtitle: 'Quando o assunto te fascina, a disciplina deixa de ser um sacrifício pesado.',
      icon: '🧭'
    },
    questions: [
      {
        id: 'q2_themes',
        sectionId: 2,
        sectionName: 'Interesses',
        question: 'Que temas você consome por puro prazer?',
        subtext: 'Conteúdo que você lê, assiste ou ouve até nos finais de semana.',
        type: 'multiple',
        maxChoices: 2,
        options: [
          { id: 'produtividade', label: 'Produtividade e foco pessoal', icon: '⏱️' },
          { id: 'negocios', label: 'Empreendedorismo e histórias de negócios', icon: '💼' },
          { id: 'financas', label: 'Finanças pessoais e investimentos', icon: '💰' },
          { id: 'desenvolvimento', label: 'Psicologia e autoconhecimento', icon: '🧠' },
          { id: 'comunicacao', label: 'Marketing, mídias e storytelling', icon: '📢' },
          { id: 'artes', label: 'Artes, criação e design', icon: '🖌️' }
        ]
      },
      {
        id: 'q2_community',
        sectionId: 2,
        sectionName: 'Interesses',
        question: 'Como você prefere atuar no digital?',
        subtext: 'Uma escolha honesta sobre a dinâmica de trabalho que você aguenta.',
        type: 'single',
        options: [
          { id: 'solo', label: 'Bastidores / Criar produtos assíncronos', icon: '👤' },
          { id: 'comunidade', label: 'Direto com pessoas em comunidade ou mentorias', icon: '👥' },
          { id: 'misto', label: 'Um modelo equilibrado com pouco contato 1 a 1', icon: '⚖️' }
        ],
        reflectionPrompt: 'Com suas palavras: o que mais drena ou recarrega sua bateria social no trabalho?',
        reflectionPlaceholder: 'Ex: Ficar o dia todo em chamadas me esgota, prefiro criar no meu ritmo...'
      }
    ]
  },
  {
    id: 3,
    title: 'Disponibilidade e Recursos',
    iconName: 'Clock',
    valueSignal: {
      title: 'Entendendo seu tempo real',
      subtitle: 'Isso muda tudo no roteiro: desenhamos passos que cabem na sua vida real, sem queimar a largada.',
      icon: '⏳'
    },
    questions: [
      {
        id: 'q3_hours',
        sectionId: 3,
        sectionName: 'Disponibilidade',
        question: 'Quantas horas por semana você realmente tem para se dedicar?',
        subtext: 'Seja realista: contar com fins de semana e noites livres.',
        type: 'single',
        options: [
          { id: 'pouco', label: '3 a 5 horas/semana (cerca de 1h por noite)', icon: '🌙' },
          { id: 'medio', label: '6 a 12 horas/semana (noites + sábado)', icon: '⚡' },
          { id: 'muito', label: '15+ horas/semana (meio período ou tempo total)', icon: '🚀' }
        ]
      },
      {
        id: 'q3_investment',
        sectionId: 3,
        sectionName: 'Disponibilidade',
        question: 'Quanto pode investir no primeiro mês?',
        subtext: 'Sem pressão: é totalmente possível começar com R$ 0.',
        type: 'single',
        options: [
          { id: 'zero', label: 'R$ 0 (usar apenas ferramentas gratuitas)', icon: '🆓' },
          { id: 'ate_200', label: 'Até R$ 200 (domínio, ferramentas básicas)', icon: '🌱' },
          { id: 'mais_500', label: 'R$ 500 ou mais (tráfego e plataformas pagas)', icon: '💼' }
        ],
        reflectionPrompt: 'Com suas palavras: quais são os maiores ladrões de tempo da sua semana atual?',
        reflectionPlaceholder: 'Ex: Horas extras no trabalho e cansaço mental após o expediente...'
      }
    ]
  },
  {
    id: 4,
    title: 'Objetivos',
    iconName: 'Target',
    valueSignal: {
      title: 'Definindo sua vitória inicial',
      subtitle: 'Um marco claro e palpável traz alívio e valida seu esforço logo nos primeiros passos.',
      icon: '🎯'
    },
    questions: [
      {
        id: 'q4_goal',
        sectionId: 4,
        sectionName: 'Objetivos',
        question: 'Qual é o seu marco financeiro inicial?',
        subtext: 'A meta que fará você comemorar e validar seu prumo.',
        type: 'single',
        options: [
          { id: 'primeiro_real', label: 'Primeiros R$ 500 a R$ 1.000 / mês', icon: '🎯' },
          { id: 'substituir', label: 'R$ 3.000 a R$ 5.000 / mês (substituição parcial)', icon: '📈' },
          { id: 'escala', label: 'R$ 10.000+ / mês (construir empresa digital)', icon: '🏰' }
        ]
      },
      {
        id: 'q4_timeline',
        sectionId: 4,
        sectionName: 'Objetivos',
        question: 'Em quanto tempo você precisa do primeiro resultado monetário?',
        subtext: 'Isso define a velocidade do seu roteiro.',
        type: 'single',
        options: [
          { id: 'rapido', label: '30 a 45 dias (urgência e foco em serviço/validação rápida)', icon: '⚡' },
          { id: 'medio', label: '60 a 90 dias (ritmo ideal para construir com calma)', icon: '🧭' },
          { id: 'longo', label: '6 a 12 meses (construção estruturada)', icon: '🧱' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Perfil Comportamental',
    iconName: 'Brain',
    valueSignal: {
      title: 'Respeitando sua personalidade',
      subtitle: 'Não existe fórmula única: há modelos altamente lucrativos e respeitados sem aparecer na câmera.',
      icon: '🛡️'
    },
    questions: [
      {
        id: 'q5_exposure',
        sectionId: 5,
        sectionName: 'Perfil',
        question: 'Quão confortável você se sente aparecendo (câmera, voz, stories)?',
        subtext: 'Não existe certo ou errado: há modelos lucrativos sem aparecer.',
        type: 'single',
        options: [
          { id: 'sem_camera', label: 'Zero câmera: prefiro texto, áudio ou bastidores', icon: '🙈' },
          { id: 'moderado', label: 'Apareço se for necessário, mas sem forçar', icon: '🎙️' },
          { id: 'confortavel', label: 'Super tranquilo: gosto de falar em vídeo', icon: '📹' }
        ]
      },
      {
        id: 'q5_rejection',
        sectionId: 5,
        sectionName: 'Perfil',
        question: 'Como você lida com ouvir "não" ou ter poucas visualizações no início?',
        subtext: 'Ajuda a escolher entre abordagens diretas (1 a 1) ou conteúdo orgânico.',
        type: 'single',
        options: [
          { id: 'sensivel', label: 'Fico desanimado com facilidade; preciso de passos guiados', icon: '🛡️' },
          { id: 'resiliente', label: 'Entendo que faz parte do processo de aprendizado', icon: '🌱' }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Experiência Digital',
    iconName: 'Smartphone',
    valueSignal: {
      title: 'Aproveitando o que você já domina',
      subtitle: 'Usamos as ferramentas do seu dia a dia para você não perder tempo com tecnologia complexa.',
      icon: '📱'
    },
    questions: [
      {
        id: 'q6_tools',
        sectionId: 6,
        sectionName: 'Experiência',
        question: 'Quais ferramentas você já usa com alguma facilidade?',
        subtext: 'Marque todas as que você já abriu ou mexeu.',
        type: 'multiple',
        options: [
          { id: 'instagram', label: 'Instagram / Redes Sociais', icon: '📱' },
          { id: 'canva', label: 'Canva (criação de artes)', icon: '🎨' },
          { id: 'notion', label: 'Notion / Docs / Planilhas', icon: '📝' },
          { id: 'whatsapp_biz', label: 'WhatsApp Business', icon: '💬' },
          { id: 'nenhuma', label: 'Ainda não mexo com ferramentas digitais', icon: '🌱' }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Identidade & Eu Futuro',
    iconName: 'Sparkles',
    valueSignal: {
      title: 'Sua âncora pessoal de compromisso',
      subtitle: 'A motivação oscila, mas a identidade permanece. Aqui você define quem você escolhe se tornar.',
      icon: '🌿'
    },
    questions: [
      {
        id: 'q7_pride',
        sectionId: 7,
        sectionName: 'Identidade',
        question: 'O que te daria orgulho de dizer "eu faço isso" daqui a 90 dias?',
        subtext: 'Essa frase será a sua âncora emocional fixa no topo de todo o seu roteiro.',
        type: 'single',
        options: [
          { id: 'autor_metodo', label: 'Criei e validei meu próprio mini-produto digital do zero', icon: '🌱' },
          { id: 'primeira_renda', label: 'Recebi meus primeiros pagamentos com a consciência tranquila', icon: '💎' },
          { id: 'rotina_livre', label: 'Construí uma rotina criativa sem esgotamento nem ansiedade', icon: '🕊️' },
          { id: 'impacto_real', label: 'Gerei um alívio verdadeiro e tangível para 3+ pessoas reais', icon: '🤝' }
        ],
        reflectionPrompt: 'Em suas próprias palavras: o que essa conquista mudaria na sua autoestima e na sua vida?',
        reflectionPlaceholder: 'Ex: Provavelmente eu sentiria que finalmente tomei as rédeas do meu futuro sem depender da sorte...'
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
  product: 'Mini-curso prático + Template Notion',
  productDescription: 'Um material digital gravado em vídeo curto (10-15 min) acompanhado de checklist prático que você cria uma única vez.',
  audience: 'Freelancers e Profissionais CLT em transição',
  audienceDescription: 'Pessoas com rotina corrida que sofrem com dispersão e precisam de um método simples de organização.',
  channel: 'Instagram e WhatsApp Direto',
  channelDescription: 'Conteúdo rápido focado em dores reais e conversas consultivas no 1 a 1 para as primeiras validações.',
  timeline: '60 dias até a 1ª validação',
  personalAnchor: 'Criei e validei meu próprio mini-produto digital do zero, com rotina serena e sem burnout.',
  futureSelfLetter: 'Oi Ana, sou você daqui a 90 dias. Escrevo para te lembrar do dia em que você segurou a tela e assumiu seu prumo. Naquele momento você estava insegura, mas decidiu dar um passo pequeno por vez. Hoje nosso mini-curso está validado, ajudamos 3 pessoas de verdade e aquela sensação de paralisia ficou para trás. Continue firme, seu prumo é real.',
  chapterTitle: 'Capítulo 1: Onde você encontra sua promessa',
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
    chapterTitle: 'Capítulo 1: Onde você encontra sua promessa',
    title: 'Definir sua promessa em 1 frase',
    description: 'Escreva a promessa exata do que o seu produto resolve para o cliente.',
    durationMinutes: 15,
    status: 'completed',
    whatToDo: 'Complete a fórmula: "Eu ajudo [Público] a alcançar [Resultado desejado] mesmo que [Maior objeção/dificuldade]". Evite jargões complexos.',
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
      narrator: 'Helena · Coach Prumo',
      transcript: 'Ana, quando tentamos falar com todo mundo, ninguém ouve. Uma frase simples não é limitar seu talento: é estender a mão para quem está perdido exatamente onde você já esteve. Respire fundo e escreva o óbvio.',
      audioWaveHeights: [25, 45, 60, 80, 50, 70, 95, 60, 40, 55, 75, 40, 30]
    }
  },
  {
    id: 't2',
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Onde você encontra sua promessa',
    title: 'Criar sua versão mínima entregável',
    description: 'O menor entregável possível para testar o interesse de alguém real.',
    durationMinutes: 20,
    status: 'pending',
    whatToDo: 'Pegue o tema que você mais domina e monte o menor formato possível: um checklist em PDF, um documento estruturado no Notion ou um vídeo direto de 10 minutos.',
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
      narrator: 'Helena · Coach Prumo',
      transcript: 'Você não precisa de estúdio, iluminação ou 40 aulas. Uma semente bem plantada gera mais vida do que um palácio imaginário. 20 minutos focados em resolver uma dor real. Você já sabe o que colocar aí.',
      audioWaveHeights: [30, 50, 70, 60, 85, 90, 65, 45, 55, 70, 50, 35, 20]
    }
  },
  {
    id: 't3',
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Onde você encontra sua promessa',
    title: 'Validar com 3 pessoas reais',
    description: 'Converse com 3 pessoas do perfil para receber feedback honesto.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Envie sua versão mínima para 3 pessoas que já expressaram dificuldade no tema. Faça duas perguntas: "O que ficou confuso?" e "Isso te poupou tempo?".',
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
      narrator: 'Helena · Coach Prumo',
      transcript: 'Dar a cara a tapa assusta todo mundo. Mas lembre-se: você não está pedindo aprovação pessoal, está oferecendo um atalho que você construiu com carinho. Três mensagens calmas. O que vier de resposta é ouro.',
      audioWaveHeights: [20, 40, 55, 75, 80, 60, 85, 90, 70, 50, 65, 40, 25]
    }
  },
  {
    id: 't4',
    phaseId: 'fundacao',
    phaseName: 'Fundação',
    chapterId: 1,
    chapterTitle: 'Capítulo 1: Onde você encontra sua promessa',
    title: 'Ajustar o preço e meio de pagamento',
    description: 'Definir o valor de entrada e link de cobrança seguro.',
    durationMinutes: 15,
    status: 'pending',
    whatToDo: 'Defina o preço inicial de validação (ex: R$ 27 a R$ 47). Crie uma conta gratuita em uma plataforma (ex: Kiwify, Hotmart ou Asaas) e gere o link de checkout.',
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
      narrator: 'Helena · Coach Prumo',
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
    chapterTitle: 'Capítulo 2: Onde sua ideia ganha corpo e primeiro contato',
    title: 'Publicar 3 postagens de dor real no Instagram',
    description: 'Conteúdo focado nos erros que as pessoas cometem antes de ter seu produto.',
    durationMinutes: 40,
    status: 'pending',
    whatToDo: 'Crie 3 posts em carrossel ou reels curtos abordando: 1) o erro comum, 2) o mito do nicho, 3) a solução simples.',
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
      narrator: 'Helena · Coach Prumo',
      transcript: 'Você não precisa viralizar com dancinhas. Quando você descreve com precisão a frustração que alguém sente às 23h da noite, essa pessoa sabe que você é o guia certo.',
      audioWaveHeights: [30, 60, 75, 90, 80, 65, 70, 85, 60, 50, 40, 30, 25]
    }
  },
  {
    id: 't6',
    phaseId: 'marketing',
    phaseName: 'Marketing',
    chapterId: 2,
    chapterTitle: 'Capítulo 2: Onde sua ideia ganha corpo e primeiro contato',
    title: 'Convidar 10 pessoas para conhecer o produto',
    description: 'Abordagem consultiva e direta com quem interagiu.',
    durationMinutes: 30,
    status: 'pending',
    whatToDo: 'Puxe conversa com quem curtiu, comentou ou já pediu conselhos, oferecendo a solução com condição especial de validação.',
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
      narrator: 'Helena · Coach Prumo',
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
    chapterTitle: 'Capítulo 3: Onde o valor se torna realidade e primeiro retorno',
    title: 'Fazer o primeiro dia de vendas e coletar depoimentos',
    description: 'Abertura oficial com prazo e coleta dos primeiros resultados.',
    durationMinutes: 45,
    status: 'pending',
    whatToDo: 'Anuncie a abertura com bônus para os 5 primeiros compradores e acompanhe de perto.',
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
      narrator: 'Helena · Coach Prumo',
      transcript: 'A primeira notificação de venda não é sobre o dinheiro em si: é a confirmação de que sua mente é capaz de gerar valor no mundo real. Guarde esse momento.',
      audioWaveHeights: [30, 50, 75, 95, 80, 85, 100, 75, 60, 45, 35, 25, 20]
    }
  }
];
