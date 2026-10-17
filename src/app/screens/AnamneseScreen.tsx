import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { ANAMNESE_SECTIONS } from '../../data/prumoData';
import { useApp } from '../state/AppStore';

export const AnamneseScreen: React.FC = () => {
  const { answers, reflections, sectionIndex, questionIndex, questionDirection, actions } = useApp();
  const currentSection = ANAMNESE_SECTIONS[sectionIndex];
  const currentQuestion = currentSection?.questions[questionIndex];
  const [showReflectionInput, setShowReflectionInput] = useState(false);
  // Cada pergunta começa com o campo de reflexão recolhido
  useEffect(() => setShowReflectionInput(false), [sectionIndex, questionIndex]);
  if (!currentQuestion) return null;

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none relative overflow-hidden">
      <div 
        key={`${sectionIndex}-${questionIndex}`}
        className={`flex-1 flex flex-col justify-between ${
          questionDirection === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}
      >
        {/* Header com Progresso da Anamnese */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={actions.prevQuestion}
              className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] transition-transform active:scale-90"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F6F5C]">
              <span className="px-2 py-0.5 rounded bg-[#E3F2ED] transition-all duration-300">
                {currentSection.id}/{ANAMNESE_SECTIONS.length} · {currentSection.title}
              </span>
            </div>
          </div>

          {/* Barra Fina de Progresso com transição lenta e serena */}
          <div className="w-full bg-[#E6E8E6] h-1.5 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-[#1F6F5C] h-full transition-all duration-700 ease-out"
              style={{ width: `${((sectionIndex * 2 + questionIndex + 1) / (ANAMNESE_SECTIONS.length * 2)) * 100}%` }}
            />
          </div>


          {/* Pergunta */}
          <div className="mb-3">
            <h2 className="text-lg font-bold font-display text-[#1A1D1B] leading-snug">
              {currentQuestion.question}
            </h2>
            <p className="text-xs text-[#5B615D] mt-0.5">
              {currentQuestion.subtext}
            </p>
          </div>

          {/* Lista de Opções Táteis */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {currentQuestion.options.map(opt => {
              const selected = (answers[currentQuestion.id] || []).includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => actions.selectOption(
                    currentQuestion.id, 
                    opt.id, 
                    currentQuestion.type === 'multiple',
                    currentQuestion.maxChoices
                  )}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all duration-200 flex items-center justify-between transform active:scale-[0.98] ${
                    selected
                      ? 'bg-[#E3F2ED] border-[#1F6F5C] text-[#1F6F5C] font-semibold shadow-xs ring-1 ring-[#1F6F5C]/30'
                      : 'bg-white border-[#E6E8E6] text-[#1A1D1B] hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {opt.icon && <span className="text-base">{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                  {selected && <CheckCircle2 className="w-4 h-4 text-[#1F6F5C] shrink-0 animate-scale-in" />}
                </div>
              );
            })}
          </div>

          {/* Campo de reflexão aberta com as próprias palavras */}
          {currentQuestion.reflectionPrompt && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs transition-all duration-200">
              <button
                type="button"
                onClick={() => setShowReflectionInput(!showReflectionInput)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-amber-900 text-left cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>✍️</span>
                  <span>Detalhar com suas próprias palavras</span>
                </span>
                <span className="text-[10px] text-amber-700 underline font-medium">
                  {showReflectionInput ? 'Ocultar' : 'Escrever'}
                </span>
              </button>

              {showReflectionInput && (
                <div className="mt-2 space-y-1.5 animate-fadeIn">
                  <p className="text-[11px] text-[#5B615D] leading-tight">
                    {currentQuestion.reflectionPrompt}
                  </p>
                  <textarea
                    rows={2}
                    value={reflections[currentQuestion.id] || ''}
                    onChange={(e) => actions.setReflection(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.reflectionPlaceholder}
                    className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-white text-[#1A1D1B] placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1F6F5C] resize-none transition-shadow"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botão de Avanço */}
        <div className="pt-3 pb-2 border-t border-[#E6E8E6]">
          <button
            disabled={!(answers[currentQuestion.id] && answers[currentQuestion.id].length > 0)}
            onClick={actions.nextQuestion}
            className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
