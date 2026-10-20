import React, { useState } from 'react';
import { ACTIONS_TO_REPAIR, BUSY_DAY_TASKS } from '../../domain/journey';
import { useApp, type CheckIn } from '../state/AppStore';

const MOODS: Array<{ id: NonNullable<CheckIn['mood']>; label: string }> = [
  { id: 'bem', label: '😌 Foi bem' },
  { id: 'ok', label: '😐 Mais ou menos' },
  { id: 'dificil', label: '😮‍💨 Foi difícil' },
];

const MOOD_LABEL = Object.fromEntries(MOODS.map((m) => [m.id, m.label]));

/**
 * Ritmo diário (docs/pesquisa/02): check-in de 10 segundos, sequência gentil com descanso e
 * remendo, e acolhimento para quem volta. Nunca mostra "você quebrou a sequência".
 */
export const DailyRhythm: React.FC = () => {
  const { userName, streak, todayCheckIn, freshStart, tasksDoneToday, restartOffer, nextStepTask, actions } = useApp();
  const [restarted, setRestarted] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todayCheckIn?.text ?? '');
  const [mood, setMood] = useState<CheckIn['mood']>(todayCheckIn?.mood);

  const returning = streak.daysAway !== null && streak.daysAway >= 2 && streak.actionsToday === 0;
  const showForm = !todayCheckIn || editing;

  return (
    <div className="space-y-2">
      {/* Recomeço sem culpa (etapa 52): logo na volta, a semana do próximo passo começa hoje */}
      {restartOffer && nextStepTask?.week && (
        <section aria-label="Recomeçar" className="p-3.5 rounded-2xl bg-gold-soft border border-gold-line text-sm text-gold-ink leading-relaxed space-y-2">
          <p>
            <strong className="block mb-0.5">
              {returning ? `Que bom te ver de volta, ${userName}.` : freshStart === 'segunda' ? 'Hoje é segunda-feira: um bom dia para recomeçar.' : 'Hoje é o primeiro dia do mês: um bom dia para recomeçar.'}
            </strong>
            Quer recomeçar a partir de hoje? O roteiro volta para a semana {nextStepTask.week}, a do seu próximo passo, sem nada atrasado. O que você
            já fez continua feito.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRestarted(nextStepTask.week!);
                actions.restartFromToday();
              }}
              className="px-3 min-h-9 rounded-lg bg-primary text-on-primary text-[13px] font-semibold cursor-pointer"
            >
              Recomeçar a partir de hoje
            </button>
            <button onClick={actions.dismissRestart} className="px-3 min-h-9 rounded-lg text-[13px] text-gold-ink cursor-pointer">
              Agora não
            </button>
          </div>
        </section>
      )}
      {restarted !== null && (
        <p role="status" className="p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm text-primary">
          Pronto: a semana {restarted} começa hoje. Um passo de cada vez. 🧭
        </p>
      )}

      {returning && !restartOffer && (
        <div className="p-3.5 rounded-2xl bg-gold-soft border border-gold-line text-sm text-gold-ink leading-relaxed">
          <strong className="block mb-0.5">Que bom te ver de volta, {userName}.</strong>
          Ficar uns dias longe acontece com todo mundo e não apaga o que você já fez. Que tal só 5 minutos hoje?
          {freshStart && (
            <span className="block mt-1 font-semibold">
              {freshStart === 'segunda' ? 'Hoje é segunda-feira' : 'Hoje é o primeiro dia do mês'}: um ótimo dia para recomeçar.
            </span>
          )}
        </div>
      )}

      {streak.canRepairYesterday && (
        <div className="p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm text-primary leading-relaxed">
          Ontem ficou em branco. Faça {ACTIONS_TO_REPAIR} ações hoje e sua sequência continua{' '}
          <strong>
            ({Math.min(streak.actionsToday, ACTIONS_TO_REPAIR)}/{ACTIONS_TO_REPAIR})
          </strong>
          .
        </div>
      )}

      {tasksDoneToday >= BUSY_DAY_TASKS && (
        <div className="p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm text-primary leading-relaxed">
          <strong>{tasksDoneToday} passos hoje, que dia!</strong> Fazer mais de um por dia adianta o caminho. Só lembra de descansar
          também: amanhã ele continua aqui. 🌙
        </div>
      )}

      <div data-tour="checkin" className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-ink">Check-in de hoje</span>
          {streak.current > 0 && (
            <span className="text-[13px] font-semibold text-primary">
              ✦ {streak.current} {streak.current === 1 ? 'dia' : 'dias'} de prumo
              {streak.restDays.length > 0 && <span className="font-normal text-muted"> · com descanso</span>}
            </span>
          )}
        </div>

        {showForm ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(mood === m.id ? undefined : m.id)}
                  className={`px-2.5 py-1 rounded-full text-[13px] border cursor-pointer ${
                    mood === m.id ? 'bg-primary border-primary text-on-primary font-semibold' : 'bg-surface border-line text-muted'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="O que você fez hoje, mesmo que pequeno?"
              className="w-full px-3 py-2 bg-surface border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <button
              disabled={!text.trim() && !mood}
              onClick={() => {
                actions.checkIn(text, mood);
                setEditing(false);
              }}
              className="px-3 py-1.5 bg-primary disabled:opacity-40 text-on-primary text-[13px] font-semibold rounded-lg cursor-pointer"
            >
              Registrar
            </button>
          </>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-ink">
              ✓ {todayCheckIn?.mood ? `${MOOD_LABEL[todayCheckIn.mood]}. ` : ''}
              {todayCheckIn?.text}
            </p>
            <button onClick={() => setEditing(true)} className="text-[13px] text-muted shrink-0 cursor-pointer">
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
