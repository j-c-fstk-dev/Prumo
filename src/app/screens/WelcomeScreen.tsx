import React from 'react';
import { soundEffects } from '../../utils/soundEffects';
import { CompassMark } from '../../components/brand/CompassMark';
import { useApp } from '../state/AppStore';

export const WelcomeScreen: React.FC = () => {
  const { actions } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center select-none overflow-y-auto animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Logo da Bússola */}
        <div className="w-24 h-24 rounded-full bg-primary-soft flex items-center justify-center text-primary shadow-sm">
          <CompassMark size={76} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display text-ink tracking-tight">
            Ache o seu caminho no digital.
          </h1>
          <p className="text-base text-muted max-w-[260px] mx-auto leading-relaxed">
            Em uns 15 minutos você descobre o que oferecer, pra quem e por onde começar. Sem complicação.
          </p>
        </div>
      </div>

      <div className="space-y-3 pb-4">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('register');
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Começar diagnóstico
        </button>
      </div>
    </div>
  );
};
