import React from 'react';
import { soundEffects } from '../../utils/soundEffects';
import { CompassMark } from '../../components/brand/CompassMark';
import { useApp } from '../state/AppStore';

export const WelcomeScreen: React.FC = () => {
  const { actions } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center select-none animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Logo da Bússola */}
        <div className="w-24 h-24 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C] shadow-sm">
          <CompassMark size={76} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display text-[#1A1D1B] tracking-tight">
            Descubra seu caminho no digital.
          </h1>
          <p className="text-sm text-[#5B615D] max-w-[260px] mx-auto leading-relaxed">
            Em 15 minutos, você sabe o que criar, para quem e como começar. Sem paralisia.
          </p>
        </div>
      </div>

      <div className="space-y-3 pb-4">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('register');
          }}
          className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Começar diagnóstico
        </button>
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.go('home');
            actions.goTab('home');
          }}
          className="text-xs text-[#5B615D] hover:text-[#1A1D1B] font-medium cursor-pointer"
        >
          Já tenho conta · Entrar
        </button>
      </div>
    </div>
  );
};
