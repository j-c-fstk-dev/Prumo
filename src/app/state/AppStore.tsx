import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ANAMNESE_SECTIONS, DEFAULT_DIAGNOSIS, INITIAL_TASKS, TaskItem } from '../../data/prumoData';
import { applyAlternative, calculateDiagnosis, type Diagnosis, type DiagnosisOption } from '../../domain/diagnosis';
import { soundEffects } from '../../utils/soundEffects';
import { clearAll, loadValue, saveValue } from './storage';

export type ScreenState =
  | 'splash'
  | 'register'
  | 'carousel'
  | 'value_signal'
  | 'anamnese'
  | 'calculating'
  | 'result'
  | 'commitment'
  | 'future_letter'
  | 'home'
  | 'task_detail'
  | 'paywall';

export type TabId = 'home' | 'roadmap' | 'coach' | 'profile';
export type MacroGoal = 'renda_extra' | 'substituir' | 'proposito';

export interface CoachMessage {
  sender: 'user' | 'coach';
  text: string;
  time: string;
}

/** O que fica salvo no aparelho. Mudou o formato? Suba a versão e migre em `migrate`. */
interface PersistedState {
  version: 1;
  userName: string;
  macroGoal: MacroGoal;
  answers: Record<string, string[]>;
  reflections: Record<string, string>;
  /** Opções que a pessoa confirmou (ou recusou) a partir do texto livre: só as confirmadas pontuam */
  textOptions: { confirmed: Record<string, string[]>; dismissed: Record<string, string[]> };
  /** Só o progresso (sem entrada = pendente); o conteúdo vem de INITIAL_TASKS e pode mudar sem perder progresso */
  taskStatus: Record<string, TaskItem['status']>;
  coachMessages: CoachMessage[];
  /** Diagnóstico calculado ao fim da anamnese (null até lá) */
  diagnosis: Diagnosis | null;
  onboardingDone: boolean;
}

const STORAGE_KEY = 'prumo_state';

function initialPersisted(): PersistedState {
  return {
    version: 1,
    userName: '',
    macroGoal: 'renda_extra',
    answers: {},
    reflections: {},
    textOptions: { confirmed: {}, dismissed: {} },
    taskStatus: {},
    coachMessages: [],
    diagnosis: null,
    onboardingDone: false,
  };
}

function migrate(raw: unknown): PersistedState | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<PersistedState>;
  if (data.version !== 1) return null;
  const base = initialPersisted();
  return { ...base, ...data, textOptions: { ...base.textOptions, ...data.textOptions } };
}

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function useAppState() {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<PersistedState>(initialPersisted);

  // Navegação (não persiste: ao reabrir, vai para a home se o onboarding já foi feito)
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [tab, setTab] = useState<TabId>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionDirection, setQuestionDirection] = useState<'forward' | 'backward'>('forward');

  // Player de micro-áudio (simulado), compartilhado entre home e detalhe da tarefa
  const [activeAudioTaskId, setActiveAudioTaskId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElapsedSec, setAudioElapsedSec] = useState(12);

  const [isSoundMuted, setIsSoundMuted] = useState(soundEffects.getIsMuted());
  const [isTyping, setIsTyping] = useState(false);

  // Carrega o que estava salvo no aparelho
  useEffect(() => {
    let cancelled = false;
    loadValue<unknown>(STORAGE_KEY).then((raw) => {
      if (cancelled) return;
      const saved = migrate(raw);
      if (saved) {
        setData(saved);
        if (saved.onboardingDone) setScreen('home');
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Salva a cada mudança (com um pequeno atraso para agrupar digitação)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveValue(STORAGE_KEY, data), 300);
  }, [data, hydrated]);

  // Relógio do player simulado
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setAudioElapsedSec((prev) => {
        if (prev >= 70) {
          setIsPlayingAudio(false);
          soundEffects.playAudioCoachToggle(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const tasks: TaskItem[] = useMemo(
    () => INITIAL_TASKS.map((t) => ({ ...t, status: data.taskStatus[t.id] ?? 'pending' })),
    [data.taskStatus],
  );
  const nextStepTask = tasks.find((t) => t.status !== 'completed' && !t.isLocked) || tasks[0];
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? nextStepTask;

  const personalAnchor =
    data.reflections['q7_pride'] ||
    (data.answers['q7_pride']?.length
      ? ANAMNESE_SECTIONS[6]?.questions[0]?.options.find((o) => o.id === data.answers['q7_pride'][0])?.label ||
        DEFAULT_DIAGNOSIS.personalAnchor
      : DEFAULT_DIAGNOSIS.personalAnchor);

  // Respostas marcadas + opções confirmadas a partir do texto livre (é isso que o motor pontua)
  const scoredAnswers = useMemo(() => {
    const merged: Record<string, string[]> = { ...data.answers };
    for (const [q, ids] of Object.entries(data.textOptions.confirmed)) {
      merged[q] = Array.from(new Set([...(merged[q] ?? []), ...ids]));
    }
    return merged;
  }, [data.answers, data.textOptions.confirmed]);

  // Antes de calcular, mostra uma prévia a partir das respostas atuais
  const diagnosis: Diagnosis = useMemo(
    () => data.diagnosis ?? calculateDiagnosis(scoredAnswers, personalAnchor, data.reflections),
    [data.diagnosis, scoredAnswers, personalAnchor, data.reflections],
  );

  const update = useCallback((patch: Partial<PersistedState>) => setData((d) => ({ ...d, ...patch })), []);

  const actions = {
    go: (s: ScreenState) => setScreen(s),
    goTab: (t: TabId) => {
      setTab(t);
      setScreen('home');
    },
    openTask: (id: string) => {
      setSelectedTaskId(id);
      setScreen('task_detail');
    },

    setUserName: (userName: string) => update({ userName }),
    setMacroGoal: (macroGoal: MacroGoal) => update({ macroGoal }),
    setReflection: (questionId: string, text: string) =>
      setData((d) => ({ ...d, reflections: { ...d.reflections, [questionId]: text } })),

    selectOption: (questionId: string, optionId: string, isMultiple?: boolean, max?: number) => {
      soundEffects.playSelectOption();
      setData((d) => {
        const current = d.answers[questionId] || [];
        let next: string[];
        if (!isMultiple) next = [optionId];
        else if (current.includes(optionId)) next = current.filter((id) => id !== optionId);
        else if (max && current.length >= max) return d;
        else next = [...current, optionId];
        return { ...d, answers: { ...d.answers, [questionId]: next } };
      });
    },

    confirmTextOption: (questionId: string, optionId: string) => {
      soundEffects.playSelectOption();
      setData((d) => ({
        ...d,
        textOptions: {
          ...d.textOptions,
          confirmed: { ...d.textOptions.confirmed, [questionId]: [...(d.textOptions.confirmed[questionId] ?? []), optionId] },
        },
      }));
    },
    dismissTextOption: (questionId: string, optionId: string) => {
      soundEffects.playSoftTap();
      setData((d) => ({
        ...d,
        textOptions: {
          ...d.textOptions,
          dismissed: { ...d.textOptions.dismissed, [questionId]: [...(d.textOptions.dismissed[questionId] ?? []), optionId] },
        },
      }));
    },

    startAnamnese: () => {
      setSectionIndex(0);
      setQuestionIndex(0);
      setScreen('value_signal');
    },
    nextQuestion: () => {
      soundEffects.playTransition();
      setQuestionDirection('forward');
      const section = ANAMNESE_SECTIONS[sectionIndex];
      if (questionIndex < section.questions.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else if (sectionIndex < ANAMNESE_SECTIONS.length - 1) {
        setSectionIndex((i) => i + 1);
        setQuestionIndex(0);
        setScreen('value_signal');
      } else {
        setScreen('calculating');
      }
    },
    prevQuestion: () => {
      soundEffects.playBack();
      setQuestionDirection('backward');
      if (questionIndex > 0) {
        setQuestionIndex((i) => i - 1);
      } else if (sectionIndex > 0) {
        setSectionIndex((i) => i - 1);
        setQuestionIndex(ANAMNESE_SECTIONS[sectionIndex - 1].questions.length - 1);
      } else {
        setScreen('carousel');
      }
    },

    completeOnboarding: () => update({ onboardingDone: true }),

    saveDiagnosis: (d: Diagnosis) => update({ diagnosis: d }),
    /** O "pivô": troca o plano por uma das alternativas */
    chooseAlternative: (alt: DiagnosisOption) => update({ diagnosis: applyAlternative(diagnosis, alt, scoredAnswers) }),

    toggleTaskStatus: (taskId: string) => {
      const next = (data.taskStatus[taskId] ?? 'pending') === 'completed' ? 'pending' : 'completed';
      if (next === 'completed') {
        soundEffects.playCompleteTask();
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      } else {
        soundEffects.playSoftTap();
      }
      setData((d) => ({ ...d, taskStatus: { ...d.taskStatus, [taskId]: next } }));
    },

    toggleAudio: (taskId: string) => {
      const nextPlaying = !(isPlayingAudio && activeAudioTaskId === taskId);
      soundEffects.playAudioCoachToggle(nextPlaying);
      setActiveAudioTaskId(taskId);
      setIsPlayingAudio(nextPlaying);
    },

    toggleSound: () => setIsSoundMuted(soundEffects.toggleMute()),

    sendCoachMessage: async (text: string) => {
      if (!text.trim() || isTyping) return;
      soundEffects.playSoftTap();
      const history = data.coachMessages;
      setData((d) => ({ ...d, coachMessages: [...d.coachMessages, { sender: 'user', text, time: nowTime() }] }));
      setIsTyping(true);

      // A tarefa aberta por último, se ainda estiver pendente; senão, o próximo passo
      const task = selectedTask.status !== 'completed' ? selectedTask : nextStepTask;
      let reply: string;
      try {
        const response = await fetch('/api/coach/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Contexto mínimo: as reflexões brutas não saem do aparelho (docs/pesquisa/07)
          body: JSON.stringify({
            message: text,
            history,
            userContext: {
              userName: data.userName,
              macroGoal: data.macroGoal,
              personalAnchor,
              diagnosis: {
                niche: diagnosis.niche,
                nicheDescription: diagnosis.nicheDescription,
                product: diagnosis.product,
                audience: diagnosis.audience,
                channel: diagnosis.channel,
                timeline: diagnosis.timeline,
                // Derivados das opções, não do texto livre (que fica no aparelho)
                obstacle: diagnosis.obstacle,
                planB: diagnosis.planB,
              },
              currentTask: { title: task.title, whatToDo: task.whatToDo, chapterTitle: task.chapterTitle },
            },
          }),
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const json = await response.json();
        reply =
          json.reply ||
          `Estou com você, ${data.userName}. Como podemos simplificar esse próximo passo em uma micro-tarefa de 15 minutos?`;
      } catch (err) {
        console.error('Falha ao consultar Coach:', err);
        reply = `Boa pergunta, ${data.userName}! Para destravar em "${task.title}", o segredo é focar no Menor Esforço Viável (MEV). Monte um roteiro de 3 tópicos e valide com 1 ou 2 pessoas conhecidas. 15 minutos de foco agora é tudo o que você precisa para dar esse passo.`;
      }
      soundEffects.playTransition();
      setData((d) => ({ ...d, coachMessages: [...d.coachMessages, { sender: 'coach', text: reply, time: nowTime() }] }));
      setIsTyping(false);
    },

    /** Apaga tudo do aparelho e volta ao início */
    resetAll: async () => {
      await clearAll();
      setData(initialPersisted());
      setScreen('splash');
      setTab('home');
    },
  };

  return {
    hydrated,
    ...data,
    tasks,
    selectedTask,
    nextStepTask,
    personalAnchor,
    scoredAnswers,
    diagnosis,
    screen,
    tab,
    sectionIndex,
    questionIndex,
    questionDirection,
    activeAudioTaskId,
    isPlayingAudio,
    audioElapsedSec,
    isSoundMuted,
    isTyping,
    actions,
  };
}

export type AppStore = ReturnType<typeof useAppState>;

const AppContext = createContext<AppStore | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAppState();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export function useApp(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
