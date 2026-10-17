import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ANAMNESE_SECTIONS, DEFAULT_DIAGNOSIS, TaskItem } from '../../data/prumoData';
import { applyAlternative, calculateDiagnosis, type Diagnosis, type DiagnosisOption } from '../../domain/diagnosis';
import { buildPlanTasks } from '../../domain/tasks';
import { ACTIONS_TO_REPAIR, addDays, buildTimeline, computeStreak, dayKey, isFreshStart, weekKey } from '../../domain/journey';
import { can as canUse, currentPlan, trialDaysLeft, type Feature } from '../../domain/entitlements';

/** Paywall desligado no MVP: liga com VITE_PAYWALL_ENABLED=true (docs/etapas/11-paywall.md) */
const PAYWALL_ENABLED = import.meta.env.VITE_PAYWALL_ENABLED === 'true';
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
/** auto segue o sistema; light = "Pergaminho"; dark = "Noite" (docs/pesquisa/03) */
export type ThemePref = 'auto' | 'light' | 'dark';

/** Tarefa criada pela própria pessoa (fora do plano) */
export interface PersonalTask {
  id: string;
  title: string;
  /** "quando eu ___" (intenção de implementação) */
  when?: string;
  done: boolean;
  createdAt: number;
}

/** Carta em duas vias: ida (hoje → 90 dias) e resposta escrita pela pessoa como seu eu futuro */
export interface FutureLetter {
  toFuture: string;
  fromFuture: string;
  sealedAt?: number;
}

export interface CheckIn {
  day: string;
  text: string;
  mood?: 'bem' | 'ok' | 'dificil';
}

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
  /** Só o progresso (sem entrada = pendente); o conteúdo vem do roteiro (domain/tasks.ts) e pode mudar sem perder progresso */
  taskStatus: Record<string, TaskItem['status']>;
  /** Ajustes da pessoa nas tarefas do plano (título e "quando vou fazer") */
  planEdits: Record<string, { title?: string; when?: string }>;
  personalTasks: PersonalTask[];
  coachMessages: CoachMessage[];
  /** Diagnóstico calculado ao fim da anamnese (null até lá) */
  diagnosis: Diagnosis | null;
  letter: FutureLetter | null;
  diagnosisAt?: number;
  /** Ritmo diário (domain/journey.ts) */
  actionsByDay: Record<string, number>;
  repairedDays: string[];
  checkIns: CheckIn[];
  /** Quando cada tarefa do plano foi concluída (linha do tempo) */
  completedAt: Record<string, number>;
  celebratedChapters: number[];
  /** Fim do onboarding: início do teste de fundador */
  startedAt?: number;
  isPremium: boolean;
  /** Uso dos recursos com limite no grátis */
  usage: { coachByWeek: Record<string, number>; pivots: number };
  theme: ThemePref;
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
    planEdits: {},
    personalTasks: [],
    coachMessages: [],
    diagnosis: null,
    letter: null,
    actionsByDay: {},
    repairedDays: [],
    checkIns: [],
    completedAt: {},
    celebratedChapters: [],
    isPremium: false,
    usage: { coachByWeek: {}, pivots: 0 },
    theme: 'auto',
    onboardingDone: false,
  };
}

function migrate(raw: unknown): PersistedState | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<PersistedState>;
  if (data.version !== 1) return null;
  const base = initialPersisted();
  return {
    ...base,
    ...data,
    textOptions: { ...base.textOptions, ...data.textOptions },
    usage: { ...base.usage, ...data.usage },
  };
}

/** Soma uma ação ao dia de hoje e, se completar o remendo, remenda o dia de ontem. */
function withAction(d: PersistedState): PersistedState {
  const today = dayKey(new Date());
  const before = computeStreak({ actionsByDay: d.actionsByDay, repairedDays: d.repairedDays, today });
  const actionsByDay = { ...d.actionsByDay, [today]: (d.actionsByDay[today] ?? 0) + 1 };
  const repairedDays =
    before.canRepairYesterday && actionsByDay[today] >= ACTIONS_TO_REPAIR ? [...d.repairedDays, addDays(today, -1)] : d.repairedDays;
  return { ...d, actionsByDay, repairedDays };
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
  /** Por que o paywall foi aberto (mostrado na tela de planos) */
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
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

  // Aplica o tema na página (o CSS troca as cores pelos tokens)
  useEffect(() => {
    const root = document.documentElement;
    if (data.theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = data.theme;
    const dark = data.theme === 'dark' || (data.theme === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#15122A' : '#FBF8F2');
  }, [data.theme]);

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

  // Roteiro montado a partir do diagnóstico + progresso + ajustes da pessoa
  const tasks: TaskItem[] = useMemo(
    () =>
      buildPlanTasks(data.diagnosis).map((t) => ({
        ...t,
        ...data.planEdits[t.id],
        title: data.planEdits[t.id]?.title || t.title,
        status: data.taskStatus[t.id] ?? 'pending',
      })),
    [data.diagnosis, data.taskStatus, data.planEdits],
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

  const today = dayKey(new Date());
  const streak = computeStreak({ actionsByDay: data.actionsByDay, repairedDays: data.repairedDays, today });
  const todayCheckIn = data.checkIns.find((c) => c.day === today);
  const freshStart = isFreshStart(today);
  const timeline = buildTimeline({
    diagnosisAt: data.diagnosisAt,
    letterSealedAt: data.letter?.sealedAt,
    tasks,
    completedAt: data.completedAt,
  });

  const now = Date.now();
  const entitlementCtx = {
    paywallEnabled: PAYWALL_ENABLED,
    isPremium: data.isPremium,
    startedAt: data.startedAt,
    now,
    usage: { coachMessagesThisWeek: data.usage.coachByWeek[weekKey(today)] ?? 0, pivots: data.usage.pivots },
  };
  const plan = currentPlan(entitlementCtx);
  const can = (feature: Feature) => canUse(feature, entitlementCtx);
  /** Se não pode, abre a tela de planos com o motivo e devolve false */
  const guard = (feature: Feature): boolean => {
    const e = can(feature);
    if (e.allowed) return true;
    setPaywallReason(e.reason ?? null);
    setScreen('paywall');
    return false;
  };

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
      // Refazer o diagnóstico depois da jornada começar conta como troca de plano
      if (data.onboardingDone && data.diagnosis && !guard('pivot')) return;
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

    completeOnboarding: () => setData((d) => ({ ...d, onboardingDone: true, startedAt: d.startedAt ?? Date.now() })),

    saveDiagnosis: (diag: Diagnosis) =>
      setData((d) => ({
        ...d,
        diagnosis: diag,
        diagnosisAt: Date.now(),
        usage: d.onboardingDone && d.diagnosis ? { ...d.usage, pivots: d.usage.pivots + 1 } : d.usage,
      })),

    /** Check-in de 10 segundos: um por dia (refazer substitui) */
    checkIn: (text: string, mood?: CheckIn['mood']) => {
      soundEffects.playCompleteTask();
      const day = dayKey(new Date());
      setData((d) => {
        const already = d.checkIns.some((c) => c.day === day);
        const next = { ...d, checkIns: [...d.checkIns.filter((c) => c.day !== day), { day, text: text.trim(), mood }] };
        return already ? next : withAction(next);
      });
    },
    markChapterCelebrated: (chapterId: number) =>
      setData((d) => ({ ...d, celebratedChapters: Array.from(new Set([...d.celebratedChapters, chapterId])) })),

    setLetter: (patch: Partial<FutureLetter>) =>
      setData((d) => ({ ...d, letter: { toFuture: '', fromFuture: '', ...d.letter, ...patch } })),
    sealLetter: () =>
      setData((d) => (d.letter ? { ...d, letter: { ...d.letter, sealedAt: Date.now() } } : d)),
    /** O "pivô": troca o plano por uma das alternativas */
    chooseAlternative: (alt: DiagnosisOption) => {
      if (!guard('pivot')) return;
      setData((d) => ({ ...d, diagnosis: applyAlternative(diagnosis, alt, scoredAnswers), usage: { ...d.usage, pivots: d.usage.pivots + 1 } }));
    },

    toggleTaskStatus: (taskId: string) => {
      const next: TaskItem['status'] = (data.taskStatus[taskId] ?? 'pending') === 'completed' ? 'pending' : 'completed';
      if (next === 'completed') {
        soundEffects.playCompleteTask();
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      } else {
        soundEffects.playSoftTap();
      }
      setData((d) => {
        const completedAt = { ...d.completedAt };
        if (next === 'completed') completedAt[taskId] = Date.now();
        else delete completedAt[taskId];
        const updated = { ...d, taskStatus: { ...d.taskStatus, [taskId]: next }, completedAt };
        return next === 'completed' ? withAction(updated) : updated;
      });
    },

    /** "Quando vou fazer" de uma tarefa do plano (vazio remove) */
    setPlanTaskWhen: (taskId: string, when: string) =>
      setData((d) => ({ ...d, planEdits: { ...d.planEdits, [taskId]: { ...d.planEdits[taskId], when: when.trim() || undefined } } })),
    renamePlanTask: (taskId: string, title: string) =>
      setData((d) => ({ ...d, planEdits: { ...d.planEdits, [taskId]: { ...d.planEdits[taskId], title: title.trim() || undefined } } })),

    addPersonalTask: (title: string, when?: string) => {
      if (!title.trim()) return;
      soundEffects.playSelectOption();
      const task: PersonalTask = {
        id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        when: when?.trim() || undefined,
        done: false,
        createdAt: Date.now(),
      };
      setData((d) => ({ ...d, personalTasks: [...d.personalTasks, task] }));
    },
    updatePersonalTask: (id: string, patch: Partial<Pick<PersonalTask, 'title' | 'when'>>) =>
      setData((d) => ({
        ...d,
        personalTasks: d.personalTasks.map((t) =>
          t.id === id
            ? { ...t, ...patch, title: patch.title?.trim() || t.title, when: patch.when !== undefined ? patch.when.trim() || undefined : t.when }
            : t,
        ),
      })),
    togglePersonalTask: (id: string) => {
      const task = data.personalTasks.find((t) => t.id === id);
      if (task && !task.done) soundEffects.playCompleteTask();
      else soundEffects.playSoftTap();
      setData((d) => {
        const updated = { ...d, personalTasks: d.personalTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) };
        return task && !task.done ? withAction(updated) : updated;
      });
    },
    deletePersonalTask: (id: string) => {
      soundEffects.playBack();
      setData((d) => ({ ...d, personalTasks: d.personalTasks.filter((t) => t.id !== id) }));
    },
    movePersonalTask: (id: string, direction: -1 | 1) =>
      setData((d) => {
        const list = [...d.personalTasks];
        const i = list.findIndex((t) => t.id === id);
        const j = i + direction;
        if (i < 0 || j < 0 || j >= list.length) return d;
        [list[i], list[j]] = [list[j], list[i]];
        return { ...d, personalTasks: list };
      }),

    toggleAudio: (taskId: string) => {
      const nextPlaying = !(isPlayingAudio && activeAudioTaskId === taskId);
      soundEffects.playAudioCoachToggle(nextPlaying);
      setActiveAudioTaskId(taskId);
      setIsPlayingAudio(nextPlaying);
    },

    toggleSound: () => setIsSoundMuted(soundEffects.toggleMute()),
    /** Automático → Claro → Noite → Automático */
    cycleTheme: () => {
      soundEffects.playSoftTap();
      setData((d) => ({ ...d, theme: ({ auto: 'light', light: 'dark', dark: 'auto' } as const)[d.theme] }));
    },

    sendCoachMessage: async (text: string) => {
      if (!text.trim() || isTyping) return;
      if (!guard('coach_message')) return;
      soundEffects.playSoftTap();
      const week = weekKey(dayKey(new Date()));
      setData((d) => ({ ...d, usage: { ...d.usage, coachByWeek: { ...d.usage.coachByWeek, [week]: (d.usage.coachByWeek[week] ?? 0) + 1 } } }));
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
              currentTask: {
                title: task.title,
                whatToDo: task.whatToDo,
                chapterTitle: task.chapterTitle,
                // Camada 3: só os códigos; o servidor monta a lista a partir do mesmo catálogo curado
                toolCategories: task.toolCategories ?? [],
              },
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
    streak,
    plan,
    can,
    paywallReason,
    trialDaysLeft: trialDaysLeft(data.startedAt, now),
    paywallEnabled: PAYWALL_ENABLED,
    todayCheckIn,
    freshStart,
    timeline,
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
