import { describe, expect, it } from 'vitest';
import { fiveMinutePlan } from './fiveMinutes';
import type { Person } from './people';

const p = (name: string, extra: Partial<Person> = {}): Person => ({ id: name, name, stage: 'conversou', stageHistory: [], createdAt: 0, updatedAt: 0, ...extra });

describe('"Hoje só tenho 5 minutos" (etapa 55)', () => {
  it('primeiro retoma quem ficou para hoje, depois manda a 1ª mensagem, depois anota um nome', () => {
    expect(fiveMinutePlan([p('Ana Souza', { nextDate: '2026-10-20', nextStep: 'mandar o preço' })], '2026-10-21')).toMatchObject({ kind: 'retomar', detail: 'Mande uma mensagem para Ana: mandar o preço.' });
    expect(fiveMinutePlan([p('Beto', { stage: 'contato' })], '2026-10-21').kind).toBe('mensagem');
    expect(fiveMinutePlan([p('Caio')], '2026-10-21').kind).toBe('nome');
    expect(fiveMinutePlan(Array.from({ length: 20 }, (_, i) => p(`P${i}`)), '2026-10-21').kind).toBe('checkin');
  });
});
