import React from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import { ANAMNESE_SECTIONS } from '../../data/prumoData';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const ValueSignalScreen: React.FC = () => {
  const { sectionIndex, actions } = useApp();
  const currentSection = ANAMNESE_SECTIONS[sectionIndex];
  if (!currentSection) return null;

  return (
    <div 
      key={`value-signal-${currentSection.id}`}
      className="flex-1 flex flex-col justify-between p-6 select-none animate-scale-in bg-gradient-to-b from-[#FDFCF9] to-[#F5F2EB]"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E3F2ED] text-[#1F6F5C] flex items-center justify-center text-3xl mb-5 shadow-xs transition-transform hover:scale-105">
          {currentSection.valueSignal.icon}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-1 rounded-full mb-3 shadow-2xs">
          Etapa {currentSection.id} de {ANAMNESE_SECTIONS.length} · {currentSection.title}
        </span>

        <h2 className="text-xl font-bold font-display text-[#1A1D1B] leading-snug mb-3">
          {currentSection.valueSignal.title}
        </h2>

        <p className="text-xs text-[#5B615D] leading-relaxed max-w-[280px]">
          {currentSection.valueSignal.subtitle}
        </p>
      </div>

      <div className="pt-4 border-t border-[#E6E8E6]">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('anamnese');
          }}
          className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Entendido, vamos lá</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
