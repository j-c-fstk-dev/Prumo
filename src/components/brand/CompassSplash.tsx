import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CompassMark } from './CompassMark';

const SEEN_KEY = 'prumo_splash_seen';

// Duração em ms: ritual completo na 1ª abertura, versão curta nas seguintes (docs/pesquisa/04)
const FIRST_RUN_MS = 2600;
const RETURNING_MS = 900;
const FADE_MS = 350;

function hasSeenSplash(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSplashSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Armazenamento indisponível (modo privado): apenas repete o ritual completo
  }
}

/** Gerador pseudoaleatório determinístico, para o céu ser sempre o mesmo. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export const Starfield: React.FC<{ count?: number; seed?: number; maxRadius?: number; opacity?: number }> = ({
  count = 28,
  seed = 7,
  maxRadius = 0.35,
  opacity = 1,
}) => {
  const stars = useMemo(() => {
    const rnd = seeded(seed);
    return Array.from({ length: count }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: maxRadius * (0.35 + rnd() * 0.65),
      dur: 2.2 + rnd() * 3,
      delay: rnd() * 3,
    }));
  }, [count, seed, maxRadius]);

  return (
    <svg style={{ opacity }} className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {stars.map((st, i) => (
        <circle
          key={i}
          cx={st.x}
          cy={st.y}
          r={st.r}
          fill="#EDE8F7"
          className="star-twinkle"
          style={{ ['--tw-dur' as string]: `${st.dur}s`, ['--tw-delay' as string]: `${st.delay}s` }}
        />
      ))}
    </svg>
  );
};

export const CompassSplash: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [firstRun] = useState(() => !hasSeenSplash());
  const [leaving, setLeaving] = useState(false);
  const totalMs = firstRun ? FIRST_RUN_MS : RETURNING_MS;
  const doneRef = useRef(false);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    markSplashSeen();
    const leaveTimer = setTimeout(() => setLeaving(true), totalMs);
    // Garantia caso o evento de fim de animação não dispare
    const doneTimer = setTimeout(finish, totalMs + FADE_MS + 100);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [totalMs]);

  return (
    <div
      className={`absolute inset-0 z-[60] bg-night-sky flex flex-col items-center justify-center select-none cursor-pointer ${leaving ? 'splash-out' : ''}`}
      onClick={() => setLeaving(true)}
      onAnimationEnd={(e) => {
        if (e.currentTarget === e.target && leaving) finish();
      }}
      role="presentation"
    >
      <Starfield />

      <div className="relative flex flex-col items-center gap-5">
        <CompassMark size={firstRun ? 132 : 104} mode="settle" tone="night" settleMs={firstRun ? 1700 : 650} />
        <div
          className="text-center"
          style={firstRun ? { animation: 'fadeIn 700ms cubic-bezier(0.22, 1, 0.36, 1) 1100ms both' } : undefined}
        >
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ color: 'var(--night-text)' }}>
            Prumo
          </h1>
          {firstRun && (
            <p className="mt-1 text-sm" style={{ color: 'var(--night-muted)' }}>
              encontre seu norte
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
