import React from 'react';
import {
  Sparkles,
  Home,
  CheckSquare,
  User,
  NotebookPen,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const BottomNav: React.FC = () => {
  const { tab: activeTab, actions } = useApp();

  return (
    <div className="h-16 bg-surface border-t border-line px-1 flex items-center justify-around shrink-0 select-none">
      {[
        { id: 'home' as const, label: 'Início', icon: Home },
        { id: 'roadmap' as const, label: 'Roteiro', icon: CheckSquare },
        { id: 'coach' as const, label: 'Coach', icon: Sparkles },
        { id: 'notebook' as const, label: 'Caderno', icon: NotebookPen },
        { id: 'profile' as const, label: 'Você', icon: User }
      ].map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (activeTab !== tab.id) {
                soundEffects.playSoftTap();
                actions.goTab(tab.id);
              }
            }}
            className={`flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer transform active:scale-95 ${
              isActive ? 'text-primary' : 'text-muted hover:text-ink'
            }`}
          >
            <div className={`px-2.5 py-1 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-soft scale-105 shadow-2xs' : 'bg-transparent'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-xs transition-all duration-200 ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
