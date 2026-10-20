/**
 * Pessoas: mini-CRM do Caderno (etapa 28). Contatos, etapa de cada um, próximo passo e mensagem
 * pronta para abrir no WhatsApp ou no e-mail. Fica só no aparelho: são dados pessoais de terceiros
 * (LGPD) e nunca vão para a IA.
 */

import { buildKitText, type KitContext } from './kit';

/**
 * Etapas (etapa 52): o funil único do roteiro. Conversou = falaram sobre o problema dela, sem mostrar
 * a sua ideia; Viu a proposta = você mostrou o que oferece; Se comprometeu = deu tempo, reputação ou
 * dinheiro (The Mom Test: elogio não conta). Dá para pular etapas: alguém da sua rede pode comprar direto.
 */
export type Stage = 'contato' | 'conversou' | 'proposta' | 'compromisso' | 'cliente' | 'agora_nao';

export const STAGES: { id: Stage; label: string; emoji: string; hint: string }[] = [
  { id: 'contato', label: 'Novo', emoji: '👋', hint: 'Ainda não conversaram' },
  { id: 'conversou', label: 'Conversou', emoji: '💬', hint: 'Conversaram sobre o problema dela, sem mostrar a sua ideia' },
  { id: 'proposta', label: 'Viu a proposta', emoji: '👀', hint: 'Você mostrou o que oferece' },
  { id: 'compromisso', label: 'Se comprometeu', emoji: '🤝', hint: 'Marcou uma data, indicou alguém ou deu um sinal' },
  { id: 'cliente', label: 'Cliente', emoji: '⭐', hint: 'Pagou' },
  { id: 'agora_nao', label: 'Agora não', emoji: '🌙', hint: 'Disse não ou não é o momento' },
];

/** Tipo de compromisso, do mais fraco ao mais forte: uma etiqueta da pessoa, não uma etapa */
export type Commitment = 'tempo' | 'indicacao' | 'dinheiro';

export const COMMITMENTS: { id: Commitment; label: string; emoji: string; hint: string }[] = [
  { id: 'tempo', label: 'Marcou uma data', emoji: '📅', hint: 'Combinou um dia para a entrega ou a conversa (vale também no teste grátis)' },
  { id: 'indicacao', label: 'Indicou alguém', emoji: '🙋', hint: 'Indicou outra pessoa ou autorizou usar o depoimento' },
  { id: 'dinheiro', label: 'Pagou ou deu sinal', emoji: '💰', hint: 'Pagou o teste ou deu um sinal. Teste grátis nunca conta como dinheiro' },
];

export const SOURCES = ['Indicação', 'Conhecido', 'Grupo', 'Instagram', 'Outro'] as const;

export interface Person {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  stage: Stage;
  /** Compromissos que a pessoa assumiu (etapa 52) */
  commitments?: Commitment[];
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
      return {
        subject: 'A primeira versão ficou pronta',
        text: [
          `Oi, ${nome}! Lembra da nossa conversa sobre ${c.pain}?`,
          `Com o que você e outras pessoas me contaram, montei a primeira versão: ${product}.`,
          'Estou abrindo um teste com preço de fundador, só para as primeiras pessoas: [valor].',
          'Quer que eu te mostre como funciona?',
          `Um abraço, ${c.name}`,
        ].join('\n\n'),
      };
    case 'proposta':
      return {
        subject: 'Sobre o teste',
        text: [
          `Oi, ${nome}! Ficou alguma dúvida sobre ${product}?`,
          'Se fizer sentido pra você, a gente já pode marcar o dia. O valor de teste é [valor], por Pix, e se não for o que você esperava eu devolvo em até 7 dias.',
          'Se agora não for o momento, tudo bem também. Você conhece alguém que passa por isso?',
          `Um abraço, ${c.name}`,
        ].join('\n\n'),
      };
    case 'compromisso':
      return {
        subject: 'Combinado!',
        text: [
          `Oi, ${nome}! Obrigado(a) pela confiança.`,
          'Só pra deixar tudo combinado: [o que você vai entregar], no dia [data].',
          'Qualquer dúvida até lá, é só me chamar aqui.',
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

const RANK: Record<Exclude<Stage, 'agora_nao'>, number> = { contato: 0, conversou: 1, proposta: 2, compromisso: 3, cliente: 4 };

/** A etapa mais longe a que a pessoa chegou (quem disse "agora não" conta onde estava antes) */
function reached(p: Person): number {
  let best = p.stage === 'agora_nao' ? 0 : RANK[p.stage];
  for (const h of p.stageHistory) if (h.stage !== 'agora_nao' && RANK[h.stage] !== undefined) best = Math.max(best, RANK[h.stage]);
  // Quem pulou direto para "Agora não" já conversou com você
  if (p.stage === 'agora_nao') best = Math.max(best, 1);
  if (p.commitments?.length) best = Math.max(best, RANK.compromisso);
  return best;
}

export interface Funnel {
  names: number;
  /** Conversaram sobre o problema (ou foram além) */
  talked: number;
  /** Viram a proposta (ou foram além) */
  presented: number;
  /** Assumiram algum compromisso: tempo, indicação ou dinheiro */
  committed: number;
  /** Desses, quantos em dinheiro (pagou ou deu sinal) */
  money: number;
  clients: number;
}

/** O funil único do roteiro: 20 nomes → conversas sobre o problema → apresentações → compromissos */
export function funnel(people: Person[]): Funnel {
  const r = people.map(reached);
  return {
    names: people.length,
    talked: r.filter((x) => x >= RANK.conversou).length,
    presented: r.filter((x) => x >= RANK.proposta).length,
    committed: r.filter((x) => x >= RANK.compromisso).length,
    money: people.filter((p, i) => p.commitments?.includes('dinheiro') || r[i] >= RANK.cliente).length,
    clients: r.filter((x) => x >= RANK.cliente).length,
  };
}

export type TestVerdict = 'seguir' | 'ajustar' | 'trocar';

/** Apresentações que formam uma rodada de teste */
export const TEST_ROUND = 5;

/**
 * A decisão da semana 6 conta compromissos, não "sins". Toda combinação cai em uma saída só:
 *   - seguir: 2 ou mais compromissos, com pelo menos 1 em dinheiro;
 *   - ajustar: qualquer outro caso com pelo menos 1 compromisso (ex.: 1 só, mesmo em dinheiro);
 *   - trocar: nenhum compromisso (antes, conferir se as 5 eram o público certo).
 * Teste grátis com compromisso conta como tempo ou indicação, nunca como dinheiro.
 * Antes de 5 apresentações, sem o sinal de seguir, ainda está testando (null).
 */
export function testVerdict(f: Funnel): TestVerdict | null {
  if (f.committed >= 2 && f.money >= 1) return 'seguir';
  if (f.presented < TEST_ROUND) return null;
  return f.committed > 0 ? 'ajustar' : 'trocar';
}

/** Dados antigos: "Interessado" virou "Viu a proposta" (interesse não é compromisso) */
export function normalizePerson(p: Person): Person {
  const fix = (s: string): Stage => (s === 'interessado' ? 'proposta' : (s as Stage));
  return { ...p, stage: fix(p.stage), stageHistory: (p.stageHistory ?? []).map((h) => ({ ...h, stage: fix(h.stage) })) };
}

/** Próximos passos para hoje ou atrasados, mais antigos primeiro */
export function dueFollowUps(people: Person[], today: string): Person[] {
  return people
    .filter((p) => p.nextDate && p.nextDate <= today && p.stage !== 'agora_nao')
    .sort((a, b) => (a.nextDate! < b.nextDate! ? -1 : a.nextDate! > b.nextDate! ? 1 : 0));
}

export function countByStage(people: Person[]): Record<Stage, number> {
  const out = { contato: 0, conversou: 0, proposta: 0, compromisso: 0, cliente: 0, agora_nao: 0 } as Record<Stage, number>;
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
    ...(p.commitments !== undefined && { commitments: COMMITMENTS.map((c) => c.id).filter((id) => p.commitments!.includes(id)) }),
  };
}
