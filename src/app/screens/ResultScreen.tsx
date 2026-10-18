import React, { useRef, useState } from 'react';
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
  const { userName, diagnosis, onboardingDone, actions } = useApp();
  const [showJustification, setShowJustification] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
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

        {/* 3 caminhos diferentes + "criar o meu" (teste com usuários, etapa 23) */}
        <div className="pt-1 mb-4">
          <h3 className="text-base font-bold text-ink">Não é bem isso? Escolha outro caminho</h3>
          <p className="text-[13px] text-muted mb-2">
            {diagnosis.nicheId === 'custom' ? 'Estas são as sugestões que combinam com as suas respostas.' : 'Também combinam com as suas respostas.'}
          </p>
          <div className="space-y-2">
            {diagnosis.alternatives.map((alt) => (
              <div key={`${alt.nicheId}-${alt.productId}`} className="p-3 rounded-xl bg-surface border border-line">
                <strong className="text-sm text-ink block">{alt.niche}</strong>
                <span className="text-[13px] text-muted block mt-0.5">{alt.product}</span>
                <button
                  onClick={() => {
                    soundEffects.playSelectOption();
                    actions.chooseAlternative(alt);
                    // Volta ao topo para mostrar o caminho escolhido
                    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-1.5 min-h-9 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Escolher este caminho
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                soundEffects.playTransition();
                actions.go('custom_path');
              }}
              className="w-full p-3 rounded-xl border-2 border-dashed border-primary/40 text-left cursor-pointer hover:border-primary transition-colors"
            >
              <strong className="text-sm text-primary block">✏️ Quero criar o meu</strong>
              <span className="text-[13px] text-muted block mt-0.5">Conte a sua ideia e a jornada se adapta a ela.</span>
            </button>
          </div>
        </div>
        </Reveal>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2 pt-2">
        {/* Quem já está na jornada só veio rever o resultado: volta pra ela, sem refazer o compromisso (etapa 41) */}
        <button
          onClick={() => {
            soundEffects.playTransition();
            if (onboardingDone) actions.goTab('home');
            else actions.go('commitment');
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          {!onboardingDone && <ShieldCheck className="w-4 h-4 text-on-primary/70" />}
          <span>{onboardingDone ? 'Voltar para a jornada' : 'Assumir meu prumo'}</span>
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
