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
          className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>


        <h2 className="text-2xl font-bold font-display text-[#1A1D1B]">
          Só o essencial.
        </h2>
        <p className="text-xs text-[#5B615D] mt-1 mb-6">
          Você personaliza os detalhes depois.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#1A1D1B] block mb-1">Como devemos te chamar?</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => actions.setUserName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6E8E6] rounded-xl text-sm focus:outline-none focus:border-[#1F6F5C]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1A1D1B] block mb-2">Qual seu objetivo principal hoje?</label>
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
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    macroGoal === item.id 
                      ? 'bg-[#E3F2ED] border-[#1F6F5C] text-[#1F6F5C] font-semibold ring-1 ring-[#1F6F5C]/30' 
                      : 'bg-white border-[#E6E8E6] text-[#5B615D] hover:bg-neutral-50'
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
          className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
