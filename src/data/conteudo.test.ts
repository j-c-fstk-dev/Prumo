import { describe, expect, it } from 'vitest';
import { CITACOES, citacoesPublicaveis } from './citacoes';
import { CARTOES_CIENCIA } from './ciencia';
import { itemOfTheDay } from '../app/components/QuoteCard';

describe('citações e cartões de ciência', () => {
  it('só citações verificadas são publicáveis', () => {
    expect(citacoesPublicaveis().every((c) => c.status === 'verificada')).toBe(true);
    expect(citacoesPublicaveis().length).toBeLessThan(CITACOES.length);
  });

  it('toda citação publicável e todo cartão têm fonte https', () => {
    for (const c of citacoesPublicaveis()) expect(c.verificacao).toMatch(/^https:\/\//);
    for (const c of CARTOES_CIENCIA) expect(c.fonte).toMatch(/^https:\/\//);
  });

  it('a inspiração do dia muda de um dia para o outro e nunca é pendente', () => {
    const seen = new Set<string>();
    for (let d = 1; d <= 14; d++) {
      const item = itemOfTheDay(new Date(2026, 9, d, 12));
      if (item.kind === 'citacao') expect(item.data.status).toBe('verificada');
      seen.add(`${item.kind}:${item.data.id}`);
      const next = itemOfTheDay(new Date(2026, 9, d + 1, 12));
      expect(`${next.kind}:${next.data.id}`).not.toBe(`${item.kind}:${item.data.id}`);
    }
    expect(seen.size).toBe(14);
  });

  it('o mesmo dia mostra sempre o mesmo item', () => {
    const a = itemOfTheDay(new Date(2026, 9, 20, 8));
    const b = itemOfTheDay(new Date(2026, 9, 20, 22));
    expect(`${a.kind}:${a.data.id}`).toBe(`${b.kind}:${b.data.id}`);
  });
});
