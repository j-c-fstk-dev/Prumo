import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Constellation } from '../../components/brand/Constellation';
import { Starfield } from '../../components/brand/CompassSplash';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { QuoteByTheme } from './QuoteCard';

/** Fim de capítulo: a constelação completa ganha nome (docs/pesquisa/04). Aparece uma vez por capítulo. */
export const ChapterComplete: React.FC = () => {
  const { tasks, celebratedChapters, actions } = useApp();

  const chapters = Array.from(new Set(tasks.map((t) => t.chapterId))).sort();
  const done = chapters.find(
    (c) => !celebratedChapters.includes(c) && tasks.filter((t) => t.chapterId === c).every((t) => t.status === 'completed'),
  );

  useEffect(() => {
    if (done === undefined) return;
    soundEffects.playChapterCelebration();
    // Chuva de estrelas lenta, em vez de confete rápido (teste com usuários: "algo mais mágico")
    const stars = { shapes: ['star' as const], colors: ['#E3B860', '#F5E6B8', '#B9A6FF', '#FFFFFF'], gravity: 0.35, decay: 0.95, ticks: 320, scalar: 1.1 };
    confetti({ ...stars, particleCount: 40, spread: 100, startVelocity: 22, origin: { y: 0.35 } });
    const later = setTimeout(() => confetti({ ...stars, particleCount: 30, spread: 140, startVelocity: 15, origin: { y: 0.2 } }), 900);
    return () => clearTimeout(later);
  }, [done]);

  if (done === undefined) return null;

  const chapterTasks = tasks.filter((t) => t.chapterId === done);
  const [label, name] = chapterTasks[0].chapterTitle.split(/:\s*/);
  const next = tasks.find((t) => t.chapterId > done);

  return (
    <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-5 animate-fadeIn">
      <div className="relative isolate w-full rounded-3xl overflow-hidden bg-night-sky p-5 space-y-4 animate-scale-in" style={{ color: 'var(--night-text)' }}>
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-80">
          <Starfield />
        </div>
        <div className="text-center space-y-1">
          <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
            {label} concluído
          </span>
          <h3 className="font-display text-xl font-bold">Sua constelação está completa</h3>
        </div>

        <Constellation
          name={name ?? label}
          stars={chapterTasks.map((t) => ({ id: t.id, title: t.title, done: true }))}
          seed={done * 13}
        />

        <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--night-muted)' }}>
          Cada estrela foi um passo seu. {next ? 'O próximo capítulo começa com o que você já construiu.' : 'Você completou a jornada inteira.'}
        </p>

        <QuoteByTheme tema="habito" />


        <button
          onClick={() => {
            soundEffects.playTransition();
            actions.markChapterCelebrated(done);
            if (!next) actions.goTab('profile');
          }}
          className="w-full py-3 rounded-xl font-semibold text-base cursor-pointer"
          style={{ background: 'var(--gold)', color: 'var(--night-900)' }}
        >
          {next ? `Seguir para o ${next.chapterTitle.split(':')[0]}` : 'Ver minha linha do tempo'}
        </button>
      </div>
    </div>
  );
};
