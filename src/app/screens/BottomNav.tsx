import React from 'react';
import { Sparkles, Home, CheckSquare, User, NotebookPen } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp, type TabId } from '../state/AppStore';

const SIDE_TABS: { id: TabId; label: string; icon: typeof Home }[][] = [
  [
    { id: 'roadmap', label: 'Roteiro', icon: CheckSquare },
    { id: 'coach', label: 'Coach', icon: Sparkles },
  ],
  [
    { id: 'notebook', label: 'Caderno', icon: NotebookPen },
    { id: 'profile', label: 'Você', icon: User },
  ],
];

/**
 * Barra de baixo (etapa 29): a Início fica no meio, num círculo maior e um pouco elevado, e a borda de
 * cima faz uma curva suave por cima dela. O contorno é um SVG que usa as cores do tema (claro e escuro).
 */
export const BottomNav: React.FC = () => {
  const { tab: activeTab, actions } = useApp();

  const go = (id: TabId) => {
    if (activeTab === id) return;
    soundEffects.playSoftTap();
    actions.goTab(id);
  };

  const sideButton = (t: { id: TabId; label: string; icon: typeof Home }) => {
    const Icon = t.icon;
    const isActive = activeTab === t.id;
    return (
      <button
        key={t.id}
        onClick={() => go(t.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`flex-1 min-h-11 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors active:scale-95 ${
          isActive ? 'text-primary' : 'text-muted hover:text-ink'
        }`}
      >
        <span className={`px-2.5 py-1 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-soft' : ''}`}>
          <Icon className="w-5 h-5" />
        </span>
        <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{t.label}</span>
      </button>
    );
  };

  const homeActive = activeTab === 'home';

  return (
    <nav className="relative h-[68px] shrink-0 select-none" aria-label="Navegação principal">
      {/* Fundo com a curva sobre o botão do meio (estica na largura; a curva fica centralizada) */}
      <svg className="absolute inset-x-0 -top-5 w-full h-[calc(100%+20px)] pointer-events-none" viewBox="0 0 390 88" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20 H126 C152 20 158 0 195 0 C232 0 238 20 264 20 H390 V88 H0 Z" fill="var(--c-surface)" />
        <path d="M0 20 H126 C152 20 158 0 195 0 C232 0 238 20 264 20 H390" fill="none" stroke="var(--c-line)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="relative h-full flex items-end pb-1.5 px-1">
        <div className="flex-1 flex">{SIDE_TABS[0].map(sideButton)}</div>

        {/* Início: maior, no centro, levemente elevada */}
        <div className="relative w-[84px] h-full flex flex-col items-center justify-end">
          <button
            onClick={() => go('home')}
            aria-label="Início"
            aria-current={homeActive ? 'page' : undefined}
            className={`absolute left-1/2 -translate-x-1/2 -top-[13px] w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 ${
              homeActive ? 'bg-primary text-on-primary shadow-lg scale-105' : 'bg-surface text-primary border-2 border-primary/40 shadow-md'
            }`}
          >
            <Home className="w-6 h-6" />
          </button>
          <span className={`text-xs ${homeActive ? 'font-bold text-primary' : 'font-medium text-muted'}`}>Início</span>
        </div>

        <div className="flex-1 flex">{SIDE_TABS[1].map(sideButton)}</div>
      </div>
    </nav>
  );
};
