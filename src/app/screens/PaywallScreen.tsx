import React from 'react';
import {
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const PaywallScreen: React.FC = () => {
  const { actions } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none bg-white animate-slide-up">
      <div>
        <button
          onClick={() => {
            soundEffects.playBack();
            actions.go('home');
          }}
          className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#E3F2ED] text-[#1F6F5C] flex items-center justify-center text-xl mb-3">
          🧭
        </div>

        <h2 className="text-xl font-bold font-display text-[#1A1D1B]">
          Desbloqueie o roteiro completo
        </h2>
        <p className="text-xs text-[#5B615D] mt-1 mb-5">
          Tudo o que você precisa para ir da validação até a primeira venda.
        </p>

        <div className="space-y-2.5 text-xs text-[#1A1D1B] mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
            <span>Todas as fases (Fundação, Marketing e Lançamento)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
            <span>Coach de IA ilimitado para destravar em tempo real</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
            <span>Relatório semanal de progresso e ajustes de rota</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
            <span>Exportar tarefas para Notion e PDF</span>
          </div>
        </div>

        {/* Planos */}
        <div className="space-y-2.5">
          <div 
            onClick={() => soundEffects.playSelectOption()}
            className="p-3.5 rounded-xl border-2 border-[#1F6F5C] bg-[#E3F2ED]/50 flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="text-xs text-[#1A1D1B]">Anual</strong>
                <span className="text-[10px] bg-[#F2A93B] text-[#1A1D1B] font-bold px-1.5 py-0.2 rounded">Economize 36%</span>
              </div>
              <span className="text-[11px] text-[#5B615D]">R$ 299/ano (apenas R$ 24,90/mês)</span>
            </div>
            <span className="text-xs font-bold text-[#1F6F5C]">Melhor escolha</span>
          </div>

          <div 
            onClick={() => soundEffects.playSelectOption()}
            className="p-3.5 rounded-xl border border-[#E6E8E6] bg-white flex items-center justify-between cursor-pointer hover:bg-neutral-50"
          >
            <div>
              <strong className="text-xs text-[#1A1D1B] block">Mensal</strong>
              <span className="text-[11px] text-[#5B615D]">R$ 39/mês</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <button
          onClick={() => {
            soundEffects.playCompleteTask();
            confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
            actions.go('home');
          }}
          className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Assinar Agora (Desbloquear)
        </button>
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.go('home');
          }}
          className="w-full py-2 text-xs text-[#5B615D] hover:text-[#1A1D1B] text-center cursor-pointer"
        >
          Continuar grátis
        </button>
      </div>
    </div>
  );
};
