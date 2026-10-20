/**
 * Carta ao eu futuro em duas vias (Chishima & Wilson): a pessoa escreve para si no futuro e
 * depois responde como esse eu futuro. Escrever só a ida não teve efeito no estudo; o
 * ingrediente ativo é a própria pessoa escrever a resposta (docs/pesquisa/02).
 * Horizonte (etapa 52): um eu concreto e distante funciona melhor que o de 3 meses (Rutchick
 * et al., 2018, usaram 20 anos). Sugerimos 10 anos, longe o bastante para dar perspectiva e perto
 * o bastante para se imaginar; a pessoa pode trocar.
 */

export const LETTER_YEARS = 10;
export const LETTER_YEAR_OPTIONS = [3, 5, 10, 15, 20] as const;

/** "daqui a 10 anos"; cartas antigas, sem anos, eram para daqui a 90 dias */
export function horizonLabel(years: number | undefined): string {
  return years ? `daqui a ${years} ${years === 1 ? 'ano' : 'anos'}` : 'daqui a 90 dias';
}

export interface LetterContext {
  name: string;
  product: string;
  anchor: string;
  /** Rótulo da opção de obstáculo marcada na anamnese (ex.: "Querer deixar tudo perfeito antes de mostrar") */
  obstacleLabel?: string;
  planB: string;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Rascunho editável da carta de ida (hoje → daqui a alguns anos). */
export function draftToFuture(c: LetterContext, years: number = LETTER_YEARS): string {
  return [
    `Oi, eu de ${horizonLabel(years)}.`,
    `Hoje eu decidi dar um primeiro passo: testar ${lower(c.product)}.`,
    c.obstacleLabel
      ? `Sei que o que pode me atrapalhar é: ${lower(c.obstacleLabel)}. Combinei comigo que, se isso acontecer, ${c.planB}`
      : `Combinei comigo que, nos dias difíceis, ${c.planB}`,
    `O que eu mais quero é: ${lower(c.anchor)}`,
    'Me conta: como está a sua vida? Valeu a pena ter começado?',
  ].join('\n\n');
}

/** Só a primeira linha da resposta: o resto quem escreve é a pessoa. */
export function starterFromFuture(name: string, years?: number): string {
  return `Oi, ${name || 'você'}. Sou você ${horizonLabel(years)}.\n\n`;
}

/**
 * Trocar o número de anos atualiza a primeira linha das duas cartas, se ela ainda é a do rascunho.
 * O resto é da pessoa e não muda.
 */
export function retitle(text: string, from: number | undefined, to: number): string {
  const a = horizonLabel(from);
  const b = horizonLabel(to);
  const [first, ...rest] = text.split('\n');
  return first.includes(a) ? [first.replace(a, b), ...rest].join('\n') : text;
}

/** Mínimo de texto próprio na resposta para liberar o selo (além da frase inicial). */
export const MIN_OWN_CHARS = 30;

export function hasWrittenReply(reply: string, name: string, years?: number): boolean {
  const own = reply.replace(starterFromFuture(name, years).trim(), '').trim();
  return own.length >= MIN_OWN_CHARS;
}
