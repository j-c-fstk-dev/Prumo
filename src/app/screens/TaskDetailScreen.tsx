import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Pencil,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { WhenPicker } from '../components/WhenPicker';
import { ToolSuggestions } from '../components/ToolSuggestions';
import { QuoteByTheme } from '../components/QuoteCard';
import type { TemaCitacao } from '../../data/citacoes';

/** Citação para as tarefas em que a trava mais aparece */
const QUOTE_BY_TASK: Record<string, TemaCitacao> = { t2: 'perfeccionismo', t6: 'medo' };

export const TaskDetailScreen: React.FC = () => {
  const { selectedTask, reflections, activeAudioTaskId, isPlayingAudio, audioElapsedSec, actions } = useApp();
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(selectedTask.title);
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundEffects.playBack();
              actions.go('home');
            }}
            className="-ml-3 min-w-11 min-h-11 inline-flex items-center justify-center text-muted hover:text-ink cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-primary font-semibold bg-primary-soft px-2.5 py-0.5 rounded-full">
            {selectedTask.chapterTitle.split(':')[0]}
          </span>
        </div>

        {/* Card de Ilustração-Âncora */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary-soft to-gold-soft border border-primary/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface shadow-xs flex items-center justify-center text-2xl shrink-0">
            {selectedTask.anchorIllustration.symbol}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
              {selectedTask.anchorIllustration.badge} · Âncora Visual
            </span>
            <strong className="text-sm text-ink block">
              {selectedTask.anchorIllustration.title}
            </strong>
            <span className="text-[13px] text-muted">
              {selectedTask.anchorIllustration.meaning}
            </span>
          </div>
        </div>

        <div>
          {renaming ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-2 py-1 border border-primary rounded-md text-base focus:outline-none"
              />
              <button
                onClick={() => {
                  actions.renamePlanTask(selectedTask.id, newTitle);
                  setRenaming(false);
                }}
                className="px-3 py-1 bg-primary text-on-primary text-sm font-semibold rounded-lg cursor-pointer"
              >
                Salvar
              </button>
            </div>
          ) : (
            <h2 className="text-lg font-bold font-display text-ink">
              {selectedTask.title}{' '}
              <button onClick={() => setRenaming(true)} className="align-middle text-muted cursor-pointer" aria-label="Editar título">
                <Pencil className="w-3.5 h-3.5 inline" />
              </button>
            </h2>
          )}
          <div className="flex items-center gap-2 mt-0.5 text-sm text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Duração recomendada: {selectedTask.durationMinutes} min</span>
          </div>
        </div>

        {/* Player de Micro-Áudio Coaching */}
        {selectedTask.audioCoach && (
          <div className="p-3 rounded-xl bg-surface border border-primary/30 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => actions.toggleAudio(selectedTask.id)}
                  className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  {isPlayingAudio && activeAudioTaskId === selectedTask.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <div>
                  <strong className="text-sm text-ink block">
                    {selectedTask.audioCoach.title}
                  </strong>
                  <span className="text-xs text-muted">
                    {selectedTask.audioCoach.narrator} · {selectedTask.audioCoach.duration}
                  </span>
                </div>
              </div>

              {/* Visualizador de Ondas Sonoras */}
              <div className="flex items-center gap-0.5 h-6 px-1">
                {selectedTask.audioCoach.audioWaveHeights.map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-0.75 rounded-full transition-all duration-300 ${isPlayingAudio && activeAudioTaskId === selectedTask.id ? 'bg-primary animate-pulse' : 'bg-line'}`}
                    style={{ height: isPlayingAudio && activeAudioTaskId === selectedTask.id ? `${Math.max(20, (h * (0.6 + Math.sin((audioElapsedSec + i) * 1.2) * 0.4)))}%` : `${h * 0.35}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Transcrição Inspiradora Expansível */}
            <div className="pt-2 border-t border-line">
              <button
                onClick={() => {
                  soundEffects.playSoftTap();
                  setShowTranscript(!showTranscript);
                }}
                className="text-[13px] text-primary font-medium hover:underline flex items-center justify-between w-full cursor-pointer"
              >
                <span>{showTranscript ? 'Ocultar transcrição' : 'Ler palavras de encorajamento'}</span>
                {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showTranscript && (
                <p className="text-sm font-serif italic text-ink mt-1.5 bg-surface-2 p-2.5 rounded-lg leading-relaxed border-l-2 border-primary">
                  "{selectedTask.audioCoach.transcript}"
                </p>
              )}
            </div>
          </div>
        )}


        {/* Intenção de implementação: o recurso com mais evidência (docs/pesquisa/02) */}


        <div className="p-3.5 rounded-xl bg-surface border border-primary/30">


          <strong className="text-sm text-ink block mb-2">Quando vou fazer:</strong>


          <WhenPicker


            value={selectedTask.when}


            onChange={(when) => actions.setPlanTaskWhen(selectedTask.id, when)}


            timeThieves={reflections.q3_hours}


          />


        </div>



        {/* O Que Fazer */}
        <div className="p-3.5 rounded-xl bg-surface border border-line">
          <strong className="text-sm text-ink block mb-1">O que fazer:</strong>
          <p className="text-sm text-muted leading-relaxed">
            {selectedTask.whatToDo}
          </p>
        </div>

        {/* Como saber que ficou bom */}
        <div className="p-3.5 rounded-xl bg-primary-soft/60 border border-primary/20">
          <strong className="text-sm text-primary block mb-1.5">Como saber que ficou bom:</strong>
          <ul className="space-y-1.5 text-sm text-ink">
            {selectedTask.howToKnowItIsGood.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {QUOTE_BY_TASK[selectedTask.id] && <QuoteByTheme tema={QUOTE_BY_TASK[selectedTask.id]} />}


        {/* Ferramentas por categoria + exemplos curados, sem preços (docs/etapas/14) */}

        <ToolSuggestions categories={selectedTask.toolCategories} />


        {/* Recursos de apoio */}
        {selectedTask.resources && selectedTask.resources.length > 0 && (
          <div className="p-3.5 rounded-xl bg-surface border border-line">
            <strong className="text-sm text-ink block mb-2">📎 Recursos de apoio <span className="font-normal text-muted">(em breve no kit de execução)</span></strong>
            <div className="space-y-1.5">
              {selectedTask.resources.map((res, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm text-primary bg-surface-2 p-2 rounded-lg">
                  <span>• {res.title}</span>
                  <span className="text-xs text-muted bg-surface px-1.5 py-0.5 rounded border border-line">
                    {res.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2 pt-4">
        <button
          onClick={() => {
            actions.toggleTaskStatus(selectedTask.id);
            actions.go('home');
          }}
          className={`w-full py-3.5 text-base font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
            selectedTask.status === 'completed'
              ? 'bg-line text-ink'
              : 'bg-primary hover:bg-primary-hover text-on-primary'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{selectedTask.status === 'completed' ? 'Marcar como pendente' : 'Marcar como feita'}</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.goTab('coach');
            actions.go('home');
          }}
          className="w-full py-2 text-sm font-semibold text-primary text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Preciso de ajuda nisso (Abrir Coach)</span>
        </button>
      </div>
    </div>
  );
};
