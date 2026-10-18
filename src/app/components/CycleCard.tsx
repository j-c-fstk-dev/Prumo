import React from 'react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { CYCLE_DAYS, CYCLE_LABEL } from '../../domain/cycles';

/** Ciclo de 30 dias em andamento (etapa 44): a meta vem do Caderno → Pessoas */
export const CycleCard: React.FC = () => {
  const { cycleInfo: c, canChooseCycle, actions } = useApp();
  if (!c) return null;
  const label = CYCLE_LABEL[c.kind];
  return (
    <section aria-label="Ciclo atual" className="p-4 rounded-2xl bg-primary-soft border border-primary/30 shadow-sm space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {c.kind === 'continuar' ? '🌳' : '🔧'} Ciclo {c.number} · {label.title}
        </span>
        <span className="text-[13px] text-muted">{c.ended ? 'terminou' : `dia ${c.day} de ${CYCLE_DAYS}`}</span>
      </div>
      <h3 className="text-lg font-bold text-ink leading-snug">
        {c.count} de {c.target} {c.target === 1 ? label.unit[0] : label.unit[1]}
        {c.goalMet && ' ✦'}
      </h3>
      <div className="w-full bg-line h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={c.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Meta do ciclo">
        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${c.percent}%` }} />
      </div>
      {c.note && <p className="text-[13px] text-ink">🎯 {c.note}</p>}
      <p className="text-xs text-muted leading-snug">
        {c.goalMet
          ? 'Meta batida! Você pode seguir até o fim do ciclo ou já escolher o próximo.'
          : c.ended
            ? 'O ciclo terminou. Olhe o que aconteceu e escolha o próximo, sem culpa.'
            : 'Conta sozinho a partir do Caderno: mude a etapa das pessoas conforme as conversas.'}
      </p>
      <div className="grid gap-2">
        {canChooseCycle ? (
          <button
            onClick={() => {
              soundEffects.playTransition();
              actions.go('next_cycle');
            }}
            className="min-h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold cursor-pointer"
          >
            Fechar o ciclo e escolher o próximo
          </button>
        ) : null}
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.openPeople();
          }}
          className="min-h-10 rounded-xl border border-primary/30 bg-surface text-sm text-primary font-semibold cursor-pointer"
        >
          Ver minhas pessoas
        </button>
      </div>
    </section>
  );
};
