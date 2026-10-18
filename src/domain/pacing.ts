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
