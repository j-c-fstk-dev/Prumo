import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ANAMNESE_SECTIONS, DEFAULT_DIAGNOSIS, TaskItem } from '../../data/prumoData';
import { applyAlternative, calculateDiagnosis, type Diagnosis, type DiagnosisOption, buildCustomDiagnosis, type CustomPathInput } from '../../domain/diagnosis';
import { buildPlanTasks } from '../../domain/tasks';
import { ACTIONS_TO_REPAIR, addDays, buildTimeline, computeStreak, isFreshStart, journeyDayKey, journeyDayNumber, tasksDoneOn, weekKey } from '../../domain/journey';
import { track } from '../../utils/telemetry';
import { can as canUse, currentPlan, trialDaysLeft, type Feature } from '../../domain/entitlements';
import type { KitId } from '../../domain/kit';

/** Paywall desligado no MVP: liga com VITE_PAYWALL_ENABLED=true (docs/etapas/11-paywall.md) */
const PAYWALL_ENABLED = import.meta.env.VITE_PAYWALL_ENABLED === 'true';
import { soundEffects } from '../../utils/soundEffects';
import { speak, stopSpeaking } from '../../utils/voice';
import { clearAll, loadValue, saveValue } from './storage';
import { NOTE_MAX, type Note, type NoteTag, type ProfileFieldId, type ProfileOverrides } from '../../domain/notebook';
import { cleanPerson, type Person } from '../../domain/people';
import { requestPersistence } from '../../utils/install';
import { deleteImages } from './images';

export type ScreenState =
  | 'splash'
  | 'register'
  | 'carousel'
  | 'value_signal'
  | 'anamnese'
  | 'calculating'
  | 'result'
  | 'custom_path'
  | 'commitment'
  | 'future_letter'
  | 'home'
  | 'task_detail'
  | 'paywall';

export type TabId = 'home' | 'roadmap' | 'coach' | 'notebook' | 'profile';
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
  /** live = IA respondeu · offline = resposta pronta (IA indisponível) · crisis = protocolo de crise */
  mode?: 'live' | 'offline' | 'crisis' | 'limited';
  reported?: boolean;
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
  /** Caderno do projeto (etapa 27): anotações, ficha editada e notas por tarefa. Só no aparelho. */
  notes: Note[];
  profileOverrides: ProfileOverrides;
  taskNotes: Record<string, string>;
  /** Pessoas (mini-CRM, etapa 28): dados de terceiros, só no aparelho e nunca enviados à IA */
  people: Person[];
  /** Última vez que a pessoa exportou o Caderno (lembrete de backup) */
  lastExportAt?: number;
  /** Quando dispensou o convite para instalar o app (volta depois de 7 dias) */
  installHintDismissedAt?: number;
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
  /** Modelos do kit já abertos em cada capítulo (limite do grátis: 1 por capítulo) */
  kitUsage: Record<number, KitId[]>;
  /** Consentimento antes do 1º uso do coach (o que é enviado e para onde: docs/pesquisa/07) */
  coachConsentAt?: number;
  theme: ThemePref;
  onboardingDone: boolean;
  /** Id aleatório e anônimo deste aparelho, só para o limite de uso do coach no servidor */
  clientId: string;
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
    notes: [],
    profileOverrides: {},
    taskNotes: {},
    people: [],
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
    kitUsage: {},
    theme: 'auto',
    onboardingDone: false,
    clientId: newClientId(),
  };
}

function newClientId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
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
    clientId: data.clientId || base.clientId,
  };
}

/** Soma uma ação ao dia de hoje e, se completar o remendo, remenda o dia de ontem. */
function withAction(d: PersistedState): PersistedState {
  const today = journeyDayKey();
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

  // Player de micro-áudio com voz sintética do aparelho, compartilhado entre home e detalhe da tarefa
  const [activeAudioTaskId, setActiveAudioTaskId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElapsedSec, setAudioElapsedSec] = useState(0);
  /** O aparelho não tem voz em português: a pessoa lê a transcrição */
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);

  const [isSoundMuted, setIsSoundMuted] = useState(soundEffects.getIsMuted());
  const [tapSounds, setTapSounds] = useState(soundEffects.getTapSounds());
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
        loadedData.current = saved;
        setData(saved);
        if (saved.onboardingDone) setScreen('home');
        // Em que dia da jornada a pessoa abriu o app: mostra quem volta no dia 2, 7, 30... (etapa 38)
        if (saved.startedAt) track('app_aberto', { dia: journeyDayNumber(saved.startedAt) });
      }
      if (!saved) loadedData.current = data;
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Salva imediatamente a cada mudança. Antes havia um atraso de 300 ms para agrupar a digitação,
  // mas fechar o app nesse intervalo perdia a última ação (achado pelos testes ponta a ponta).
  // As gravações no IndexedDB acontecem em ordem, então a mais recente sempre prevalece.
  // O estado que acabou de ser carregado não precisa ser regravado (evita sobrescrever outra aba)
  const loadedData = useRef<PersistedState | null>(null);
  useEffect(() => {
    if (!hydrated || data === loadedData.current) return;
    saveValue(STORAGE_KEY, data);
  }, [data, hydrated]);

  // Aplica o tema na página (o CSS troca as cores pelos tokens)
  useEffect(() => {
    const root = document.documentElement;
    if (data.theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = data.theme;
    const dark = data.theme === 'dark' || (data.theme === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#15122A' : '#FBF8F2');
  }, [data.theme]);

  // Relógio do player: conta enquanto a voz fala (o fim vem do próprio leitor de voz)
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => setAudioElapsedSec((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Para a voz se a tela do app for fechada
  useEffect(() => () => stopSpeaking(), []);

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

  const today = journeyDayKey();
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
  const journeyDay = data.startedAt ? journeyDayNumber(data.startedAt, new Date(now)) : null;
  const entitlementCtx = {
    paywallEnabled: PAYWALL_ENABLED,
    isPremium: data.isPremium,
    startedAt: data.startedAt,
    now,
    usage: { coachMessagesThisWeek: data.usage.coachByWeek[weekKey(today)] ?? 0, pivots: data.usage.pivots },
  };
  const plan = currentPlan(entitlementCtx);
  const can = (feature: Feature, extra: Partial<typeof entitlementCtx> & { chapterId?: number; executionKitUsedInChapter?: number } = {}) =>
    canUse(feature, { ...entitlementCtx, ...extra });
  /** Se não pode, abre a tela de planos com o motivo e devolve false */
  const guard = (feature: Feature, extra: Parameters<typeof can>[1] = {}): boolean => {
    const e = can(feature, extra);
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

    completeOnboarding: () => {
      setData((d) => ({ ...d, onboardingDone: true, startedAt: d.startedAt ?? Date.now() }));
      track('jornada_iniciada');
      // A partir daqui há dados que importam: pede ao navegador para não apagá-los (etapa 30)
      void requestPersistence();
    },

    saveDiagnosis: (diag: Diagnosis) => {
      track(data.diagnosis ? 'caminho_trocado' : 'diagnostico_concluido', { caminho: diag.productId });
      setData((d) => ({
        ...d,
        diagnosis: diag,
        diagnosisAt: Date.now(),
        usage: d.onboardingDone && d.diagnosis ? { ...d.usage, pivots: d.usage.pivots + 1 } : d.usage,
      }));
    },

    /** Check-in de 10 segundos: um por dia (refazer substitui) */
    checkIn: (text: string, mood?: CheckIn['mood']) => {
      soundEffects.playCompleteTask();
      const day = journeyDayKey();
      track('checkin', mood ? { humor: mood } : undefined);
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
    sealLetter: () => {
      track('carta_selada');
      setData((d) => (d.letter ? { ...d, letter: { ...d.letter, sealedAt: Date.now() } } : d));
    },
    /** O "pivô": troca o plano por uma das alternativas */
    /** "Quero criar o meu": a pessoa desenha o próprio caminho */
    chooseCustomPath: (input: CustomPathInput) => {
      if (!guard('pivot')) return;
      soundEffects.playSelectOption();
      setData((d) => ({ ...d, diagnosis: buildCustomDiagnosis(diagnosis, input, scoredAnswers), usage: { ...d.usage, pivots: d.usage.pivots + 1 } }));
    },

    /**
     * Sugestão de mensagem para uma pessoa da lista. Vai só a etapa, o contexto digitado e o resumo do
     * produto: o nome e o contato da pessoa nunca saem do aparelho (a IA escreve "[nome]").
     */
    suggestMessage: async (stage: string, context: string, another = false): Promise<{ mode: string; text?: string; reply?: string }> => {
      try {
        const response = await fetch('/api/coach/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stage,
            context,
            another,
            clientId: data.clientId,
            userContext: {
              userName: data.userName,
              diagnosis: {
                product: data.profileOverrides.offer || diagnosis?.product,
                audience: data.profileOverrides.audience || diagnosis?.audience,
              },
            },
          }),
        });
        if (!response.ok) return { mode: 'offline' };
        return await response.json();
      } catch {
        return { mode: 'offline' };
      }
    },

    /** Pede à IA uma sugestão organizada a partir da ideia contada com as próprias palavras */
    suggestPath: async (description: string): Promise<{ mode: string; idea?: { offer: string; audience: string; pain: string; format: string } }> => {
      try {
        const response = await fetch('/api/coach/idea', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, clientId: data.clientId, userName: data.userName }),
        });
        if (!response.ok) return { mode: 'offline' };
        return await response.json();
      } catch {
        return { mode: 'offline' };
      }
    },

    chooseAlternative: (alt: DiagnosisOption) => {
      if (!guard('pivot')) return;
      setData((d) => ({ ...d, diagnosis: applyAlternative(diagnosis, alt, scoredAnswers), usage: { ...d.usage, pivots: d.usage.pivots + 1 } }));
    },

    toggleTaskStatus: (taskId: string) => {
      const next: TaskItem['status'] = (data.taskStatus[taskId] ?? 'pending') === 'completed' ? 'pending' : 'completed';
      if (next === 'completed') {
        track('tarefa_concluida', { capitulo: tasks.find((t) => t.id === taskId)?.chapterId ?? 0 });
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
      setAudioElapsedSec(0);
      if (!nextPlaying) {
        stopSpeaking();
        setIsPlayingAudio(false);
        return;
      }
      const transcript = tasks.find((t) => t.id === taskId)?.audioCoach?.transcript ?? '';
      const ok = speak(transcript, (finishedOk) => {
        setIsPlayingAudio(false);
        if (!finishedOk) setVoiceUnavailable(true);
      });
      setVoiceUnavailable(!ok);
      setIsPlayingAudio(ok);
    },

    /** Abre um modelo do kit; conta no limite do capítulo só na primeira vez. Devolve se pode abrir. */
    openKit: (kitId: KitId, chapterId: number): boolean => {
      const used = data.kitUsage[chapterId] ?? [];
      if (used.includes(kitId)) return true;
      if (!guard('execution_kit', { chapterId, executionKitUsedInChapter: used.length })) return false;
      soundEffects.playSelectOption();
      setData((d) => ({ ...d, kitUsage: { ...d.kitUsage, [chapterId]: [...(d.kitUsage[chapterId] ?? []), kitId] } }));
      return true;
    },

    giveCoachConsent: () => {
      soundEffects.playSelectOption();
      setData((d) => ({ ...d, coachConsentAt: Date.now() }));
    },
    /** Denúncia de resposta da IA: vai para o log do servidor (só a resposta e o motivo) */
    reportCoachMessage: async (index: number, reason: 'ofensiva' | 'perigosa' | 'errada' | 'outro') => {
      const msg = data.coachMessages[index];
      if (!msg || msg.sender !== 'coach') return;
      setData((d) => ({ ...d, coachMessages: d.coachMessages.map((m, i) => (i === index ? { ...m, reported: true } : m)) }));
      try {
        await fetch('/api/coach/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reply: msg.text, reason }),
        });
      } catch (err) {
        console.error('Falha ao enviar denúncia:', err);
      }
    },

    toggleSound: () => setIsSoundMuted(soundEffects.toggleMute()),
    toggleTapSounds: () => setTapSounds(soundEffects.toggleTapSounds()),
    /** Automático → Claro → Noite → Automático */
    cycleTheme: () => {
      soundEffects.playSoftTap();
      setData((d) => ({ ...d, theme: ({ auto: 'light', light: 'dark', dark: 'auto' } as const)[d.theme] }));
    },

    sendCoachMessage: async (text: string) => {
      if (!text.trim() || isTyping) return;
      if (!guard('coach_message')) return;
      soundEffects.playSoftTap();
      const week = weekKey(journeyDayKey());
      track('coach_mensagem');
      setData((d) => ({ ...d, usage: { ...d.usage, coachByWeek: { ...d.usage.coachByWeek, [week]: (d.usage.coachByWeek[week] ?? 0) + 1 } } }));
      const history = data.coachMessages;
      setData((d) => ({ ...d, coachMessages: [...d.coachMessages, { sender: 'user', text, time: nowTime() }] }));
      setIsTyping(true);

      // A tarefa aberta por último, se ainda estiver pendente; senão, o próximo passo
      const task = selectedTask.status !== 'completed' ? selectedTask : nextStepTask;
      let reply: string;
      let mode: CoachMessage['mode'] = 'offline';
      try {
        const response = await fetch('/api/coach/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Contexto mínimo: as reflexões brutas não saem do aparelho (docs/pesquisa/07)
          body: JSON.stringify({
            message: text,
            clientId: data.clientId,
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
        mode = json.mode ?? (json.isLiveAI ? 'live' : 'offline');
        reply =
          json.reply ||
          `Tô com você, ${data.userName}. Qual é o menor pedaço desse passo que dá pra fazer em 15 minutos?`;
      } catch (err) {
        console.error('Falha ao consultar Coach:', err);
        reply = `Não consegui falar com o servidor agora, ${data.userName}. Enquanto isso: em "${task.title}", qual é o menor passo que dá pra fazer em 15 minutos? Às vezes é só mandar uma mensagem.`;
      }
      soundEffects.playTransition();
      setData((d) => ({ ...d, coachMessages: [...d.coachMessages, { sender: 'coach', text: reply, time: nowTime(), mode }] }));
      setIsTyping(false);
    },

    /** Caderno: nova anotação (opcionalmente ligada à tarefa em que a pessoa estava) */
    addNote: (text: string, tag: NoteTag, taskTitle?: string, images: string[] = []) => {
      const clean = text.trim().slice(0, NOTE_MAX);
      if (!clean && !images.length) return;
      soundEffects.playSelectOption();
      const now = Date.now();
      const note: Note = {
        id: `n${now}-${Math.random().toString(36).slice(2, 7)}`,
        text: clean,
        tag,
        taskTitle,
        images: images.length ? images : undefined,
        createdAt: now,
        updatedAt: now,
      };
      setData((d) => ({ ...d, notes: [note, ...d.notes] }));
    },
    updateNote: (id: string, patch: Partial<Pick<Note, 'text' | 'tag' | 'images'>>) =>
      setData((d) => ({
        ...d,
        notes: d.notes.map((n) =>
          n.id === id ? { ...n, ...patch, text: (patch.text ?? n.text).slice(0, NOTE_MAX), updatedAt: Date.now() } : n,
        ),
      })),
    deleteNote: (id: string) => {
      void deleteImages(data.notes.find((n) => n.id === id)?.images);
      setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
    },
    setProfileField: (id: ProfileFieldId, value: string) =>
      setData((d) => ({ ...d, profileOverrides: { ...d.profileOverrides, [id]: value.slice(0, 300) } })),
    setTaskNote: (taskId: string, text: string) =>
      setData((d) => ({ ...d, taskNotes: { ...d.taskNotes, [taskId]: text.slice(0, NOTE_MAX) } })),

    /** Pessoas: novo contato (manual ou trazido da agenda do celular) */
    /** Devolve o id da pessoa criada (para a lista já abrir a ficha dela) */
    addPerson: (input: Partial<Person> & { name: string }): string | undefined => {
      const clean = cleanPerson(input);
      if (!clean.name) return undefined;
      const now = Date.now();
      const stage = clean.stage ?? 'contato';
      const person: Person = {
        ...clean,
        name: clean.name,
        id: `p${now}-${Math.random().toString(36).slice(2, 7)}`,
        stage,
        stageHistory: [{ stage, at: now }],
        createdAt: now,
        updatedAt: now,
      };
      setData((d) => ({ ...d, people: [person, ...d.people] }));
      track('pessoa_adicionada');
      return person.id;
    },
    updatePerson: (id: string, patch: Partial<Omit<Person, 'id' | 'stageHistory' | 'createdAt'>>) =>
      setData((d) => ({
        ...d,
        people: d.people.map((p) => {
          if (p.id !== id) return p;
          const next = cleanPerson({ ...p, ...patch, updatedAt: Date.now() });
          // Guarda quando mudou de etapa (para métricas da fase 2)
          if (patch.stage && patch.stage !== p.stage) next.stageHistory = [...p.stageHistory, { stage: patch.stage, at: Date.now() }];
          return next;
        }),
      })),
    markExported: () => {
      track('caderno_exportado');
      setData((d) => ({ ...d, lastExportAt: Date.now() }));
    },
    dismissInstallHint: () => setData((d) => ({ ...d, installHintDismissedAt: Date.now() })),
    deletePerson: (id: string) => {
      void deleteImages(data.people.find((p) => p.id === id)?.images);
      setData((d) => ({ ...d, people: d.people.filter((p) => p.id !== id) }));
    },

    /** Apaga tudo do aparelho e volta ao início */
    resetAll: async () => {
      await clearAll();
      // Preferências guardadas fora do banco (sons, abertura já vista)
      try {
        for (const k of Object.keys(localStorage)) if (k.startsWith('prumo_')) localStorage.removeItem(k);
      } catch {
        // armazenamento bloqueado: nada a apagar
      }
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
    /** Dia da jornada (1 = o dia em que começou, pelo calendário, virando às 4h); null antes do onboarding */
    journeyDay,
    /** Dias desde o início da jornada (0 = hoje); null antes de terminar o onboarding */
    daysSinceStart: journeyDay === null ? null : journeyDay - 1,
    tasksDoneToday: tasksDoneOn(data.completedAt, today),
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
    voiceUnavailable,
    isSoundMuted,
    tapSounds,
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
