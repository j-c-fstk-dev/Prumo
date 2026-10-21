import React from 'react';
import { weeklySummaryText, whatsappShare } from '../../domain/share';
import { useApp } from '../state/AppStore';

/**
 * Resumo da semana passada (etapa 54), de segunda a quarta: o que a pessoa fez, para ver o
 * próprio progresso e, se quiser, mandar ao parceiro de prumo, à turma ou ao coach. Só números.
 */
export const WeekSummary: React.FC = () => {
  const { lastWeek, weeklyGoal, actions } = useApp();
  if (!lastWeek) return null;
  const items = [
    [lastWeek.tasks, 'passos'],
    [lastWeek.routines, 'rotinas'],
    [lastWeek.talked, 'conversas'],
    [lastWeek.committed, 'compro­missos'],
  ] as const;
  return (
    <section aria-label="Sua semana passada" className="p-4 rounded-2xl bg-surface border border-line space-y-2.5">
      <span className="text-sm font-bold text-ink block">Sua semana passada</span>
      <ul className="grid grid-cols-4 gap-1.5 text-center">
        {items.map(([n, label]) => (
          <li key={label} className="rounded-xl bg-primary-soft/60 py-1.5 px-1">
            <span className="block text-lg font-bold text-ink leading-none">{n}</span>
            <span className="block text-[11px] text-muted leading-tight mt-1">{label}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <a
          href={whatsappShare(weeklySummaryText(lastWeek, { goal: weeklyGoal?.goal }))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            actions.sharedProgress('semana');
            actions.dismissWeekSummary();
          }}
          className="flex-1 min-h-10 rounded-xl bg-primary text-on-primary text-[13px] font-semibold inline-flex items-center justify-center"
        >
          📣 Mandar pro meu parceiro
        </a>
        <button onClick={actions.dismissWeekSummary} className="px-3 min-h-10 text-[13px] text-muted cursor-pointer">
          Ok
        </button>
      </div>
    </section>
  );
};
