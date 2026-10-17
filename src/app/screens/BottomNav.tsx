import React from 'react';
import {
  Sparkles,
  Home,
  CheckSquare,
  User,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

export const BottomNav: React.FC = () => {
  const { tab: activeTab, actions } = useApp();

  return (
    <div className="h-16 bg-white border-t border-[#E6E8E6] px-4 flex items-center justify-around shrink-0 select-none">
      {[
        { id: 'home' as const, label: 'Início', icon: Home },
        { id: 'roadmap' as const, label: 'Roteiro', icon: CheckSquare },
        { id: 'coach' as const, label: 'Coach', icon: Sparkles },
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
              isActive ? 'text-[#1F6F5C]' : 'text-[#5B615D] hover:text-[#1A1D1B]'
            }`}
          >
            <div className={`px-3 py-1 rounded-full transition-all duration-300 ${isActive ? 'bg-[#E3F2ED] scale-105 shadow-2xs' : 'bg-transparent'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] transition-all duration-200 ${isActive ? 'font-bold text-[#1F6F5C]' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
