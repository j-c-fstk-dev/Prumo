/**
 * Parceiro de prumo e resumo da semana (etapa 54): prestar contas a alguém de confiança é o que
 * mais segura as pessoas (Mohr e colegas). Sem contas nem servidor: a mensagem sai pelo WhatsApp e a
 * própria pessoa escolhe para quem manda. Só números e títulos de passo, nunca nomes de contatos.
 */

import { addDays, journeyDayKey, weekKey } from './journey';
import type { Person } from './people';

export function whatsappShare(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function stepDoneText(stepTitle: string): string {
  return `Concluí mais um passo no Prumo ✅\n"${stepTitle}"\n\nMe cobra o próximo? 😄`;
}

export interface WeekStats {
  tasks: number;
  routines: number;
  /** Pessoas que avançaram para Conversou ou além na semana */
  talked: number;
  /** Compromissos novos na semana */
  committed: number;
}

const ADVANCED = new Set(['conversou', 'proposta', 'compromisso', 'cliente']);

/** O que aconteceu na semana que começa na segunda `monday` (AAAA-MM-DD) */
export function weekStats(
  monday: string,
  data: { completedAt: Record<string, number>; routineLog: Record<string, string[]>; people: Person[] },
): WeekStats {
  const inWeek = (day: string) => weekKey(day) === monday;
  const at = (ms: number) => inWeek(journeyDayKey(new Date(ms)));
  return {
    tasks: Object.values(data.completedAt).filter(at).length,
    routines: Object.values(data.routineLog).reduce((n, days) => n + days.filter(inWeek).length, 0),
    talked: data.people.filter((p) => p.stageHistory.some((h) => ADVANCED.has(h.stage) && at(h.at))).length,
    committed: data.people.filter((p) => p.stageHistory.some((h) => (h.stage === 'compromisso' || h.stage === 'cliente') && at(h.at))).length,
  };
}

export const lastMonday = (today: string) => addDays(weekKey(today), -7);

export const hasActivity = (s: WeekStats) => s.tasks + s.routines + s.talked + s.committed > 0;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function weeklySummaryText(s: WeekStats, opts: { goal?: string } = {}): string {
  return [
    'Minha semana no Prumo 🧭',
    `• ${plural(s.tasks, 'passo concluído', 'passos concluídos')}`,
    `• ${plural(s.routines, 'rotina feita', 'rotinas feitas')}`,
    `• ${plural(s.talked, 'conversa que avançou', 'conversas que avançaram')}`,
    `• ${plural(s.committed, 'compromisso novo', 'compromissos novos')}`,
    ...(opts.goal ? [`\nMeta da próxima semana: ${opts.goal}`] : []),
  ].join('\n');
}
