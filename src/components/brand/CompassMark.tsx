import React from 'react';

type CompassMode = 'settle' | 'seek' | 'still';
type CompassTone = 'night' | 'day';

interface CompassMarkProps {
  size?: number;
  /** settle: oscila e se assenta no norte · seek: procura a direção · still: parada */
  mode?: CompassMode;
  /** night: dourado sobre fundo escuro · day: usa a cor do texto (currentColor) */
  tone?: CompassTone;
  settleMs?: number;
  className?: string;
}

const TICKS = Array.from({ length: 16 }, (_, i) => i * 22.5);

/** Bússola da marca Prumo. A agulha "encontrando o norte" é a metáfora central do app. */
export const CompassMark: React.FC<CompassMarkProps> = ({
  size = 80,
  mode = 'still',
  tone = 'day',
  settleMs = 1600,
  className = '',
}) => {
  const ring = tone === 'night' ? 'var(--gold-deco)' : 'currentColor';
  const north = tone === 'night' ? 'var(--gold)' : '#C86638';
  const south = tone === 'night' ? 'var(--lavender)' : 'currentColor';
  const needleClass = mode === 'settle' ? 'needle needle-settle' : mode === 'seek' ? 'needle needle-seek' : 'needle';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Bússola Prumo"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={ring} strokeWidth="1.5" opacity="0.9" />
      <circle cx="50" cy="50" r="39" fill="none" stroke={ring} strokeWidth="0.6" opacity="0.4" />

      {TICKS.map((deg) => {
        const cardinal = deg % 90 === 0;
        return (
          <line
            key={deg}
            x1="50"
            y1={cardinal ? 5.5 : 7}
            x2="50"
            y2={cardinal ? 13 : 10.5}
            stroke={ring}
            strokeWidth={cardinal ? 1.6 : 0.8}
            opacity={cardinal ? 1 : 0.55}
            transform={`rotate(${deg} 50 50)`}
          />
        );
      })}

      {/* Rosa dos ventos ao fundo */}
      <g opacity="0.18" fill={ring}>
        <polygon points="50,20 53,47 50,50 47,47" />
        <polygon points="80,50 53,53 50,50 53,47" />
        <polygon points="50,80 47,53 50,50 53,53" />
        <polygon points="20,50 47,47 50,50 47,53" />
      </g>

      <text x="50" y="26" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={north} fontFamily="Fraunces, Georgia, serif">
        N
      </text>

      <g className={needleClass} style={{ ['--settle-ms' as string]: `${settleMs}ms` }}>
        <polygon points="50,15 55,50 45,50" fill={north} />
        <polygon points="50,85 55,50 45,50" fill={south} opacity="0.45" />
      </g>
      <circle cx="50" cy="50" r="3.6" fill={ring} />
      <circle cx="50" cy="50" r="1.4" fill={tone === 'night' ? 'var(--night-900)' : '#FFFFFF'} />
    </svg>
  );
};
