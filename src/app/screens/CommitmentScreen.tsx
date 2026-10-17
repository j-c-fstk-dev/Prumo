import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const CommitmentScreen: React.FC = () => {
  const { personalAnchor, diagnosis, actions } = useApp();
  // Ritual de compromisso (segurar para selar)
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  }, []);

  const handleStartHold = () => {
    setIsHolding(true);
    soundEffects.playHoldPulse(5);
    const startTime = Date.now();
    let lastProgressBand = 0;
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / 2600) * 100));
      setHoldProgress(progress);

      const currentBand = Math.floor(progress / 18);
      if (currentBand > lastProgressBand) {
        lastProgressBand = currentBand;
        soundEffects.playHoldPulse(progress);
      }

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        soundEffects.playCommitmentSuccess();
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => actions.go('future_letter'), 500);
      }
    }, 25);
  };

  const handleCancelHold = () => {
    if (holdProgress < 100) {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setIsHolding(false);
      setHoldProgress(0);
      soundEffects.playSoftTap();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none animate-scale-in bg-gradient-to-b from-[#FDFCF9] via-[#FAF6F0] to-[#F3EDE2] text-center">
      <div className="pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D97746]" />
          <span>Pacto de Compromisso Consciente</span>
        </div>

        <div className="w-16 h-16 rounded-full bg-white border border-amber-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-[#1F6F5C]">
          <Compass className="w-8 h-8 text-[#1F6F5C]" />
        </div>

        <h2 className="text-2xl font-bold font-serif text-[#1A1D1B] leading-tight mb-2">
          Assumir seu Prumo
        </h2>

        <p className="text-xs text-[#5B615D] leading-relaxed max-w-[280px] mx-auto mb-4">
          Mudar de direção não é riscar tarefas: é um compromisso consciente com quem você escolhe se tornar daqui a 90 dias.
        </p>

        {/* Card de Âncora */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200 text-left shadow-2xs mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97746] block mb-1">
            Sua Promessa para Si Mesmo
          </span>
          <p className="text-xs text-[#1A1D1B] font-serif italic">
            "{personalAnchor}"
          </p>
        </div>

        {/* Plano B combinado antes de começar (WOOP: obstáculo previsto + "se… então…") */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-[#1F6F5C]/25 text-left shadow-2xs mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block mb-1">
            Seu plano B
          </span>
          <p className="text-xs text-[#1A1D1B] leading-relaxed">
            Se {diagnosis.obstacle}, então {diagnosis.planB}
          </p>
        </div>
      </div>

      {/* Botão Tátil de Pressão Contínua (Hold to Sign) */}
      <div className="py-4 flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-3">
          {/* Círculo de Progresso SVG */}
          <svg className="w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E6E8E6"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#1F6F5C"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="351.86"
              strokeDashoffset={351.86 - (351.86 * holdProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>

          <button
            onMouseDown={handleStartHold}
            onMouseUp={handleCancelHold}
            onMouseLeave={handleCancelHold}
            onTouchStart={handleStartHold}
            onTouchEnd={handleCancelHold}
            className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all select-none cursor-pointer ${
              isHolding 
                ? 'bg-[#1F6F5C] text-white scale-95 shadow-inner' 
                : 'bg-[#1F6F5C] hover:bg-[#2E8B73] text-white shadow-lg active:scale-95'
            }`}
          >
            <Compass className={`w-6 h-6 mb-1 ${isHolding ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight px-1">
              {holdProgress > 0 ? `${holdProgress}%` : 'Segurar'}
            </span>
          </button>
        </div>

        <p className="text-[11px] text-[#5B615D] font-medium">
          {isHolding ? (
            <span className="text-[#1F6F5C] font-semibold animate-pulse">
              Firmando seu prumo...
            </span>
          ) : (
            <span>Pressione e segure por 3 segundos para selar</span>
          )}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            soundEffects.playBack();
            actions.go('result');
          }}
          className="w-full py-2 text-xs text-[#5B615D] hover:text-[#1A1D1B] cursor-pointer"
        >
          Voltar ao diagnóstico
        </button>
      </div>
    </div>
  );
};
