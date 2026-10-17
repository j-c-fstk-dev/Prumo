import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { CompassMark } from '../../components/brand/CompassMark';
import { calculateDiagnosis } from '../../domain/diagnosis';
import { useApp } from '../state/AppStore';

export const CalculatingScreen: React.FC = () => {
  const { answers, personalAnchor, actions } = useApp();
  const [calcStep, setCalcStep] = useState(0);
  // Calcula uma vez ao entrar; as etapas abaixo citam as respostas reais
  const [result] = useState(() => calculateDiagnosis(answers, personalAnchor));
  const steps = result.calcSteps;
  useEffect(() => actions.saveDiagnosis(result), []);

  // Etapas do cálculo com storytelling (docs/pesquisa/04: "labor illusion")
  useEffect(() => {
    soundEffects.playTransition();
    const timers = [
      setTimeout(() => { setCalcStep(1); soundEffects.playSoftTap(); }, 1000),
      setTimeout(() => { setCalcStep(2); soundEffects.playSoftTap(); }, 2200),
      setTimeout(() => { setCalcStep(3); soundEffects.playSoftTap(); }, 3400),
      setTimeout(() => {
        setCalcStep(4);
        soundEffects.playCompleteTask();
        timers.push(setTimeout(() => actions.go('result'), 1200));
      }, 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      <div className="w-28 h-28 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C] mb-6">
        <CompassMark size={92} mode={calcStep >= 4 ? 'settle' : 'seek'} settleMs={900} />
      </div>

      <h2 className="text-2xl font-bold font-display text-[#1A1D1B] mb-2">
        Montando seu prumo...
      </h2>
      <p className="text-xs text-[#5B615D] mb-8">
        Cruzando habilidades, tempo e perfil para encontrar o modelo certo.
      </p>

      {/* Checklist dinâmico com storytelling */}
      <div className="w-full max-w-xs space-y-3 text-left">
        {steps.map((label, idx) => ({ label, done: calcStep >= idx + 1 })).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs">
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
            )}
            <span className={item.done ? 'text-[#1A1D1B] font-medium' : 'text-[#5B615D]'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
