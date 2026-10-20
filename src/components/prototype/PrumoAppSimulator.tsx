import React, { useEffect, useState } from 'react';
import { setScreenForLogs } from '../../utils/telemetry';

const TAB_KEY = 'prumo_splash_tab';
function splashShownThisTab(): boolean {
  try {
    return sessionStorage.getItem(TAB_KEY) === '1';
  } catch {
    return false;
  }
}
function markSplashShownThisTab(): void {
  try {
    sessionStorage.setItem(TAB_KEY, '1');
  } catch {
    // sem sessionStorage: a abertura só repete
  }
}
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
import { NextCycleScreen } from '../../app/screens/NextCycleScreen';
import { BottomNav } from '../../app/screens/BottomNav';
import { ChapterComplete } from '../../app/components/ChapterComplete';
import { TimeAsk } from '../../app/components/TimeAsk';
import { GuideTour } from '../../app/components/GuideTour';

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
  next_cycle: NextCycleScreen,
  paywall: PaywallScreen,
};

const TABS = { home: HomeTab, roadmap: RoadmapTab, coach: CoachTab, notebook: NotebookTab, profile: ProfileTab };

/** Tela atual. A `key` remonta a tela a cada troca, o que dispara as animações de entrada. */
const CurrentScreen: React.FC = () => {
  const { screen, tab, sectionIndex, guideOpen } = useApp();
  useEffect(() => setScreenForLogs(screen === 'home' ? `aba:${tab}` : screen), [screen, tab]);
  if (screen === 'home') {
    const Tab = TABS[tab];
    return (
      <>
        <Tab key={`tab-${tab}`} />
        <BottomNav />
        <TimeAsk />
        <ChapterComplete />
        {guideOpen && <GuideTour />}
      </>
    );
  }
  const Screen = SCREENS[screen];
  return <Screen key={screen === 'value_signal' ? `value-signal-${sectionIndex}` : screen} />;
};

/**
 * Moldura do app: tela cheia no celular; no computador, centralizado no tamanho de um celular
 * (etapa 39: sem a barra de "preview", relógio e notch falsos do protótipo).
 */
const DeviceFrame: React.FC = () => {
  const { hydrated } = useApp();
  // A abertura toca uma vez por aba. Se o celular recarregar a página sozinho (por exemplo, ao voltar do
  // WhatsApp, quando o Android fecha a aba para liberar memória), o app entra direto (etapa 49).
  const [showBrandSplash, setShowBrandSplash] = useState(() => !splashShownThisTab());
  const doneSplash = () => {
    markSplashShownThisTab();
    setShowBrandSplash(false);
  };

  return (
    <div className="w-full sm:w-auto flex flex-col items-center justify-center sm:p-6">
      <div className="w-full h-[100dvh] sm:max-w-[400px] sm:h-[min(820px,calc(100dvh-48px))] sm:rounded-[32px] sm:shadow-2xl sm:border sm:border-line relative flex flex-col overflow-hidden">
        <div id="app-screen" data-ready={hydrated && !showBrandSplash ? '' : undefined} className="flex-1 bg-canvas overflow-hidden flex flex-col relative text-ink">
          {showBrandSplash && <CompassSplash onDone={doneSplash} />}
          {hydrated && <CurrentScreen />}
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
