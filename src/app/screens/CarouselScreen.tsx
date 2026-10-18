import React, { useState } from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const CarouselScreen: React.FC = () => {
  const { actions } = useApp();
  const [carouselSlide, setCarouselSlide] = useState(0);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <button 
              key={i} 
              onClick={() => {
                soundEffects.playSoftTap();
                setCarouselSlide(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${carouselSlide === i ? 'w-6 bg-primary' : 'w-2 bg-line'}`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.startAnamnese();
            actions.go('value_signal');
          }}
          className="text-sm text-muted hover:text-ink transition-colors cursor-pointer"
        >
          Pular
        </button>
      </div>

      {/* Conteúdo do Slide com Transição Suave */}
      <div key={`slide-${carouselSlide}`} className="flex-1 flex flex-col items-center justify-center text-center px-2 animate-slide-in-right">
        {carouselSlide === 0 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105">
              🧭
            </div>
            <h3 className="text-xl font-bold font-display text-ink">
              Você responde, a gente calcula.
            </h3>
            <p className="text-sm text-muted leading-relaxed max-w-[260px] mx-auto">
              São 7 blocos curtos de perguntas em formato de cards táteis com espaço para reflexão pessoal.
            </p>
          </div>
        )}

        {carouselSlide === 1 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 text-gold flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105">
              🎯
            </div>
            <h3 className="text-xl font-bold font-display text-ink">
              Seu diagnóstico personalizado.
            </h3>
            <p className="text-sm text-muted leading-relaxed max-w-[260px] mx-auto">
              Descubra seu nicho, produto ideal, público, canal e prazo — tudo com justificativa clara para sua realidade.
            </p>
          </div>
        )}

        {carouselSlide === 2 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#7A5AF8]/20 text-[#7A5AF8] flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105">
              ✅
            </div>
            <h3 className="text-xl font-bold font-display text-ink">
              Um roteiro pra seguir sem travar.
            </h3>
            <p className="text-sm text-muted leading-relaxed max-w-[260px] mx-auto">
              Capítulos narrativos de transformação com momentos de compromisso, micro-áudios e coach de IA contextual.
            </p>
          </div>
        )}
      </div>

      <div className="pb-4">
        {carouselSlide < 2 ? (
          <button
            onClick={() => {
              soundEffects.playTransition();
              setCarouselSlide(prev => prev + 1);
            }}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Avançar
          </button>
        ) : (
          <button
            onClick={() => {
              soundEffects.playTransition();
              actions.startAnamnese();
              actions.go('value_signal');
            }}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Iniciar Anamnese</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
