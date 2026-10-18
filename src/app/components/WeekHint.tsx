import React from 'react';
import { weekStatus } from '../../domain/pacing';

/** Onde o passo está em relação à semana da jornada (etapa 42). Só informa: nada fica travado. */
export const WeekHint: React.FC<{ week: number; current: number; className?: string }> = ({ week, current, className = '' }) => {
  const status = weekStatus(week, current);
  const text =
    status === 'agora' ? `Sugerido pra esta semana (semana ${week})` : status === 'adiantar' ? `Da semana ${week} · dá pra adiantar` : `Era da semana ${week} · sem pressa, segue daqui`;
  return <p className={`text-xs mt-1.5 ${status === 'agora' ? 'text-primary font-semibold' : 'text-muted'} ${className}`}>{text}</p>;
};
