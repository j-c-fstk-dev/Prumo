import React, { useState } from 'react';
import { ACTIONS_TO_REPAIR } from '../../domain/journey';
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
  const { userName, streak, todayCheckIn, freshStart, actions } = useApp();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todayCheckIn?.text ?? '');
  const [mood, setMood] = useState<CheckIn['mood']>(todayCheckIn?.mood);

  const returning = streak.daysAway !== null && streak.daysAway >= 2 && streak.actionsToday === 0;
  const showForm = !todayCheckIn || editing;

  return (
    <div className="space-y-2">
      {returning && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
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
        <div className="p-3 rounded-xl bg-[#E3F2ED] border border-[#1F6F5C]/30 text-xs text-[#1F6F5C] leading-relaxed">
          Ontem ficou em branco. Faça {ACTIONS_TO_REPAIR} ações hoje e sua sequência continua{' '}
          <strong>
            ({Math.min(streak.actionsToday, ACTIONS_TO_REPAIR)}/{ACTIONS_TO_REPAIR})
          </strong>
          .
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white border border-[#E6E8E6] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1A1D1B]">Check-in de hoje</span>
          {streak.current > 0 && (
            <span className="text-[11px] font-semibold text-[#1F6F5C]">
              ✦ {streak.current} {streak.current === 1 ? 'dia' : 'dias'} de prumo
              {streak.restDays.length > 0 && <span className="font-normal text-[#5B615D]"> · com descanso</span>}
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
                  className={`px-2.5 py-1 rounded-full text-[11px] border cursor-pointer ${
                    mood === m.id ? 'bg-[#1F6F5C] border-[#1F6F5C] text-white font-semibold' : 'bg-white border-[#E6E8E6] text-[#5B615D]'
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
              className="w-full px-3 py-2 bg-white border border-[#E6E8E6] rounded-lg text-xs focus:outline-none focus:border-[#1F6F5C]"
            />
            <button
              disabled={!text.trim() && !mood}
              onClick={() => {
                actions.checkIn(text, mood);
                setEditing(false);
              }}
              className="px-3 py-1.5 bg-[#1F6F5C] disabled:opacity-40 text-white text-[11px] font-semibold rounded-lg cursor-pointer"
            >
              Registrar
            </button>
          </>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-[#1A1D1B]">
              ✓ {todayCheckIn?.mood ? `${MOOD_LABEL[todayCheckIn.mood]}. ` : ''}
              {todayCheckIn?.text}
            </p>
            <button onClick={() => setEditing(true)} className="text-[11px] text-[#5B615D] shrink-0 cursor-pointer">
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
