/**
 * Entende o texto livre da anamnese sem IA: procura palavras-chave no próprio aparelho e
 * sugere opções existentes. A sugestão só conta no diagnóstico depois que a pessoa
 * confirma (decisão registrada em docs/etapas/07-campos-abertos.md).
 */

/** Palavras-chave por opção. Radicais sem acento: "planilh" casa "planilha" e "planilhas". */
const KEYWORDS: Record<string, Record<string, string[]>> = {
  q1_help: {
    conselhos: ['conselh', 'carreira', 'curriculo', 'entrevista', 'emprego', 'vaga', 'desabaf', 'relacionament', 'decis', 'orient'],
    design: ['design', 'arte', 'logo', 'marca', 'visual', 'canva', 'foto', 'cores', 'decora', 'identidade'],
    planilhas: ['planilh', 'excel', 'organiz', 'orcament', 'financ', 'dinheiro', 'contas', 'gasto', 'divida', 'rotina', 'agenda'],
    textos: ['texto', 'escrev', 'escrita', 'redac', 'revis', 'legenda', 'post', 'carta', 'traduc', 'portugues'],
    ensinar: ['ensin', 'explic', 'aula', 'estud', 'prova', 'professor', 'reforco', 'tutor', 'treinament'],
    vendas: ['vend', 'negoci', 'cliente', 'whatsapp', 'loja', 'atendiment', 'comerci'],
    tecnologia: ['computador', 'celular', 'tecnolog', 'internet', 'aplicativo', 'app', 'site', 'programa', 'instal', 'formatar', 'wifi', 'impressora'],
    saude: ['treino', 'academia', 'aliment', 'dieta', 'saude', 'exercic', 'corrida', 'emagrec', 'receita', 'sono', 'yoga'],
  },
  q2_themes: {
    produtividade: ['produtiv', 'foco', 'rotina', 'habito', 'organiz', 'tempo', 'agenda'],
    negocios: ['negocio', 'empreend', 'startup', 'empresa', 'marketing digital', 'vendas'],
    financas: ['financ', 'investi', 'dinheiro', 'bolsa', 'economi', 'cripto', 'renda'],
    desenvolvimento: ['psicolog', 'autoconhec', 'terapia', 'espiritual', 'meditac', 'filosof', 'maternidade', 'paternidade', 'relacionament'],
    comunicacao: ['marketing', 'midia', 'rede social', 'storytelling', 'podcast', 'youtube', 'comunicac', 'jornal'],
    artes: ['arte', 'design', 'musica', 'desenho', 'pintura', 'fotograf', 'cinema', 'artesanat', 'moda', 'croche', 'costura'],
  },
  q1_preference: {
    criar: ['criar', 'crio', 'criand', 'criac', 'invent', 'desenh', 'montar', 'apresenta', 'bonit', 'arte', 'escrev', 'produz', 'ideia', 'do zero'],
    ensinar: ['ensin', 'explic', 'aula', 'ajud', 'orient', 'mentor', 'treina', 'aprend'],
    organizar: ['organiz', 'planilh', 'process', 'rotina', 'arrum', 'planej', 'list', 'agenda', 'estrutur'],
    conectar: ['convers', 'vend', 'negoci', 'pessoas', 'apresentar gente', 'network', 'conect', 'indic', 'convenc'],
  },
  q2_community: {
    solo: ['sozinh', 'quiet', 'bastidor', 'sem falar', 'meu tempo', 'introvert', 'concentr', 'silencio'],
    comunidade: ['convers', 'pessoas', 'grupo', 'comunidade', 'turma', 'conversar', 'extrovert', 'atender'],
    misto: ['equilibr', 'meio termo', 'um pouco', 'depende', 'mas preciso', 'as vezes'],
  },
  q5_exposure: {
    sem_camera: ['trav', 'vergonha', 'timid', 'nao gosto', 'odeio', 'nunca', 'medo', 'escondid', 'bastidor'],
    moderado: ['audio', 'voz', 'as vezes', 'se precisar', 'depende', 'pouco', 'mais ou menos'],
    confortavel: ['adoro', 'gosto de gravar', 'tranquil', 'de boa', 'facil', 'live', 'video', 'stories'],
  },
  q5_rejection: {
    sensivel: ['desanim', 'chate', 'trist', 'desist', 'magoa', 'abal', 'sofr', 'paraliz', 'travo'],
    resiliente: ['tento de novo', 'normal', 'aprend', 'faz parte', 'insist', 'sigo', 'continuo', 'supero'],
  },
  q5_obstacle: {
    tempo: ['tempo', 'cansa', 'trabalho', 'filho', 'rotina', 'corrid', 'exaust', 'sono'],
    medo: ['medo', 'vergonha', 'julg', 'critica', 'oferec', 'inseg', 'ansied'],
    perfeccionismo: ['perfei', 'perfeccion', 'detalh', 'pronto', 'nunca esta bom', 'revis'],
    dispersao: ['distra', 'ideia', 'disper', 'foco', 'termin', 'comeco e', 'paro no meio', 'procrastin'],
  },
  q6_tools: {
    instagram: ['instagram', 'insta', 'tiktok', 'facebook', 'rede social', 'redes sociais', 'youtube', 'stories', 'reels'],
    canva: ['canva', 'capcut', 'photoshop', 'figma', 'edicao', 'editar video', 'editar foto'],
    notion: ['notion', 'docs', 'planilh', 'excel', 'sheets', 'word', 'trello', 'agenda', 'drive'],
    whatsapp_biz: ['whatsapp', 'zap', 'telegram'],
  },
};

/** Minúsculas, sem acentos e sem pontuação, para comparar com segurança. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Quais perguntas aceitam sugestão a partir do texto livre. */
export function supportsTextMatch(questionId: string): boolean {
  return questionId in KEYWORDS;
}

/**
 * Opções sugeridas para o texto, da mais para a menos provável.
 * Ignora as que a pessoa já marcou ou já recusou.
 */
export function suggestOptions(questionId: string, text: string, exclude: string[] = []): string[] {
  const dict = KEYWORDS[questionId];
  if (!dict) return [];
  const norm = ` ${normalize(text)}`;
  if (norm.trim().length < 3) return [];
  return Object.entries(dict)
    .map(([optionId, words]) => ({
      optionId,
      hits: words.filter((w) => norm.includes(` ${w}`)).length,
    }))
    .filter((x) => x.hits > 0 && !exclude.includes(x.optionId))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 2)
    .map((x) => x.optionId);
}
