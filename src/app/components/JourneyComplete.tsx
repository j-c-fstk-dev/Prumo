import React from 'react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

/**
 * Roteiro concluído (etapa 41): no lugar do "próximo passo", que antes voltava para a tarefa 1.
 * Mostra o que fazer a partir daqui, sem fingir que existe uma tarefa pendente.
 */
export const JourneyComplete: React.FC = () => {
  const { tasks, people, canChooseCycle, actions } = useApp();
  const clients = people.filter((p) => p.stage === 'cliente').length;
  return (
    <div className="p-4 rounded-2xl bg-night-sky shadow-sm space-y-3" style={{ color: 'var(--night-text)' }}>
      <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--gold)' }}>
        ✦ Roteiro concluído
      </span>
      <h3 className="text-lg font-bold font-display leading-snug">Você fez todos os {tasks.length} passos do roteiro.</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--night-muted)' }}>
        Pouca gente chega até aqui. Agora o que conta é manter o ritmo: seguir conversando com pessoas e cuidando de quem já disse sim
        {clients > 0 ? ` (${clients} ${clients === 1 ? 'cliente' : 'clientes'} até agora)` : ''}.
      </p>
      <div className="grid gap-2">
        {canChooseCycle && (
          <button
            onClick={() => {
              soundEffects.playTransition();
              actions.go('next_cycle');
            }}
            className="min-h-11 rounded-xl font-semibold text-sm cursor-pointer"
            style={{ background: 'var(--gold)', color: 'var(--night-900)' }}
          >
            Escolher o próximo ciclo
          </button>
        )}
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.openPeople();
          }}
          className="min-h-11 rounded-xl border text-sm cursor-pointer"
          style={{ borderColor: 'rgba(237,232,247,.25)', color: 'var(--night-text)' }}
        >
          Ver minhas pessoas no Caderno
        </button>
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.go('future_letter');
          }}
          className="min-h-11 rounded-xl border text-sm cursor-pointer"
          style={{ borderColor: 'rgba(237,232,247,.25)', color: 'var(--night-text)' }}
        >
          Reler a carta do começo
        </button>
      </div>
    </div>
  );
};
