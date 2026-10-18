import React from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import { ANAMNESE_SECTIONS } from '../../data/prumoData';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { QuoteByTheme } from '../components/QuoteCard';
import type { TemaCitacao } from '../../data/citacoes';

/** Citação de abertura de alguns blocos da anamnese */
const QUOTE_BY_SECTION: Record<number, TemaCitacao> = { 1: 'comecar', 3: 'recursos', 5: 'medo', 7: 'habito' };

export const ValueSignalScreen: React.FC = () => {
  const { sectionIndex, actions } = useApp();
  const currentSection = ANAMNESE_SECTIONS[sectionIndex];
  if (!currentSection) return null;

  return (
    <div 
      key={`value-signal-${currentSection.id}`}
      className="flex-1 flex flex-col justify-between p-6 select-none animate-scale-in bg-gradient-to-b from-canvas to-gold-soft"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center text-3xl mb-5 shadow-xs transition-transform hover:scale-105">
          {currentSection.valueSignal.icon}
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-soft px-2.5 py-1 rounded-full mb-3 shadow-2xs">
          Etapa {currentSection.id} de {ANAMNESE_SECTIONS.length} · {currentSection.title}
        </span>

        <h2 className="text-xl font-bold font-display text-ink leading-snug mb-3">
          {currentSection.valueSignal.title}
        </h2>

        <p className="text-sm text-muted leading-relaxed max-w-[280px]">
          {currentSection.valueSignal.subtitle}
        </p>

        {QUOTE_BY_SECTION[currentSection.id] && (
          <div className="mt-5 w-full max-w-[300px] text-left">
            <QuoteByTheme tema={QUOTE_BY_SECTION[currentSection.id]} />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-line">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('anamnese');
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Entendido, vamos lá</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
