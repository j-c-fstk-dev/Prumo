import { describe, expect, it } from 'vitest';
import { ROUTINES, activeRoutines, currentGoal, routineProgress, toggleRoutineDay, weeklyMinutes } from './routines';
import { suggestedWeek, weekStatus } from './pacing';

const conversa = ROUTINES.find((r) => r.id === 'r_conversa')!;

describe('rotinas', () => {
  it('valem a partir do capítulo delas e continuam nos seguintes', () => {
    const ids = (ch: number) => activeRoutines(ch).map((r) => r.id);
    expect(ids(1)).toEqual(['r_revisao', 'r_produto']);
    expect(ids(2)).toContain('r_conversa');
    expect(ids(2)).not.toContain('r_retomar');
    // "15 min no que vai oferecer" acaba no capítulo 3: o produto já existe
    expect(ids(3)).toEqual(ROUTINES.filter((r) => r.chapterId <= 3 && r.id !== 'r_produto').map((r) => r.id));
    expect(activeRoutines(1, true)).toHaveLength(ROUTINES.length - 1);
  });

  it('ritmo leve ou firme: a frequência se ajusta e "Mostrar algo útil" cai para 1× no capítulo 3', () => {
    const per = (ch: number, pace: 'leve' | 'firme', id: string) => activeRoutines(ch, false, pace).find((r) => r.id === id)!.perWeek;
    expect(per(2, 'firme', 'r_conversa')).toBe(5);
    expect(per(2, 'leve', 'r_conversa')).toBe(3);
    expect(per(2, 'firme', 'r_conteudo')).toBe(2);
    expect(per(3, 'firme', 'r_conteudo')).toBe(1);
    // Leve fica perto de 1h30 por semana; firme, perto de 3h no pico
    for (const ch of [1, 2, 3]) expect(weeklyMinutes(activeRoutines(ch, false, 'leve'))).toBeLessThanOrEqual(105);
    expect(weeklyMinutes(activeRoutines(2, false, 'firme'))).toBeLessThanOrEqual(180);
  });

  it('conta a semana de segunda a domingo e só uma vez por dia', () => {
    // 2026-10-19 é segunda; 2026-10-18 é o domingo da semana anterior
    const log = ['2026-10-18', '2026-10-19', '2026-10-21'];
    expect(routineProgress(conversa, log, '2026-10-21')).toEqual({ doneToday: true, thisWeek: 2, weekDone: false });
    const added = toggleRoutineDay(log, '2026-10-22');
    expect(added.added).toBe(true);
    expect(toggleRoutineDay(added.log, '2026-10-22')).toEqual({ log, added: false });
    const full = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23'];
    expect(routineProgress(conversa, full, '2026-10-23').weekDone).toBe(true);
  });

  it('a meta da semana é a da revisão mais recente que tem meta', () => {
    expect(currentGoal({})).toBeNull();
    const r = (goal: string) => ({ worked: '', change: '', goal, at: 0 });
    expect(currentGoal({ '2026-10-12': r('Falar com 5 pessoas'), '2026-10-19': r('  ') })).toEqual({ goal: 'Falar com 5 pessoas', week: '2026-10-12' });
  });
});

describe('ritmo pelo calendário', () => {
  it('semana 1 nos primeiros 7 dias, e assim por diante', () => {
    expect(suggestedWeek(null)).toBe(1);
    expect(suggestedWeek(1)).toBe(1);
    expect(suggestedWeek(7)).toBe(1);
    expect(suggestedWeek(8)).toBe(2);
    expect(suggestedWeek(90)).toBe(13);
  });

  it('só sugere: passo de semana futura pode ser adiantado', () => {
    expect(weekStatus(3, 3)).toBe('agora');
    expect(weekStatus(5, 3)).toBe('adiantar');
    expect(weekStatus(1, 3)).toBe('anterior');
  });
});
