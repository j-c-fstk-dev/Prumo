import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { Reveal } from '../components/Reveal';

export const ResultScreen: React.FC = () => {
  const { userName, diagnosis, actions } = useApp();
  const [showJustification, setShowJustification] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
      <div>
        <Reveal i={0}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Pronto!
        </div>

        <h2 className="text-2xl font-bold font-display text-ink leading-tight mb-4">
          {userName}, este é o seu prumo: um caminho pra você testar.
        </h2>
        </Reveal>

        {/* Card de Destaque: Nicho */}
        <Reveal i={1}>
        <div className="p-4 rounded-2xl bg-surface border border-primary/30 shadow-sm mb-3">
          <span className="text-[13px] font-bold text-primary uppercase tracking-wider block mb-1">
            🎯 Seu caminho
          </span>
          <h3 className="text-lg font-bold text-ink">
            {diagnosis.niche}
          </h3>
          <p className="text-sm text-muted mt-1">
            {diagnosis.nicheDescription}
          </p>
        </div>
        </Reveal>

        {/* Grid dos Cards Secundários */}
        <Reveal i={2}>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">📦 O que oferecer</span>
            <strong className="text-sm text-ink block">{diagnosis.product}</strong>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">👥 Pra quem</span>
            <strong className="text-sm text-ink block">{diagnosis.audience}</strong>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">📣 Onde achar essas pessoas</span>
            <strong className="text-sm text-ink block">{diagnosis.channel}</strong>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">⏱️ Primeiro resultado</span>
            <strong className="text-sm text-ink block">{diagnosis.timeline}</strong>
          </div>
        </div>
        </Reveal>

        {/* Hipótese a testar: o diagnóstico não é veredito (docs/pesquisa/01) */}
        <Reveal i={3}>
        <div className="p-3.5 rounded-xl bg-surface border border-line mb-3 space-y-1.5">
          <span className="text-[13px] font-bold text-primary uppercase tracking-wider block">
            🧪 Sua aposta
          </span>
          <p className="text-[13px] text-muted leading-snug">
            Ninguém acerta de primeira. Por isso, antes de investir muito tempo, você testa se a ideia funciona.
          </p>
          <p className="text-sm text-ink leading-relaxed">{diagnosis.hypothesis}</p>
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-ink">Como testar:</strong> {diagnosis.test}
          </p>
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-ink">Deu certo se:</strong> {diagnosis.successSignal}
          </p>
        </div>
        </Reveal>

        <Reveal i={4}>
        {diagnosis.warnings.map((w) => (
          <div key={w} className="p-3 rounded-xl bg-gold-soft border border-gold-line text-sm text-gold-ink mb-3 leading-relaxed">
            {w}
          </div>
        ))}

        {/* Justificativa Expansível */}
        <div className="p-3.5 rounded-xl bg-surface-2 border border-line mb-4">
          <button
            onClick={() => setShowJustification(!showJustification)}
            className="w-full flex items-center justify-between text-sm font-semibold text-primary"
          >
            <span>Por que esse caminho?</span>
            {showJustification ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showJustification && (
            <p className="text-sm text-muted mt-2 leading-relaxed pt-2 border-t border-line">
              {diagnosis.justification}
            </p>
          )}
        </div>

        {/* Alternativas recolhidas: 1 recomendação em destaque evita sobrecarga de escolha */}
        {diagnosis.alternatives.length > 0 && (
          <div className="p-3.5 rounded-xl bg-surface-2 border border-line mb-4">
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="w-full flex items-center justify-between text-sm font-semibold text-primary"
            >
              <span>Ver {diagnosis.alternatives.length} alternativas</span>
              {showAlternatives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAlternatives && (
              <div className="mt-2 pt-2 border-t border-line space-y-2">
                {diagnosis.alternatives.map((alt) => (
                  <div key={`${alt.nicheId}-${alt.productId}`} className="p-2.5 rounded-lg bg-surface border border-line">
                    <strong className="text-sm text-ink block">{alt.niche}</strong>
                    <span className="text-[13px] text-muted block mt-0.5">{alt.product}</span>
                    <button
                      onClick={() => {
                        soundEffects.playSelectOption();
                        actions.chooseAlternative(alt);
                        setShowAlternatives(false);
                      }}
                      className="mt-1.5 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Explorar esta alternativa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </Reveal>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('commitment');
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-on-primary/70" />
          <span>Assumir meu prumo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            soundEffects.playBack();
            actions.go('value_signal');
            actions.startAnamnese();
          }}
          className="w-full py-2 text-sm text-muted hover:text-ink text-center cursor-pointer"
        >
          ⟳ Refazer as perguntas
        </button>
      </div>
    </div>
  );
};
