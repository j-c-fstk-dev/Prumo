import React from 'react';

/**
 * O prumo de pedreiro (etapa 45): um fio com um peso na ponta que balança e para na vertical.
 * Ao lado, uma parede de tijolos que acompanha a linha reta. SVG leve, cores do tema.
 */
export const PlumbLine: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Um prumo de pedreiro: um fio com um peso na ponta, ao lado de uma parede reta">
    {/* Parede de tijolos, reta como o fio */}
    {[0, 1, 2, 3, 4, 5].map((row) => (
      <g key={row}>
        {[0, 1].map((col) => {
          const offset = row % 2 ? 9 : 0;
          return (
            <rect
              key={col}
              x={70 + offset + col * 18}
              y={22 + row * 13}
              width={16}
              height={11}
              rx={1.5}
              fill="var(--c-primary-soft, #ECE6F7)"
              stroke="var(--c-primary, #4B3F8C)"
              strokeOpacity={0.35}
            />
          );
        })}
      </g>
    ))}
    {/* Suporte em cima */}
    <rect x="36" y="8" width="30" height="5" rx="2.5" fill="var(--c-ink, #1C1A2E)" opacity="0.75" />
    {/* Fio e peso balançam juntos a partir do ponto de apoio */}
    <g className="plumb-swing">
      <line x1="51" y1="12" x2="51" y2="88" stroke="var(--c-ink, #1C1A2E)" strokeWidth="1.2" opacity="0.7" />
      <path d="M45 88 h12 l-6 16 z" fill="var(--gold, #E3B860)" stroke="#9C7A2E" strokeWidth="1" />
      <circle cx="51" cy="88" r="2" fill="#9C7A2E" />
    </g>
  </svg>
);
