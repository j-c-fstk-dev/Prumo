/**
 * Ciclos depois do roteiro (etapa 44). Ao terminar os passos (ou chegar ao Dia 90), a pessoa decide
 * com honestidade:
 *   - continuar: deu certo, mais 30 dias com uma meta de clientes;
 *   - ajustar: quase, muda uma coisa e testa de novo, com uma meta de conversas;
 *   - trocar de caminho: não rolou, começa um roteiro novo (o que fez fica na história).
 * Inspiração: "jornadas" que se encadeiam (Fabulous) e a prática contínua depois do curso (Duolingo,
 * Headspace). O progresso do ciclo vem do Caderno → Pessoas, nunca de texto enviado para fora.
 */

import type { Person, Stage } from './people';

export const CYCLE_DAYS = 30;

export type CycleKind = 'continuar' | 'ajustar';

export interface Cycle {
  id: string;
  kind: CycleKind;
  /** Quando começou (ms) */
  startedAt: number;
  /** Meta em número: clientes novos (continuar) ou conversas novas (ajustar) */
  target: number;
  /** O que a pessoa vai mudar ou focar (opcional, fica só no aparelho) */
  note: string;
  closedAt?: number;
}

export interface PastJourney {
  endedAt: number;
  /** Caminho daquela jornada (ex.: "Transição de carreira") */
  title: string;
  tasksDone: number;
}

export const CYCLE_NOTE_LIMIT = 300;

/** O que conta para a meta de cada tipo de ciclo */
const COUNTS: Record<CycleKind, (s: Stage) => boolean> = {
  continuar: (s) => s === 'cliente',
  ajustar: (s) => s !== 'contato',
};

export const CYCLE_LABEL: Record<CycleKind, { title: string; unit: [string, string] }> = {
  continuar: { title: 'Crescer', unit: ['cliente novo', 'clientes novos'] },
  ajustar: { title: 'Ajustar e testar de novo', unit: ['conversa nova', 'conversas novas'] },
};

/** Ciclo em andamento (o último que não foi fechado) */
export function activeCycle(cycles: Cycle[]): Cycle | null {
  const last = cycles[cycles.length - 1];
  return last && !last.closedAt ? last : null;
}

/** Dia do ciclo (1 no dia em que começou), contado em blocos de 24 h a partir do início */
export function cycleDay(cycle: Cycle, now: number): number {
  return Math.max(1, Math.floor((now - cycle.startedAt) / 86_400_000) + 1);
}

/** Quantas pessoas chegaram à etapa que conta, desde o início do ciclo (pelo histórico de etapas) */
export function cycleCount(cycle: Cycle, people: Person[]): number {
  const counts = COUNTS[cycle.kind];
  return people.filter((p) => p.stageHistory.some((h) => h.at >= cycle.startedAt && counts(h.stage))).length;
}

export interface CycleStatus {
  day: number;
  count: number;
  /** 0 a 100 */
  percent: number;
  goalMet: boolean;
  /** Passou dos 30 dias: hora de fechar e escolher o próximo */
  ended: boolean;
}

export function cycleStatus(cycle: Cycle, people: Person[], now: number): CycleStatus {
  const day = cycleDay(cycle, now);
  const count = cycleCount(cycle, people);
  const target = Math.max(1, cycle.target);
  return { day, count, percent: Math.min(100, Math.round((count / target) * 100)), goalMet: count >= target, ended: day > CYCLE_DAYS };
}

/** Meta sugerida para o próximo ciclo, a partir do que já aconteceu (pequena e possível) */
export function suggestedTarget(kind: CycleKind, people: Person[]): number {
  if (kind === 'ajustar') return 5;
  const clients = people.filter((p) => p.stage === 'cliente').length;
  return Math.min(10, Math.max(2, clients + 1));
}
