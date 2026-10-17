import React from 'react';
import {
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const ProfileTab: React.FC = () => {
  const { userName, isSoundMuted, actions } = useApp();

  return (
    <div key="tab-profile" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1F6F5C] text-white font-bold flex items-center justify-center text-lg">
            {userName[0]}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1A1D1B]">{userName}</h3>
            <span className="text-xs text-[#5B615D]">Plano Gratuito</span>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F6F5C] to-[#164e41] text-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2A93B] block mb-1">
            Prumo Premium
          </span>
          <h4 className="text-sm font-bold">Desbloqueie o Roteiro Completo</h4>
          <p className="text-xs text-white/80 mt-1 mb-3">
            Acesso a todas as fases de Marketing, Lançamento e Coach de IA ilimitado.
          </p>
          <button
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('paywall');
            }}
            className="w-full py-2 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Conhecer Planos
          </button>
        </div>

        {/* Opções de Conta */}
        <div className="space-y-2 text-xs">
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('result');
            }}
            className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
          >
            <span>Ver Diagnóstico Completo</span>
            <ChevronRight className="w-4 h-4 text-[#5B615D]" />
          </div>
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('anamnese');
              actions.startAnamnese();
            }}
            className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
          >
            <span>Refazer Anamnese (1x no Free)</span>
            <ChevronRight className="w-4 h-4 text-[#5B615D]" />
          </div>
          <div 
            onClick={actions.toggleSound}
            className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
          >
            <span>Sons do app: {isSoundMuted ? 'Desligados' : 'Ligados'}</span>
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-[#5B615D]" /> : <Volume2 className="w-4 h-4 text-[#1F6F5C]" />}
          </div>
          <a
            href="https://github.com/j-c-fstk-dev/Prumo"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
          >
            <span>Código-fonte (AGPL-3.0)</span>
            <ExternalLink className="w-4 h-4 text-[#5B615D]" />
          </a>
        </div>
      </div>
    </div>
  );
};
