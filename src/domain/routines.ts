/**
 * Rotinas (etapa 42): o que se repete durante a jornada, ao lado dos passos únicos do roteiro.
 * Inspiração: Couch to 5K (treinos que se repetem por semana), Noom e Fabulous (hábitos que se
 * acumulam). Cada rotina tem uma meta por semana; no máximo uma marcação por dia.
 */

import { weekKey } from './journey';

export interface Routine {
  id: string;
  emoji: string;
  title: string;
  description: string;
  /** Passa a valer a partir deste capítulo (e continua nos seguintes) */
  chapterId: number;
  /** Quantas vezes por semana (1 a 7) no ritmo firme */
  perWeek: number;
  /** No ritmo leve (etapa 53) */
  perWeekLeve: number;
  /** Deixa de valer depois deste capítulo (ex.: o produto já existe no capítulo 3) */
  untilChapter?: number;
  /** A partir deste capítulo, a frequência cai (firme e leve) */
  later?: { fromChapter: number; perWeek: number; perWeekLeve: number };
  minutes: number;
  /** Atalho ao tocar: a lista de pessoas ou a revisão da semana */
  link?: 'pessoas' | 'revisao';
}

export const ROUTINES: Routine[] = [
  {
    id: 'r_revisao',
    emoji: '🧭',
    title: 'Revisão da semana',
    description: 'Cinco minutos para olhar a semana: o que funcionou, o que mudar e a meta da próxima.',
    chapterId: 1,
    perWeek: 1,
    perWeekLeve: 1,
    minutes: 5,
    link: 'revisao',
  },
  {
    id: 'r_produto',
    emoji: '🌱',
    title: '15 minutos no que você vai oferecer',
    description: 'Avance um pouco no esboço, no roteiro ou no exemplo. Pouco e sempre rende mais do que muito de vez em quando.',
    chapterId: 1,
    perWeek: 3,
    perWeekLeve: 2,
    untilChapter: 2,
    minutes: 15,
  },
  {
    id: 'r_conversa',
    emoji: '💬',
    title: 'Falar com 1 pessoa nova',
    description: 'Mande a mensagem pronta para alguém da sua lista ou responda alguém num grupo do seu tema. Uma conversa por vez.',
    chapterId: 2,
    perWeek: 5,
    perWeekLeve: 3,
    minutes: 15,
    link: 'pessoas',
  },
  {
    id: 'r_conteudo',
    emoji: '🏮',
    title: 'Mostrar algo útil',
    description: 'Um post, um status ou uma resposta num grupo sobre o problema que você resolve. Sem vender: só ajudar.',
    chapterId: 2,
    perWeek: 2,
    perWeekLeve: 1,
    later: { fromChapter: 3, perWeek: 1, perWeekLeve: 1 },
    minutes: 20,
  },
  {
    id: 'r_retomar',
    emoji: '🔁',
    title: 'Retomar quem ficou de responder',
    description: 'Olhe o "Pra hoje" no Caderno e retome uma conversa parada. A maioria das vendas sai da segunda mensagem.',
    chapterId: 3,
    perWeek: 3,
    perWeekLeve: 2,
    minutes: 10,
    link: 'pessoas',
  },
  {
    id: 'r_cliente',
    emoji: '🤝',
    title: 'Cuidar de quem já comprou',
    description: 'Pergunte como está sendo, ajude no que travou e, se fizer sentido, peça um depoimento.',
    chapterId: 3,
    perWeek: 1,
    perWeekLeve: 1,
    minutes: 10,
    link: 'pessoas',
  },
];

/**
 * Ritmo (etapa 53): leve (~1h30 por semana de rotinas) ou firme (~3h, com os passos). Quem tem
 * emprego e família escolhe leve; as frequências se ajustam sozinhas. "Falar com 1 pessoa nova"
 * continua a principal nos dois: é ela que gera vendas.
 */
export type Pace = 'leve' | 'firme';

export const PACES: { id: Pace; label: string; hint: string }[] = [
  { id: 'leve', label: 'Leve', hint: 'Cerca de 1h30 por semana. Para quem tem emprego, família ou pouco tempo.' },
  { id: 'firme', label: 'Firme', hint: 'Cerca de 3h por semana. Para quem pode se dedicar um pouco mais agora.' },
];

/**
 * Rotinas valendo agora: as do capítulo atual e as dos anteriores (ou todas, depois do roteiro),
 * com a frequência do ritmo escolhido e da fase.
 */
export function activeRoutines(currentChapter: number, all = false, pace: Pace = 'firme'): Routine[] {
  const chapter = all ? Number.POSITIVE_INFINITY : currentChapter;
  return ROUTINES.filter((r) => r.chapterId <= chapter && (r.untilChapter === undefined || chapter <= r.untilChapter)).map((r) => {
    const phase = r.later && chapter >= r.later.fromChapter ? r.later : r;
    return { ...r, perWeek: pace === 'leve' ? phase.perWeekLeve : phase.perWeek };
  });
}

/** Minutos de rotina por semana (para mostrar a carga ao escolher o ritmo) */
export function weeklyMinutes(routines: Routine[]): number {
  return routines.reduce((n, r) => n + r.perWeek * r.minutes, 0);
}

export interface RoutineProgress {
  doneToday: boolean;
  /** Vezes nesta semana (segunda a domingo) */
  thisWeek: number;
  /** Bateu a meta da semana */
  weekDone: boolean;
}

export function routineProgress(routine: Routine, log: string[] | undefined, today: string): RoutineProgress {
  const days = log ?? [];
  const week = weekKey(today);
  const thisWeek = days.filter((d) => weekKey(d) === week).length;
  return { doneToday: days.includes(today), thisWeek, weekDone: thisWeek >= routine.perWeek };
}

/** Marca ou desmarca a rotina no dia (no máximo uma vez por dia) */
export function toggleRoutineDay(log: string[] | undefined, today: string): { log: string[]; added: boolean } {
  const days = log ?? [];
  return days.includes(today) ? { log: days.filter((d) => d !== today), added: false } : { log: [...days, today], added: true };
}

export interface WeeklyReview {
  worked: string;
  change: string;
  goal: string;
  at: number;
}

export const REVIEW_LIMIT = 400;

/** A meta mais recente da revisão da semana (vale para a semana seguinte à revisão, até a próxima revisão) */
export function currentGoal(reviews: Record<string, WeeklyReview>): { goal: string; week: string } | null {
  const weeks = Object.keys(reviews)
    .filter((w) => reviews[w].goal.trim())
    .sort();
  const last = weeks[weeks.length - 1];
  return last ? { goal: reviews[last].goal.trim(), week: last } : null;
}
