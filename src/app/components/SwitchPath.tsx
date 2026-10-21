import React, { useState } from 'react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

/**
 * Trocar de caminho sem começar do zero (etapa 55). O Caderno, os contatos e a prática de conversar
 * vão junto. Com o mesmo público, as conversas sobre o problema continuam valendo: começa na semana 3.
 */
export const SwitchPath: React.FC<{ onCancel?: () => void }> = ({ onCancel }) => {
  const { actions } = useApp();
  const [sure, setSure] = useState<boolean | null>(null);
  const go = (same: boolean) => {
    soundEffects.playTransition();
    actions.switchPath(same);
  };
  return (
    <div className="p-4 rounded-2xl bg-surface border border-primary/40 space-y-3 animate-fadeIn" role="group" aria-label="Trocar de caminho">
      <p className="text-sm text-ink leading-relaxed">
        Você não começa do zero. <strong>Vão junto:</strong> o Caderno, as pessoas, as cartas, as rotinas e a prática de conversar.
      </p>
      <p className="text-sm font-semibold text-ink">O novo caminho é para o mesmo público, as pessoas com quem você já conversou?</p>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => setSure(true)}
          aria-pressed={sure === true}
          className={`min-h-11 px-3 rounded-xl border text-sm text-left cursor-pointer ${sure === true ? 'border-primary bg-primary-soft' : 'border-line'}`}
        >
          <strong className="block text-ink">Sim, o mesmo público</strong>
          <span className="text-xs text-muted">As conversas sobre o problema continuam valendo: o roteiro novo começa na semana 3.</span>
        </button>
        <button
          onClick={() => setSure(false)}
          aria-pressed={sure === false}
          className={`min-h-11 px-3 rounded-xl border text-sm text-left cursor-pointer ${sure === false ? 'border-primary bg-primary-soft' : 'border-line'}`}
        >
          <strong className="block text-ink">Não, um público novo</strong>
          <span className="text-xs text-muted">O roteiro começa da semana 1, com conversas sobre o problema desse público. Seus contatos continuam lá.</span>
        </button>
      </div>
      {sure !== null && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => go(sure)} className="min-h-11 rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer">
            Escolher o novo caminho
          </button>
          <button
            onClick={() => {
              setSure(null);
              onCancel?.();
            }}
            className="min-h-11 rounded-xl border border-line text-sm text-ink cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
