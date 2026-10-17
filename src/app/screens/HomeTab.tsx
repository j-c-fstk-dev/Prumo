import React from 'react';
import {
  Compass,
  CheckCircle2,
  Flame,
  Play,
  Pause,
  Bookmark,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { Constellation } from '../../components/brand/Constellation';
import { PersonalTasks } from '../components/PersonalTasks';

export const HomeTab: React.FC = () => {
  const { userName, tasks, nextStepTask, personalAnchor, activeAudioTaskId, isPlayingAudio, audioElapsedSec, actions } = useApp();
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  const fundacaoTasks = tasks.filter(t => t.phaseId === 'fundacao');
  const fundacaoPercent = Math.round((fundacaoTasks.filter(t => t.status === 'completed').length / fundacaoTasks.length) * 100);

  return (
    <div key="tab-home" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
      <div className="space-y-3.5">
        {/* Header com Boas-Vindas */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A1D1B]">
              Olá, {userName} 👋
            </h2>
            <p className="text-xs text-[#5B615D]">
              Capítulo 1: Onde você encontra sua promessa
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C]">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* ÂNCORA EMOCIONAL FIXA DO EU FUTURO */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 shadow-2xs flex items-start gap-2.5">
          <Bookmark className="w-4 h-4 text-[#D97746] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97746] block">
              Sua Âncora do Eu Futuro
            </span>
            <p className="text-xs text-[#1A1D1B] font-serif italic truncate mt-0.5">
              "{personalAnchor}"
            </p>
          </div>
        </div>

        {/* CONSTELAÇÃO DO CAPÍTULO: cada tarefa concluída acende uma estrela */}
        <Constellation
          name={nextStepTask.chapterTitle.replace(/^Capítulo \d+:\s*/, '')}
          stars={tasks
            .filter(t => t.chapterId === nextStepTask.chapterId)
            .map(t => ({ id: t.id, title: t.title, done: t.status === 'completed' }))}
          seed={nextStepTask.chapterId * 13}
        />

        {/* CARTÃO DO PRÓXIMO PASSO (Com Ilustração-Âncora e Áudio Coach) */}
        <div className="p-4 rounded-2xl bg-[#E3F2ED] border border-[#1F6F5C]/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{nextStepTask.anchorIllustration.symbol}</span>
              <span className="text-[10px] font-bold text-[#1F6F5C] uppercase tracking-wider">
                {nextStepTask.anchorIllustration.title}
              </span>
            </div>
            <span className="text-[11px] text-[#5B615D]">
              ⏱ {nextStepTask.durationMinutes} min
            </span>
          </div>

          <h3 className="text-base font-bold text-[#1A1D1B]">
            {nextStepTask.title}
          </h3>
          <p className="text-xs text-[#5B615D] mt-1 leading-relaxed">
            {nextStepTask.description}
          </p>
          {nextStepTask.when && (
            <p className="text-[11px] text-[#1F6F5C] font-semibold mt-1.5">⏰ Combinado: {nextStepTask.when}</p>
          )}

          {/* Micro-áudio Coaching Pills */}
          {nextStepTask.audioCoach && (
            <div className="mt-3 p-2.5 rounded-xl bg-white/90 border border-[#1F6F5C]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => actions.toggleAudio(nextStepTask.id)}
                  className="w-7 h-7 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center hover:bg-[#2E8B73] transition-colors cursor-pointer"
                >
                  {isPlayingAudio && activeAudioTaskId === nextStepTask.id ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
                <div>
                  <span className="text-[11px] font-bold text-[#1A1D1B] block">
                    {nextStepTask.audioCoach.narrator}
                  </span>
                  <span className="text-[10px] text-[#5B615D]">
                    {isPlayingAudio && activeAudioTaskId === nextStepTask.id 
                      ? `0:${audioElapsedSec.toString().padStart(2, '0')} / ${nextStepTask.audioCoach.duration}` 
                      : `Presença em áudio · ${nextStepTask.audioCoach.duration}`}
                  </span>
                </div>
              </div>

              {/* Ondas Sonoras Animadas */}
              <div className="flex items-center gap-0.5 h-4">
                {nextStepTask.audioCoach.audioWaveHeights.slice(0, 8).map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-0.75 rounded-full transition-all duration-300 ${isPlayingAudio && activeAudioTaskId === nextStepTask.id ? 'bg-[#1F6F5C] animate-pulse' : 'bg-neutral-300'}`}
                    style={{ height: isPlayingAudio && activeAudioTaskId === nextStepTask.id ? `${Math.max(25, h * 0.8)}%` : `${h * 0.3}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                actions.openTask(nextStepTask.id);
                actions.go('task_detail');
              }}
              className="flex-1 py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-xl transition-all shadow-xs text-center cursor-pointer"
            >
              Abrir tarefa
            </button>
            <button
              onClick={() => actions.toggleTaskStatus(nextStepTask.id)}
              className="px-3 py-2.5 bg-white border border-[#1F6F5C]/30 text-[#1F6F5C] text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              title="Concluir"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarefas pessoais: o app também serve para o dia a dia fora do plano */}

        <PersonalTasks title="Suas tarefas de hoje" />


        {/* Card de Progresso da História em Capítulos */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E8E6] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A1D1B]">Avanço da sua Jornada</span>
            <span className="text-xs font-bold text-[#1F6F5C]">{progressPercent}%</span>
          </div>

          {/* Barra linear geral */}
          <div className="w-full bg-[#E6E8E6] h-2 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-[#1F6F5C] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Capítulos Narrativos */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-[#1A1D1B] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1F6F5C]" /> Cap. 1: Sua Promessa
              </span>
              <span className="text-[#1F6F5C] font-semibold">{fundacaoPercent}%</span>
            </div>
            <div className="flex items-center justify-between text-[#5B615D]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F2A93B]" /> Cap. 2: Primeiro Contato
              </span>
              <span>0% (Próximo)</span>
            </div>
            <div className="flex items-center justify-between text-[#5B615D]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7A5AF8]" /> Cap. 3: Primeiro Retorno
              </span>
              <span>0% (Futuro)</span>
            </div>
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid grid-cols-2 gap-2.5">
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('future_letter');
            }}
            className="p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-[#1F6F5C] transition-colors"
          >
            <span className="text-base block mb-1">📜</span>
            <strong className="text-xs text-[#1A1D1B] block">Carta do Futuro</strong>
            <span className="text-[10px] text-[#5B615D]">Reler compromisso</span>
          </div>
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.goTab('coach');
            }}
            className="p-3 rounded-xl bg-white border border-[#E6E8E6] cursor-pointer hover:border-[#1F6F5C] transition-colors"
          >
            <span className="text-base block mb-1">💬</span>
            <strong className="text-xs text-[#1A1D1B] block">Coach Prumo</strong>
            <span className="text-[10px] text-[#5B615D]">Tirar dúvidas</span>
          </div>
        </div>

      </div>

      {/* Dica de Presença */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 mt-3 flex items-start gap-2">
        <Flame className="w-4 h-4 text-[#F2A93B] shrink-0 mt-0.5" />
        <span><strong>Lembrete gentil:</strong> O progresso é uma história sendo escrita, não um placar subindo.</span>
      </div>
    </div>
  );
};
