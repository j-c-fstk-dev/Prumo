import { describe, expect, it } from 'vitest';
import { newMilestones } from './metrics';

describe('marcos do roteiro (etapa 53)', () => {
  it('registra a primeira conversa e a primeira venda uma vez só', () => {
    expect(newMilestones({ talked: 0, clients: 0 }, undefined)).toEqual([]);
    expect(newMilestones({ talked: 1, clients: 0 }, undefined)).toEqual(['primeira_conversa']);
    expect(newMilestones({ talked: 3, clients: 1 }, { primeira_conversa: 1 })).toEqual(['primeira_venda']);
    expect(newMilestones({ talked: 3, clients: 2 }, { primeira_conversa: 1, primeira_venda: 2 })).toEqual([]);
  });
});
