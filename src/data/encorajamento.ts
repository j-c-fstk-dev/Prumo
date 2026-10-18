/**
 * Frases de encorajamento escritas pelo Prumo (não são citações, então não precisam de autor).
 * Seguem o guia de voz (docs/guia-de-voz.md): curtas, de amigo, sem promessa de renda.
 * Teste com usuários (etapa 24): "frases rotativas, precisamos de muito mais frases" e
 * "lembretes sincronizados com o dia e a etapa".
 */

/** Uma por pergunta da anamnese, sorteadas a cada vez que a pessoa responde */
export const ENCORAJAMENTO_ANAMNESE: string[] = [
  'Não tem resposta errada aqui.',
  'Responde o que é verdade hoje, não o que seria bonito.',
  'Pode ir no primeiro impulso. Depois dá pra ajustar.',
  'Ninguém vai ver isso além de você.',
  'Respira. É só uma pergunta.',
  'Você está indo bem.',
  'Quanto mais sincero, melhor o caminho fica.',
  'Tudo bem não ter certeza. Marca o mais perto.',
  'Cada resposta deixa o seu caminho mais com a sua cara.',
  'Sem pressa. O importante é ser você.',
  'Isso aqui é sobre você, não sobre o que os outros esperam.',
  'Pensa no seu dia a dia de verdade.',
  'Seu jeito de ser não é defeito. É ponto de partida.',
  'Uma pergunta de cada vez. Você já está fazendo.',
  'Dúvida faz parte. Escolhe e segue.',
  'O que você já sabe vale mais do que parece.',
  'Começar já é a parte mais difícil. E você começou.',
  'Se quiser, escreve com as suas palavras.',
  'Você não precisa saber tudo pra começar.',
  'Olha só: você já está mais perto do que ontem.',
  'Coisa pequena e real ganha de plano grande no papel.',
  'Vale lembrar de quando alguém te agradeceu por uma ajuda.',
  'A vida que você tem hoje é o ponto de partida certo.',
  'Responder com calma já é um jeito de se cuidar.',
  'Ninguém nasce sabendo. Todo mundo começa do começo.',
  'Sua história conta. Ela entra no seu caminho.',
  'Tá quase. Segue firme.',
  'Escolher já é um passo.',
  'Pode confiar no que você sente.',
  'O seu ritmo é o ritmo certo.',
  'Você está construindo algo seu.',
  'Mais uma e pronto.',
  'Ser honesto com você mesmo é o melhor atalho.',
  'Não precisa ser perfeito. Precisa ser seu.',
  'Bora! Falta pouco pra ver o seu caminho.',
  'Cada clique aqui é você cuidando do seu futuro.',
  'Se travar, escolhe a opção que te dá menos peso.',
  'Ouvir a si mesmo também é trabalho.',
  'Você chegou até aqui. Isso já diz muito.',
  'Dá pra mudar tudo depois. Agora é só começar.',
];

export type ContextoLembrete = {
  date: Date;
  /** Capítulo atual da jornada (1 a 3) */
  chapterId: number;
  /** Dias desde que a pessoa começou a jornada */
  daysSinceStart: number;
  /** Dias desde a última ação; null se nunca agiu */
  daysAway: number | null;
};

/** Lembretes que só aparecem no momento certo; os gerais preenchem o resto */
const LEMBRETES: { quando: (c: ContextoLembrete) => boolean; textos: string[] }[] = [
  {
    quando: (c) => c.daysSinceStart === 0,
    textos: ['Primeiro dia! Hoje basta dar um passo pequeno. O resto vem.', 'Bem-vindo à jornada. Começa leve: 15 minutos já contam.'],
  },
  {
    quando: (c) => c.daysAway !== null && c.daysAway >= 2,
    textos: [
      'Voltar é o que importa. Ninguém caminha sem pausas.',
      'Uns dias longe não apagam nada do que você fez.',
      'Recomeçar faz parte do caminho, não é sinal de falha.',
    ],
  },
  {
    quando: (c) => c.date.getDay() === 1,
    textos: ['Segunda-feira: semana nova, folha em branco. Qual é o passo de hoje?', 'Segunda é um ótimo dia pra recomeçar, se precisar.'],
  },
  {
    quando: (c) => c.date.getDay() === 5,
    textos: ['Sexta-feira! Que tal fechar a semana com um passinho?', 'Sexta: olha pra trás e vê quanta coisa você já fez.'],
  },
  {
    quando: (c) => c.date.getDay() === 0 || c.date.getDay() === 6,
    textos: ['Fim de semana também é pra descansar. Se der, 10 minutinhos já valem.', 'Descansar faz parte. Volta com calma quando der.'],
  },
  {
    quando: (c) => c.date.getDate() === 1,
    textos: ['Primeiro dia do mês: bom momento pra recomeçar ou continuar.'],
  },
  {
    quando: (c) => c.chapterId === 1,
    textos: ['Capítulo 1: deixar a ideia clara. Não precisa estar perfeita, só clara.', 'Nesta fase, simples ganha de completo.'],
  },
  {
    quando: (c) => c.chapterId === 2,
    textos: ['Capítulo 2: testar com pessoas reais. Dá frio na barriga, e tudo bem.', 'Cada conversa ensina algo, até o "não".'],
  },
  {
    quando: (c) => c.chapterId === 3,
    textos: ['Capítulo 3: as primeiras vendas. Você chegou longe.', 'Vender é ajudar alguém a resolver um problema. Simples assim.'],
  },
  {
    quando: (c) => c.chapterId === 4,
    textos: ['Capítulo 4: criar ritmo. Agora é constância, sem pressa.', 'O que você repete toda semana vale mais do que um dia de esforço enorme.'],
  },
];

const GERAIS: string[] = [
  'Não é corrida. Cada passinho conta, mesmo nos dias mais devagar.',
  'Feito é melhor que perfeito.',
  'Um passo pequeno hoje vale mais que um grande amanhã.',
  'Se o dia estiver pesado, faz só 5 minutos.',
  'Você não precisa sentir vontade pra começar. A vontade vem depois.',
  'Comparar seu começo com o meio dos outros não é justo com você.',
  'Errar é informação, não fracasso.',
  'Pergunta ao coach quando travar. É pra isso que ele existe.',
  'Seu ritmo é o seu ritmo.',
  'Lembra da sua âncora: é por ela que você começou.',
  'Descansar também é parte do plano.',
  'Mostrar algo simples ensina mais que guardar algo perfeito.',
];

function dayNumber(date: Date): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60_000) / 86_400_000);
}

/** O lembrete do dia: prioriza o que combina com o momento; muda todo dia, sem sorteio */
export function lembreteDoDia(c: ContextoLembrete): string {
  const especificos = LEMBRETES.filter((l) => l.quando(c)).flatMap((l) => l.textos);
  // Dia sim, dia não, um geral entra na roda para não ficar repetitivo
  const pool = especificos.length && dayNumber(c.date) % 3 !== 2 ? especificos : [...especificos, ...GERAIS];
  return pool[dayNumber(c.date) % pool.length];
}

export { GERAIS as LEMBRETES_GERAIS, LEMBRETES as LEMBRETES_POR_MOMENTO };
