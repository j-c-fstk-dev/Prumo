import React from 'react';
import { PACES } from '../../domain/routines';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

/**
 * Ritmo leve ou firme (etapa 53): as rotinas se ajustam sozinhas. Escolhido na entrada e
 * trocado quando quiser em Você. Sem escolha, vale o firme.
 */
export const PaceChooser: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { pace, actions } = useApp();
  return (
    <div role="radiogroup" aria-label="Seu ritmo" className={`grid grid-cols-2 gap-2 ${className}`}>
      {PACES.map((p) => {
        const on = pace === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => {
              soundEffects.playSelectOption();
              actions.setPace(p.id);
            }}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${on ? 'border-primary bg-primary-soft' : 'border-line bg-surface'}`}
          >
            <span className={`block text-sm font-bold ${on ? 'text-primary' : 'text-ink'}`}>{p.label}</span>
            <span className="block text-xs text-muted leading-snug mt-0.5">{p.hint}</span>
          </button>
        );
      })}
    </div>
  );
};
