/**
 * Ritmo diário do Prumo, com base em docs/pesquisa/02:
 *  - Sequência gentil: 1 dia de descanso por semana não quebra; um dia em branco pode ser
 *    "remendado" com 2 ações no dia seguinte (Silverman & Barasch 2023: quebra sem conserto desmotiva).
 *  - Nunca existe mensagem de "você quebrou"; quem volta é acolhido (Breines & Chen 2012).
 *  - Recomeço em datas-marco: segunda-feira e dia 1º (Dai, Milkman & Riis 2014).
 */

/** Data local no formato AAAA-MM-DD (sem fuso: o dia é o do celular da pessoa). */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, delta: number): string {
  const d = parseDay(key);
  d.setDate(d.getDate() + delta);
  return dayKey(d);
}

/** Segunda-feira da semana do dia (a semana vai de segunda a domingo). */
export function weekKey(key: string): string {
  const d = parseDay(key);
  const offset = (d.getDay() + 6) % 7;
  return addDays(key, -offset);
}

export const ACTIONS_TO_REPAIR = 2;

export interface StreakInput {
  /** Quantas ações (tarefa concluída ou check-in) a pessoa fez em cada dia */
  actionsByDay: Record<string, number>;
  /** Dias em branco que já foram remendados */
  repairedDays: string[];
  today: string;
}

export interface StreakInfo {
  /** Dias ativos (ou remendados) na sequência atual; descansos não somam, mas não quebram */
  current: number;
  /** Dias de descanso usados dentro da sequência atual */
  restDays: string[];
  /** Ontem ficou em branco, sem descanso disponível, e havia sequência antes: dá para remendar hoje */
  canRepairYesterday: boolean;
  actionsToday: number;
  /** Dias desde a última ação (0 = hoje). null se nunca houve ação */
  daysAway: number | null;
}

export function computeStreak({ actionsByDay, repairedDays, today }: StreakInput): StreakInfo {
  const isCounted = (d: string, extra?: string) => (actionsByDay[d] ?? 0) > 0 || repairedDays.includes(d) || d === extra;
  const counted = (d: string) => isCounted(d);
  const activeDays = Object.keys(actionsByDay).filter((d) => actionsByDay[d] > 0).sort();
  const first = activeDays[0];
  const last = activeDays[activeDays.length - 1];
  const actionsToday = actionsByDay[today] ?? 0;

  const walk = (start: string, assumeRepaired?: string) => {
    let count = 0;
    const rest: string[] = [];
    const restWeeks = new Set<string>();
    let d = start;
    let brokeAt: string | null = null;
    while (first && d >= first) {
      if (isCounted(d, assumeRepaired)) {
        count++;
      } else if (!restWeeks.has(weekKey(d))) {
        restWeeks.add(weekKey(d));
        rest.push(d);
      } else {
        brokeAt = d;
        break;
      }
      d = addDays(d, -1);
    }
    return { count, rest, brokeAt };
  };

  // Hoje ainda está aberto: se não houve ação hoje, a sequência é contada até ontem
  const start = counted(today) ? today : addDays(today, -1);
  const { count, rest, brokeAt } = walk(start);

  // Dá para remendar ontem se isso recupera mais do que o próprio dia de ontem (a sequência anterior)
  const yesterday = addDays(today, -1);
  const repairedWalk = walk(counted(today) ? today : yesterday, yesterday);
  const canRepairYesterday = !counted(yesterday) && brokeAt !== null && repairedWalk.count > count + 1;

  const daysAway = last ? Math.round((parseDay(today).getTime() - parseDay(last).getTime()) / 86_400_000) : null;

  return { current: count, restDays: rest, canRepairYesterday, actionsToday, daysAway };
}

/** Segunda-feira ou dia 1º: um bom momento para recomeçar. */
export function isFreshStart(today: string): 'segunda' | 'mes' | null {
  const d = parseDay(today);
  if (d.getDate() === 1) return 'mes';
  if (d.getDay() === 1) return 'segunda';
  return null;
}

export interface TimelineEvent {
  at: number;
  title: string;
  kind: 'diagnostico' | 'carta' | 'tarefa' | 'capitulo';
}

export interface TimelineInput {
  diagnosisAt?: number;
  letterSealedAt?: number;
  tasks: Array<{ id: string; title: string; chapterId: number; chapterTitle: string }>;
  completedAt: Record<string, number>;
}

/** Linha do tempo de conquistas, da mais recente para a mais antiga. */
export function buildTimeline({ diagnosisAt, letterSealedAt, tasks, completedAt }: TimelineInput): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  if (diagnosisAt) events.push({ at: diagnosisAt, title: 'Diagnóstico pronto: você encontrou seu norte', kind: 'diagnostico' });
  if (letterSealedAt) events.push({ at: letterSealedAt, title: 'Cartas ao eu futuro seladas', kind: 'carta' });
  for (const t of tasks) {
    if (completedAt[t.id]) events.push({ at: completedAt[t.id], title: `Concluiu: ${t.title}`, kind: 'tarefa' });
  }
  const chapters = Array.from(new Set(tasks.map((t) => t.chapterId)));
  for (const c of chapters) {
    const inChapter = tasks.filter((t) => t.chapterId === c);
    if (inChapter.every((t) => completedAt[t.id])) {
      const at = Math.max(...inChapter.map((t) => completedAt[t.id]));
      events.push({ at: at + 1, title: `${inChapter[0].chapterTitle.split(':')[0]} concluído`, kind: 'capitulo' });
    }
  }
  return events.sort((a, b) => b.at - a.at);
}
