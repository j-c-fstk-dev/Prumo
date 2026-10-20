/**
 * Ritmo pelo calendário (etapa 42): os 90 dias viram 13 semanas e cada passo tem uma semana sugerida.
 * Só sugere: dá para adiantar à vontade (decisão do teste com usuários). Como no Couch to 5K, o ritmo
 * vem da semana, não da pressa.
 */

export const JOURNEY_WEEKS = 13;

/** Semana da jornada (1 no começo), a partir do dia da jornada */
export function suggestedWeek(journeyDay: number | null): number {
  if (!journeyDay || journeyDay < 1) return 1;
  return Math.ceil(journeyDay / 7);
}

export type WeekStatus = 'agora' | 'adiantar' | 'anterior';

/** Onde um passo está em relação à semana sugerida */
export function weekStatus(taskWeek: number, current: number): WeekStatus {
  if (taskWeek === current) return 'agora';
  return taskWeek > current ? 'adiantar' : 'anterior';
}

/** Dias longe a partir dos quais oferecemos recomeçar (etapa 52) */
export const RESTART_AFTER_DAYS = 7;

export interface RestartInput {
  /** Dias desde a última ação (null: nunca fez nada) */
  daysAway: number | null;
  /** Hoje é segunda-feira ou dia 1 */
  freshStart: boolean;
  /** Semana do próximo passo pendente */
  nextWeek: number | undefined;
  /** Semana sugerida hoje */
  currentWeek: number;
  journeyComplete: boolean;
}

/**
 * Recomeço sem culpa (Dai, Milkman e Riis: o efeito do "novo começo"). Oferece assim que a pessoa
 * volta depois de 7 dias ou mais, em qualquer dia; segunda-feira e dia 1 são um empurrão a mais
 * para quem ficou para trás. Só faz sentido se o próximo passo é de uma semana que já passou.
 */
export function shouldOfferRestart(i: RestartInput): boolean {
  if (i.journeyComplete || !i.nextWeek || i.nextWeek >= i.currentWeek) return false;
  return (i.daysAway !== null && i.daysAway >= RESTART_AFTER_DAYS) || i.freshStart;
}

/** Quantos dias "descontar" da jornada para que hoje seja o 1º dia da semana do próximo passo */
export function restartShift(journeyDay: number, nextWeek: number): number {
  return Math.max(0, journeyDay - ((nextWeek - 1) * 7 + 1));
}
