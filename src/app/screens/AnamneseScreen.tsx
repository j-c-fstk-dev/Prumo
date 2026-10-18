import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { ANAMNESE_SECTIONS } from '../../data/prumoData';
import { suggestOptions } from '../../domain/textMatch';
import { useApp } from '../state/AppStore';
import { ENCORAJAMENTO_ANAMNESE } from '../../data/encorajamento';

/** Sorteado a cada vez que o app abre: as frases mudam de uma vez para outra */
const SESSION_SEED = Math.floor(Math.random() * ENCORAJAMENTO_ANAMNESE.length);

export const AnamneseScreen: React.FC = () => {
  const { answers, scoredAnswers, reflections, textOptions, sectionIndex, questionIndex, questionDirection, actions } = useApp();
  const currentSection = ANAMNESE_SECTIONS[sectionIndex];
  const currentQuestion = currentSection?.questions[questionIndex];
  const [showReflectionInput, setShowReflectionInput] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  // Cada pergunta começa com o campo recolhido, a não ser que a pessoa já tenha escrito algo
  useEffect(() => {
    setShowReflectionInput(false);
    setJustSaved(false);
  }, [sectionIndex, questionIndex]);
  if (!currentQuestion) return null;

  const qid = currentQuestion.id;
  const optionLabel = (id: string) => currentQuestion.options.find((o) => o.id === id)?.label ?? id;
  const confirmed = textOptions.confirmed[qid] ?? [];
  const savedText = (reflections[qid] ?? '').trim();
  const isSingle = currentQuestion.type === 'single';
  // Pergunta de escolha única: confirmar a sugestão vira a própria resposta
  const acceptSuggestion = (id: string) =>
    isSingle ? actions.selectOption(qid, id, false) : actions.confirmTextOption(qid, id);
  const saveReflection = () => {
    setShowReflectionInput(false);
    setJustSaved(true);
  };
  // Sugestões locais a partir do texto: só contam no diagnóstico se a pessoa confirmar
  const suggestions = suggestOptions(qid, reflections[qid] ?? '', [
    ...(answers[qid] ?? []),
    ...confirmed,
    ...(textOptions.dismissed[qid] ?? []),
  ]);

  const totalQuestions = ANAMNESE_SECTIONS.reduce((n, sec) => n + sec.questions.length, 0);
  const answeredBefore = ANAMNESE_SECTIONS.slice(0, sectionIndex).reduce((n, sec) => n + sec.questions.length, 0);
  const progress = ((answeredBefore + questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none relative overflow-x-hidden overflow-y-auto">
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
              className="-ml-3 min-w-11 min-h-11 inline-flex items-center justify-center text-muted hover:text-ink transition-transform active:scale-90"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <span className="px-2 py-0.5 rounded bg-primary-soft transition-all duration-300">
                {currentSection.id}/{ANAMNESE_SECTIONS.length} · {currentSection.title}
              </span>
            </div>
          </div>

          {/* Barra Fina de Progresso com transição lenta e serena */}
          <div className="w-full bg-line h-1.5 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-primary h-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>


          {/* Pergunta */}
          <div className="mb-3">
            <h2 className="text-lg font-bold font-display text-ink leading-snug">
              {currentQuestion.question}
            </h2>
            <p className="text-sm text-muted mt-0.5">
              {currentQuestion.subtext}
            </p>
            <p className="text-[13px] text-primary font-medium italic mt-1.5">
              💬 {ENCORAJAMENTO_ANAMNESE[(SESSION_SEED + answeredBefore + questionIndex) % ENCORAJAMENTO_ANAMNESE.length]}
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
                  className={`p-3 rounded-xl border text-sm cursor-pointer transition-all duration-200 flex items-center justify-between transform active:scale-[0.98] ${
                    selected
                      ? 'bg-primary-soft border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/30'
                      : 'bg-surface border-line text-ink hover:bg-surface-2 hover:border-line'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {opt.icon && <span className="text-lg">{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                  {selected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 animate-scale-in" />}
                </div>
              );
            })}
          </div>

          {/* Campo de reflexão aberta com as próprias palavras */}
          {currentQuestion.reflectionPrompt && (
            <div className="mt-3 p-2.5 rounded-xl bg-gold-soft/70 border border-gold-line/70 text-sm transition-all duration-200">
              <button
                type="button"
                onClick={() => setShowReflectionInput(!showReflectionInput)}
                className="w-full flex items-center justify-between text-[13px] font-semibold text-gold-ink text-left cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>✍️</span>
                  <span>Detalhar com suas próprias palavras</span>
                </span>
                {!showReflectionInput && (
                  <span className="text-xs text-gold-ink underline font-medium">{savedText ? 'Editar' : 'Escrever'}</span>
                )}
              </button>

              {!showReflectionInput && savedText && (
                <p className="mt-1.5 text-[13px] text-ink leading-snug">
                  <span className="text-primary font-semibold">{justSaved ? 'Salvo ✓ ' : '✓ '}</span>
                  <span className="italic">"{savedText.length > 90 ? `${savedText.slice(0, 90)}…` : savedText}"</span>
                </p>
              )}

              {showReflectionInput && (
                <div className="mt-2 space-y-1.5 animate-fadeIn">
                  <p className="text-[13px] text-muted leading-tight">
                    {currentQuestion.reflectionPrompt}
                  </p>
                  <textarea
                    rows={2}
                    value={reflections[currentQuestion.id] || ''}
                    onChange={(e) => actions.setReflection(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.reflectionPlaceholder}
                    className="w-full p-2 text-sm rounded-lg border border-gold-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-shadow"
                  />

                  {suggestions.map((id) => (
                    <div key={id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-primary/30 animate-fadeIn">
                      <span className="text-[13px] text-ink">
                        Isso tem a ver com <strong>{optionLabel(id)}</strong>?
                      </span>
                      <span className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => acceptSuggestion(id)}
                          className="px-2 py-0.5 rounded-md bg-primary text-on-primary text-[13px] font-semibold cursor-pointer"
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => actions.dismissTextOption(qid, id)}
                          className="px-2 py-0.5 rounded-md border border-line text-muted text-[13px] cursor-pointer"
                        >
                          Não
                        </button>
                      </span>
                    </div>
                  ))}

                  {confirmed.length > 0 && (
                    <p className="text-[13px] text-primary font-medium">
                      ✓ Também considerado: {confirmed.map(optionLabel).join(', ')}
                    </p>
                  )}

                  {currentQuestion.reflectionPurpose && (
                    <p className="text-xs text-muted leading-snug">
                      {currentQuestion.reflectionPurpose} Fica salvo só no seu celular. Evite escrever dados de saúde ou outros dados sensíveis.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={saveReflection}
                    className="w-full min-h-10 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    Salvar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botão de Avanço */}
        <div className="pt-3 pb-2 border-t border-line">
          <button
            disabled={!scoredAnswers[qid]?.length}
            onClick={actions.nextQuestion}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
