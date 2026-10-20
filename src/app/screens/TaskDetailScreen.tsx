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
import { estimateSeconds, formatDuration, VOICE_ENABLED } from '../../utils/voice';
import { WhenPicker } from '../components/WhenPicker';
import { ToolSuggestions } from '../components/ToolSuggestions';
import { ExecutionKit } from '../components/ExecutionKit';
import { QuoteByTheme } from '../components/QuoteCard';
import { Reveal } from '../components/Reveal';
import type { TemaCitacao } from '../../data/citacoes';
import { funnel } from '../../domain/people';

/** Citação para as tarefas em que a trava mais aparece */
const QUOTE_BY_TASK: Record<string, TemaCitacao> = { t2: 'perfeccionismo', t6: 'medo' };

const COUNTER_LABEL = {
  names: ['nome no Caderno', 'nomes no Caderno'],
  talked: ['conversa sobre o problema', 'conversas sobre o problema'],
  presented: ['pessoa viu a proposta', 'pessoas viram a proposta'],
} as const;

/** Contador que vem do Caderno → Pessoas: anda sozinho conforme as etapas mudam */
const TaskCounter: React.FC<{ kind: keyof typeof COUNTER_LABEL; target: number; count: ReturnType<typeof funnel> }> = ({ kind, target, count }) => {
  const n = { names: count.names, talked: count.talked, presented: count.presented }[kind];
  const done = n >= target;
  return (
    <p className={`text-sm font-semibold ${done ? 'text-success' : 'text-ink'}`} role="status" aria-label="Contador do Caderno">
      {done ? '✓ ' : ''}
      {Math.min(n, target)} de {target} {COUNTER_LABEL[kind][target === 1 ? 0 : 1]}
      <span className="block text-xs font-normal text-muted">Conta sozinho pelo Caderno → Pessoas.</span>
    </p>
  );
};

export const TaskDetailScreen: React.FC = () => {
  const { selectedTask, people, reflections, taskNotes, activeAudioTaskId, isPlayingAudio, audioElapsedSec, voiceUnavailable, actions } = useApp();
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(selectedTask.title);
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptOpen = showTranscript || (voiceUnavailable && activeAudioTaskId === selectedTask.id);
  // Quando e onde (etapa 53): sem combinado, a pergunta vem logo no começo do passo. Decidido ao abrir,
  // para o cartão não pular de lugar enquanto a pessoa escolhe.
  const [askWhenFirst] = useState(!selectedTask.when && selectedTask.status !== 'completed');
  const whenCard = (
    <div className="p-3.5 rounded-xl bg-surface border border-primary/30">
      <strong className="text-sm text-ink block mb-0.5">{askWhenFirst ? 'Antes de começar: quando e onde você vai fazer?' : 'Quando vou fazer:'}</strong>
      {askWhenFirst && <p className="text-[13px] text-muted mb-2">Combinar dia, hora e lugar aumenta muito a chance de sair do papel.</p>}
      <WhenPicker
        value={selectedTask.when}
        onChange={(when) => actions.setPlanTaskWhen(selectedTask.id, when)}
        timeThieves={reflections.q3_hours}
      />
    </div>
  );

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

        {askWhenFirst && whenCard}

        {/* Sem voz: as palavras de encorajamento como texto */}
        {selectedTask.audioCoach && !VOICE_ENABLED && (
          <div className="p-3 rounded-xl bg-surface border border-primary/30 shadow-xs">
            <strong className="text-sm text-ink block mb-1">{selectedTask.audioCoach.title}</strong>
            <p className="text-sm font-serif italic text-ink leading-relaxed">"{selectedTask.audioCoach.transcript}"</p>
          </div>
        )}

        {/* Player de Micro-Áudio Coaching */}
        {selectedTask.audioCoach && VOICE_ENABLED && (
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
                    {selectedTask.audioCoach.narrator} · {formatDuration(estimateSeconds(selectedTask.audioCoach.transcript))}
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

            {voiceUnavailable && activeAudioTaskId === selectedTask.id && (

              <p className="text-[13px] text-gold-ink bg-gold-soft rounded-lg p-2">

                Este aparelho não tem voz em português disponível. As palavras de encorajamento estão logo abaixo.

              </p>

            )}

            {/* Transcrição Inspiradora Expansível */}
            <div className="pt-2 border-t border-line">
              <button
                onClick={() => {
                  soundEffects.playSoftTap();
                  setShowTranscript(!showTranscript);
                }}
                className="text-[13px] text-primary font-medium hover:underline flex items-center justify-between w-full cursor-pointer"
              >
                <span>{transcriptOpen ? 'Ocultar transcrição' : 'Ler palavras de encorajamento'}</span>
                {transcriptOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {transcriptOpen && (
                <p className="text-sm font-serif italic text-ink mt-1.5 bg-surface-2 p-2.5 rounded-lg leading-relaxed border-l-2 border-primary">
                  "{selectedTask.audioCoach.transcript}"
                </p>
              )}
            </div>
          </div>
        )}


        <Reveal i={1}>
        {/* O Que Fazer */}
        <div className="p-3.5 rounded-xl bg-surface border border-line">
          <strong className="text-sm text-ink block mb-1">O que fazer:</strong>
          <p className="text-sm text-muted leading-relaxed">
            {selectedTask.whatToDo}
          </p>
        </div>
        </Reveal>

        <Reveal i={2}>
        {/* Duas camadas (etapa 52): o que depende de você marca o passo; o sinal do mundo é informação */}
        <div className="p-3.5 rounded-xl bg-primary-soft/60 border border-primary/20 space-y-2.5">
          {selectedTask.counter && <TaskCounter kind={selectedTask.counter.kind} target={selectedTask.counter.target} count={funnel(people)} />}
          <div>
            <strong className="text-sm text-primary block mb-1.5">Você fez:</strong>
            <ul className="space-y-1.5 text-sm text-ink">
              {selectedTask.howToKnowItIsGood.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {selectedTask.signals?.length ? (
            <div className="pt-2 border-t border-primary/15">
              <strong className="text-sm text-ink block mb-1">O que o mundo respondeu:</strong>
              <ul className="space-y-1 text-sm text-ink">
                {selectedTask.signals.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span aria-hidden="true">📡</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[13px] text-muted leading-snug mt-1.5">
                Isso não depende só de você, e o passo conta como feito mesmo sem resposta.
                {selectedTask.ifNoSignal && ` ${selectedTask.ifNoSignal}`}
              </p>
            </div>
          ) : null}
        </div>
        </Reveal>

        {!askWhenFirst && (
          <Reveal i={3}>
            {/* Intenção de implementação: o recurso com mais evidência (docs/pesquisa/02) */}
            {whenCard}
          </Reveal>
        )}

        <Reveal i={4}>
          {/* Caderno: anotações desta tarefa (aparecem também na aba Caderno) */}
          <label className="block p-3.5 rounded-xl bg-surface border border-line">
            <strong className="text-sm text-ink block mb-1.5">✍️ Minhas anotações desta tarefa</strong>
            <textarea
              rows={3}
              value={taskNotes[selectedTask.id] ?? ''}
              maxLength={4000}
              onChange={(e) => actions.setTaskNote(selectedTask.id, e.target.value)}
              placeholder="O que você fez, o que as pessoas disseram, o que aprendeu..."
              className="w-full p-2.5 text-sm rounded-lg border border-line bg-canvas text-ink placeholder:text-muted focus:outline-none focus:border-primary resize-none"
            />
            <span className="text-xs text-muted">Salva sozinho e aparece também no Caderno.</span>
          </label>
        </Reveal>

        <Reveal i={5}>{QUOTE_BY_TASK[selectedTask.id] && <QuoteByTheme tema={QUOTE_BY_TASK[selectedTask.id]} />}</Reveal>


        {/* Ferramentas por categoria + exemplos curados, sem preços (docs/etapas/14) */}

        <Reveal i={5}>
          <ToolSuggestions categories={selectedTask.toolCategories} />
        </Reveal>


        {/* Kit de execução: modelos prontos com o plano da pessoa */}
        <Reveal i={6}>
          <ExecutionKit taskId={selectedTask.id} chapterId={selectedTask.chapterId} />
        </Reveal>
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
          <span>Travei aqui: falar com o coach</span>
        </button>
      </div>
    </div>
  );
};
