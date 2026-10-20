import { describe, expect, it } from 'vitest';
import { activeCycle, cycleStatus, suggestedTarget, type Cycle } from './cycles';
import type { Person } from './people';

const DAY = 86_400_000;
const start = Date.UTC(2026, 9, 1);
const person = (id: string, history: [Person['stage'], number][]): Person => ({
  id,
  name: id,
  stage: history[history.length - 1][0],
  stageHistory: history.map(([stage, at]) => ({ stage, at })),
  createdAt: 0,
  updatedAt: 0,
});

describe('ciclos depois do roteiro', () => {
  const crescer: Cycle = { id: 'c1', kind: 'continuar', startedAt: start, target: 3, note: '' };

  it('só o último ciclo aberto vale', () => {
    expect(activeCycle([])).toBeNull();
    expect(activeCycle([{ ...crescer, closedAt: 1 }])).toBeNull();
    expect(activeCycle([{ ...crescer, closedAt: 1 }, { ...crescer, id: 'c2' }])?.id).toBe('c2');
  });

  it('crescer conta clientes que viraram cliente durante o ciclo', () => {
    const people = [
      person('antiga', [['contato', 0], ['cliente', start - DAY]]), // virou cliente antes: não conta
      person('nova', [['contato', 0], ['cliente', start + 2 * DAY]]),
      person('conversando', [['contato', 0], ['conversou', start + DAY]]),
    ];
    const s = cycleStatus(crescer, people, start + 4 * DAY);
    expect(s).toEqual({ day: 5, count: 1, percent: 33, goalMet: false, ended: false });
    expect(cycleStatus(crescer, people, start + 30 * DAY).ended).toBe(true);
  });

  it('ajustar conta quem avançou além de "novo" durante o ciclo', () => {
    const ajustar: Cycle = { ...crescer, kind: 'ajustar', target: 2 };
    const people = [person('a', [['contato', start], ['conversou', start + DAY]]), person('b', [['contato', start], ['proposta', start + DAY]])];
    expect(cycleStatus(ajustar, people, start + DAY).goalMet).toBe(true);
  });

  it('a meta sugerida é pequena e cresce com o que já aconteceu', () => {
    expect(suggestedTarget('ajustar', [])).toBe(5);
    expect(suggestedTarget('continuar', [])).toBe(2);
    const clients = Array.from({ length: 4 }, (_, i) => person(`c${i}`, [['cliente', 0]]));
    expect(suggestedTarget('continuar', clients)).toBe(5);
  });
});
