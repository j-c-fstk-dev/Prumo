import React from 'react';
import type { Person } from '../../domain/people';
import { useApp } from '../state/AppStore';

/**
 * "Mandou a mensagem?" (etapas 36 e 49): aparece na ficha da pessoa e na Início depois de abrir o
 * WhatsApp ou o e-mail. Fica salvo no aparelho, então sobrevive à recarga da página na volta do outro app.
 */
export const SentPrompt: React.FC<{ person: Person; onHome?: boolean }> = ({ person, onHome }) => {
  const { actions } = useApp();
  const first = person.name.trim().split(/\s+/)[0] || person.name;
  return (
    <div
      className={`p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm text-ink space-y-2 ${onHome ? 'shadow-xs' : ''}`}
      role="status"
      aria-label="Mandou a mensagem?"
    >
      {person.stage === 'contato' ? (
        <>
          <p>
            Mandou a mensagem{onHome ? ` para ${first}` : ''}? Quer marcar {onHome ? '' : `${first} `}como <strong>💬 Conversou</strong>?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => actions.answerSent(person.id, true)}
              className="min-h-9 px-3 rounded-lg bg-primary text-on-primary text-[13px] font-semibold cursor-pointer"
            >
              Sim, marcar
            </button>
            <button onClick={() => actions.answerSent(person.id, false)} className="min-h-9 px-3 rounded-lg border border-line text-[13px] text-muted cursor-pointer">
              Ainda não
            </button>
          </div>
        </>
      ) : (
        <p className="flex items-center justify-between gap-2">
          <span>Mandou{onHome ? ` a mensagem para ${first}` : ''}? Quando {first} responder, mude a etapa na ficha.</span>
          <button onClick={() => actions.answerSent(person.id, false)} className="min-h-9 px-2 text-[13px] text-muted cursor-pointer">
            Ok
          </button>
        </p>
      )}
    </div>
  );
};
