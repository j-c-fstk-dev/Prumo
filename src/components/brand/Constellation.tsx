import React, { useEffect, useMemo, useRef } from 'react';
import { Starfield } from './CompassSplash';

export interface ConstellationStar {
  id: string;
  title: string;
  done: boolean;
}

interface ConstellationProps {
  /** Nome da constelação (ex.: o capítulo atual) */
  name: string;
  stars: ConstellationStar[];
  seed?: number;
}

/** Posições estáveis: as estrelas avançam da esquerda para a direita com altura variável. */
function layout(count: number, seed: number): Array<{ x: number; y: number }> {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, (_, i) => ({
    x: count === 1 ? 50 : 10 + (80 * i) / (count - 1),
    y: 12 + rnd() * 26,
  }));
}

/**
 * Cada tarefa concluída acende uma estrela; estrelas acesas em sequência se ligam.
 * O progresso vira um desenho que é só da pessoa (docs/pesquisa/04).
 */
export const Constellation: React.FC<ConstellationProps> = ({ name, stars, seed = 11 }) => {
  const points = useMemo(() => layout(stars.length, seed), [stars.length, seed]);
  const nextIndex = stars.findIndex((st) => !st.done);
  const doneCount = stars.filter((st) => st.done).length;

  // Só anima o "acender" das estrelas que acabaram de ser concluídas
  const previouslyDone = useRef<Set<string> | null>(null);
  const justLit = previouslyDone.current
    ? new Set(stars.filter((st) => st.done && !previouslyDone.current!.has(st.id)).map((st) => st.id))
    : new Set<string>();
  useEffect(() => {
    previouslyDone.current = new Set(stars.filter((st) => st.done).map((st) => st.id));
  });

  return (
    <div className="relative rounded-2xl overflow-hidden bg-night-sky p-4" style={{ color: 'var(--night-text)' }}>
      <Starfield count={14} seed={seed + 3} maxRadius={0.5} opacity={0.45} />

      <div className="relative flex items-baseline justify-between mb-1">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
          Sua constelação
        </span>
        <span className="text-xs" style={{ color: 'var(--night-muted)' }}>
          {doneCount} de {stars.length} estrelas
        </span>
      </div>
      <h4 className="relative font-display text-base font-semibold">{name}</h4>

      <svg viewBox="0 0 100 50" className="relative w-full mt-1" role="img" aria-label={`${doneCount} de ${stars.length} tarefas concluídas`}>
        {points.map((p, i) => {
          if (i === 0) return null;
          const prev = points[i - 1];
          const bothDone = stars[i - 1].done && stars[i].done;
          const leadsToNext = stars[i - 1].done && i === nextIndex;
          if (!bothDone && !leadsToNext) return null;
          return (
            <line
              key={`l-${stars[i].id}`}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              pathLength={1}
              stroke={bothDone ? 'var(--gold)' : 'var(--lavender)'}
              strokeWidth={bothDone ? 0.6 : 0.4}
              strokeDasharray={bothDone ? undefined : '0.04 0.04'}
              opacity={bothDone ? 0.85 : 0.5}
              className={bothDone && justLit.has(stars[i].id) ? 'constellation-line' : undefined}
            />
          );
        })}

        {points.map((p, i) => {
          const st = stars[i];
          const isNext = i === nextIndex;
          return (
            <g key={st.id}>
              <title>{st.title}</title>
              {st.done && <circle cx={p.x} cy={p.y} r={3.2} fill="var(--gold)" opacity={0.18} />}
              {st.done || isNext ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={st.done ? 1.7 : 1.4}
                  fill={st.done ? 'var(--gold)' : 'var(--lavender)'}
                  className={`star-node ${justLit.has(st.id) ? 'star-ignite' : isNext ? 'star-pulse' : ''}`}
                />
              ) : (
                // Estrela ainda apagada: contorno, para não se confundir com o céu de fundo
                <circle cx={p.x} cy={p.y} r={1.2} fill="none" stroke="var(--night-muted)" strokeWidth={0.35} opacity={0.8} />
              )}
            </g>
          );
        })}
      </svg>

      {nextIndex >= 0 ? (
        <p className="relative text-xs mt-1" style={{ color: 'var(--night-muted)' }}>
          Próxima estrela: <span style={{ color: 'var(--night-text)' }}>{stars[nextIndex].title}</span>
        </p>
      ) : (
        <p className="relative text-xs mt-1" style={{ color: 'var(--gold)' }}>
          Constelação completa ✦
        </p>
      )}
    </div>
  );
};
