import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl, nextOccurrence } from './calendar';

const start = new Date(2026, 9, 22, 7, 30); // qui, 22/10/2026, 7h30

describe('lembrete pela agenda (etapa 54)', () => {
  it('o .ics tem o horário local, a duração e um alarme 10 min antes', () => {
    const ics = buildIcs({ title: 'Prumo: Conversar com 5 pessoas', details: 'Abra o Prumo', start, minutes: 15 }, new Date(Date.UTC(2026, 9, 21)), 'x@prumo');
    expect(ics).toContain('DTSTART:20261022T073000');
    expect(ics).toContain('DTEND:20261022T074500');
    expect(ics).toContain('TRIGGER:-PT10M');
    expect(ics).not.toContain('RRULE');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('escapa vírgulas e quebras de linha e repete toda semana nas rotinas', () => {
    const ics = buildIcs({ title: 'Falar com 1 pessoa, nova', details: 'a\nb', start, minutes: 15, weekly: ['TU', 'TH'] });
    expect(ics).toContain('SUMMARY:Falar com 1 pessoa\\, nova');
    expect(ics).toContain('DESCRIPTION:a\\nb');
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=TU,TH');
  });

  it('o link do Google Agenda leva título, horário e repetição', () => {
    const url = new URL(googleCalendarUrl({ title: 'Prumo', details: 'x', start, minutes: 20, weekly: ['MO'] }));
    expect(url.hostname).toBe('calendar.google.com');
    expect(url.searchParams.get('dates')).toBe('20261022T073000/20261022T075000');
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=WEEKLY;BYDAY=MO');
  });

  it('a próxima ocorrência cai no primeiro dia escolhido depois de agora', () => {
    const now = new Date(2026, 9, 21, 9, 0); // qua, 9h
    expect(nextOccurrence(now, ['WE'], 8, 0).getDate()).toBe(28); // hoje às 8h já passou
    expect(nextOccurrence(now, ['WE'], 20, 0).getDate()).toBe(21);
    expect(nextOccurrence(now, ['TU', 'FR'], 7, 0).getDate()).toBe(23);
  });
});
