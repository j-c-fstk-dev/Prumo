import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  Headphones,
  Bookmark,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { durationLabel } from '../../domain/tasks';
import { useApp } from '../state/AppStore';
import { PersonalTasks } from '../components/PersonalTasks';
import { RoutinesCard } from '../components/Routines';
import { weekStatus } from '../../domain/pacing';
import type { TaskItem } from '../../data/prumoData';

export const RoadmapTab: React.FC = () => {
  const { tasks, personalAnchor, currentWeek, actions } = useApp();
  const [chapterFilter, setChapterFilter] = useState<number | 'todos'>('todos');
  // Capítulos vêm das próprias tarefas (o roteiro pode crescer sem mexer aqui)
  const chapters = Array.from(new Map(tasks.map((t) => [t.chapterId, t.chapterTitle])).entries()).sort((a, b) => a[0] - b[0]);
  const shown = tasks.filter((t) => chapterFilter === 'todos' || t.chapterId === chapterFilter);
  // Agrupa por semana sugerida (etapa 42): só sugere, dá para adiantar
  const weeks = Array.from(new Set(shown.map((t) => t.week ?? 1))).sort((a, b) => a - b);
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
        <div className="p-2.5 rounded-xl bg-gold-soft/80 border border-gold-line mb-3 text-sm flex items-start gap-2">
          <Bookmark className="w-3.5 h-3.5 text-gold-text shrink-0 mt-1" aria-hidden="true" />
          <span className="text-sm text-ink font-serif italic leading-snug break-words min-w-0">
            "{personalAnchor}"
          </span>
        </div>

        {/* Rotinas do capítulo: o que se repete toda semana */}
        <div className="mb-4">
          <RoutinesCard title="Rotinas" />
        </div>

        {/* Filtros por capítulo */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 text-[13px]">
          {[['todos', 'Todos'] as const, ...chapters.map(([id, title]) => [id, title.replace(/^Capítulo (\d+):\s*/, 'Cap. $1: ')] as const)].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                soundEffects.playSoftTap();
                setChapterFilter(id);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                chapterFilter === id ? 'bg-primary text-on-primary font-semibold' : 'bg-surface border border-line text-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Passos do roteiro, por semana sugerida */}
        <div className="space-y-4">
          {weeks.map((week) => {
            const status = weekStatus(week, currentWeek);
            return (
              <section key={week} aria-label={`Semana ${week}`} className="space-y-2">
                <h3 className="flex items-baseline justify-between text-xs font-bold uppercase tracking-wider">
                  <span className={status === 'agora' ? 'text-primary' : 'text-muted'}>Semana {week}</span>
                  <span className={`normal-case tracking-normal font-semibold ${status === 'agora' ? 'text-primary' : 'text-muted font-normal'}`}>
                    {status === 'agora' ? '● esta semana' : status === 'adiantar' ? 'dá pra adiantar' : ''}
                  </span>
                </h3>
                {shown
                  .filter((t) => (t.week ?? 1) === week)
                  .map((task) => <TaskRow key={task.id} task={task} />)}
              </section>
            );
          })}
        </div>

        <div className="mt-4">
          <PersonalTasks title="Minha lista · fora da jornada" />
        </div>
      </div>
    </div>
  );
};

/** Um passo do roteiro na lista */
const TaskRow: React.FC<{ task: TaskItem }> = ({ task }) => {
  const { actions } = useApp();
  const isCompleted = task.status === 'completed';
  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        task.isLocked ? 'bg-surface-2 border-line opacity-75' : isCompleted ? 'bg-success-soft/50 border-success/30' : 'bg-surface border-line hover:border-primary'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {task.isLocked ? (
          <Lock className="w-4 h-4 text-muted shrink-0 mt-1" />
        ) : (
          <button
            onClick={() => actions.toggleTaskStatus(task.id)}
            aria-label={`${task.title}: ${isCompleted ? 'concluída' : 'marcar como concluída'}`}
            className="mt-0.5 text-primary cursor-pointer"
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted" />}
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
              <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-muted' : 'text-ink'}`}>{task.title}</h4>
            </div>
            <span className="text-xs bg-primary-soft text-primary px-1.5 py-0.2 rounded font-medium shrink-0">{task.skipped ? 'pulado' : task.anchorIllustration.badge}</span>
          </div>

          <p className="text-[13px] text-muted line-clamp-1 mt-0.5">{task.description}</p>

          <div className="flex items-center justify-between mt-2 text-xs text-muted">
            <span>
              ⏱ {durationLabel(task)} · {task.chapterTitle.split(':')[0]}
            </span>
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
};
