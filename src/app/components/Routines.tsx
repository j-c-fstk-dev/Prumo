import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { useApp } from '../state/AppStore';
import { REVIEW_LIMIT } from '../../domain/routines';
import { journeyDayKey, weekKey } from '../../domain/journey';
import { soundEffects } from '../../utils/soundEffects';
import { WhenPicker } from './WhenPicker';

const inputClass =
  'w-full px-3 py-2 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary resize-none';

/**
 * Revisão da semana (etapa 42): 3 perguntas curtas. A meta vira o lembrete da semana seguinte.
 * Abre por cima da tela do app (mesmo jeito do modal do coach nas Pessoas).
 */
export const WeeklyReviewModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { weeklyReviews, routines, tasks, completedAt, people, actions } = useApp();
  // Refazer a revisão na mesma semana abre o que já foi escrito
  const existing = weeklyReviews[weekKey(journeyDayKey())];
  const [worked, setWorked] = useState(existing?.worked ?? '');
  const [change, setChange] = useState(existing?.change ?? '');
  const [goal, setGoal] = useState(existing?.goal ?? '');

  // O que aconteceu nos últimos 7 dias, para ajudar a lembrar
  const since = Date.now() - 7 * 86_400_000;
  const tasksDone = tasks.filter((t) => (completedAt[t.id] ?? 0) >= since).length;
  const routinesDone = routines.reduce((n, r) => n + r.thisWeek, 0);
  const talked = people.filter((p) => p.stageHistory.some((h) => h.at >= since && h.stage !== 'contato')).length;

  const root = document.getElementById('app-screen') ?? document.body;
  return createPortal(
    <div className="absolute inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-3 animate-fadeIn" role="dialog" aria-modal="true" aria-label="Revisão da semana">
      <div className="w-full max-h-[90%] overflow-y-auto rounded-2xl bg-surface border border-line p-4 space-y-3 animate-slide-up">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-ink">🧭 Revisão da semana</h3>
          <button onClick={onClose} className="min-h-9 px-2 text-sm text-muted cursor-pointer">
            Fechar
          </button>
        </div>
        <p className="text-[13px] text-muted leading-snug">
          Nos últimos 7 dias: {tasksDone} {tasksDone === 1 ? 'passo concluído' : 'passos concluídos'} · {routinesDone}{' '}
          {routinesDone === 1 ? 'rotina feita' : 'rotinas feitas'} · {talked} {talked === 1 ? 'pessoa avançou' : 'pessoas avançaram'} no Caderno.
        </p>
        {[
          { label: 'O que funcionou esta semana?', value: worked, set: setWorked, ph: 'Ex: mandar mensagem de manhã, antes do trabalho' },
          { label: 'O que você vai mudar?', value: change, set: setChange, ph: 'Ex: posts longos demais; vou testar algo mais curto' },
          { label: 'Uma meta para a próxima semana', value: goal, set: setGoal, ph: 'Ex: conversar com 5 pessoas novas' },
        ].map((f) => (
          <label key={f.label} className="block">
            <span className="text-sm font-semibold text-ink block mb-1">{f.label}</span>
            <textarea rows={2} maxLength={REVIEW_LIMIT} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} aria-label={f.label} className={inputClass} />
          </label>
        ))}
        <p className="text-xs text-muted">Fica só neste celular. Não precisa responder tudo: uma linha já ajuda.</p>
        <button
          onClick={() => {
            actions.saveWeeklyReview({ worked, change, goal });
            onClose();
          }}
          className="w-full min-h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold cursor-pointer"
        >
          Salvar revisão
        </button>
      </div>
    </div>,
    root,
  );
};

/**
 * Rotina da semana (etapa 42): o que se repete no capítulo atual, com a contagem da semana.
 * Marcar conta como ação do dia (dias de prumo), igual a concluir um passo.
 */
export const RoutinesCard: React.FC<{ title?: string }> = ({ title = 'Rotina da semana' }) => {
  const { routines, weeklyGoal, reflections, actions } = useApp();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [whenFor, setWhenFor] = useState<string | null>(null);
  if (!routines.length) return null;

  return (
    <section aria-label={title} data-tour="rotinas" className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-ink">{title}</span>
        <span className="text-xs text-muted">o que se repete, no seu ritmo</span>
      </div>
      {weeklyGoal && (
        <p className="text-[13px] text-primary bg-primary-soft rounded-lg px-2.5 py-1.5">
          🎯 <strong>Meta da semana:</strong> {weeklyGoal.goal}
        </p>
      )}
      <ul className="space-y-1.5">
        {routines.map((r) => {
          const open = () => {
            soundEffects.playSoftTap();
            if (r.link === 'revisao') setReviewOpen(true);
            if (r.link === 'pessoas') actions.openPeople();
          };
          return (
            <li key={r.id} className={`p-2 rounded-xl border ${r.doneToday ? 'border-success/30 bg-success-soft/40' : 'border-line'}`}>
              <div className="flex items-center gap-2.5">
              <button
                onClick={() => (r.link === 'revisao' && !r.doneToday ? setReviewOpen(true) : actions.toggleRoutine(r.id))}
                aria-pressed={r.doneToday}
                aria-label={`${r.title}: ${r.doneToday ? 'feita hoje' : 'marcar como feita hoje'}`}
                className="shrink-0 cursor-pointer"
              >
                {r.doneToday ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted" />}
              </button>
              <button onClick={open} disabled={!r.link} title={r.description} className="flex-1 min-w-0 text-left disabled:cursor-default cursor-pointer">
                <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
                  <span aria-hidden="true">{r.emoji}</span>
                  <span className="truncate">{r.title}</span>
                </span>
                <span className="text-xs text-muted">
                  {r.weekDone ? '✦ meta da semana feita' : `${r.thisWeek} de ${r.perWeek} esta semana`} · {r.minutes} min
                </span>
              </button>
              {r.link && <ChevronRight className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />}
              </div>
              {/* Quando e onde (etapa 53): também para as rotinas */}
              <button
                type="button"
                onClick={() => setWhenFor(whenFor === r.id ? null : r.id)}
                aria-expanded={whenFor === r.id}
                aria-label={`Quando fazer: ${r.title}`}
                className="ml-7.5 mt-0.5 text-xs text-primary cursor-pointer"
              >
                {r.when ? `⏰ ${r.when}` : '⏰ combinar quando'}
              </button>
              {whenFor === r.id && (
                <div className="mt-1.5 ml-7.5">
                  <WhenPicker
                    value={r.when}
                    onChange={(when) => {
                      actions.setRoutineWhen(r.id, when);
                      if (when) setWhenFor(null);
                    }}
                    timeThieves={reflections.q3_hours}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {reviewOpen && <WeeklyReviewModal onClose={() => setReviewOpen(false)} />}
    </section>
  );
};
