/**
 * Motor de diagnóstico do Prumo: regras transparentes e determinísticas (funciona offline
 * e é testável). Base: docs/pesquisa/01-metodo-de-decisao.md
 *
 *  - Nicho = habilidade × interesse (o encaixe prediz persistência melhor que a habilidade sozinha)
 *  - Produto = escada de menor atrito até o 1º real, filtrada por tempo, prazo e exposição
 *  - Canal = começar por quem você já conhece (effectuation: "pássaro na mão")
 *  - Resultado = hipótese a testar, não veredito; 1 recomendação + 2 alternativas
 */

import { ANAMNESE_SECTIONS, DEFAULT_DIAGNOSIS, DiagnosisProfile } from '../data/prumoData';

export type Answers = Record<string, string[]>;

export interface DiagnosisOption {
  nicheId: string;
  productId: ProductId;
  niche: string;
  product: string;
}

export interface Diagnosis extends DiagnosisProfile {
  nicheId: string;
  productId: ProductId;
  /** A dor do público, em palavras simples (usada no kit de execução) */
  pain: string;
  hypothesis: string;
  test: string;
  successSignal: string;
  /** Etapas mostradas na tela de cálculo, citando as respostas reais (pesquisa 04) */
  calcSteps: string[];
  warnings: string[];
  /** Obstáculo previsto e o plano B "se… então…" (WOOP, pesquisa 02) */
  obstacle: string;
  planB: string;
  alternatives: DiagnosisOption[];
}

interface Niche {
  id: string;
  label: string;
  topic: string;
  description: string;
  audience: string;
  audienceDescription: string;
  pain: string;
  skills: string[];
  themes: string[];
  roles: string[];
}

const NICHES: Niche[] = [
  {
    id: 'organizacao',
    label: 'Organização e rotina para quem trabalha por conta própria',
    topic: 'organização da rotina',
    description: 'Ajudar autônomos e freelancers a organizar tempo, tarefas e entregas sem esgotamento.',
    audience: 'Autônomos e freelancers sobrecarregados',
    audienceDescription: 'Pessoas com muitas frentes ao mesmo tempo que perdem prazos e se sentem sempre atrasadas.',
    pain: 'a sensação de estar sempre atrasado',
    skills: ['planilhas'],
    themes: ['produtividade'],
    roles: ['organizar'],
  },
  {
    id: 'financas',
    label: 'Finanças pessoais descomplicadas para iniciantes',
    topic: 'organização financeira',
    description: 'Ajudar quem nunca controlou o próprio dinheiro a sair do vermelho com um método simples.',
    audience: 'Adultos que querem controlar o dinheiro pela primeira vez',
    audienceDescription: 'Gente que chega ao fim do mês sem saber para onde foi o salário.',
    pain: 'não saber para onde vai o dinheiro',
    skills: ['planilhas'],
    themes: ['financas'],
    roles: ['organizar', 'ensinar'],
  },
  {
    id: 'carreira',
    label: 'Transição de carreira e primeiros passos profissionais',
    topic: 'transição de carreira',
    description: 'Ajudar quem quer mudar de área a se posicionar, montar currículo e conseguir as primeiras conversas.',
    audience: 'Profissionais em transição de carreira',
    audienceDescription: 'Pessoas que querem mudar de área, mas não sabem por onde começar nem como se apresentar.',
    pain: 'não saber como se apresentar numa área nova',
    skills: ['conselhos'],
    themes: ['desenvolvimento', 'negocios'],
    roles: ['ensinar', 'conectar'],
  },
  {
    id: 'design',
    label: 'Identidade visual simples para pequenos negócios',
    topic: 'identidade visual',
    description: 'Ajudar pequenos negócios a ter uma imagem bonita e coerente sem gastar com agência.',
    audience: 'Pequenos negócios e empreendedores locais',
    audienceDescription: 'Lojas, prestadores de serviço e autônomos com artes improvisadas e sem padrão visual.',
    pain: 'parecer amador nas redes sociais',
    skills: ['design'],
    themes: ['artes', 'comunicacao'],
    roles: ['criar'],
  },
  {
    id: 'escrita',
    label: 'Textos que vendem para autônomos e pequenos negócios',
    topic: 'textos para redes e vendas',
    description: 'Ajudar quem vende algo a escrever legendas, bios e mensagens que geram conversas.',
    audience: 'Autônomos que vendem pelas redes sociais',
    audienceDescription: 'Pessoas que têm um bom serviço, mas travam na hora de escrever sobre ele.',
    pain: 'travar na hora de escrever sobre o próprio trabalho',
    skills: ['textos'],
    themes: ['comunicacao', 'negocios'],
    roles: ['criar'],
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia sem medo para adultos e pequenos negócios',
    topic: 'tecnologia no dia a dia',
    description: 'Ajudar quem tem dificuldade com celular e computador a usar ferramentas digitais com confiança.',
    audience: 'Adultos e pequenos negócios com pouca intimidade com tecnologia',
    audienceDescription: 'Pessoas que dependem dos outros para resolver problemas no celular, no computador ou em apps.',
    pain: 'depender dos outros para resolver problemas digitais',
    skills: ['tecnologia'],
    themes: ['produtividade', 'negocios'],
    roles: ['ensinar', 'organizar'],
  },
  {
    id: 'vendas',
    label: 'Vendas pelo WhatsApp para pequenos empreendedores',
    topic: 'vendas pelo WhatsApp',
    description: 'Ajudar quem vende produtos ou serviços a conversar com clientes e fechar mais vendas.',
    audience: 'Pequenos empreendedores que vendem pelo WhatsApp',
    audienceDescription: 'Pessoas que recebem mensagens de interessados, mas não conseguem transformar em venda.',
    pain: 'conversas que não viram venda',
    skills: ['vendas'],
    themes: ['negocios', 'comunicacao'],
    roles: ['conectar'],
  },
  {
    id: 'saude',
    label: 'Hábitos saudáveis possíveis para rotinas corridas',
    topic: 'hábitos saudáveis',
    description: 'Ajudar quem não tem tempo a encaixar movimento e alimentação melhor na rotina real.',
    audience: 'Adultos com rotina corrida que querem se cuidar',
    audienceDescription: 'Pessoas que começam e param várias vezes porque os planos não cabem na vida real.',
    pain: 'começar e desistir de se cuidar várias vezes',
    skills: ['saude'],
    themes: ['desenvolvimento', 'produtividade'],
    roles: ['ensinar'],
  },
];

export type ProductId = 'servico' | 'sessao' | 'guia' | 'minicurso';

interface ProductFormat {
  id: ProductId;
  name: (topic: string) => string;
  description: string;
  test: string;
}

const PRODUCTS: Record<ProductId, ProductFormat> = {
  servico: {
    id: 'servico',
    name: (topic) => `Serviço feito por você: ${topic}`,
    description: 'Você resolve o problema para a pessoa. É o caminho mais curto até o primeiro pagamento e ensina o que o público realmente precisa.',
    test: 'Ofereça o serviço com preço de teste para 5 pessoas da sua rede de contatos.',
  },
  sessao: {
    id: 'sessao',
    name: (topic) => `Sessão individual de 1 hora: ${topic}`,
    description: 'Uma conversa guiada (chamada ou áudio) com um plano no final. Exige pouco preparo e valida rápido.',
    test: 'Ofereça 5 sessões com preço de teste para pessoas que já te pediram ajuda.',
  },
  guia: {
    id: 'guia',
    name: (topic) => `Guia prático + modelo pronto: ${topic}`,
    description: 'Um material curto (PDF, planilha ou Notion) que você cria uma vez e vende várias. Não exige aparecer em vídeo.',
    test: 'Mostre o esboço de 1 página para 5 pessoas do público e abra uma pré-venda.',
  },
  minicurso: {
    id: 'minicurso',
    name: (topic) => `Mini-curso em vídeo (até 5 aulas curtas): ${topic}`,
    description: 'Aulas curtas gravadas, com um material de apoio. Funciona bem para quem gosta de explicar e de aparecer.',
    test: 'Grave 1 aula de amostra, mostre para 5 pessoas do público e abra uma pré-venda.',
  },
};

const has = (answers: Answers, q: string, ...ids: string[]) => ids.some((id) => answers[q]?.includes(id));
const one = (answers: Answers, q: string) => answers[q]?.[0];

function optionLabel(q: string, id: string | undefined): string {
  if (!id) return '';
  for (const section of ANAMNESE_SECTIONS) {
    const question = section.questions.find((x) => x.id === q);
    const opt = question?.options.find((o) => o.id === id);
    if (opt) return opt.label;
  }
  return id;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function scoreNiche(n: Niche, a: Answers): number {
  const skill = n.skills.filter((s) => has(a, 'q1_help', s)).length * 3;
  const interest = n.themes.filter((t) => has(a, 'q2_themes', t)).length * 2;
  const role = n.roles.includes(one(a, 'q1_preference') ?? '') ? 1 : 0;
  return skill + interest + role;
}

const PLAN_B: Record<string, { obstacle: string; planB: string }> = {
  tempo: {
    obstacle: 'faltar tempo ou energia',
    planB: 'faço só 5 minutos da tarefa do dia. Pouco feito vale mais que nada.',
  },
  medo: {
    obstacle: 'bater o medo de julgamento',
    planB: 'mando a mensagem para 1 pessoa de confiança primeiro, e não para todo mundo.',
  },
  perfeccionismo: {
    obstacle: 'eu quiser deixar tudo perfeito',
    planB: 'mostro a versão de hoje mesmo assim. Feito e testado ensina mais que perfeito e guardado.',
  },
  dispersao: {
    obstacle: 'surgir uma ideia nova e brilhante',
    planB: 'anoto a ideia numa lista para depois e volto para a tarefa atual.',
  },
};

export function scoreProduct(p: ProductId, a: Answers): number {
  const fast = one(a, 'q4_timeline') === 'rapido';
  const slow = one(a, 'q4_timeline') === 'longo' || one(a, 'q4_timeline') === 'medio';
  const lowTime = one(a, 'q3_hours') === 'pouco';
  const noCamera = one(a, 'q5_exposure') === 'sem_camera';
  const onCamera = one(a, 'q5_exposure') === 'confortavel';
  const solo = one(a, 'q2_community') === 'solo';
  const people = one(a, 'q2_community') === 'comunidade';
  const role = one(a, 'q1_preference');
  const teaches = role === 'ensinar' || has(a, 'q1_help', 'ensinar');
  const firstMoney = one(a, 'q4_goal') === 'primeiro_real';
  // Perda aceitável (Sarasvathy): sem dinheiro a perder, evitamos o formato que pede equipamento
  const noMoney = one(a, 'q3_investment') === 'zero';

  switch (p) {
    case 'servico':
      return (fast ? 2 : 0) + (firstMoney ? 1 : 0) + (role === 'criar' || role === 'organizar' ? 1 : 0) + (solo ? -1 : 1);
    case 'sessao':
      return (fast ? 2 : 0) + (role === 'conectar' || role === 'ensinar' ? 2 : 0) + (people ? 1 : 0) + (noCamera ? -1 : 0) + (solo ? -1 : 0);
    case 'guia':
      return (solo ? 2 : 0) + (noCamera ? 2 : 0) + (role === 'criar' || role === 'organizar' ? 1 : 0) + (lowTime ? 1 : 0) + (slow ? 1 : 0) + (has(a, 'q6_tools', 'notion', 'canva') ? 1 : 0);
    case 'minicurso':
      return (teaches ? 2 : 0) + (onCamera ? 2 : one(a, 'q5_exposure') === 'moderado' ? 1 : -2) + (lowTime ? -1 : 1) + (slow ? 1 : 0) + (fast ? -1 : 0) + (noMoney ? -1 : 0);
  }
}

function channelFor(a: Answers): { channel: string; channelDescription: string } {
  const noCamera = one(a, 'q5_exposure') === 'sem_camera';
  const usesInstagram = has(a, 'q6_tools', 'instagram');
  const second = !noCamera && usesInstagram ? 'Instagram' : 'grupos e comunidades online do seu tema';
  return {
    channel: `Sua rede de contatos (WhatsApp) + ${second}`,
    channelDescription:
      'Comece por quem já te conhece: é o jeito mais fácil de ter as primeiras conversas e vendas de teste. ' +
      (second === 'Instagram'
        ? 'Depois, use o Instagram para mostrar bastidores e atrair desconhecidos.'
        : 'Depois, entre em grupos onde essas pessoas já tiram dúvidas, sem precisar aparecer em vídeo.') +
      (has(a, 'q3_investment', 'mais_500') ? ' Anúncios pagos só depois que o teste der certo.' : ''),
  };
}

function timelineFor(a: Answers): string {
  switch (one(a, 'q4_timeline')) {
    case 'rapido':
      return '30 a 45 dias até a 1ª venda de teste';
    case 'longo':
      return '3 a 6 meses, construindo com calma';
    default:
      return '60 a 90 dias até a 1ª venda de teste';
  }
}

function isComplete(a: Answers): boolean {
  return ['q1_help', 'q1_preference', 'q2_themes', 'q3_hours', 'q4_timeline', 'q5_exposure'].every((q) => a[q]?.length);
}

const MAX_QUOTE = 140;
function quote(text: string | undefined): string {
  const t = (text ?? '').trim().replace(/\s+/g, ' ');
  if (!t) return '';
  return t.length > MAX_QUOTE ? `${t.slice(0, MAX_QUOTE - 1).trimEnd()}…` : t;
}

/**
 * @param a respostas (já somadas às opções que a pessoa confirmou a partir do texto livre)
 * @param reflections textos livres, usados só para personalizar a redação, nunca para pontuar
 */
export function calculateDiagnosis(a: Answers, personalAnchor: string, reflections: Record<string, string> = {}): Diagnosis {
  const rankedNiches = NICHES.map((n, i) => ({ n, score: scoreNiche(n, a), i }))
    .sort((x, y) => y.score - x.score || x.i - y.i);
  const rankedProducts = (Object.keys(PRODUCTS) as ProductId[])
    .map((p, i) => ({ p, score: scoreProduct(p, a), i }))
    .sort((x, y) => y.score - x.score || x.i - y.i);

  const niche = rankedNiches[0].n;
  const product = PRODUCTS[rankedProducts[0].p];
  const { channel, channelDescription } = channelFor(a);

  const skills = (a.q1_help ?? []).map((id) => lower(optionLabel('q1_help', id)));
  const themes = (a.q2_themes ?? []).map((id) => lower(optionLabel('q2_themes', id)));
  const hours = lower(optionLabel('q3_hours', one(a, 'q3_hours')));
  const exposure = lower(optionLabel('q5_exposure', one(a, 'q5_exposure')));

  const warnings: string[] = [];
  if (one(a, 'q3_hours') === 'pouco' && one(a, 'q4_timeline') === 'rapido') {
    warnings.push('Prazo curto pra quem tem 3 a 5 horas por semana. Dica: comece com algo bem pequeno e foque em vender pra testar.');
  }
  if (one(a, 'q4_goal') === 'escala') {
    warnings.push('R$ 10 mil por mês é meta de longo prazo. Esta jornada mira o primeiro degrau: provar que alguém paga pela sua ideia.');
  }
  if (rankedNiches[0].score === 0) {
    warnings.push('Suas respostas não apontaram um tema claro. Este caminho é só um ponto de partida: troque por uma alternativa se não fizer sentido.');
  }

  const justification =
    `Você contou que as pessoas te pedem ajuda com ${skills.join(', ') || 'várias coisas'}` +
    (themes.length ? ` e que gosta de ${themes.join(' e ')}` : '') +
    `. Juntar o que você já faz bem com o que você curte ajuda a continuar quando ficar difícil. ` +
    `Com ${hours ? `${hours} por semana` : 'o tempo que você tem'} e ${exposure ? `o seu jeito ("${exposure}")` : 'o seu jeito de aparecer'}, ` +
    `o começo mais leve é: ${lower(product.name(niche.topic))}. ` +
    (quote(reflections.q1_help) ? `Nas suas palavras, você gosta de ajudar com: "${quote(reflections.q1_help)}". ` : '') +
    `Mas é uma aposta: o teste do Capítulo 2 vai mostrar se é por aqui ou se vale ajustar.`;

  const plan = PLAN_B[one(a, 'q5_obstacle') ?? ''] ?? PLAN_B.tempo;

  // 3 caminhos de verdade diferentes: cada alternativa é outro tema (teste com usuários, etapa 23)
  const alternatives: DiagnosisOption[] = [
    { n: rankedNiches[1].n, p: PRODUCTS[rankedProducts[0].p] },
    { n: rankedNiches[2].n, p: PRODUCTS[rankedProducts[1].p] },
  ].map(({ n, p }) => ({ nicheId: n.id, productId: p.id, niche: n.label, product: p.name(n.topic) }));

  const radar = (v: number) => Math.max(20, Math.min(100, v));

  return {
    ...DEFAULT_DIAGNOSIS,
    nicheId: niche.id,
    productId: product.id,
    niche: niche.label,
    nicheDescription: niche.description,
    product: product.name(niche.topic),
    productDescription: product.description,
    audience: niche.audience,
    audienceDescription: niche.audienceDescription,
    channel,
    channelDescription,
    timeline: timelineFor(a),
    justification,
    personalAnchor,
    pain: niche.pain,
    hypothesis: `${niche.audience} pagam por "${lower(product.name(niche.topic))}" pra resolver ${niche.pain}.`,
    test: product.test,
    successSignal: '2 compromissos em até 5 apresentações, sendo pelo menos 1 em dinheiro (pagamento ou sinal).',
    calcSteps: [
      skills.length ? `Cruzando sua facilidade com ${skills[0]}` : 'Olhando o que você faz bem',
      hours ? `Considerando seu tempo real: ${hours}` : 'Olhando o tempo que você tem',
      `Procurando o caminho mais leve: ${lower(niche.topic)}`,
      'Montando sua jornada em 4 capítulos',
    ],
    warnings,
    obstacle: plan.obstacle,
    planB: plan.planB,
    alternatives,
    radarScores: {
      skills: radar(40 + rankedNiches[0].score * 10),
      interest: radar(40 + niche.themes.filter((t) => has(a, 'q2_themes', t)).length * 25),
      availability: radar({ pouco: 40, medio: 70, muito: 90 }[one(a, 'q3_hours') ?? ''] ?? 50),
      goals: radar(one(a, 'q4_goal') === 'primeiro_real' ? 85 : 65),
      behavior: radar(one(a, 'q5_rejection') === 'resiliente' ? 80 : 55),
      tech: radar(40 + (a.q6_tools ?? []).filter((t) => t !== 'nenhuma').length * 15),
    },
  };
}

/** Recalcula trocando nicho e/ou produto por uma alternativa (o "pivô"). */
export function applyAlternative(base: Diagnosis, alt: DiagnosisOption, a: Answers): Diagnosis {
  const niche = NICHES.find((n) => n.id === alt.nicheId) ?? NICHES[0];
  const product = PRODUCTS[alt.productId];
  // O caminho criado pela pessoa não vira alternativa (ela pode recriar quando quiser)
  const others: DiagnosisOption[] = [
    ...(base.nicheId === CUSTOM_NICHE_ID ? [] : [{ nicheId: base.nicheId, productId: base.productId, niche: base.niche, product: base.product }]),
    ...base.alternatives.filter((x) => !(x.nicheId === alt.nicheId && x.productId === alt.productId)),
  ].slice(0, 2);
  return {
    ...base,
    nicheId: niche.id,
    productId: product.id,
    niche: niche.label,
    nicheDescription: niche.description,
    product: product.name(niche.topic),
    productDescription: product.description,
    audience: niche.audience,
    audienceDescription: niche.audienceDescription,
    pain: niche.pain,
    hypothesis: `${niche.audience} pagam por "${lower(product.name(niche.topic))}" pra resolver ${niche.pain}.`,
    test: product.test,
    justification:
      'Você escolheu este caminho entre os que combinam com as suas respostas. ' +
      'O teste do Capítulo 2 vai mostrar se é por aqui ou se vale ajustar.',
    warnings: [],
    alternatives: others,
    ...channelFor(a),
  };
}

export const CUSTOM_NICHE_ID = 'custom';

export interface CustomPathInput {
  /** O que a pessoa vai oferecer (ex.: "aulas de violão para iniciantes") */
  offer: string;
  /** Pra quem */
  audience: string;
  /** Que problema resolve, nas palavras dela */
  pain: string;
  productId: ProductId;
}

export const CUSTOM_LIMITS = { offer: 80, audience: 80, pain: 120 } as const;

const tidy = (t: string, max: number) => t.trim().replace(/\s+/g, ' ').replace(/[.!]+$/, '').slice(0, max);

export function isCustomPathReady(input: CustomPathInput): boolean {
  return tidy(input.offer, 80).length >= 3 && tidy(input.audience, 80).length >= 3 && tidy(input.pain, 120).length >= 3;
}

/**
 * "Quero criar o meu": a pessoa desenha o próprio caminho e a jornada se adapta a ele.
 * Mantém o que vem das respostas (canal, prazo, "se travar, eu…") e troca o resto.
 */
export function buildCustomDiagnosis(base: Diagnosis, input: CustomPathInput, a: Answers): Diagnosis {
  const offer = tidy(input.offer, CUSTOM_LIMITS.offer);
  const audience = tidy(input.audience, CUSTOM_LIMITS.audience);
  const pain = lower(tidy(input.pain, CUSTOM_LIMITS.pain));
  const product = PRODUCTS[input.productId];
  const suggestions: DiagnosisOption[] =
    base.nicheId === CUSTOM_NICHE_ID
      ? base.alternatives
      : [{ nicheId: base.nicheId, productId: base.productId, niche: base.niche, product: base.product }, ...base.alternatives];
  return {
    ...base,
    nicheId: CUSTOM_NICHE_ID,
    productId: product.id,
    niche: offer.charAt(0).toUpperCase() + offer.slice(1),
    nicheDescription: `Ajudar ${lower(audience)} a resolver ${pain}.`,
    product: product.name(lower(offer)),
    productDescription: product.description,
    audience: audience.charAt(0).toUpperCase() + audience.slice(1),
    audienceDescription: `As pessoas que você mesmo escolheu ajudar.`,
    pain,
    hypothesis: `${audience.charAt(0).toUpperCase() + audience.slice(1)} pagam por "${lower(product.name(lower(offer)))}" pra resolver ${pain}.`,
    test: product.test,
    justification:
      'Esse caminho foi você que desenhou. O Prumo montou a jornada em cima dele, mantendo o que veio das suas respostas ' +
      '(onde achar as pessoas, prazo e o que fazer se travar). O teste do Capítulo 2 vai mostrar se é por aqui.',
    warnings: [],
    alternatives: suggestions.slice(0, 3),
    ...channelFor(a),
  };
}

export { isComplete as isAnamneseComplete };
