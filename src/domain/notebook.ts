/**
 * Caderno do projeto (etapa 27): ficha do produto, anotações com etiquetas e notas por tarefa.
 * Tudo fica no aparelho; nada vai para a IA sozinho.
 */

import type { Diagnosis } from './diagnosis';
import { TEST_PRICE } from './tasks';
import { STAGES, type Person } from './people';

export type NoteTag = 'ideia' | 'conversa' | 'aprendizado' | 'coach';

export const NOTE_TAGS: { id: NoteTag; label: string; emoji: string }[] = [
  { id: 'ideia', label: 'Ideias', emoji: '💡' },
  { id: 'conversa', label: 'Conversas', emoji: '🗣️' },
  { id: 'aprendizado', label: 'Aprendizados', emoji: '📚' },
  { id: 'coach', label: 'Do coach', emoji: '🧭' },
];

export interface Note {
  id: string;
  text: string;
  tag: NoteTag;
  /** Tarefa em que a pessoa estava quando anotou (opcional) */
  taskTitle?: string;
  createdAt: number;
  updatedAt: number;
}

export const NOTE_MAX = 4000;

export type ProfileFieldId = 'offer' | 'audience' | 'pain' | 'price' | 'channel' | 'promise';

export const PROFILE_FIELDS: { id: ProfileFieldId; label: string; placeholder: string }[] = [
  { id: 'offer', label: 'O que eu ofereço', placeholder: 'Ex: aulas de violão para iniciantes' },
  { id: 'audience', label: 'Pra quem', placeholder: 'Ex: adultos que sempre quiseram tocar' },
  { id: 'pain', label: 'Que problema resolve', placeholder: 'Ex: não saber por onde começar' },
  { id: 'price', label: 'Preço de teste', placeholder: 'Ex: R$ 60 por aula' },
  { id: 'channel', label: 'Onde acho clientes', placeholder: 'Ex: grupos do bairro no WhatsApp' },
  { id: 'promise', label: 'Minha frase', placeholder: 'Eu ajudo [quem] a [conseguir o quê], mesmo que [dificuldade]' },
];

export type ProfileOverrides = Partial<Record<ProfileFieldId, string>>;

/** A ficha já vem preenchida pelo resultado; o que a pessoa editar tem prioridade */
export function profileValues(d: Diagnosis | null, overrides: ProfileOverrides): Record<ProfileFieldId, string> {
  const defaults: Record<ProfileFieldId, string> = {
    offer: d?.product ?? '',
    audience: d?.audience ?? '',
    pain: d?.pain ?? '',
    price: d ? TEST_PRICE[d.productId] : '',
    channel: d?.channel ?? '',
    promise: '',
  };
  const out = { ...defaults };
  for (const f of PROFILE_FIELDS) {
    const v = overrides[f.id];
    if (typeof v === 'string') out[f.id] = v;
  }
  return out;
}

function normalize(t: string): string {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Mais recentes primeiro; busca ignora maiúsculas e acentos */
export function filterNotes(notes: Note[], opts: { tag?: NoteTag | 'todas'; query?: string } = {}): Note[] {
  const q = normalize(opts.query?.trim() ?? '');
  return notes
    .filter((n) => !opts.tag || opts.tag === 'todas' || n.tag === opts.tag)
    .filter((n) => !q || normalize(`${n.text} ${n.taskTitle ?? ''}`).includes(q))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

const fmtDate = (ms: number) => new Date(ms).toLocaleDateString('pt-BR');

/** Caderno inteiro em texto simples, para compartilhar ou guardar como backup */
export function exportNotebook(input: {
  userName: string;
  profile: Record<ProfileFieldId, string>;
  notes: Note[];
  taskNotes: { title: string; text: string }[];
  people?: Person[];
  now?: Date;
}): string {
  const lines: string[] = [`Caderno do Prumo · ${input.userName || 'meu projeto'} · ${fmtDate((input.now ?? new Date()).getTime())}`, ''];
  lines.push('== Ficha do meu produto ==');
  for (const f of PROFILE_FIELDS) {
    const v = input.profile[f.id]?.trim();
    if (v) lines.push(`${f.label}: ${v}`);
  }
  for (const tag of NOTE_TAGS) {
    const list = filterNotes(input.notes, { tag: tag.id });
    if (!list.length) continue;
    lines.push('', `== ${tag.emoji} ${tag.label} ==`);
    for (const n of list) {
      lines.push(`[${fmtDate(n.createdAt)}${n.taskTitle ? ` · ${n.taskTitle}` : ''}]`, n.text.trim(), '');
    }
  }
  const people = input.people ?? [];
  if (people.length) {
    lines.push('', '== Pessoas ==');
    for (const p of people) {
      const stage = STAGES.find((s) => s.id === p.stage);
      const contact = [p.phone, p.email].filter(Boolean).join(' · ');
      lines.push(`${p.name} (${stage?.emoji} ${stage?.label})${contact ? ` · ${contact}` : ''}`);
      if (p.nextStep || p.nextDate) lines.push(`Próximo passo: ${[p.nextStep, p.nextDate].filter(Boolean).join(' · ')}`);
      if (p.note) lines.push(p.note);
      lines.push('');
    }
  }
  const tasks = input.taskNotes.filter((t) => t.text.trim());
  if (tasks.length) {
    lines.push('', '== Anotações das tarefas ==');
    for (const t of tasks) lines.push(`${t.title}:`, t.text.trim(), '');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Letra "base" de cada caractere (sem acento, minúscula), mantendo o mesmo tamanho do texto */
function foldChars(t: string): string {
  return Array.from(t)
    .map((c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().charAt(0) || c)
    .join('');
}

function terms(query: string): string[] {
  return foldChars(query).split(/\s+/).filter(Boolean);
}

/** Todas as palavras da busca aparecem no texto (em qualquer ordem, sem ligar para acento) */
export function matchesQuery(text: string, query: string): boolean {
  const t = terms(query);
  if (!t.length) return false;
  const hay = foldChars(text);
  return t.every((w) => hay.includes(w));
}

/** Corta o texto em pedaços marcando onde cada palavra da busca aparece (para destacar na tela) */
export function highlightParts(text: string, query: string): { text: string; hit: boolean }[] {
  const t = terms(query);
  const chars = Array.from(text);
  const folded = Array.from(foldChars(text));
  const hit = new Array(chars.length).fill(false);
  // Uma posição por caractere: emoji (2 unidades) vira um marcador de 1, para os índices baterem
  const hay = folded.map((c) => (c.length > 1 ? '\u0000' : c)).join('');
  for (const w of t) {
    let from = 0;
    for (let i = hay.indexOf(w, from); i !== -1; i = hay.indexOf(w, from)) {
      for (let k = i; k < i + w.length && k < hit.length; k++) hit[k] = true;
      from = i + w.length;
    }
  }
  const parts: { text: string; hit: boolean }[] = [];
  chars.forEach((c, i) => {
    const last = parts[parts.length - 1];
    if (last && last.hit === hit[i]) last.text += c;
    else parts.push({ text: c, hit: hit[i] });
  });
  return parts;
}

export type SearchResult =
  | { kind: 'ficha'; label: string; text: string }
  | { kind: 'nota'; note: Note }
  | { kind: 'tarefa'; taskId: string; title: string; text: string }
  | { kind: 'pessoa'; person: Person };

/** Busca em todo o Caderno: ficha, anotações (com a tarefa e a etiqueta) e notas das tarefas */
export function searchNotebook(
  query: string,
  data: {
    profile: Record<ProfileFieldId, string>;
    notes: Note[];
    taskNotes: { taskId: string; title: string; text: string }[];
    people?: Person[];
  },
): SearchResult[] {
  if (!terms(query).length) return [];
  const out: SearchResult[] = [];
  for (const f of PROFILE_FIELDS) {
    const v = data.profile[f.id];
    if (v && matchesQuery(`${f.label} ${v}`, query)) out.push({ kind: 'ficha', label: f.label, text: v });
  }
  for (const n of filterNotes(data.notes)) {
    const tag = NOTE_TAGS.find((t) => t.id === n.tag)!;
    if (matchesQuery(`${n.text} ${n.taskTitle ?? ''} ${tag.label}`, query)) out.push({ kind: 'nota', note: n });
  }
  for (const t of data.taskNotes) {
    if (t.text.trim() && matchesQuery(`${t.title} ${t.text}`, query)) out.push({ kind: 'tarefa', ...t });
  }
  for (const p of data.people ?? []) {
    const stage = STAGES.find((s) => s.id === p.stage)?.label ?? '';
    const hay = [p.name, p.phone, p.email, p.source, p.note, p.nextStep, stage].filter(Boolean).join(' ');
    if (matchesQuery(hay, query)) out.push({ kind: 'pessoa', person: p });
  }
  return out;
}
