import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../state/AppStore';
import { soundEffects } from '../../utils/soundEffects';

const inputClass =
  'w-full px-3 py-2 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary';

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * Uma vitória já na primeira visita (etapa 54): mais de 80% das pessoas usam um app uma vez só.
 * Em 5 minutos a pessoa sai com a frase rascunhada e os primeiros nomes no Caderno, e o passo 1 feito.
 */
export const FirstWin: React.FC = () => {
  const { diagnosis, profileOverrides, actions } = useApp();
  const audience = profileOverrides.audience || diagnosis?.audience || '';
  const [phrase, setPhrase] = useState(
    profileOverrides.promise || `Eu ajudo ${audience ? lowerFirst(audience) : '[quem]'} a [conseguir o quê], mesmo que [a maior dificuldade].`,
  );
  const [names, setNames] = useState(['', '', '']);
  const filled = names.map((n) => n.trim()).filter(Boolean);
  const ready = phrase.trim().length >= 15 && !phrase.includes('[') && filled.length > 0;

  return (
    <section aria-label="Seu primeiro passo" className="p-4 rounded-2xl bg-gold-soft border border-gold-line space-y-3">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold-ink block">Seu primeiro passo, agora · 5 minutos</span>
        <p className="text-sm text-ink mt-1 leading-snug">Duas coisas pequenas e você já sai daqui com o começo do seu caminho.</p>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-ink block mb-1">1. Rascunhe a sua frase</span>
        <textarea rows={3} value={phrase} onChange={(e) => setPhrase(e.target.value)} aria-label="Sua frase" className={`${inputClass} resize-none`} />
        <span className="text-xs text-muted block mt-1">
          Troque o que está entre [colchetes].{diagnosis?.pain && ` O problema que apareceu no seu resultado: ${lowerFirst(diagnosis.pain)}.`} É rascunho: na semana 2
          você reescreve com as palavras das pessoas.
        </span>
      </label>

      <div>
        <span className="text-sm font-semibold text-ink block mb-1">2. Três pessoas que podem ter esse problema</span>
        <div className="space-y-1.5">
          {names.map((n, i) => (
            <input
              key={i}
              value={n}
              onChange={(e) => setNames(names.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={['Ex.: a vizinha que sempre pede ajuda', 'Ex.: um colega do trabalho', 'Ex.: alguém de um grupo do tema'][i]}
              aria-label={`Pessoa ${i + 1}`}
              className={inputClass}
            />
          ))}
        </div>
        <span className="text-xs text-muted block mt-1">Só o nome, por enquanto. Ainda não precisa falar com ninguém.</span>
      </div>

      <div className="flex gap-2">
        <button
          disabled={!ready}
          onClick={() => {
            actions.completeFirstWin(phrase.trim(), filled);
            soundEffects.playCompleteTask();
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
          }}
          className="flex-1 min-h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Pronto: primeiro passo feito
        </button>
        <button onClick={actions.dismissFirstWin} className="px-3 min-h-11 text-sm text-gold-ink cursor-pointer">
          Depois
        </button>
      </div>
    </section>
  );
};
