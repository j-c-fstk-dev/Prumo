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
          <h2 className="text-xl font-bold text-ink">
            Sua Jornada
          </h2>
          <span className="text-sm font-semibold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full">
            {completedCount} de {totalCount} concluídas
          </span>
        </div>

        {/* Âncora Emocional Fixa */}
        <div className="p-2.5 rounded-xl bg-gold-soft/80 border border-gold-line mb-3 text-sm flex items-center gap-2">
          <Bookmark className="w-3.5 h-3.5 text-gold-text shrink-0" />
          <span className="text-[13px] text-ink font-serif italic truncate">
            "{personalAnchor}"
          </span>
        </div>

        {/* Filtros por Capítulos */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 text-[13px]">
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
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface border border-line text-muted'
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
                      ? 'bg-surface-2 border-line opacity-75' 
                      : isCompleted 
                        ? 'bg-success-soft/50 border-success/30' 
                        : 'bg-surface border-line hover:border-primary'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {task.isLocked ? (
                      <Lock className="w-4 h-4 text-muted shrink-0 mt-1" />
                    ) : (
                      <button
                        onClick={() => actions.toggleTaskStatus(task.id)}
                        className="mt-0.5 text-primary cursor-pointer"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted" />
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
                          <span className="text-sm">{task.anchorIllustration.symbol}</span>
                          <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-muted' : 'text-ink'}`}>
                            {task.title}
                          </h4>
                        </div>
                        {task.isLocked ? (
                          <span className="text-xs bg-gold-soft text-gold-ink px-1.5 py-0.2 rounded font-medium shrink-0">
                            Cap. 2
                          </span>
                        ) : (
                          <span className="text-xs bg-primary-soft text-primary px-1.5 py-0.2 rounded font-medium shrink-0">
                            {task.anchorIllustration.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-[13px] text-muted line-clamp-1 mt-0.5">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between mt-2 text-xs text-muted">
                        <span>⏱ {task.durationMinutes} min · {task.chapterTitle.split(':')[0]}</span>
                        {task.audioCoach && (
                          <span className="text-primary font-semibold flex items-center gap-1">
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
