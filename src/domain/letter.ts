/**
 * Carta ao eu futuro em duas vias (Chishima & Wilson): a pessoa escreve para si daqui a
 * 90 dias e depois responde como esse eu futuro. Escrever só a ida não teve efeito no
 * estudo; o ingrediente ativo é a própria pessoa escrever a resposta (docs/pesquisa/02).
 */

export interface LetterContext {
  name: string;
  product: string;
  anchor: string;
  /** Rótulo da opção de obstáculo marcada na anamnese (ex.: "Querer deixar tudo perfeito antes de mostrar") */
  obstacleLabel?: string;
  planB: string;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Rascunho editável da carta de ida (hoje → daqui a 90 dias). */
export function draftToFuture(c: LetterContext): string {
  return [
    'Oi, eu de daqui a 90 dias.',
    `Hoje eu decidi testar: ${lower(c.product)}.`,
    c.obstacleLabel
      ? `Sei que o que pode me atrapalhar é: ${lower(c.obstacleLabel)}. Combinei comigo que, se isso acontecer, ${c.planB}`
      : `Combinei comigo que, nos dias difíceis, ${c.planB}`,
    `O que eu mais quero é: ${lower(c.anchor)}`,
    'Me conta: valeu a pena?',
  ].join('\n\n');
}

/** Só a primeira linha da resposta: o resto quem escreve é a pessoa. */
export function starterFromFuture(name: string): string {
  return `Oi, ${name || 'você'}. Sou você daqui a 90 dias.\n\n`;
}

/** Mínimo de texto próprio na resposta para liberar o selo (além da frase inicial). */
export const MIN_OWN_CHARS = 30;

export function hasWrittenReply(reply: string, name: string): boolean {
  const own = reply.replace(starterFromFuture(name).trim(), '').trim();
  return own.length >= MIN_OWN_CHARS;
}
