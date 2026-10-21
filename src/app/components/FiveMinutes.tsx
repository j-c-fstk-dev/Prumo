import React, { useState } from 'react';
import { dayKey } from '../../domain/journey';
import { fiveMinutePlan } from '../../domain/fiveMinutes';
import { useApp } from '../state/AppStore';

/** "Hoje só tenho 5 minutos" (etapa 55): uma coisa pequena que conta no dia */
export const FiveMinutes: React.FC = () => {
  const { people, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const plan = fiveMinutePlan(people, dayKey(new Date()));

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full min-h-10 rounded-xl border border-dashed border-primary/40 text-[13px] text-primary font-semibold cursor-pointer">
        ⏱ Hoje só tenho 5 minutos
      </button>
    );
  }
  return (
    <section aria-label="Só 5 minutos" className="p-3.5 rounded-2xl bg-surface border border-primary/30 space-y-2">
      {done ? (
        <p role="status" className="text-sm text-primary font-semibold">
          Feito! Isso conta no seu dia de prumo. Amanhã, um pouco mais, se der. 🧭
        </p>
      ) : (
        <>
          <span className="text-xs font-bold uppercase tracking-wider text-primary block">Só 5 minutos</span>
          <strong className="text-sm text-ink block">{plan.title}</strong>
          <p className="text-[13px] text-muted leading-snug">{plan.detail}</p>
          <div className="flex gap-2">
            {plan.opensPeople && (
              <button onClick={() => actions.openPeople()} className="flex-1 min-h-10 rounded-xl bg-primary text-on-primary text-[13px] font-semibold cursor-pointer">
                Abrir o Caderno
              </button>
            )}
            <button
              onClick={() => {
                actions.didFiveMinutes(plan.kind);
                setDone(true);
              }}
              className="flex-1 min-h-10 rounded-xl border border-primary text-primary text-[13px] font-semibold cursor-pointer"
            >
              Fiz!
            </button>
          </div>
        </>
      )}
    </section>
  );
};
