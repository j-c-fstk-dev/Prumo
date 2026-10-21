import React from 'react';
import { X } from 'lucide-react';
import { TIME_ANSWERS } from '../../domain/metrics';
import { stepDoneText, whatsappShare } from '../../domain/share';
import { useApp } from '../state/AppStore';

/**
 * Pergunta rápida depois de concluir um passo (etapa 53): o tempo real comparado ao estimado.
 * Mostra quais passos estão mal dimensionados. Responder é opcional.
 */
export const TimeAsk: React.FC = () => {
  const { timeAsk, actions } = useApp();
  if (!timeAsk) return null;
  return (
    <div
      role="dialog"
      aria-label="Quanto tempo levou"
      className="absolute left-3 right-3 bottom-20 z-40 p-3 rounded-2xl bg-surface border border-line shadow-lg animate-slide-up"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-ink">
          Levou quanto tempo? <span className="text-muted">A estimativa era {timeAsk.estimated} min.</span>
        </p>
        <button onClick={() => actions.answerTimeAsk(null)} aria-label="Fechar sem responder" className="text-muted cursor-pointer -mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1.5 mt-2">
        {TIME_ANSWERS.map((a) => (
          <button
            key={a.id}
            onClick={() => actions.answerTimeAsk(a.id)}
            className="flex-1 min-h-9 px-2 rounded-lg border border-line text-[13px] text-ink hover:border-primary cursor-pointer"
          >
            {a.label}
          </button>
        ))}
      </div>
      {/* Parceiro de prumo (etapa 54): avisar alguém de confiança segura o ritmo */}
      <a
        href={whatsappShare(stepDoneText(timeAsk.title))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => actions.sharedProgress('passo')}
        className="mt-2 block text-center text-[13px] text-primary font-semibold"
      >
        📣 Contar pro meu parceiro de prumo
      </a>
    </div>
  );
};
