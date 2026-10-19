import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CompassMark } from './CompassMark';
import { Seeker } from './Seeker';
import { soundEffects } from '../../utils/soundEffects';

const SEEN_KEY = 'prumo_splash_seen';

/**
 * Abertura em duas cenas, toda vez que o app abre (etapa 34): o bonequinho olhando o céu e, em seguida,
 * a bússola se assentando no norte. Na 1ª abertura a pessoa toca para começar; nas seguintes entra
 * sozinho, e um toque pula a abertura.
 *
 * Etapa 48: o céu fica ~6 s (com estrelas cadentes) antes da bússola. A música toca sozinha quando o
 * navegador deixa (app instalado no Android, por exemplo); quando não deixa, aparece "♪ Ouvir a música".
 * Quem pede menos movimento vê a versão curta.
 */
const lessMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const SEEKER_MS = lessMotion() ? 1500 : 6000;
const COMPASS_MS = lessMotion() ? 900 : 1700;
const FADE_MS = 700;

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
  const [scene, setScene] = useState<'seeker' | 'compass'>('seeker');
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const musicRef = useRef(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const playMusic = () => {
    if (musicRef.current) return;
    musicRef.current = true;
    setMusicBlocked(false);
    // Som nunca pode travar a abertura
    try {
      soundEffects.playSplashMusic();
    } catch {
      // sem som: segue
    }
  };
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  // Cena 1 → cena 2; depois, na 1ª vez mostra o botão, nas outras sai sozinha
  // Música: toca já, se o navegador deixar; senão oferece um botão discreto
  useEffect(() => {
    let alive = true;
    void soundEffects.canAutoplay().then((ok) => {
      if (!alive) return;
      if (ok) playMusic();
      else if (!firstRun) setMusicBlocked(true);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markSplashSeen();
    const toCompass = setTimeout(() => setScene('compass'), SEEKER_MS);
    const leave = firstRun ? undefined : setTimeout(() => setLeaving(true), SEEKER_MS + COMPASS_MS);
    return () => {
      clearTimeout(toCompass);
      if (leave) clearTimeout(leave);
    };
  }, [firstRun]);

  // Garantia caso o evento de fim de animação não dispare
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(finish, FADE_MS + 100);
    return () => clearTimeout(t);
  }, [leaving]);

  const start = () => {
    if (leaving) return;
    if (firstRun) {
      // Na 1ª vez o toque só vale pelo botão, depois que a bússola aparece
      if (scene !== 'compass') return;
      setLeaving(true);
      playMusic();
      return;
    }
    setLeaving(true);
  };

  return (
    <div
      data-splash
      className={`absolute inset-0 z-[60] bg-night-sky flex flex-col items-center justify-center select-none cursor-pointer ${leaving ? 'splash-out' : ''}`}
      onClick={start}
      onAnimationEnd={(e) => {
        if (e.currentTarget === e.target && leaving) finish();
      }}
      role="presentation"
    >
      <Starfield count={44} maxRadius={0.4} />

      {/* Estrelas cadentes enquanto o céu brilha (etapa 48) */}
      {scene === 'seeker' &&
        [
          { top: '14%', left: '78%', delay: 1600 },
          { top: '26%', left: '62%', delay: 3900 },
        ].map((st) => (
          <span
            key={st.delay}
            aria-hidden="true"
            className="shooting-star absolute w-24 h-px pointer-events-none"
            style={{
              top: st.top,
              left: st.left,
              rotate: '-29deg',
              background: 'linear-gradient(90deg, rgba(237,232,247,0.95), rgba(237,232,247,0))',
              animationDelay: `${st.delay}ms`,
            }}
          />
        ))}

      {/* Quando o navegador não deixa a música tocar sozinha: um toque aqui toca (sem pular a abertura) */}
      {musicBlocked && !leaving && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playMusic();
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 min-h-10 px-4 rounded-full text-sm cursor-pointer border"
          style={{ color: 'var(--night-text)', borderColor: 'rgba(237,232,247,.3)' }}
        >
          ♪ Ouvir a música
        </button>
      )}

      {scene === 'seeker' ? (
        <div key="seeker" className="relative flex flex-col items-center gap-5">
          <Seeker size={240} />
          <div className="text-center" style={{ animation: 'fadeIn 1100ms cubic-bezier(0.22, 1, 0.36, 1) 1800ms both' }}>
            <h1 className="font-display text-4xl font-bold tracking-tight" style={{ color: 'var(--night-text)' }}>
              Prumo
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--night-muted)' }}>
              encontre seu norte
            </p>
          </div>
        </div>
      ) : (
        <div key="compass" className="relative flex flex-col items-center gap-5 animate-fadeIn">
          <CompassMark size={104} mode="settle" tone="night" settleMs={1100} />
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ color: 'var(--night-text)' }}>
            Prumo
          </h1>
          {firstRun && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                start();
              }}
              className="mt-2 px-6 py-3 rounded-full font-semibold text-base cursor-pointer"
              style={{ background: 'var(--gold)', color: 'var(--night-900)', animation: 'fadeIn 900ms ease-out 900ms both' }}
            >
              Toque para começar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
