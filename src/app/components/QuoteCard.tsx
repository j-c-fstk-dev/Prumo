import React from 'react';
import { citacoesPublicaveis, type Citacao, type TemaCitacao } from '../../data/citacoes';
import { CARTOES_CIENCIA, type CartaoCiencia } from '../../data/ciencia';

type Item = { kind: 'citacao'; data: Citacao } | { kind: 'ciencia'; data: CartaoCiencia };

/** Número do dia local (troca à meia-noite do celular). */
function dayNumber(date = new Date()): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60_000) / 86_400_000);
}

/** Inspiração do dia: alterna citações verificadas e cartões de ciência, sem repetir dia após dia. */
export function itemOfTheDay(date = new Date()): Item {
  const items: Item[] = [
    ...citacoesPublicaveis().map((data) => ({ kind: 'citacao' as const, data })),
    ...CARTOES_CIENCIA.map((data) => ({ kind: 'ciencia' as const, data })),
  ];
  return items[dayNumber(date) % items.length];
}

const linkClass = 'underline decoration-dotted underline-offset-2';

export const QuoteView: React.FC<{ item: Item; compact?: boolean }> = ({ item, compact }) => {
  if (item.kind === 'ciencia') {
    const c = item.data;
    return (
      <div className={`rounded-xl bg-primary-soft border border-primary/20 ${compact ? 'p-3' : 'p-4'}`}>
        <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">🔬 Você sabia?</span>
        <p className="text-sm text-ink leading-relaxed">{c.texto}</p>
        <a href={c.fonte} target="_blank" rel="noopener noreferrer" className={`text-xs text-muted mt-1 inline-block ${linkClass}`}>
          {c.estudo}
        </a>
      </div>
    );
  }
  const q = item.data;
  return (
    <figure className={`rounded-xl bg-gold-soft border border-gold-line ${compact ? 'p-3' : 'p-4'}`}>
      <blockquote className="font-display text-base text-ink leading-snug whitespace-pre-line">“{q.texto}”</blockquote>
      <figcaption className="text-xs text-gold-ink mt-1.5">
        {q.autor} ·{' '}
        <a href={q.verificacao} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {q.obra}, {q.referencia}
        </a>
        {q.traducao === 'nossa' && <span className="text-muted"> · tradução nossa</span>}
      </figcaption>
    </figure>
  );
};

/** Citação verificada por tema (primeira disponível; nada aparece se não houver verificada). */
export const QuoteByTheme: React.FC<{ tema: TemaCitacao; compact?: boolean }> = ({ tema, compact = true }) => {
  const q = citacoesPublicaveis(tema)[0];
  if (!q) return null;
  return <QuoteView item={{ kind: 'citacao', data: q }} compact={compact} />;
};

export const DailyInspiration: React.FC = () => (
  <div className="space-y-1.5">
    <span className="text-sm font-bold text-ink block">Inspiração do dia</span>
    <QuoteView item={itemOfTheDay()} />
  </div>
);
