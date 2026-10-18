/**
 * Pessoas: mini-CRM do Caderno (etapa 28). Contatos, etapa de cada um, próximo passo e mensagem
 * pronta para abrir no WhatsApp ou no e-mail. Fica só no aparelho: são dados pessoais de terceiros
 * (LGPD) e nunca vão para a IA.
 */

import { buildKitText, type KitContext } from './kit';

export type Stage = 'contato' | 'conversou' | 'interessado' | 'cliente' | 'agora_nao';

export const STAGES: { id: Stage; label: string; emoji: string; hint: string }[] = [
  { id: 'contato', label: 'Novo', emoji: '👋', hint: 'Ainda não conversaram sobre a sua ideia' },
  { id: 'conversou', label: 'Conversou', emoji: '💬', hint: 'Vocês já conversaram' },
  { id: 'interessado', label: 'Interessado', emoji: '✨', hint: 'Disse sim ou pediu mais' },
  { id: 'cliente', label: 'Cliente', emoji: '🤝', hint: 'Pagou' },
  { id: 'agora_nao', label: 'Agora não', emoji: '🌙', hint: 'Disse não ou não é o momento' },
];

export const SOURCES = ['Indicação', 'Conhecido', 'Grupo', 'Instagram', 'Outro'] as const;

export interface Person {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  stage: Stage;
  note?: string;
  /** Próximo passo combinado ("mandar proposta") e a data (AAAA-MM-DD) */
  nextStep?: string;
  nextDate?: string;
  /** Quando entrou em cada etapa (para métricas futuras) */
  stageHistory: { stage: Stage; at: number }[];
  /** Fotos anexadas (ids no armazenamento do aparelho; etapa 31) */
  images?: string[];
  createdAt: number;
  updatedAt: number;
}

export const PERSON_LIMITS = { name: 80, phone: 30, email: 120, note: 2000, nextStep: 160 } as const;

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name.trim();

/** Só dígitos; número brasileiro sem DDI (10 ou 11 dígitos) ganha o 55 */
export function waNumber(phone: string | undefined): string | null {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  return digits.length <= 11 ? `55${digits}` : digits;
}

export function whatsappLink(phone: string | undefined, text: string): string | null {
  const n = waNumber(phone);
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : null;
}

export function emailLink(email: string | undefined, subject: string, body: string): string | null {
  const e = (email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return `mailto:${encodeURIComponent(e)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function phoneLink(phone: string | undefined): string | null {
  const digits = (phone ?? '').replace(/[^\d+]/g, '');
  return digits.replace(/\D/g, '').length >= 8 ? `tel:${digits}` : null;
}

/** Mensagem pronta conforme a etapa, já com o primeiro nome da pessoa. A pessoa revisa antes de enviar. */
export function messageFor(person: Pick<Person, 'name' | 'stage'>, c: KitContext): { subject: string; text: string } {
  const nome = firstName(person.name);
  const product = c.product.charAt(0).toLowerCase() + c.product.slice(1);
  switch (person.stage) {
    case 'contato':
      return { subject: 'Uma pergunta rápida', text: buildKitText('convite', c).replace('[nome]', nome) };
    case 'conversou':
    case 'interessado':
      return {
        subject: 'A primeira versão ficou pronta',
        text: [
          `Oi, ${nome}! Lembra da nossa conversa sobre ${c.pain}?`,
          `A primeira versão (${product}) ficou pronta, e você está entre as primeiras pessoas que eu quis avisar.`,
          'Tenho uma condição especial de teste: [valor].',
          'Quer que eu te explique como funciona? Sem compromisso.',
          `Um abraço, ${c.name}`,
        ].join('\n\n'),
      };
    case 'cliente':
      return { subject: 'Como foi pra você?', text: buildKitText('depoimento', c).replace('[nome]', nome) };
    case 'agora_nao':
      return {
        subject: 'Faz um tempo que a gente conversou',
        text: [
          `Oi, ${nome}! Faz um tempo que conversamos sobre ${c.pain}.`,
          `Melhorei ${product} com o que as pessoas me disseram.`,
          'Se ainda fizer sentido pra você, posso te mostrar? Sem pressão nenhuma.',
          `Um abraço, ${c.name}`,
        ].join('\n\n'),
      };
  }
}

/**
 * O teste do Capítulo 2: "2 de 5 dizem sim". Conta quem já conversou (qualquer etapa depois de
 * "Contato") e, desses, quem disse sim (Interessado ou Cliente).
 */
export function testStats(people: Person[]): { talked: number; yes: number; clients: number; goalMet: boolean } {
  const talked = people.filter((p) => p.stage !== 'contato').length;
  const yes = people.filter((p) => p.stage === 'interessado' || p.stage === 'cliente').length;
  const clients = people.filter((p) => p.stage === 'cliente').length;
  return { talked, yes, clients, goalMet: yes >= 2 };
}

/** Próximos passos para hoje ou atrasados, mais antigos primeiro */
export function dueFollowUps(people: Person[], today: string): Person[] {
  return people
    .filter((p) => p.nextDate && p.nextDate <= today && p.stage !== 'agora_nao')
    .sort((a, b) => (a.nextDate! < b.nextDate! ? -1 : a.nextDate! > b.nextDate! ? 1 : 0));
}

export function countByStage(people: Person[]): Record<Stage, number> {
  const out = { contato: 0, conversou: 0, interessado: 0, cliente: 0, agora_nao: 0 } as Record<Stage, number>;
  for (const p of people) out[p.stage]++;
  return out;
}

/** Campos limpos e cortados nos limites (usado ao criar e editar) */
export function cleanPerson<T extends Partial<Person>>(p: T): T {
  const cut = (v: string | undefined, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : v);
  return {
    ...p,
    name: cut(p.name, PERSON_LIMITS.name),
    phone: cut(p.phone, PERSON_LIMITS.phone),
    email: cut(p.email, PERSON_LIMITS.email),
    note: cut(p.note, PERSON_LIMITS.note),
    nextStep: cut(p.nextStep, PERSON_LIMITS.nextStep),
  };
}
