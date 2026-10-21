/**
 * Lembrete pela agenda do celular (etapa 54): o "quando vou fazer" vira um evento com alarme no
 * Google Agenda ou no calendário do aparelho (.ics). Sem servidor e sem permissão de notificação:
 * o lembrete chega no dia e na hora que a própria pessoa escolheu.
 */

export type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export const WEEKDAYS: { id: Weekday; label: string; js: number }[] = [
  { id: 'MO', label: 'seg', js: 1 },
  { id: 'TU', label: 'ter', js: 2 },
  { id: 'WE', label: 'qua', js: 3 },
  { id: 'TH', label: 'qui', js: 4 },
  { id: 'FR', label: 'sex', js: 5 },
  { id: 'SA', label: 'sáb', js: 6 },
  { id: 'SU', label: 'dom', js: 0 },
];

export interface CalendarEvent {
  title: string;
  details: string;
  /** Começo, no horário do aparelho */
  start: Date;
  minutes: number;
  /** Repete toda semana nesses dias (rotinas) */
  weekly?: Weekday[];
}

/** Avisa 10 minutos antes */
export const ALARM_MINUTES = 10;

const pad = (n: number) => String(n).padStart(2, '0');

/** Data e hora "flutuantes" (sem fuso): o evento fica no horário local de quem abre */
function local(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function utc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeText(t: string): string {
  return t.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

const end = (e: CalendarEvent) => new Date(e.start.getTime() + e.minutes * 60_000);

/** Primeiro dia (a partir de `from`) que cai num dos dias da semana, no horário pedido */
export function nextOccurrence(from: Date, days: Weekday[], hour: number, minute: number): Date {
  const wanted = new Set(days.map((d) => WEEKDAYS.find((w) => w.id === d)!.js));
  for (let i = 0; i < 8; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i, hour, minute);
    if (wanted.has(d.getDay()) && d.getTime() > from.getTime()) return d;
  }
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() + 7, hour, minute);
}

/** Arquivo .ics (abre no calendário do iPhone, do Android ou do computador) */
export function buildIcs(e: CalendarEvent, now: Date = new Date(), uid = `${now.getTime()}@prumo`): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prumo//Lembrete//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utc(now)}`,
    `DTSTART:${local(e.start)}`,
    `DTEND:${local(end(e))}`,
    `SUMMARY:${escapeText(e.title)}`,
    `DESCRIPTION:${escapeText(e.details)}`,
    ...(e.weekly?.length ? [`RRULE:FREQ=WEEKLY;BYDAY=${e.weekly.join(',')}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(e.title)}`,
    `TRIGGER:-PT${ALARM_MINUTES}M`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

/** Link que abre o Google Agenda com o evento pronto para salvar */
export function googleCalendarUrl(e: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    details: e.details,
    dates: `${local(e.start)}/${local(end(e))}`,
  });
  if (e.weekly?.length) params.set('recur', `RRULE:FREQ=WEEKLY;BYDAY=${e.weekly.join(',')}`);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
