/**
 * Caderno do projeto (etapa 27): ficha do produto, anotações com etiquetas e notas por tarefa.
 * Tudo fica no aparelho; nada vai para a IA sozinho.
 */

import type { Diagnosis } from './diagnosis';
import { TEST_PRICE } from './tasks';

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
  const tasks = input.taskNotes.filter((t) => t.text.trim());
  if (tasks.length) {
    lines.push('', '== Anotações das tarefas ==');
    for (const t of tasks) lines.push(`${t.title}:`, t.text.trim(), '');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
