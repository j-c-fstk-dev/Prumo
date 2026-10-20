import { describe, expect, it } from 'vitest';
import { restartShift, shouldOfferRestart, suggestedWeek } from './pacing';

const base = { daysAway: 0, freshStart: false, nextWeek: 2, currentWeek: 5, journeyComplete: false };

describe('recomeço sem culpa (etapa 52)', () => {
  it('oferece logo na volta, depois de 7 dias ou mais, em qualquer dia da semana', () => {
    expect(shouldOfferRestart({ ...base, daysAway: 7 })).toBe(true);
    expect(shouldOfferRestart({ ...base, daysAway: 3 })).toBe(false);
    expect(shouldOfferRestart({ ...base, daysAway: null, freshStart: false })).toBe(false);
  });

  it('segunda-feira e dia 1 são um empurrão a mais para quem ficou para trás', () => {
    expect(shouldOfferRestart({ ...base, freshStart: true })).toBe(true);
  });

  it('não oferece para quem está em dia, adiantado ou terminou o roteiro', () => {
    expect(shouldOfferRestart({ ...base, daysAway: 10, nextWeek: 5 })).toBe(false);
    expect(shouldOfferRestart({ ...base, daysAway: 10, nextWeek: 6 })).toBe(false);
    expect(shouldOfferRestart({ ...base, daysAway: 10, journeyComplete: true })).toBe(false);
  });

  it('o desconto faz hoje virar o 1º dia da semana do próximo passo', () => {
    const day = 40;
    const shift = restartShift(day, 2);
    expect(day - shift).toBe(8);
    expect(suggestedWeek(day - shift)).toBe(2);
    expect(restartShift(3, 1)).toBe(2);
  });
});
