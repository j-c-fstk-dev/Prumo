/**
 * "Hoje só tenho 5 minutos" (etapa 55): uma coisa só, pequena, que conta no dia. Pular dias não
 * quebra o hábito (Lally et al.), mas "não tenho tempo pra nada, então nem abro" quebra.
 */

import { dueFollowUps, type Person } from './people';

export type FiveMinuteKind = 'retomar' | 'mensagem' | 'nome' | 'checkin';

export interface FiveMinutePlan {
  kind: FiveMinuteKind;
  title: string;
  detail: string;
  /** Abre o Caderno → Pessoas */
  opensPeople: boolean;
}

const first = (name: string) => name.trim().split(/\s+/)[0];

export function fiveMinutePlan(people: Person[], today: string): FiveMinutePlan {
  const due = dueFollowUps(people, today);
  if (due.length) {
    return { kind: 'retomar', title: 'Retomar uma conversa', detail: `Mande uma mensagem para ${first(due[0].name)}: ${due[0].nextStep || 'retomar contato'}.`, opensPeople: true };
  }
  const fresh = people.find((p) => p.stage === 'contato');
  if (fresh) {
    return { kind: 'mensagem', title: 'Mandar 1 mensagem pronta', detail: `Abra ${first(fresh.name)} no Caderno, toque em "Mensagem pronta" e mande.`, opensPeople: true };
  }
  if (people.length < 20) {
    return { kind: 'nome', title: 'Anotar 1 nome novo', detail: 'Alguém que pode ter o problema que você resolve. Só o nome já vale.', opensPeople: true };
  }
  return { kind: 'checkin', title: 'Fazer o check-in de hoje', detail: 'Dez segundos pra contar como foi o dia. Até um dia difícil conta.', opensPeople: false };
}
