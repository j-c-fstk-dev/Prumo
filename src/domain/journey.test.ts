import { describe, expect, it } from 'vitest';
import { addDays, buildTimeline, computeStreak, dayKey, isFreshStart, journeyDayKey, journeyDayLabel, journeyDayNumber, tasksDoneOn, weekKey } from './journey';

// 2026-10-14 é uma quarta-feira
const WED = '2026-10-14';
const days = (...keys: string[]) => Object.fromEntries(keys.map((k) => [k, 1]));

describe('datas', () => {
  it('dayKey usa a data local', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
  it('a semana começa na segunda', () => {
    expect(weekKey(WED)).toBe('2026-10-12');
    expect(weekKey('2026-10-18')).toBe('2026-10-12'); // domingo
    expect(weekKey('2026-10-19')).toBe('2026-10-19'); // segunda
  });
  it('addDays atravessa meses', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
  });
});

describe('computeStreak', () => {
  it('conta dias seguidos com ação', () => {
    const s = computeStreak({ actionsByDay: days('2026-10-12', '2026-10-13', WED), repairedDays: [], today: WED });
    expect(s.current).toBe(3);
  });

  it('hoje ainda aberto não zera a sequência de ontem', () => {
    const s = computeStreak({ actionsByDay: days('2026-10-12', '2026-10-13'), repairedDays: [], today: WED });
    expect(s.current).toBe(2);
  });

  it('1 dia de descanso por semana não quebra', () => {
    // seg ativo, ter em branco (descanso), qua ativo
    const s = computeStreak({ actionsByDay: days('2026-10-12', WED), repairedDays: [], today: WED });
    expect(s.current).toBe(2);
    expect(s.restDays).toEqual(['2026-10-13']);
    expect(s.canRepairYesterday).toBe(false);
  });

  it('o segundo dia em branco na mesma semana quebra, mas dá para remendar', () => {
    // sex 09, sáb 10 e dom 11 ativos; seg 12 e ter 13 em branco (só 1 descanso por semana)
    const s = computeStreak({ actionsByDay: days('2026-10-09', '2026-10-10', '2026-10-11'), repairedDays: [], today: WED });
    expect(s.canRepairYesterday).toBe(true);
    expect(s.current).toBe(0);
  });

  it('o remendo devolve a sequência', () => {
    const s = computeStreak({
      actionsByDay: { ...days('2026-10-09', '2026-10-10', '2026-10-11'), [WED]: 2 },
      repairedDays: ['2026-10-13'],
      today: WED,
    });
    // qua + ter (remendado) + sex/sáb/dom; a segunda vira o descanso da semana
    expect(s.current).toBe(5);
    expect(s.restDays).toEqual(['2026-10-12']);
  });

  it('sem nenhuma ação, nada a remendar', () => {
    const s = computeStreak({ actionsByDay: {}, repairedDays: [], today: WED });
    expect(s).toMatchObject({ current: 0, canRepairYesterday: false, daysAway: null });
  });

  it('conta há quantos dias a pessoa não aparece', () => {
    const s = computeStreak({ actionsByDay: days('2026-10-09'), repairedDays: [], today: WED });
    expect(s.daysAway).toBe(5);
  });
});

describe('isFreshStart', () => {
  it('reconhece segunda-feira e dia 1º', () => {
    expect(isFreshStart('2026-10-12')).toBe('segunda');
    expect(isFreshStart('2026-11-01')).toBe('mes');
    expect(isFreshStart(WED)).toBeNull();
  });
});

describe('buildTimeline', () => {
  const tasks = [
    { id: 'a', title: 'Tarefa A', chapterId: 1, chapterTitle: 'Capítulo 1: Promessa' },
    { id: 'b', title: 'Tarefa B', chapterId: 1, chapterTitle: 'Capítulo 1: Promessa' },
    { id: 'c', title: 'Tarefa C', chapterId: 2, chapterTitle: 'Capítulo 2: Contato' },
  ];

  it('lista conquistas da mais recente para a mais antiga', () => {
    const t = buildTimeline({ diagnosisAt: 1, letterSealedAt: 2, tasks, completedAt: { a: 10 } });
    expect(t.map((e) => e.kind)).toEqual(['tarefa', 'carta', 'diagnostico']);
  });

  it('marca o capítulo concluído quando todas as tarefas dele terminam', () => {
    const t = buildTimeline({ tasks, completedAt: { a: 10, b: 20 } });
    expect(t[0]).toMatchObject({ kind: 'capitulo', title: 'Capítulo 1 concluído' });
    expect(t.filter((e) => e.kind === 'capitulo')).toHaveLength(1);
  });
});

describe('dia da jornada (etapa 33)', () => {
  it('o dia vira às 4h: 0h30 ainda é ontem, 4h já é hoje', () => {
    expect(journeyDayKey(new Date(2026, 9, 18, 0, 30))).toBe('2026-10-17');
    expect(journeyDayKey(new Date(2026, 9, 18, 3, 59))).toBe('2026-10-17');
    expect(journeyDayKey(new Date(2026, 9, 18, 4, 0))).toBe('2026-10-18');
    expect(journeyDayKey(new Date(2026, 9, 1, 1, 0))).toBe('2026-09-30');
  });

  it('conta dias de calendário, não blocos de 24h', () => {
    const start = new Date(2026, 9, 1, 22, 0).getTime();
    expect(journeyDayNumber(start, new Date(2026, 9, 1, 23, 0))).toBe(1);
    // 11h depois, mas já é outro dia: Dia 2 (a conta antiga dava 0)
    expect(journeyDayNumber(start, new Date(2026, 9, 2, 9, 0))).toBe(2);
    expect(journeyDayNumber(start, new Date(2026, 9, 3, 2, 0))).toBe(2);
    expect(journeyDayNumber(start, new Date(2026, 11, 29, 12, 0))).toBe(90);
  });

  it('depois dos 90 o texto muda, sem "Dia 95 de 90"', () => {
    expect(journeyDayLabel(12)).toBe('Dia 12 de 90');
    expect(journeyDayLabel(90)).toBe('Dia 90 de 90');
    expect(journeyDayLabel(95)).toBe('Dia 95 · além dos 90 ✨');
  });

  it('tarefas são contadas por dia, à parte da sequência', () => {
    const at = (h: number, d = 18) => new Date(2026, 9, d, h).getTime();
    const completedAt = { a: at(9), b: at(15), c: at(2, 19), d: at(10, 17) };
    // a "c" foi às 2h do dia 19: ainda é o dia 18
    expect(tasksDoneOn(completedAt, '2026-10-18')).toBe(3);
    expect(tasksDoneOn(completedAt, '2026-10-17')).toBe(1);
  });
});
