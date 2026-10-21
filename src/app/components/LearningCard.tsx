import React, { useState } from 'react';
import { funnel, testVerdict } from '../../domain/people';
import { useApp } from '../state/AppStore';
import { SwitchPath } from './SwitchPath';

const cut = (t: string, n = 140) => (t.length > n ? `${t.slice(0, n).trimEnd()}…` : t);

/**
 * O que o teste te mostrou (etapa 55), no passo "Decidir": a semana 6 não pode ter cara de fracasso.
 * Mostra o que a pessoa juntou (números do funil, as anotações das conversas, a frase antes e agora)
 * e, se for trocar, leva o Caderno junto.
 */
export const LearningCard: React.FC = () => {
  const { people, taskNotes, profileOverrides } = useApp();
  const [switching, setSwitching] = useState(false);
  const f = funnel(people);
  const verdict = testVerdict(f);
  const words = [
    ...people.filter((p) => p.stage !== 'contato' && p.note?.trim()).map((p) => p.note!.trim()),
    ...['t21', 't3'].map((id) => taskNotes[id]?.trim()).filter((t): t is string => Boolean(t)),
  ].slice(0, 3);
  const before = taskNotes.t1?.replace(/^Minha frase \(rascunho\):\s*/, '').trim();
  const now = profileOverrides.promise?.trim();

  return (
    <section aria-label="O que o teste te mostrou" className="p-4 rounded-2xl bg-gold-soft border border-gold-line space-y-3">
      <strong className="text-sm text-gold-ink block">O que o teste te mostrou</strong>
      <p className="text-sm text-ink">
        {f.talked} {f.talked === 1 ? 'conversa' : 'conversas'} sobre o problema · {f.presented} {f.presented === 1 ? 'apresentação' : 'apresentações'} ·{' '}
        {f.committed} {f.committed === 1 ? 'compromisso' : 'compromissos'}
        {f.committed > 0 && ` (${f.money} em dinheiro)`}. Isso é aprendizado de verdade, qualquer que seja a decisão.
      </p>
      {words.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-ink block mb-1">O que você anotou das conversas</span>
          <ul className="space-y-1">
            {words.map((w, i) => (
              <li key={i} className="text-[13px] text-ink font-serif italic leading-snug">
                "{cut(w)}"
              </li>
            ))}
          </ul>
        </div>
      )}
      {(before || now) && (
        <div className="text-[13px] text-ink space-y-0.5">
          {before && before !== now && (
            <p>
              <span className="text-muted">Sua frase no começo:</span> {cut(before)}
            </p>
          )}
          {now && (
            <p>
              <span className="text-muted">Sua frase agora:</span> {cut(now)}
            </p>
          )}
        </div>
      )}
      {verdict === 'trocar' && (
        <p className="text-[13px] text-ink">
          Nenhum compromisso ainda. Antes de trocar a ideia, confira se as pessoas eram o público certo. Se eram, trocar é uma decisão boa,
          tomada com o que aconteceu de verdade.
        </p>
      )}
      {switching ? (
        <SwitchPath onCancel={() => setSwitching(false)} />
      ) : (
        <button onClick={() => setSwitching(true)} className="text-[13px] text-primary font-semibold underline underline-offset-2 cursor-pointer">
          Decidi trocar de caminho
        </button>
      )}
    </section>
  );
};
