import React from 'react';
import {
  ArrowLeft,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import type { MacroGoal } from '../state/AppStore';

export const RegisterScreen: React.FC = () => {
  const { userName, macroGoal, actions } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none animate-fadeIn">
      <div>
        <button 
          onClick={() => {
            soundEffects.playBack();
            actions.go('splash');
          }}
          className="p-1 -ml-1 text-muted hover:text-ink mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>


        <h2 className="text-2xl font-bold font-display text-ink">
          Só o essencial.
        </h2>
        <p className="text-sm text-muted mt-1 mb-6">
          Você personaliza os detalhes depois.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink block mb-1">Como devemos te chamar?</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => actions.setUserName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-3.5 py-2.5 bg-surface border border-line rounded-xl text-base focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink block mb-2">Qual seu objetivo principal hoje?</label>
            <div className="space-y-2">
              {[
                { id: 'renda_extra', label: '💰 Renda extra (R$ 500 a R$ 2.000/mês)' },
                { id: 'substituir', label: '🚀 Substituir meu salário atual' },
                { id: 'proposito', label: '🌱 Propósito e impacto no digital' }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEffects.playSelectOption();
                    actions.setMacroGoal(item.id as MacroGoal);
                  }}
                  className={`p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    macroGoal === item.id 
                      ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary/30' 
                      : 'bg-surface border-line text-muted hover:bg-surface-2'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-4">
        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.go('carousel');
          }}
          disabled={!userName.trim()}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
