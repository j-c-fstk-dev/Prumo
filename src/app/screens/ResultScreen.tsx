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

export const ResultScreen: React.FC = () => {
  const { userName, diagnosis, actions } = useApp();
  const [showJustification, setShowJustification] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Seu perfil está pronto
        </div>

        <h2 className="text-2xl font-bold font-display text-ink leading-tight mb-4">
          {userName}, este é o seu prumo digital.
        </h2>

        {/* Card de Destaque: Nicho */}
        <div className="p-4 rounded-2xl bg-surface border border-primary/30 shadow-sm mb-3">
          <span className="text-[13px] font-bold text-primary uppercase tracking-wider block mb-1">
            🎯 Seu Nicho Recomendado
          </span>
          <h3 className="text-lg font-bold text-ink">
            {diagnosis.niche}
          </h3>
          <p className="text-sm text-muted mt-1">
            {diagnosis.nicheDescription}
          </p>
        </div>

        {/* Grid dos Cards Secundários */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">📦 Produto Ideal</span>
            <strong className="text-sm text-ink block">{diagnosis.product}</strong>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">👥 Público-alvo</span>
            <strong className="text-sm text-ink block">{diagnosis.audience}</strong>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">📣 Canal Inicial</span>
            <strong className="text-sm text-ink block">{diagnosis.channel}</strong>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-muted block mb-0.5">⏱️ Prazo Estimado</span>
            <strong className="text-sm text-ink block">{diagnosis.timeline}</strong>
          </div>
        </div>

        {/* Hipótese a testar: o diagnóstico não é veredito (docs/pesquisa/01) */}
        <div className="p-3.5 rounded-xl bg-surface border border-line mb-3 space-y-1.5">
          <span className="text-[13px] font-bold text-primary uppercase tracking-wider block">
            🧪 Sua hipótese para testar
          </span>
          <p className="text-sm text-ink leading-relaxed">{diagnosis.hypothesis}</p>
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-ink">Teste:</strong> {diagnosis.test}
          </p>
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-ink">Sinal de que funcionou:</strong> {diagnosis.successSignal}
          </p>
        </div>

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
            <span>Por que essa combinação para você?</span>
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
          <span>Assumir meu Prumo (Ritual)</span>
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
          ⟳ Refazer diagnóstico
        </button>
      </div>
    </div>
  );
};
