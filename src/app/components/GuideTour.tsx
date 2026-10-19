import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

interface Step {
  /** Elemento destacado (atributo data-tour). Sem alvo: o cartão aparece no meio da tela */
  target?: string;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  { title: 'Bem-vindo ao Prumo 🧭', text: 'Um passeio rápido pelo app: são 8 toques. Você pode pular quando quiser e ver de novo em Você → Sobre o Prumo.' },
  { target: 'checkin', title: 'Check-in do dia', text: 'Dez segundos pra contar como foi o dia. Até um dia difícil conta nos seus dias de prumo.' },
  { target: 'proximo', title: 'Seu próximo passo', text: 'O passo do roteiro que vem agora. Abra pra ver o que fazer e marque ✓ quando terminar.' },
  { target: 'rotinas', title: 'Rotina da semana', text: 'O que se repete na semana: revisar, avançar no produto, falar com pessoas. Marque quando fizer.' },
  { target: 'nav-roadmap', title: 'Roteiro', text: 'Todos os passos dos 90 dias, por semana. A semana só sugere: dá pra adiantar.' },
  {
    target: 'nav-coach',
    title: 'Coach',
    text: 'Travou? Pergunte ao coach: ele conhece o seu caminho e responde curto. O nome e o contato das pessoas nunca vão pra ele.',
  },
  {
    target: 'nav-notebook',
    title: 'Caderno',
    text: 'A ficha do que você oferece, anotações com fotos e as pessoas com quem você vai conversar, com mensagem pronta pro WhatsApp.',
  },
  { target: 'nav-profile', title: 'Você', text: 'Backup, tema, sons e o "Sobre o Prumo". Este guia fica lá, pra ver de novo quando quiser.' },
];

type Rect = { top: number; left: number; width: number; height: number };

/** Posição do alvo dentro da tela do app (que pode ser a moldura de celular no computador) */
function measure(target: string | undefined, root: HTMLElement): Rect | null {
  if (!target) return null;
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!el) return null;
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return { top: a.top - b.top, left: a.left - b.left, width: a.width, height: a.height };
}

/**
 * Guia interativo do app (etapa 47): destaca cada parte da Início e da barra, uma de cada vez.
 * Abre sozinho na primeira visita à Início e fica em Você → Sobre o Prumo para rever.
 */
export const GuideTour: React.FC = () => {
  const { actions } = useApp();
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const root = document.getElementById('app-screen');
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  // Traz o alvo para a tela e mede depois que a rolagem assenta
  useLayoutEffect(() => {
    if (!root) return;
    const el = step.target ? document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`) : null;
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setRect(measure(step.target, root));
    const t = setTimeout(() => setRect(measure(step.target, root)), 380);
    return () => clearTimeout(t);
  }, [i, root, step.target]);

  useEffect(() => {
    if (!root) return;
    const update = () => setRect(measure(step.target, root));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [root, step.target]);

  if (!root) return null;
  const height = root.clientHeight;
  const pad = 6;
  // Cartão do lado oposto ao destaque, para não cobrir o que está sendo explicado
  const below = rect ? rect.top + rect.height / 2 < height / 2 : false;
  const cardStyle: React.CSSProperties = !rect
    ? { top: '50%', transform: 'translateY(-50%)' }
    : below
      ? { top: Math.min(rect.top + rect.height + pad + 10, height - 200) }
      : { bottom: Math.max(height - rect.top + pad + 10, 12) };

  const next = () => {
    soundEffects.playSoftTap();
    if (last) actions.endGuide(true);
    else setI(i + 1);
  };

  return createPortal(
    <div className="absolute inset-0 z-[55]" role="dialog" aria-modal="true" aria-label="Guia do app">
      {/* Fundo escuro com um "buraco" no que está sendo mostrado */}
      {rect ? (
        <div
          className="absolute rounded-2xl ring-2 ring-[var(--gold)] transition-all duration-300 pointer-events-none"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: '0 0 0 9999px rgba(10, 8, 25, 0.62)',
          }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-[rgba(10,8,25,0.62)]" aria-hidden="true" />
      )}

      <div className="absolute left-3 right-3 p-4 rounded-2xl bg-surface border border-line shadow-xl space-y-2 animate-fadeIn" style={cardStyle}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">
            {i + 1} de {STEPS.length}
          </span>
          {!last && (
            <button onClick={() => actions.endGuide(false)} className="min-h-8 px-1 text-xs text-muted cursor-pointer">
              Pular o guia
            </button>
          )}
        </div>
        <h3 className="text-base font-bold text-ink">{step.title}</h3>
        <p className="text-sm text-ink leading-relaxed">{step.text}</p>
        <div className="flex gap-2 pt-1">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="min-h-10 px-4 rounded-xl border border-line text-sm text-ink cursor-pointer">
              Voltar
            </button>
          )}
          <button onClick={next} className="flex-1 min-h-10 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold cursor-pointer">
            {last ? 'Bora começar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>,
    root,
  );
};
