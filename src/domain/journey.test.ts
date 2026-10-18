import { describe, expect, it } from 'vitest';
import { addDays, buildTimeline, computeStreak, dayKey, isFreshStart, weekKey } from './journey';

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
