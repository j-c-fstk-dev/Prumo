import { describe, expect, it } from 'vitest';
import { hasActivity, lastMonday, stepDoneText, weeklySummaryText, weekStats, whatsappShare } from './share';

const day = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();

describe('parceiro de prumo e resumo da semana (etapa 54)', () => {
  it('a semana passada começa na segunda anterior', () => {
    expect(lastMonday('2026-10-21')).toBe('2026-10-12');
  });

  it('conta só o que aconteceu naquela semana, sem nomes', () => {
    const people = [
      { id: 'a', name: 'Ana Souza', stage: 'compromisso' as const, stageHistory: [{ stage: 'contato' as const, at: day(2026, 10, 1) }, { stage: 'conversou' as const, at: day(2026, 10, 13) }, { stage: 'compromisso' as const, at: day(2026, 10, 15) }], createdAt: 0, updatedAt: 0 },
      { id: 'b', name: 'Beto', stage: 'conversou' as const, stageHistory: [{ stage: 'conversou' as const, at: day(2026, 10, 20) }], createdAt: 0, updatedAt: 0 },
    ];
    const s = weekStats('2026-10-12', {
      completedAt: { t1: day(2026, 10, 12), t8: day(2026, 10, 18), t9: day(2026, 10, 19) },
      routineLog: { r_revisao: ['2026-10-18', '2026-10-19'], r_conversa: ['2026-10-14'] },
      people,
    });
    expect(s).toEqual({ tasks: 2, routines: 2, talked: 1, committed: 1 });
    const text = weeklySummaryText(s, { goal: 'conversar com 5' });
    expect(text).toContain('2 passos concluídos');
    expect(text).toContain('1 compromisso novo');
    expect(text).toContain('Meta da próxima semana: conversar com 5');
    expect(text).not.toContain('Ana');
    expect(hasActivity({ tasks: 0, routines: 0, talked: 0, committed: 0 })).toBe(false);
  });

  it('a mensagem do passo sai pelo WhatsApp, e a pessoa escolhe para quem', () => {
    const url = whatsappShare(stepDoneText('Listar 20 pessoas'));
    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toContain('"Listar 20 pessoas"');
  });
});
