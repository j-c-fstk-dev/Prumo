import React from 'react';
import { Sparkles, Home, CheckSquare, User, NotebookPen } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp, type TabId } from '../state/AppStore';

const TABS: { id: TabId; label: string; icon: typeof Home; big?: boolean }[] = [
  { id: 'roadmap', label: 'Roteiro', icon: CheckSquare },
  { id: 'coach', label: 'Coach', icon: Sparkles },
  { id: 'home', label: 'Início', icon: Home, big: true },
  { id: 'notebook', label: 'Caderno', icon: NotebookPen },
  { id: 'profile', label: 'Você', icon: User },
];

/**
 * Barra de baixo (etapas 29 e 32): só ícones, com a Início no meio e um pouco maior.
 * O nome de cada aba fica no aria-label (leitor de tela) e no título da própria tela.
 * A aba aberta fica na cor principal, com um tracinho embaixo do ícone.
 */
export const BottomNav: React.FC = () => {
  const { tab: activeTab, actions } = useApp();

  const go = (id: TabId) => {
    if (activeTab === id) return;
    soundEffects.playSoftTap();
    actions.goTab(id);
  };

  return (
    <nav className="h-14 shrink-0 select-none flex items-stretch px-1 bg-surface border-t border-line" aria-label="Navegação principal">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            aria-label={t.label}
            title={t.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 min-h-11 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95 ${
              isActive ? 'text-primary' : 'text-muted hover:text-ink'
            }`}
          >
            <Icon className={`${t.big ? 'w-7 h-7' : 'w-6 h-6'} transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.4 : 1.8} />
            <span className={`h-1 rounded-full bg-primary transition-all duration-300 ${isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'}`} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
};
