import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { CompassSplash } from '../brand/CompassSplash';
import { AppProvider, useApp, type ScreenState } from '../../app/state/AppStore';
import { WelcomeScreen } from '../../app/screens/WelcomeScreen';
import { RegisterScreen } from '../../app/screens/RegisterScreen';
import { CarouselScreen } from '../../app/screens/CarouselScreen';
import { ValueSignalScreen } from '../../app/screens/ValueSignalScreen';
import { AnamneseScreen } from '../../app/screens/AnamneseScreen';
import { CalculatingScreen } from '../../app/screens/CalculatingScreen';
import { ResultScreen } from '../../app/screens/ResultScreen';
import { CustomPathScreen } from '../../app/screens/CustomPathScreen';
import { CommitmentScreen } from '../../app/screens/CommitmentScreen';
import { FutureLetterScreen } from '../../app/screens/FutureLetterScreen';
import { HomeTab } from '../../app/screens/HomeTab';
import { RoadmapTab } from '../../app/screens/RoadmapTab';
import { CoachTab } from '../../app/screens/CoachTab';
import { ProfileTab } from '../../app/screens/ProfileTab';
import { NotebookTab } from '../../app/screens/NotebookTab';
import { TaskDetailScreen } from '../../app/screens/TaskDetailScreen';
import { PaywallScreen } from '../../app/screens/PaywallScreen';
import { BottomNav } from '../../app/screens/BottomNav';
import { ChapterComplete } from '../../app/components/ChapterComplete';

const SCREENS: Record<Exclude<ScreenState, 'home'>, React.FC> = {
  splash: WelcomeScreen,
  register: RegisterScreen,
  carousel: CarouselScreen,
  value_signal: ValueSignalScreen,
  anamnese: AnamneseScreen,
  calculating: CalculatingScreen,
  result: ResultScreen,
  custom_path: CustomPathScreen,
  commitment: CommitmentScreen,
  future_letter: FutureLetterScreen,
  task_detail: TaskDetailScreen,
  paywall: PaywallScreen,
};

const TABS = { home: HomeTab, roadmap: RoadmapTab, coach: CoachTab, notebook: NotebookTab, profile: ProfileTab };

/** Tela atual. A `key` remonta a tela a cada troca, o que dispara as animações de entrada. */
const CurrentScreen: React.FC = () => {
  const { screen, tab, sectionIndex } = useApp();
  if (screen === 'home') {
    const Tab = TABS[tab];
    return (
      <>
        <Tab key={`tab-${tab}`} />
        <BottomNav />
        <ChapterComplete />
      </>
    );
  }
  const Screen = SCREENS[screen];
  return <Screen key={screen === 'value_signal' ? `value-signal-${sectionIndex}` : screen} />;
};

/** Moldura do app: tela cheia no celular, aparelho de preview no desktop. */
const DeviceFrame: React.FC = () => {
  const { screen, isSoundMuted, hydrated, actions } = useApp();
  const [showBrandSplash, setShowBrandSplash] = useState(true);

  return (
    <div className="w-full sm:w-auto flex flex-col items-center justify-center sm:p-6">
      {/* Barra de controle do preview (só no desktop) */}
      <div className="hidden sm:flex w-full max-w-[420px] mb-3 items-center justify-between text-xs text-muted px-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Preview Prumo</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Controle de Sons Táteis */}
          <button
            onClick={actions.toggleSound}
            className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs transition-all cursor-pointer ${
              isSoundMuted 
                ? 'bg-neutral-100 border-neutral-300 text-neutral-500 hover:text-neutral-700' 
                : 'bg-primary-soft border-primary/30 text-primary font-semibold'
            }`}
            title={isSoundMuted ? "Efeitos sonoros desativados (clique para ativar)" : "Efeitos sonoros táteis e sutis ativos (clique para mutar)"}
          >
            {isSoundMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Som: Mudo</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                <span>Som: Ativo</span>
              </>
            )}
          </button>

          {screen !== 'splash' && (
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                if (window.confirm('Reiniciar o preview? Isso apaga os dados salvos neste navegador.')) actions.resetAll();
              }}
              className="text-[11px] text-primary hover:underline flex items-center gap-1 px-2 py-1 rounded-full bg-surface border border-line cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Moldura do celular: só no desktop; no celular o app ocupa a tela inteira */}
      <div className="w-full h-[100dvh] sm:max-w-[400px] sm:h-[780px] sm:bg-[#12140F] sm:rounded-[48px] sm:p-3 sm:shadow-2xl sm:border-4 sm:border-[#2B3029] relative flex flex-col overflow-hidden">
        {/* Notch / Câmera Frontal */}
        <div className="hidden absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#12140F] rounded-full z-50 sm:flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-800" />
        </div>

        {/* Barra de Status do Android */}
        <div className="hidden h-6 w-full pt-1 px-6 sm:flex items-center justify-between text-[11px] text-muted z-40 shrink-0 font-medium select-none">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={actions.toggleSound}
              title={isSoundMuted ? "Som desativado (clique para ativar)" : "Som sutil ativo (clique para mutar)"}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {isSoundMuted ? <VolumeX className="w-3 h-3 text-neutral-500" /> : <Volume2 className="w-3 h-3 text-primary" />}
            </button>
            <span>5G</span>
            <div className="w-4 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-current rounded-xs" />
            </div>
          </div>
        </div>

        {/* Área de Conteúdo da Tela (Dentro do Frame) */}
        <div className="flex-1 bg-canvas sm:rounded-[36px] overflow-hidden flex flex-col relative text-ink">
          

          {showBrandSplash && <CompassSplash onDone={() => setShowBrandSplash(false)} />}
          {hydrated && <CurrentScreen />}
        </div>

        {/* Barra de Navegação Gestual do Android (Gesture Pill) */}
        <div className="hidden h-4 w-full sm:flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-neutral-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const PrumoAppSimulator: React.FC = () => (
  <AppProvider>
    <DeviceFrame />
  </AppProvider>
);
