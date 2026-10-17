import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const FutureLetterScreen: React.FC = () => {
  const { userName, personalAnchor, diagnosis, actions } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none animate-letter-unroll bg-gradient-to-b from-[#FDFCF9] to-[#F5EFE6] overflow-y-auto">
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#1F6F5C] text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compromisso Assinado</span>
          </div>
          <span className="text-[10px] text-[#5B615D] font-mono">
            Daqui a 90 dias
          </span>
        </div>

        {/* Pergaminho da Carta */}
        <div className="p-4.5 rounded-2xl bg-white border border-amber-300/80 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
            <span className="text-xs font-serif italic text-amber-900 font-semibold">
              De: Seu Eu Futuro
            </span>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Selo de Prumo
            </span>
          </div>

          <h3 className="text-base font-serif font-bold text-[#1A1D1B] leading-tight mb-2">
            Querida {userName},
          </h3>

          <div className="text-xs text-[#2D3748] font-serif leading-relaxed space-y-2">
            <p>
              Escrevo esta carta no momento exato em que nosso plano se cumpriu. Lembra de quando você segurou aquele botão e assumiu o seu prumo?
            </p>
            <p className="italic bg-amber-50/90 p-2.5 rounded-lg border-l-2 border-[#1F6F5C] text-[#1F6F5C]">
              "{personalAnchor}"
            </p>
            <p>
              Você estava insegura sobre por onde começar, mas decidiu construir <strong>{diagnosis.product}</strong> para o nicho de <strong>{diagnosis.niche}</strong>.
            </p>
            <p>
              Hoje já validamos com pessoas reais, fizemos nosso primeiro retorno e aquela sensação de paralisia ficou para trás. Agora entre no Capítulo 1. Um passo de cada vez.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-[#1F6F5C]" />
              <span>Pacto Selado</span>
            </div>
            <span className="font-serif italic text-[#5B615D]">Com carinho, Você.</span>
          </div>
        </div>
      </div>

      {/* Botão de Avanço para a Jornada */}
      <div className="pt-3 border-t border-[#E6E8E6]">
        <button
          onClick={() => {
            soundEffects.playCompleteTask();
            actions.completeOnboarding();
            actions.goTab('home');
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
          }}
          className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Entrar na Jornada (Capítulo 1)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
