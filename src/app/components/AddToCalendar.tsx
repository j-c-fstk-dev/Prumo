import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { buildIcs, googleCalendarUrl, nextOccurrence, WEEKDAYS, type CalendarEvent, type Weekday } from '../../domain/calendar';
import { dayKey } from '../../domain/journey';
import { track } from '../../utils/telemetry';

const APP_LINK = 'https://prumo.jardimdofazer.com.br/app/';

interface Props {
  title: string;
  details: string;
  minutes: number;
  /** Passo: um dia só. Rotina: toda semana nos dias escolhidos */
  mode: 'once' | 'weekly';
  kind: 'passo' | 'rotina';
}

const fieldClass = 'px-2 py-1.5 bg-surface border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-primary';

/**
 * "Pôr na minha agenda" (etapa 54): lembrete com alarme no dia e na hora que a pessoa escolheu,
 * pelo Google Agenda ou pelo calendário do celular. Nada passa por servidor.
 */
export const AddToCalendar: React.FC<Props> = ({ title, details, minutes, mode, kind }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(dayKey(new Date()));
  const [time, setTime] = useState('19:00');
  const [days, setDays] = useState<Weekday[]>([]);
  const [done, setDone] = useState('');

  const ready = Boolean(time) && (mode === 'once' ? Boolean(date) : days.length > 0);
  const event = (): CalendarEvent => {
    const [h, m] = time.split(':').map(Number);
    const start =
      mode === 'once'
        ? (() => {
            const [y, mo, d] = date.split('-').map(Number);
            return new Date(y, mo - 1, d, h, m);
          })()
        : nextOccurrence(new Date(), days, h, m);
    return { title: `Prumo: ${title}`, details: `${details}\n\nAbra o Prumo: ${APP_LINK}`, start, minutes, ...(mode === 'weekly' && { weekly: days }) };
  };

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(event())], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prumo-lembrete.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    track('agenda_adicionada', { tipo: kind, como: 'ics' });
    setDone('Abra o arquivo baixado para salvar no calendário do celular.');
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-primary font-semibold cursor-pointer">
        <CalendarPlus className="w-4 h-4" /> Pôr na minha agenda
      </button>
    );
  }

  return (
    <div className="mt-2 p-2.5 rounded-xl bg-surface-2/60 border border-line space-y-2" role="group" aria-label="Pôr na minha agenda">
      <span className="text-[13px] text-ink block">O celular te avisa 10 minutos antes.</span>
      {mode === 'once' ? (
        <div className="flex gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Dia" className={`${fieldClass} flex-1`} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Hora" className={fieldClass} />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Dias da semana">
            {WEEKDAYS.map((w) => {
              const on = days.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDays(on ? days.filter((d) => d !== w.id) : [...days, w.id])}
                  className={`min-w-10 min-h-8 px-1.5 rounded-full text-xs border cursor-pointer ${on ? 'bg-primary border-primary text-on-primary font-semibold' : 'border-line text-muted'}`}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Hora" className={fieldClass} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={ready ? googleCalendarUrl(event()) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          onClick={(e) => {
            if (!ready) return e.preventDefault();
            track('agenda_adicionada', { tipo: kind, como: 'google' });
            setDone('Confira e salve o evento no Google Agenda.');
          }}
          className={`min-h-10 px-2 rounded-lg border text-[13px] font-semibold inline-flex items-center justify-center text-center ${ready ? 'border-primary text-primary' : 'border-line text-muted pointer-events-none'}`}
        >
          Google Agenda
        </a>
        <button
          type="button"
          disabled={!ready}
          onClick={downloadIcs}
          className="min-h-10 px-2 rounded-lg border border-primary text-primary text-[13px] font-semibold disabled:border-line disabled:text-muted cursor-pointer disabled:cursor-not-allowed"
        >
          Calendário do celular
        </button>
      </div>
      {done && (
        <p role="status" className="text-xs text-primary">
          {done}
        </p>
      )}
    </div>
  );
};
