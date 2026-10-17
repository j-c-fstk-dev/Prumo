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
            className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-[#1F6F5C] font-semibold bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
            {selectedTask.chapterTitle.split(':')[0]}
          </span>
        </div>

        {/* Card de Ilustração-Âncora */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#E3F2ED] to-[#FAF6F0] border border-[#1F6F5C]/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
            {selectedTask.anchorIllustration.symbol}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block">
              {selectedTask.anchorIllustration.badge} · Âncora Visual
            </span>
            <strong className="text-xs text-[#1A1D1B] block">
              {selectedTask.anchorIllustration.title}
            </strong>
            <span className="text-[11px] text-[#5B615D]">
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
                className="flex-1 px-2 py-1 border border-[#1F6F5C] rounded-md text-sm focus:outline-none"
              />
              <button
                onClick={() => {
                  actions.renamePlanTask(selectedTask.id, newTitle);
                  setRenaming(false);
                }}
                className="px-3 py-1 bg-[#1F6F5C] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Salvar
              </button>
            </div>
          ) : (
            <h2 className="text-lg font-bold font-display text-[#1A1D1B]">
              {selectedTask.title}{' '}
              <button onClick={() => setRenaming(true)} className="align-middle text-[#5B615D] cursor-pointer" aria-label="Editar título">
                <Pencil className="w-3.5 h-3.5 inline" />
              </button>
            </h2>
          )}
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5B615D]">
            <Clock className="w-3.5 h-3.5" />
            <span>Duração recomendada: {selectedTask.durationMinutes} min</span>
          </div>
        </div>

        {/* Player de Micro-Áudio Coaching */}
        {selectedTask.audioCoach && (
          <div className="p-3 rounded-xl bg-white border border-[#1F6F5C]/30 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => actions.toggleAudio(selectedTask.id)}
                  className="w-8 h-8 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center hover:bg-[#2E8B73] transition-colors cursor-pointer"
                >
                  {isPlayingAudio && activeAudioTaskId === selectedTask.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <div>
                  <strong className="text-xs text-[#1A1D1B] block">
                    {selectedTask.audioCoach.title}
                  </strong>
                  <span className="text-[10px] text-[#5B615D]">
                    {selectedTask.audioCoach.narrator} · {selectedTask.audioCoach.duration}
                  </span>
                </div>
              </div>

              {/* Visualizador de Ondas Sonoras */}
              <div className="flex items-center gap-0.5 h-6 px-1">
                {selectedTask.audioCoach.audioWaveHeights.map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-0.75 rounded-full transition-all duration-300 ${isPlayingAudio && activeAudioTaskId === selectedTask.id ? 'bg-[#1F6F5C] animate-pulse' : 'bg-neutral-300'}`}
                    style={{ height: isPlayingAudio && activeAudioTaskId === selectedTask.id ? `${Math.max(20, (h * (0.6 + Math.sin((audioElapsedSec + i) * 1.2) * 0.4)))}%` : `${h * 0.35}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Transcrição Inspiradora Expansível */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={() => {
                  soundEffects.playSoftTap();
                  setShowTranscript(!showTranscript);
                }}
                className="text-[11px] text-[#1F6F5C] font-medium hover:underline flex items-center justify-between w-full cursor-pointer"
              >
                <span>{showTranscript ? 'Ocultar transcrição' : 'Ler palavras de encorajamento'}</span>
                {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showTranscript && (
                <p className="text-xs font-serif italic text-[#2D3748] mt-1.5 bg-[#F7F9F8] p-2.5 rounded-lg leading-relaxed border-l-2 border-[#1F6F5C]">
                  "{selectedTask.audioCoach.transcript}"
                </p>
              )}
            </div>
          </div>
        )}


        {/* Intenção de implementação: o recurso com mais evidência (docs/pesquisa/02) */}


        <div className="p-3.5 rounded-xl bg-white border border-[#1F6F5C]/30">


          <strong className="text-xs text-[#1A1D1B] block mb-2">Quando vou fazer:</strong>


          <WhenPicker


            value={selectedTask.when}


            onChange={(when) => actions.setPlanTaskWhen(selectedTask.id, when)}


            timeThieves={reflections.q3_hours}


          />


        </div>



        {/* O Que Fazer */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E6E8E6]">
          <strong className="text-xs text-[#1A1D1B] block mb-1">O que fazer:</strong>
          <p className="text-xs text-[#5B615D] leading-relaxed">
            {selectedTask.whatToDo}
          </p>
        </div>

        {/* Como saber que ficou bom */}
        <div className="p-3.5 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20">
          <strong className="text-xs text-[#1F6F5C] block mb-1.5">Como saber que ficou bom:</strong>
          <ul className="space-y-1.5 text-xs text-[#1A1D1B]">
            {selectedTask.howToKnowItIsGood.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3BAA6B] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recursos de apoio */}
        {selectedTask.resources && selectedTask.resources.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white border border-[#E6E8E6]">
            <strong className="text-xs text-[#1A1D1B] block mb-2">📎 Recursos de apoio:</strong>
            <div className="space-y-1.5">
              {selectedTask.resources.map((res, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-[#1F6F5C] bg-[#F7F9F8] p-2 rounded-lg">
                  <span>• {res.title}</span>
                  <span className="text-[10px] text-[#5B615D] bg-white px-1.5 py-0.5 rounded border border-[#E6E8E6]">
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
          className={`w-full py-3.5 text-sm font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
            selectedTask.status === 'completed'
              ? 'bg-neutral-200 text-[#1A1D1B]'
              : 'bg-[#1F6F5C] hover:bg-[#2E8B73] text-white'
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
          className="w-full py-2 text-xs font-semibold text-[#1F6F5C] text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Preciso de ajuda nisso (Abrir Coach)</span>
        </button>
      </div>
    </div>
  );
};
