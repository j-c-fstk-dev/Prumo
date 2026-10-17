import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  Headphones,
  Bookmark,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { PersonalTasks } from '../components/PersonalTasks';

export const RoadmapTab: React.FC = () => {
  const { tasks, personalAnchor, actions } = useApp();
  const [activeFilterPhase, setActiveFilterPhase] = useState<'todas' | 'fundacao' | 'marketing' | 'lancamento'>('todas');
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;

  return (
    <div key="tab-roadmap" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#1A1D1B]">
            Sua Jornada
          </h2>
          <span className="text-xs font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
            {completedCount} de {totalCount} concluídas
          </span>
        </div>

        {/* Âncora Emocional Fixa */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 mb-3 text-xs flex items-center gap-2">
          <Bookmark className="w-3.5 h-3.5 text-[#D97746] shrink-0" />
          <span className="text-[11px] text-[#1A1D1B] font-serif italic truncate">
            "{personalAnchor}"
          </span>
        </div>

        {/* Filtros por Capítulos */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 text-[11px]">
          {[
            { id: 'todas', label: 'Todos os Capítulos' },
            { id: 'fundacao', label: 'Cap. 1: Promessa' },
            { id: 'marketing', label: 'Cap. 2: Contato' },
            { id: 'lancamento', label: 'Cap. 3: Retorno' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundEffects.playSoftTap();
                setActiveFilterPhase(f.id as any);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                activeFilterPhase === f.id
                  ? 'bg-[#1F6F5C] text-white font-semibold'
                  : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de Tarefas por Capítulos com Ilustrações-Âncora */}
        <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
          {tasks
            .filter(t => activeFilterPhase === 'todas' || t.phaseId === activeFilterPhase)
            .map(task => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all ${
                    task.isLocked 
                      ? 'bg-neutral-100 border-[#E6E8E6] opacity-75' 
                      : isCompleted 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-white border-[#E6E8E6] hover:border-[#1F6F5C]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {task.isLocked ? (
                      <Lock className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                    ) : (
                      <button
                        onClick={() => actions.toggleTaskStatus(task.id)}
                        className="mt-0.5 text-[#1F6F5C] cursor-pointer"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#3BAA6B]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#5B615D]" />
                        )}
                      </button>
                    )}

                    <div 
                      onClick={() => {
                        soundEffects.playSoftTap();
                        if (task.isLocked) {
                          actions.go('paywall');
                        } else {
                          actions.openTask(task.id);
                          actions.go('task_detail');
                        }
                      }}
                      className="flex-1 cursor-pointer min-w-0"
                    >

                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs">{task.anchorIllustration.symbol}</span>
                          <h4 className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-[#5B615D]' : 'text-[#1A1D1B]'}`}>
                            {task.title}
                          </h4>
                        </div>
                        {task.isLocked ? (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium shrink-0">
                            Cap. 2
                          </span>
                        ) : (
                          <span className="text-[9px] bg-[#E3F2ED] text-[#1F6F5C] px-1.5 py-0.2 rounded font-medium shrink-0">
                            {task.anchorIllustration.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#5B615D] line-clamp-1 mt-0.5">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between mt-2 text-[10px] text-[#5B615D]">
                        <span>⏱ {task.durationMinutes} min · {task.chapterTitle.split(':')[0]}</span>
                        {task.audioCoach && (
                          <span className="text-[#1F6F5C] font-semibold flex items-center gap-1">
                            <Headphones className="w-3 h-3" /> Áudio
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-4">
          <PersonalTasks title="Minhas tarefas (fora do plano)" />
        </div>
      </div>
    </div>
  );
};
