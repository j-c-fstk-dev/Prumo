import React from 'react';

/**
 * Ilustração da abertura (pedido do teste com usuários): uma pessoa no alto de um morro, com a bússola
 * acesa na mão, olhando o céu enquanto uma constelação se desenha. SVG leve, sem arquivos externos.
 */
const STARS: Array<[number, number]> = [
  [52, 58],
  [96, 34],
  [142, 52],
  [188, 30],
  [214, 76],
];

export const Seeker: React.FC<{ size?: number }> = ({ size = 240 }) => (
  <svg width={size} height={size} viewBox="0 0 260 260" overflow="visible" role="img" aria-label="Uma pessoa com uma bússola na mão olhando as estrelas">
    <defs>
      <radialGradient id="seeker-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F5E6B8" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#E3B860" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#E3B860" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="seeker-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2B2452" />
        <stop offset="100%" stopColor="#15122A" stopOpacity="0" />
      </linearGradient>
      {/* Esfuma as pontas do morro para ele se misturar ao céu */}
      <linearGradient id="seeker-fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
        <stop offset="30%" stopColor="#fff" stopOpacity="1" />
        <stop offset="70%" stopColor="#fff" stopOpacity="1" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="seeker-hill-mask" maskUnits="userSpaceOnUse" x="-150" y="180" width="560" height="90">
        <rect x="-150" y="180" width="560" height="90" fill="url(#seeker-fade)" />
      </mask>
    </defs>

    {/* Constelação se desenhando, uma linha de cada vez */}
    {STARS.slice(1).map(([x, y], i) => {
      const [px, py] = STARS[i];
      return (
        <line
          key={`l${i}`}
          x1={px}
          y1={py}
          x2={x}
          y2={y}
          pathLength={1}
          stroke="#B9A6FF"
          strokeOpacity="0.7"
          strokeWidth="1.2"
          className="constellation-line"
          style={{ animationDelay: `${900 + i * 380}ms` }}
        />
      );
    })}
    {STARS.map(([x, y], i) => (
      <circle
        key={`s${i}`}
        cx={x}
        cy={y}
        r={i === 3 ? 3.4 : 2.4}
        fill="#EDE8F7"
        className="star-node star-ignite"
        style={{ animationDelay: `${700 + i * 380}ms` }}
      />
    ))}

    {/* Morro */}
    <path d="M-150 248 Q130 190 410 248 L410 270 L-150 270 Z" fill="url(#seeker-hill)" mask="url(#seeker-hill-mask)" />

    {/* Pessoa (silhueta com contorno de luz), olhando para cima */}
    <g style={{ animation: 'fadeIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both' }}>
      <g fill="#0C0A1C" stroke="#B9A6FF" strokeOpacity="0.45" strokeWidth="0.8" strokeLinejoin="round">
        {/* pernas */}
        <path d="M123 196 L121 216 L126 216 L129 198 Z" />
        <path d="M133 198 L136 216 L141 216 L138 196 Z" />
        {/* corpo (casaco) */}
        <path d="M119 166 Q130 159 141 166 L144 200 Q130 204 116 200 Z" />
        {/* braço que segura a bússola, dobrado à frente do peito */}
        <path d="M139 170 Q149 176 151 182 L147 185 Q143 180 136 177 Z" />
        {/* cabeça inclinada para o céu */}
        <ellipse cx="131" cy="150" rx="8.5" ry="9.5" transform="rotate(-18 131 150)" />
      </g>

      {/* Bússola acesa */}
      <circle cx="152" cy="183" r="16" fill="url(#seeker-glow)" className="star-pulse" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <circle cx="152" cy="183" r="4.2" fill="#E3B860" stroke="#F5E6B8" strokeWidth="0.8" />
      <path d="M152 180.2 L153.2 183 L152 185.8 L150.8 183 Z" fill="#15122A" />
    </g>
  </svg>
);
