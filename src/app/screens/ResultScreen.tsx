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

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2ED] text-[#1F6F5C] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Seu perfil está pronto
        </div>

        <h2 className="text-2xl font-bold font-display text-[#1A1D1B] leading-tight mb-4">
          {userName}, este é o seu prumo digital.
        </h2>

        {/* Card de Destaque: Nicho */}
        <div className="p-4 rounded-2xl bg-white border border-[#1F6F5C]/30 shadow-sm mb-3">
          <span className="text-[11px] font-bold text-[#1F6F5C] uppercase tracking-wider block mb-1">
            🎯 Seu Nicho Recomendado
          </span>
          <h3 className="text-base font-bold text-[#1A1D1B]">
            {diagnosis.niche}
          </h3>
          <p className="text-xs text-[#5B615D] mt-1">
            {diagnosis.nicheDescription}
          </p>
        </div>

        {/* Grid dos Cards Secundários */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
            <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">📦 Produto Ideal</span>
            <strong className="text-xs text-[#1A1D1B] block">{diagnosis.product}</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
            <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">👥 Público-alvo</span>
            <strong className="text-xs text-[#1A1D1B] block">{diagnosis.audience}</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
            <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">📣 Canal Inicial</span>
            <strong className="text-xs text-[#1A1D1B] block">{diagnosis.channel}</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
            <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">⏱️ Prazo Estimado</span>
            <strong className="text-xs text-[#1A1D1B] block">{diagnosis.timeline}</strong>
          </div>
        </div>

        {/* Justificativa Expansível */}
        <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
          <button
            onClick={() => setShowJustification(!showJustification)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#1F6F5C]"
          >
            <span>Por que essa combinação para você?</span>
            {showJustification ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showJustification && (
            <p className="text-xs text-[#5B615D] mt-2 leading-relaxed pt-2 border-t border-[#E6E8E6]">
              {diagnosis.justification}
            </p>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('commitment');
          }}
          className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-200" />
          <span>Assumir meu Prumo (Ritual)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            soundEffects.playBack();
            actions.go('value_signal');
            actions.startAnamnese();
          }}
          className="w-full py-2 text-xs text-[#5B615D] hover:text-[#1A1D1B] text-center cursor-pointer"
        >
          ⟳ Refazer diagnóstico
        </button>
      </div>
    </div>
  );
};
