import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects';
import { PaceChooser } from '../components/PaceChooser';
import { useApp } from '../state/AppStore';
import { QuoteByTheme } from '../components/QuoteCard';
import { Reveal } from '../components/Reveal';

export const CommitmentScreen: React.FC = () => {
  const { personalAnchor, diagnosis, actions } = useApp();
  // Ritual de compromisso (segurar para selar)
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  // Toque rápido demais: mostra como fazer, em vez de não acontecer nada
  const [tapHint, setTapHint] = useState(false);
  const holdStartRef = useRef(0);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  }, []);

  const handleStartHold = () => {
    setIsHolding(true);
    setTapHint(false);
    soundEffects.playHoldPulse(5);
    const startTime = Date.now();
    holdStartRef.current = startTime;
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
      if (isHolding && Date.now() - holdStartRef.current < 1500) setTapHint(true);
      setIsHolding(false);
      setHoldProgress(0);
      soundEffects.playSoftTap();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none overflow-y-auto animate-scale-in bg-gradient-to-b from-canvas via-gold-soft to-gold-soft text-center">
      <div className="pt-2">
        <Reveal i={0}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft text-gold-ink text-[13px] font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-text" />
          <span>Seu compromisso</span>
        </div>

        <div className="w-16 h-16 rounded-full bg-surface border border-gold-line shadow-sm flex items-center justify-center mx-auto mb-3 text-primary">
          <Compass className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-2xl font-bold font-serif text-ink leading-tight mb-2">
          Assumir seu prumo
        </h2>

        <p className="text-sm text-muted leading-relaxed max-w-[290px] mx-auto mb-1">
          É um combinado com você: seguir esse caminho pelos próximos <strong className="text-ink">90 dias</strong> (3 meses).
        </p>
        <p className="text-[13px] text-muted leading-relaxed max-w-[290px] mx-auto mb-4">
          Por que 90 dias? É tempo pra testar sua ideia algumas vezes, ajustar o que não funcionar e ver os primeiros
          resultados. É uma escolha do Prumo, não uma regra científica.
        </p>
        </Reveal>

        {/* Card de Âncora */}
        <Reveal i={1}>
        <div className="p-3.5 rounded-xl bg-surface/90 border border-gold-line text-left shadow-2xs mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-text block mb-1">
            Sua âncora
          </span>
          <p className="text-sm text-ink font-serif italic">
            "{personalAnchor}"
          </p>
          <p className="text-xs text-muted mt-1">A frase que vai te lembrar por que você começou.</p>
        </div>
        </Reveal>

        {/* Plano B combinado antes de começar (WOOP: obstáculo previsto + "se… então…") */}
        <Reveal i={2}>
        <div className="p-3.5 rounded-xl bg-surface/90 border border-primary/25 text-left shadow-2xs mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
            Se travar, eu…
          </span>
          <p className="text-sm text-ink leading-relaxed">
            Quando {diagnosis.obstacle}, eu {diagnosis.planB}
          </p>
          <p className="text-xs text-muted mt-1.5 leading-snug">
            Não é plano pra desistir. É o que você já combina agora pra fazer quando a dificuldade aparecer, e isso ajuda
            muito a não parar no meio do caminho.
          </p>
        </div>
        </Reveal>

        {/* Ritmo (etapa 53): o tamanho da semana cabe na vida da pessoa */}
        <Reveal i={3}>
        <div className="p-3.5 rounded-xl bg-surface/90 border border-line text-left shadow-2xs mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1.5">Seu ritmo</span>
          <PaceChooser />
          <p className="text-xs text-muted mt-1.5 leading-snug">As rotinas se ajustam sozinhas. Dá pra trocar quando quiser, em Você.</p>
        </div>
        </Reveal>

        <Reveal i={3}>
          <QuoteByTheme tema="obstaculo" />
        </Reveal>
      </div>

      {/* Botão Tátil de Pressão Contínua (Hold to Sign) */}
      <Reveal i={4} className="py-4 flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-3">
          {/* Círculo de Progresso SVG */}
          <svg className="w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--c-line)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--c-primary)"
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
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Segure aqui por 3 segundos para assumir seu prumo"
            className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all select-none cursor-pointer ${
              isHolding 
                ? 'bg-primary text-on-primary scale-95 shadow-inner' 
                : 'bg-primary hover:bg-primary-hover text-on-primary shadow-lg active:scale-95 pulse-subtle'
            }`}
          >
            <Compass className={`w-6 h-6 mb-1 ${isHolding ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            <span className="text-xs font-bold uppercase tracking-tight text-center leading-tight px-1">
              {holdProgress > 0 ? `${holdProgress}%` : 'Segure aqui'}
            </span>
          </button>
        </div>

        <p className="text-[13px] text-muted font-medium">
          {isHolding ? (
            <span className="text-primary font-semibold animate-pulse">
              Firmando seu prumo...
            </span>
          ) : tapHint ? (
            <span className="text-primary font-semibold">Quase! Mantenha o dedo apertado até o círculo fechar.</span>
          ) : (
            <span>Aperte e <strong className="text-ink">segure o dedo</strong> no botão por 3 segundos</span>
          )}
        </p>
      </Reveal>

      <div className="pt-2">
        <button
          onClick={() => {
            soundEffects.playBack();
            actions.go('result');
          }}
          className="w-full py-2 text-sm text-muted hover:text-ink cursor-pointer"
        >
          Voltar ao diagnóstico
        </button>
      </div>
    </div>
  );
};
