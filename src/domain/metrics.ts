/**
 * Métricas do roteiro (etapa 53), da "Revisão do Roteiro de 90 dias": o Prumo funciona se as pessoas
 * chegam a uma decisão honesta, com ou sem venda. Os eventos vão para o Umami sem nenhum dado da
 * pessoa nem dos contatos: só números (dia da jornada, contagens) e ids de passo.
 */

import type { Funnel } from './people';

export type Milestone = 'primeira_conversa' | 'primeira_venda';

/** Marcos que acabaram de acontecer: cada um é registrado uma vez só */
export function newMilestones(f: Pick<Funnel, 'talked' | 'clients'>, seen: Partial<Record<Milestone, number>> | undefined): Milestone[] {
  const out: Milestone[] = [];
  if (f.talked > 0 && !seen?.primeira_conversa) out.push('primeira_conversa');
  if (f.clients > 0 && !seen?.primeira_venda) out.push('primeira_venda');
  return out;
}

/** Depois de quantos dias parada a volta vira métrica */
export const PAUSE_DAYS = 7;

export type TimeAnswer = 'menos' | 'igual' | 'mais';

export const TIME_ANSWERS: { id: TimeAnswer; label: string }[] = [
  { id: 'menos', label: 'Menos' },
  { id: 'igual', label: 'Mais ou menos isso' },
  { id: 'mais', label: 'Mais' },
];

export const SKIP_REASONS = ['Não faz sentido pra mim', 'Já fiz antes', 'Agora não dá', 'Outro motivo'] as const;
