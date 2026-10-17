import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Constellation } from '../../components/brand/Constellation';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

/** Fim de capítulo: a constelação completa ganha nome (docs/pesquisa/04). Aparece uma vez por capítulo. */
export const ChapterComplete: React.FC = () => {
  const { tasks, celebratedChapters, actions } = useApp();

  const chapters = Array.from(new Set(tasks.map((t) => t.chapterId))).sort();
  const done = chapters.find(
    (c) => !celebratedChapters.includes(c) && tasks.filter((t) => t.chapterId === c).every((t) => t.status === 'completed'),
  );

  useEffect(() => {
    if (done === undefined) return;
    soundEffects.playCommitmentSuccess();
    confetti({ particleCount: 70, spread: 90, origin: { y: 0.5 } });
  }, [done]);

  if (done === undefined) return null;

  const chapterTasks = tasks.filter((t) => t.chapterId === done);
  const [label, name] = chapterTasks[0].chapterTitle.split(/:\s*/);
  const next = tasks.find((t) => t.chapterId > done);

  return (
    <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-5 animate-fadeIn">
      <div className="w-full rounded-3xl overflow-hidden bg-night-sky p-5 space-y-4 animate-scale-in" style={{ color: 'var(--night-text)' }}>
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
            {label} concluído
          </span>
          <h3 className="font-display text-xl font-bold">Sua constelação está completa</h3>
        </div>

        <Constellation
          name={name ?? label}
          stars={chapterTasks.map((t) => ({ id: t.id, title: t.title, done: true }))}
          seed={done * 13}
        />

        <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--night-muted)' }}>
          Cada estrela foi um passo seu. {next ? 'O próximo capítulo começa com o que você já construiu.' : 'Você completou a jornada inteira.'}
        </p>

        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.markChapterCelebrated(done);
            if (!next) actions.goTab('profile');
          }}
          className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer"
          style={{ background: 'var(--gold)', color: 'var(--night-900)' }}
        >
          {next ? `Seguir para o ${next.chapterTitle.split(':')[0]}` : 'Ver minha linha do tempo'}
        </button>
      </div>
    </div>
  );
};
