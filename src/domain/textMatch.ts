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
