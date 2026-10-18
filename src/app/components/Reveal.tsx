import React from 'react';

/**
 * Bloco que surge suavemente quando a tela carrega, em sequência pelo `i` (0, 1, 2...).
 * Só anima na entrada; quem pede menos movimento vê tudo de uma vez.
 */
export const Reveal: React.FC<{ i: number; className?: string; children: React.ReactNode }> = ({ i, className = '', children }) => (
  // Atraso limitado: em telas longas, o fim não espera demais. Bloco vazio não ocupa espaço.
  <div className={`reveal empty:hidden ${className}`} style={{ ['--reveal-i' as string]: Math.min(i, 6) }}>
    {children}
  </div>
);
