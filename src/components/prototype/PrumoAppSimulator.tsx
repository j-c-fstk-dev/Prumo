import React, { useState, useEffect } from 'react';
import { 
  ANAMNESE_SECTIONS, 
  DEFAULT_DIAGNOSIS, 
  INITIAL_TASKS, 
  TaskItem, 
  DiagnosisProfile 
} from '../../data/prumoData';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Send, 
  BookOpen, 
  Target, 
  ChevronRight, 
  Lock, 
  RotateCcw, 
  HelpCircle, 
  Flame, 
  Home, 
  CheckSquare, 
  MessageSquare, 
  User, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Bookmark,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects';

type ScreenState = 
  | 'splash' 
  | 'register' 
  | 'carousel' 
  | 'value_signal'
  | 'anamnese' 
  | 'calculating' 
  | 'result' 
  | 'commitment'
  | 'future_letter'
  | 'generating_roadmap'
  | 'home' 
  | 'task_detail' 
  | 'coach' 
  | 'profile' 
  | 'paywall';

export const PrumoAppSimulator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'roadmap' | 'coach' | 'profile'>('home');

  // User state
  const [userName, setUserName] = useState('Ana');
  const [macroGoal, setMacroGoal] = useState<'renda_extra' | 'substituir' | 'proposito'>('renda_extra');
  
  // Anamnese state
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionDirection, setQuestionDirection] = useState<'forward' | 'backward'>('forward');
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    'q1_help': ['conselhos', 'planilhas'],
    'q1_preference': ['ensinar'],
    'q2_themes': ['produtividade'],
    'q2_community': ['solo'],
    'q3_hours': ['pouco'],
    'q3_investment': ['zero'],
    'q4_goal': ['primeiro_real'],
    'q4_timeline': ['medio'],
    'q5_exposure': ['moderado'],
    'q5_rejection': ['resiliente'],
    'q6_tools': ['instagram', 'notion'],
    'q7_pride': ['autor_metodo']
  });

  // Reflexões abertas em texto livre (com as próprias palavras)
  const [reflections, setReflections] = useState<Record<string, string>>({
    'q7_pride': 'Quero provar para mim mesma que consigo ter um método próprio e gerar minhas primeiras vendas com dignidade e paz de espírito.'
  });
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  // Som da UX
  const [isSoundMuted, setIsSoundMuted] = useState(soundEffects.getIsMuted());

  const handleToggleSound = () => {
    const next = soundEffects.toggleMute();
    setIsSoundMuted(next);
  };

  // Ritual de Compromisso (Hold to Commit)
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = React.useRef<any>(null);

  // Audio Coach state
  const [activeAudioTask, setActiveAudioTask] = useState<TaskItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElapsedSec, setAudioElapsedSec] = useState(12);
  const [showTranscript, setShowTranscript] = useState(false);

  // Calculating state steps
  const [calcStep, setCalcStep] = useState(0);

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<TaskItem>(INITIAL_TASKS[1]); // t2
  const [activeFilterPhase, setActiveFilterPhase] = useState<'todas' | 'fundacao' | 'marketing' | 'lancamento'>('todas');

  // Coach state
  const [coachMessages, setCoachMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string; time: string }>>([
    {
      sender: 'coach',
      text: 'Tô aqui! Como você está na tarefa "Criar sua versão mínima entregável", o que tá travando hoje?',
      time: '18:30'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Justification accordion in Result screen
  const [showJustification, setShowJustification] = useState(false);

  // Carousel slide
  const [carouselSlide, setCarouselSlide] = useState(0);

  // Áudio playback ticker
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioElapsedSec(prev => {
          if (prev >= 70) {
            setIsPlayingAudio(false);
            soundEffects.playAudioCoachToggle(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Limpeza de timeout do Hold
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const handleStartHold = () => {
    setIsHolding(true);
    soundEffects.playHoldPulse(5);
    const startTime = Date.now();
    let lastProgressBand = 0;
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / 2600) * 100));
      setHoldProgress(progress);

      const currentBand = Math.floor(progress / 18);
      if (currentBand > lastProgressBand) {
        lastProgressBand = currentBand;
        soundEffects.playHoldPulse(progress);
      }

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        soundEffects.playCommitmentSuccess();
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
          setCurrentScreen('future_letter');
        }, 500);
      }
    }, 25);
  };

  const handleCancelHold = () => {
    if (holdProgress < 100) {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setIsHolding(false);
      setHoldProgress(0);
      soundEffects.playSoftTap();
    }
  };

  // Frase de orgulho / Âncora Pessoal
  const personalAnchor = reflections['q7_pride'] || 
    (answers['q7_pride']?.length ? 
      ANAMNESE_SECTIONS[6]?.questions[0]?.options.find(o => o.id === answers['q7_pride'][0])?.label || DEFAULT_DIAGNOSIS.personalAnchor
      : DEFAULT_DIAGNOSIS.personalAnchor);

  // Trigger calculating animation
  useEffect(() => {
    if (currentScreen === 'calculating') {
      setCalcStep(0);
      soundEffects.playTransition();
      const timer1 = setTimeout(() => {
        setCalcStep(1);
        soundEffects.playSoftTap();
      }, 1000);
      const timer2 = setTimeout(() => {
        setCalcStep(2);
        soundEffects.playSoftTap();
      }, 2200);
      const timer3 = setTimeout(() => {
        setCalcStep(3);
        soundEffects.playSoftTap();
      }, 3400);
      const timer4 = setTimeout(() => {
        setCalcStep(4);
        soundEffects.playCompleteTask();
        setTimeout(() => setCurrentScreen('result'), 1200);
      }, 4600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [currentScreen]);

  // Handle task complete toggle
  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        if (newStatus === 'completed') {
          soundEffects.playCompleteTask();
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
        } else {
          soundEffects.playSoftTap();
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // Current section and question
  const currentSection = ANAMNESE_SECTIONS[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, optionId: string, isMultiple?: boolean, max?: number) => {
    soundEffects.playSelectOption();
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (!isMultiple) {
        return { ...prev, [questionId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) };
      }
      if (max && current.length >= max) {
        return prev;
      }
      return { ...prev, [questionId]: [...current, optionId] };
    });
  };

  const handleNextQuestion = () => {
    soundEffects.playTransition();
    setQuestionDirection('forward');
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowReflectionInput(false);
    } else if (currentSectionIndex < ANAMNESE_SECTIONS.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setShowReflectionInput(false);
      setCurrentScreen('value_signal');
    } else {
      setCurrentScreen('calculating');
    }
  };

  const handlePrevQuestion = () => {
    soundEffects.playBack();
    setQuestionDirection('backward');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowReflectionInput(false);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentQuestionIndex(ANAMNESE_SECTIONS[currentSectionIndex - 1].questions.length - 1);
      setShowReflectionInput(false);
    } else {
      setCurrentScreen('carousel');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    soundEffects.playSoftTap();

    const userMsg = {
      sender: 'user' as const,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCoachMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: coachMessages,
          userContext: {
            userName,
            macroGoal,
            personalAnchor,
            diagnosis: DEFAULT_DIAGNOSIS,
            currentTask: {
              title: selectedTask?.title || nextStepTask.title,
              whatToDo: selectedTask?.whatToDo || nextStepTask.whatToDo,
              chapterTitle: selectedTask?.chapterTitle || nextStepTask.chapterTitle,
            },
            reflections,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || `Estou com você, ${userName}. Como podemos simplificar esse próximo passo em uma micro-tarefa de 15 minutos?`;

      soundEffects.playTransition();
      setCoachMessages(prev => [
        ...prev,
        {
          sender: 'coach' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Falha ao consultar Coach:', err);
      // Fallback gracioso caso haja oscilação de rede
      const taskName = selectedTask?.title || nextStepTask.title;
      let reply = `Boa pergunta, ${userName}! Para destravar em "${taskName}", o segredo é focar no Menor Esforço Viável (MEV). Monte um roteiro de 3 tópicos e valide com 1 ou 2 pessoas conhecidas. 15 minutos de foco agora é tudo o que você precisa para dar esse passo.`;
      
      soundEffects.playTransition();
      setCoachMessages(prev => [
        ...prev,
        {
          sender: 'coach' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };



  // Next step task (first non-completed task)
  const nextStepTask = tasks.find(t => t.status !== 'completed' && !t.isLocked) || tasks[0];

  // Progress metrics
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const fundacaoTasks = tasks.filter(t => t.phaseId === 'fundacao');
  const fundacaoPercent = Math.round((fundacaoTasks.filter(t => t.status === 'completed').length / fundacaoTasks.length) * 100);

  return (
    <div className="w-full sm:w-auto flex flex-col items-center justify-center sm:p-6">
      {/* Barra de controle do preview (só no desktop) */}
      <div className="hidden sm:flex w-full max-w-[420px] mb-3 items-center justify-between text-xs text-[#5B615D] px-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-pulse" />
          <span>Preview Prumo</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Controle de Sons Táteis */}
          <button
            onClick={handleToggleSound}
            className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs transition-all cursor-pointer ${
              isSoundMuted 
                ? 'bg-neutral-100 border-neutral-300 text-neutral-500 hover:text-neutral-700' 
                : 'bg-[#E3F2ED] border-[#1F6F5C]/30 text-[#1F6F5C] font-semibold hover:bg-[#d6ebe4]'
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
                <Volume2 className="w-3.5 h-3.5 text-[#1F6F5C]" />
                <span>Som: Ativo</span>
              </>
            )}
          </button>

          {currentScreen !== 'splash' && (
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                setCurrentScreen('splash');
                setActiveTab('home');
              }}
              className="text-[11px] text-[#1F6F5C] hover:underline flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-[#E6E8E6] cursor-pointer"
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
        <div className="hidden h-6 w-full pt-1 px-6 sm:flex items-center justify-between text-[11px] text-[#5B615D] z-40 shrink-0 font-medium select-none">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleSound}
              title={isSoundMuted ? "Som desativado (clique para ativar)" : "Som sutil ativo (clique para mutar)"}
              className="hover:text-[#1F6F5C] transition-colors cursor-pointer"
            >
              {isSoundMuted ? <VolumeX className="w-3 h-3 text-neutral-500" /> : <Volume2 className="w-3 h-3 text-[#1F6F5C]" />}
            </button>
            <span>5G</span>
            <div className="w-4 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-current rounded-xs" />
            </div>
          </div>
        </div>

        {/* Área de Conteúdo da Tela (Dentro do Frame) */}
        <div className="flex-1 bg-[#F7F9F8] sm:rounded-[36px] overflow-hidden flex flex-col relative text-[#1A1D1B]">

          {/* ============================================================== */}
          {/* TELA A1: SPLASH & BOAS-VINDAS */}
          {/* ============================================================== */}
          {currentScreen === 'splash' && (
            <div className="flex-1 flex flex-col justify-between p-6 text-center select-none animate-fadeIn">
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                {/* Logo da Bússola */}
                <div className="w-20 h-20 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C] shadow-sm">
                  <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-display text-[#1A1D1B] tracking-tight">
                    Descubra seu caminho no digital.
                  </h1>
                  <p className="text-sm text-[#5B615D] max-w-[260px] mx-auto leading-relaxed">
                    Em 15 minutos, você sabe o que criar, para quem e como começar. Sem paralisia.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pb-4">
                <button
                  onClick={() => {
                    soundEffects.playTransition();
                    setCurrentScreen('register');
                  }}
                  className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Começar diagnóstico
                </button>
                <button
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setCurrentScreen('home');
                    setActiveTab('home');
                  }}
                  className="text-xs text-[#5B615D] hover:text-[#1A1D1B] font-medium cursor-pointer"
                >
                  Já tenho conta · Entrar
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA A2: CADASTRO LEVE */}
          {/* ============================================================== */}
          {currentScreen === 'register' && (
            <div className="flex-1 flex flex-col justify-between p-6 select-none animate-fadeIn">
              <div>
                <button 
                  onClick={() => {
                    soundEffects.playBack();
                    setCurrentScreen('splash');
                  }}
                  className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>


                <h2 className="text-2xl font-bold font-display text-[#1A1D1B]">
                  Só o essencial.
                </h2>
                <p className="text-xs text-[#5B615D] mt-1 mb-6">
                  Você personaliza os detalhes depois.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1D1B] block mb-1">Como devemos te chamar?</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6E8E6] rounded-xl text-sm focus:outline-none focus:border-[#1F6F5C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1A1D1B] block mb-2">Qual seu objetivo principal hoje?</label>
                    <div className="space-y-2">
                      {[
                        { id: 'renda_extra', label: '💰 Renda extra (R$ 500 a R$ 2.000/mês)' },
                        { id: 'substituir', label: '🚀 Substituir meu salário atual' },
                        { id: 'proposito', label: '🌱 Propósito e impacto no digital' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            soundEffects.playSelectOption();
                            setMacroGoal(item.id as any);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            macroGoal === item.id 
                              ? 'bg-[#E3F2ED] border-[#1F6F5C] text-[#1F6F5C] font-semibold ring-1 ring-[#1F6F5C]/30' 
                              : 'bg-white border-[#E6E8E6] text-[#5B615D] hover:bg-neutral-50'
                          }`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-4">
                <button
                  onClick={() => {
                    soundEffects.playTransition();
                    setCurrentScreen('carousel');
                  }}
                  className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA A3: CARROSSEL DO MÉTODO */}
          {/* ============================================================== */}
          {currentScreen === 'carousel' && (
            <div className="flex-1 flex flex-col justify-between p-6 select-none animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        soundEffects.playSoftTap();
                        setCarouselSlide(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${carouselSlide === i ? 'w-6 bg-[#1F6F5C]' : 'w-2 bg-[#E6E8E6]'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setCurrentSectionIndex(0);
                    setCurrentQuestionIndex(0);
                    setCurrentScreen('value_signal');
                  }}
                  className="text-xs text-[#5B615D] hover:text-[#1A1D1B] transition-colors cursor-pointer"
                >
                  Pular
                </button>
              </div>

              {/* Conteúdo do Slide com Transição Suave */}
              <div key={`slide-${carouselSlide}`} className="flex-1 flex flex-col items-center justify-center text-center px-2 animate-slide-in-right">
                {carouselSlide === 0 && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#E3F2ED] text-[#1F6F5C] flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105">
                      🧭
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#1A1D1B]">
                      Você responde, a gente calcula.
                    </h3>
                    <p className="text-xs text-[#5B615D] leading-relaxed max-w-[260px] mx-auto">
                      São 7 blocos curtos de perguntas em formato de cards táteis com espaço para reflexão pessoal.
                    </p>
                  </div>
                )}

                {carouselSlide === 1 && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#F2A93B]/20 text-[#F2A93B] flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105">
                      🎯
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#1A1D1B]">
                      Seu diagnóstico personalizado.
                    </h3>
                    <p className="text-xs text-[#5B615D] leading-relaxed max-w-[260px] mx-auto">
                      Descubra seu nicho, produto ideal, público, canal e prazo — tudo com justificativa clara para sua realidade.
                    </p>
                  </div>
                )}

                {carouselSlide === 2 && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#7A5AF8]/20 text-[#7A5AF8] flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105">
                      ✅
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#1A1D1B]">
                      Um roteiro pra seguir sem travar.
                    </h3>
                    <p className="text-xs text-[#5B615D] leading-relaxed max-w-[260px] mx-auto">
                      Capítulos narrativos de transformação com momentos de compromisso, micro-áudios e coach de IA contextual.
                    </p>
                  </div>
                )}
              </div>

              <div className="pb-4">
                {carouselSlide < 2 ? (
                  <button
                    onClick={() => {
                      soundEffects.playTransition();
                      setCarouselSlide(prev => prev + 1);
                    }}
                    className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Avançar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundEffects.playTransition();
                      setCurrentSectionIndex(0);
                      setCurrentQuestionIndex(0);
                      setCurrentScreen('value_signal');
                    }}
                    className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Iniciar Anamnese</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}


          {/* ============================================================== */}
          {/* SINALIZAÇÃO DE VALOR DO BLOCO (MICRO-TELA ANTES DAS PERGUNTAS) */}
          {/* ============================================================== */}
          {currentScreen === 'value_signal' && currentSection && (
            <div 
              key={`value-signal-${currentSection.id}`}
              className="flex-1 flex flex-col justify-between p-6 select-none animate-scale-in bg-gradient-to-b from-[#FDFCF9] to-[#F5F2EB]"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E3F2ED] text-[#1F6F5C] flex items-center justify-center text-3xl mb-5 shadow-xs transition-transform hover:scale-105">
                  {currentSection.valueSignal.icon}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-1 rounded-full mb-3 shadow-2xs">
                  Etapa {currentSection.id} de {ANAMNESE_SECTIONS.length} · {currentSection.title}
                </span>

                <h2 className="text-xl font-bold font-display text-[#1A1D1B] leading-snug mb-3">
                  {currentSection.valueSignal.title}
                </h2>

                <p className="text-xs text-[#5B615D] leading-relaxed max-w-[280px]">
                  {currentSection.valueSignal.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E8E6]">
                <button
                  onClick={() => {
                    soundEffects.playTransition();
                    setCurrentScreen('anamnese');
                  }}
                  className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Entendido, vamos lá</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELAS B1 a B7: ANAMNESE ADAPTATIVA COM REFLEXÃO LIVRE */}
          {/* ============================================================== */}
          {currentScreen === 'anamnese' && currentQuestion && (
            <div className="flex-1 flex flex-col justify-between p-5 select-none relative overflow-hidden">
              <div 
                key={`${currentSectionIndex}-${currentQuestionIndex}`}
                className={`flex-1 flex flex-col justify-between ${
                  questionDirection === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                }`}
              >
                {/* Header com Progresso da Anamnese */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <button 
                      onClick={handlePrevQuestion}
                      className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] transition-transform active:scale-90"
                      title="Voltar"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F6F5C]">
                      <span className="px-2 py-0.5 rounded bg-[#E3F2ED] transition-all duration-300">
                        {currentSection.id}/{ANAMNESE_SECTIONS.length} · {currentSection.title}
                      </span>
                    </div>
                  </div>

                  {/* Barra Fina de Progresso com transição lenta e serena */}
                  <div className="w-full bg-[#E6E8E6] h-1.5 rounded-full overflow-hidden mb-4">
                    <div 
                      className="bg-[#1F6F5C] h-full transition-all duration-700 ease-out"
                      style={{ width: `${((currentSectionIndex * 2 + currentQuestionIndex + 1) / (ANAMNESE_SECTIONS.length * 2)) * 100}%` }}
                    />
                  </div>


                  {/* Pergunta */}
                  <div className="mb-3">
                    <h2 className="text-lg font-bold font-display text-[#1A1D1B] leading-snug">
                      {currentQuestion.question}
                    </h2>
                    <p className="text-xs text-[#5B615D] mt-0.5">
                      {currentQuestion.subtext}
                    </p>
                  </div>

                  {/* Lista de Opções Táteis */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {currentQuestion.options.map(opt => {
                      const selected = (answers[currentQuestion.id] || []).includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(
                            currentQuestion.id, 
                            opt.id, 
                            currentQuestion.type === 'multiple',
                            currentQuestion.maxChoices
                          )}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all duration-200 flex items-center justify-between transform active:scale-[0.98] ${
                            selected
                              ? 'bg-[#E3F2ED] border-[#1F6F5C] text-[#1F6F5C] font-semibold shadow-xs ring-1 ring-[#1F6F5C]/30'
                              : 'bg-white border-[#E6E8E6] text-[#1A1D1B] hover:bg-neutral-50 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {opt.icon && <span className="text-base">{opt.icon}</span>}
                            <span>{opt.label}</span>
                          </div>
                          {selected && <CheckCircle2 className="w-4 h-4 text-[#1F6F5C] shrink-0 animate-scale-in" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Campo de reflexão aberta com as próprias palavras */}
                  {currentQuestion.reflectionPrompt && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => setShowReflectionInput(!showReflectionInput)}
                        className="w-full flex items-center justify-between text-[11px] font-semibold text-amber-900 text-left cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>✍️</span>
                          <span>Detalhar com suas próprias palavras</span>
                        </span>
                        <span className="text-[10px] text-amber-700 underline font-medium">
                          {showReflectionInput ? 'Ocultar' : 'Escrever'}
                        </span>
                      </button>

                      {showReflectionInput && (
                        <div className="mt-2 space-y-1.5 animate-fadeIn">
                          <p className="text-[11px] text-[#5B615D] leading-tight">
                            {currentQuestion.reflectionPrompt}
                          </p>
                          <textarea
                            rows={2}
                            value={reflections[currentQuestion.id] || ''}
                            onChange={(e) => setReflections(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                            placeholder={currentQuestion.reflectionPlaceholder}
                            className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-white text-[#1A1D1B] placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1F6F5C] resize-none transition-shadow"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Botão de Avanço */}
                <div className="pt-3 pb-2 border-t border-[#E6E8E6]">
                  <button
                    disabled={!(answers[currentQuestion.id] && answers[currentQuestion.id].length > 0)}
                    onClick={handleNextQuestion}
                    className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA B7: CALCULANDO COM STORYTELLING */}
          {/* ============================================================== */}
          {currentScreen === 'calculating' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C] mb-6">
                <Compass className="w-10 h-10 animate-spin text-[#1F6F5C]" style={{ animationDuration: '4s' }} />
              </div>

              <h2 className="text-2xl font-bold font-display text-[#1A1D1B] mb-2">
                Montando seu prumo...
              </h2>
              <p className="text-xs text-[#5B615D] mb-8">
                Cruzando habilidades, tempo e perfil para encontrar o modelo certo.
              </p>

              {/* Checklist dinâmico com storytelling */}
              <div className="w-full max-w-xs space-y-3 text-left">
                {[
                  { label: 'Cruzando suas habilidades principais', done: calcStep >= 1 },
                  { label: 'Analisando sua disponibilidade real', done: calcStep >= 2 },
                  { label: 'Encontrando seu nicho de menor atrito', done: calcStep >= 3 },
                  { label: 'Estruturando roteiro em 3 fases', done: calcStep >= 4 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
                    )}
                    <span className={item.done ? 'text-[#1A1D1B] font-medium' : 'text-[#5B615D]'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA C1: REVELAÇÃO DO RESULTADO / DIAGNÓSTICO */}
          {/* ============================================================== */}
          {currentScreen === 'result' && (
            <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2ED] text-[#1F6F5C] text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Seu perfil está pronto
                </div>

                <h2 className="text-2xl font-bold font-display text-[#1A1D1B] leading-tight mb-4">
                  {userName}, este é o seu prumo digital.
                </h2>

                {/* Card de Destaque: Nicho */}
                <div className="p-4 rounded-2xl bg-white border border-[#1F6F5C]/30 shadow-sm mb-3">
                  <span className="text-[11px] font-bold text-[#1F6F5C] uppercase tracking-wider block mb-1">
                    🎯 Seu Nicho Recomendado
                  </span>
                  <h3 className="text-base font-bold text-[#1A1D1B]">
                    {DEFAULT_DIAGNOSIS.niche}
                  </h3>
                  <p className="text-xs text-[#5B615D] mt-1">
                    {DEFAULT_DIAGNOSIS.nicheDescription}
                  </p>
                </div>

                {/* Grid dos Cards Secundários */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
                    <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">📦 Produto Ideal</span>
                    <strong className="text-xs text-[#1A1D1B] block">{DEFAULT_DIAGNOSIS.product}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
                    <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">👥 Público-alvo</span>
                    <strong className="text-xs text-[#1A1D1B] block">{DEFAULT_DIAGNOSIS.audience}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
                    <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">📣 Canal Inicial</span>
                    <strong className="text-xs text-[#1A1D1B] block">{DEFAULT_DIAGNOSIS.channel}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E6E8E6]">
                    <span className="text-[10px] font-semibold text-[#5B615D] block mb-0.5">⏱️ Prazo Estimado</span>
                    <strong className="text-xs text-[#1A1D1B] block">{DEFAULT_DIAGNOSIS.timeline}</strong>
                  </div>
                </div>

                {/* Justificativa Expansível */}
                <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
                  <button
                    onClick={() => setShowJustification(!showJustification)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#1F6F5C]"
                  >
                    <span>Por que essa combinação para você?</span>
                    {showJustification ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showJustification && (
                    <p className="text-xs text-[#5B615D] mt-2 leading-relaxed pt-2 border-t border-[#E6E8E6]">
                      {DEFAULT_DIAGNOSIS.justification}
                    </p>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    soundEffects.playTransition();
                    setCurrentScreen('commitment');
                    setHoldProgress(0);
                    setIsHolding(false);
                  }}
                  className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>Assumir meu Prumo (Ritual)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    soundEffects.playBack();
                    setCurrentScreen('value_signal');
                    setCurrentSectionIndex(0);
                    setCurrentQuestionIndex(0);
                  }}
                  className="w-full py-2 text-xs text-[#5B615D] hover:text-[#1A1D1B] text-center cursor-pointer"
                >
                  ⟳ Refazer diagnóstico
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA DE COMPROMISSO CONSCIENTE (HOLD TO COMMIT) */}
          {/* ============================================================== */}
          {currentScreen === 'commitment' && (
            <div className="flex-1 flex flex-col justify-between p-6 select-none animate-scale-in bg-gradient-to-b from-[#FDFCF9] via-[#FAF6F0] to-[#F3EDE2] text-center">
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-semibold mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97746]" />
                  <span>Pacto de Compromisso Consciente</span>
                </div>

                <div className="w-16 h-16 rounded-full bg-white border border-amber-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-[#1F6F5C]">
                  <Compass className="w-8 h-8 text-[#1F6F5C]" />
                </div>

                <h2 className="text-2xl font-bold font-serif text-[#1A1D1B] leading-tight mb-2">
                  Assumir seu Prumo
                </h2>

                <p className="text-xs text-[#5B615D] leading-relaxed max-w-[280px] mx-auto mb-4">
                  Mudar de direção não é riscar tarefas: é um compromisso consciente com quem você escolhe se tornar daqui a 90 dias.
                </p>

                {/* Card de Âncora */}
                <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200 text-left shadow-2xs mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97746] block mb-1">
                    Sua Promessa para Si Mesmo
                  </span>
                  <p className="text-xs text-[#1A1D1B] font-serif italic">
                    "{personalAnchor}"
                  </p>
                </div>
              </div>

              {/* Botão Tátil de Pressão Contínua (Hold to Sign) */}
              <div className="py-4 flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-3">
                  {/* Círculo de Progresso SVG */}
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E6E8E6"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#1F6F5C"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="351.86"
                      strokeDashoffset={351.86 - (351.86 * holdProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-75"
                    />
                  </svg>

                  <button
                    onMouseDown={handleStartHold}
                    onMouseUp={handleCancelHold}
                    onMouseLeave={handleCancelHold}
                    onTouchStart={handleStartHold}
                    onTouchEnd={handleCancelHold}
                    className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all select-none cursor-pointer ${
                      isHolding 
                        ? 'bg-[#1F6F5C] text-white scale-95 shadow-inner' 
                        : 'bg-[#1F6F5C] hover:bg-[#2E8B73] text-white shadow-lg active:scale-95'
                    }`}
                  >
                    <Compass className={`w-6 h-6 mb-1 ${isHolding ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                    <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight px-1">
                      {holdProgress > 0 ? `${holdProgress}%` : 'Segurar'}
                    </span>
                  </button>
                </div>

                <p className="text-[11px] text-[#5B615D] font-medium">
                  {isHolding ? (
                    <span className="text-[#1F6F5C] font-semibold animate-pulse">
                      Firmando seu prumo...
                    </span>
                  ) : (
                    <span>Pressione e segure por 3 segundos para selar</span>
                  )}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    soundEffects.playBack();
                    setCurrentScreen('result');
                  }}
                  className="w-full py-2 text-xs text-[#5B615D] hover:text-[#1A1D1B] cursor-pointer"
                >
                  Voltar ao diagnóstico
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA DA CARTA DO EU FUTURO (90 DIAS) */}
          {/* ============================================================== */}
          {currentScreen === 'future_letter' && (
            <div className="flex-1 flex flex-col justify-between p-5 select-none animate-letter-unroll bg-gradient-to-b from-[#FDFCF9] to-[#F5EFE6] overflow-y-auto">
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#1F6F5C] text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Compromisso Assinado</span>
                  </div>
                  <span className="text-[10px] text-[#5B615D] font-mono">
                    Daqui a 90 dias
                  </span>
                </div>

                {/* Pergaminho da Carta */}
                <div className="p-4.5 rounded-2xl bg-white border border-amber-300/80 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
                    <span className="text-xs font-serif italic text-amber-900 font-semibold">
                      De: Seu Eu Futuro
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Selo de Prumo
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#1A1D1B] leading-tight mb-2">
                    Querida {userName},
                  </h3>

                  <div className="text-xs text-[#2D3748] font-serif leading-relaxed space-y-2">
                    <p>
                      Escrevo esta carta no momento exato em que nosso plano se cumpriu. Lembra de quando você segurou aquele botão e assumiu o seu prumo?
                    </p>
                    <p className="italic bg-amber-50/90 p-2.5 rounded-lg border-l-2 border-[#1F6F5C] text-[#1F6F5C]">
                      "{personalAnchor}"
                    </p>
                    <p>
                      Você estava insegura sobre por onde começar, mas decidiu construir <strong>{DEFAULT_DIAGNOSIS.product}</strong> para o nicho de <strong>{DEFAULT_DIAGNOSIS.niche}</strong>.
                    </p>
                    <p>
                      Hoje já validamos com pessoas reais, fizemos nosso primeiro retorno e aquela sensação de paralisia ficou para trás. Agora entre no Capítulo 1. Um passo de cada vez.
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-900">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Bookmark className="w-3.5 h-3.5 text-[#1F6F5C]" />
                      <span>Pacto Selado</span>
                    </div>
                    <span className="font-serif italic text-[#5B615D]">Com carinho, Você.</span>
                  </div>
                </div>
              </div>

              {/* Botão de Avanço para a Jornada */}
              <div className="pt-3 border-t border-[#E6E8E6]">
                <button
                  onClick={() => {
                    soundEffects.playCompleteTask();
                    setCurrentScreen('home');
                    setActiveTab('home');
                    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
                  }}
                  className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Entrar na Jornada (Capítulo 1)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}


          {/* ============================================================== */}
          {/* TELA D1: HOME / DASHBOARD NARRATIVO */}
          {/* ============================================================== */}
          {currentScreen === 'home' && activeTab === 'home' && (
            <div key="tab-home" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
              <div className="space-y-3.5">
                {/* Header com Boas-Vindas */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1D1B]">
                      Olá, {userName} 👋
                    </h2>
                    <p className="text-xs text-[#5B615D]">
                      Capítulo 1: Onde você encontra sua promessa
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C]">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                {/* ÂNCORA EMOCIONAL FIXA DO EU FUTURO */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 shadow-2xs flex items-start gap-2.5">
                  <Bookmark className="w-4 h-4 text-[#D97746] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97746] block">
                      Sua Âncora do Eu Futuro
                    </span>
                    <p className="text-xs text-[#1A1D1B] font-serif italic truncate mt-0.5">
                      "{personalAnchor}"
                    </p>
                  </div>
                </div>

                {/* CARTÃO DO PRÓXIMO PASSO (Com Ilustração-Âncora e Áudio Coach) */}
                <div className="p-4 rounded-2xl bg-[#E3F2ED] border border-[#1F6F5C]/30 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{nextStepTask.anchorIllustration.symbol}</span>
                      <span className="text-[10px] font-bold text-[#1F6F5C] uppercase tracking-wider">
                        {nextStepTask.anchorIllustration.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5B615D]">
                      ⏱ {nextStepTask.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1A1D1B]">
                    {nextStepTask.title}
                  </h3>
                  <p className="text-xs text-[#5B615D] mt-1 leading-relaxed">
                    {nextStepTask.description}
                  </p>

                  {/* Micro-áudio Coaching Pills */}
                  {nextStepTask.audioCoach && (
                    <div className="mt-3 p-2.5 rounded-xl bg-white/90 border border-[#1F6F5C]/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const nextPlaying = !(isPlayingAudio && activeAudioTask?.id === nextStepTask.id);
                            soundEffects.playAudioCoachToggle(nextPlaying);
                            setActiveAudioTask(nextStepTask);
                            setIsPlayingAudio(nextPlaying);
                          }}
                          className="w-7 h-7 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center hover:bg-[#2E8B73] transition-colors cursor-pointer"
                        >
                          {isPlayingAudio && activeAudioTask?.id === nextStepTask.id ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                        <div>
                          <span className="text-[11px] font-bold text-[#1A1D1B] block">
                            {nextStepTask.audioCoach.narrator}
                          </span>
                          <span className="text-[10px] text-[#5B615D]">
                            {isPlayingAudio && activeAudioTask?.id === nextStepTask.id 
                              ? `0:${audioElapsedSec.toString().padStart(2, '0')} / ${nextStepTask.audioCoach.duration}` 
                              : `Presença em áudio · ${nextStepTask.audioCoach.duration}`}
                          </span>
                        </div>
                      </div>

                      {/* Ondas Sonoras Animadas */}
                      <div className="flex items-center gap-0.5 h-4">
                        {nextStepTask.audioCoach.audioWaveHeights.slice(0, 8).map((h, i) => (
                          <div 
                            key={i} 
                            className={`w-0.75 rounded-full transition-all duration-300 ${isPlayingAudio && activeAudioTask?.id === nextStepTask.id ? 'bg-[#1F6F5C] animate-pulse' : 'bg-neutral-300'}`}
                            style={{ height: isPlayingAudio && activeAudioTask?.id === nextStepTask.id ? `${Math.max(25, h * 0.8)}%` : `${h * 0.3}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playSoftTap();
                        setSelectedTask(nextStepTask);
                        setCurrentScreen('task_detail');
                      }}
                      className="flex-1 py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-xl transition-all shadow-xs text-center cursor-pointer"
                    >
                      Abrir tarefa
                    </button>
                    <button
                      onClick={() => toggleTaskStatus(nextStepTask.id)}
                      className="px-3 py-2.5 bg-white border border-[#1F6F5C]/30 text-[#1F6F5C] text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                      title="Concluir"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card de Progresso da História em Capítulos */}
                <div className="p-4 rounded-2xl bg-white border border-[#E6E8E6] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1D1B]">Avanço da sua Jornada</span>
                    <span className="text-xs font-bold text-[#1F6F5C]">{progressPercent}%</span>
                  </div>

                  {/* Barra linear geral */}
                  <div className="w-full bg-[#E6E8E6] h-2 rounded-full overflow-hidden mb-3">
                    <div 
                      className="bg-[#1F6F5C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Capítulos Narrativos */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-[#1A1D1B] font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1F6F5C]" /> Cap. 1: Sua Promessa
                      </span>
                      <span className="text-[#1F6F5C] font-semibold">{fundacaoPercent}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[#5B615D]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#F2A93B]" /> Cap. 2: Primeiro Contato
                      </span>
                      <span>0% (Próximo)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#5B615D]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7A5AF8]" /> Cap. 3: Primeiro Retorno
                      </span>
                      <span>0% (Futuro)</span>
                    </div>
                  </div>
                </div>

                {/* Atalhos Rápidos */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div 
                    onClick={() => {
                      soundEffects.playSoftTap();
                      setCurrentScreen('future_letter');
                    }}
                    className="p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-[#1F6F5C] transition-colors"
                  >
                    <span className="text-base block mb-1">📜</span>
                    <strong className="text-xs text-[#1A1D1B] block">Carta do Futuro</strong>
                    <span className="text-[10px] text-[#5B615D]">Reler compromisso</span>
                  </div>
                  <div 
                    onClick={() => {
                      soundEffects.playSoftTap();
                      setActiveTab('coach');
                    }}
                    className="p-3 rounded-xl bg-white border border-[#E6E8E6] cursor-pointer hover:border-[#1F6F5C] transition-colors"
                  >
                    <span className="text-base block mb-1">💬</span>
                    <strong className="text-xs text-[#1A1D1B] block">Coach Prumo</strong>
                    <span className="text-[10px] text-[#5B615D]">Tirar dúvidas</span>
                  </div>
                </div>

              </div>

              {/* Dica de Presença */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 mt-3 flex items-start gap-2">
                <Flame className="w-4 h-4 text-[#F2A93B] shrink-0 mt-0.5" />
                <span><strong>Lembrete gentil:</strong> O progresso é uma história sendo escrita, não um placar subindo.</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA D2: ROTEIRO EM CAPÍTULOS NARRATIVOS */}
          {/* ============================================================== */}
          {currentScreen === 'home' && activeTab === 'roadmap' && (
            <div key="tab-roadmap" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-[#1A1D1B]">
                    Sua Jornada
                  </h2>
                  <span className="text-xs font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
                    {completedCount} de {totalCount} concluídas
                  </span>
                </div>

                {/* Âncora Emocional Fixa */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 mb-3 text-xs flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-[#D97746] shrink-0" />
                  <span className="text-[11px] text-[#1A1D1B] font-serif italic truncate">
                    "{personalAnchor}"
                  </span>
                </div>

                {/* Filtros por Capítulos */}
                <div className="flex gap-1 mb-3 overflow-x-auto pb-1 text-[11px]">
                  {[
                    { id: 'todas', label: 'Todos os Capítulos' },
                    { id: 'fundacao', label: 'Cap. 1: Promessa' },
                    { id: 'marketing', label: 'Cap. 2: Contato' },
                    { id: 'lancamento', label: 'Cap. 3: Retorno' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        soundEffects.playSoftTap();
                        setActiveFilterPhase(f.id as any);
                      }}
                      className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                        activeFilterPhase === f.id
                          ? 'bg-[#1F6F5C] text-white font-semibold'
                          : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Lista de Tarefas por Capítulos com Ilustrações-Âncora */}
                <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                  {tasks
                    .filter(t => activeFilterPhase === 'todas' || t.phaseId === activeFilterPhase)
                    .map(task => {
                      const isCompleted = task.status === 'completed';
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-xl border transition-all ${
                            task.isLocked 
                              ? 'bg-neutral-100 border-[#E6E8E6] opacity-75' 
                              : isCompleted 
                                ? 'bg-emerald-50/50 border-emerald-200' 
                                : 'bg-white border-[#E6E8E6] hover:border-[#1F6F5C]'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {task.isLocked ? (
                              <Lock className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                            ) : (
                              <button
                                onClick={() => toggleTaskStatus(task.id)}
                                className="mt-0.5 text-[#1F6F5C] cursor-pointer"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#3BAA6B]" />
                                ) : (
                                  <Circle className="w-5 h-5 text-[#5B615D]" />
                                )}
                              </button>
                            )}

                            <div 
                              onClick={() => {
                                soundEffects.playSoftTap();
                                if (task.isLocked) {
                                  setCurrentScreen('paywall');
                                } else {
                                  setSelectedTask(task);
                                  setCurrentScreen('task_detail');
                                }
                              }}
                              className="flex-1 cursor-pointer min-w-0"
                            >

                              <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="text-xs">{task.anchorIllustration.symbol}</span>
                                  <h4 className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-[#5B615D]' : 'text-[#1A1D1B]'}`}>
                                    {task.title}
                                  </h4>
                                </div>
                                {task.isLocked ? (
                                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium shrink-0">
                                    Cap. 2
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-[#E3F2ED] text-[#1F6F5C] px-1.5 py-0.2 rounded font-medium shrink-0">
                                    {task.anchorIllustration.badge}
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-[#5B615D] line-clamp-1 mt-0.5">
                                {task.description}
                              </p>

                              <div className="flex items-center justify-between mt-2 text-[10px] text-[#5B615D]">
                                <span>⏱ {task.durationMinutes} min · {task.chapterTitle.split(':')[0]}</span>
                                {task.audioCoach && (
                                  <span className="text-[#1F6F5C] font-semibold flex items-center gap-1">
                                    <Headphones className="w-3 h-3" /> Áudio
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA D3: DETALHE DA TAREFA COM ILUSTRAÇÃO & ÁUDIO COACH */}
          {/* ============================================================== */}
          {currentScreen === 'task_detail' && (
            <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-slide-up">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      soundEffects.playBack();
                      setCurrentScreen('home');
                    }}
                    className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-[#1F6F5C] font-semibold bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
                    {selectedTask.chapterTitle.split(':')[0]}
                  </span>
                </div>

                {/* Card de Ilustração-Âncora */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#E3F2ED] to-[#FAF6F0] border border-[#1F6F5C]/20 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                    {selectedTask.anchorIllustration.symbol}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block">
                      {selectedTask.anchorIllustration.badge} · Âncora Visual
                    </span>
                    <strong className="text-xs text-[#1A1D1B] block">
                      {selectedTask.anchorIllustration.title}
                    </strong>
                    <span className="text-[11px] text-[#5B615D]">
                      {selectedTask.anchorIllustration.meaning}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold font-display text-[#1A1D1B]">
                    {selectedTask.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5B615D]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duração recomendada: {selectedTask.durationMinutes} min</span>
                  </div>
                </div>

                {/* Player de Micro-Áudio Coaching */}
                {selectedTask.audioCoach && (
                  <div className="p-3 rounded-xl bg-white border border-[#1F6F5C]/30 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const nextPlaying = !(isPlayingAudio && activeAudioTask?.id === selectedTask.id);
                            soundEffects.playAudioCoachToggle(nextPlaying);
                            setActiveAudioTask(selectedTask);
                            setIsPlayingAudio(nextPlaying);
                          }}
                          className="w-8 h-8 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center hover:bg-[#2E8B73] transition-colors cursor-pointer"
                        >
                          {isPlayingAudio && activeAudioTask?.id === selectedTask.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div>
                          <strong className="text-xs text-[#1A1D1B] block">
                            {selectedTask.audioCoach.title}
                          </strong>
                          <span className="text-[10px] text-[#5B615D]">
                            {selectedTask.audioCoach.narrator} · {selectedTask.audioCoach.duration}
                          </span>
                        </div>
                      </div>

                      {/* Visualizador de Ondas Sonoras */}
                      <div className="flex items-center gap-0.5 h-6 px-1">
                        {selectedTask.audioCoach.audioWaveHeights.map((h, i) => (
                          <div 
                            key={i} 
                            className={`w-0.75 rounded-full transition-all duration-300 ${isPlayingAudio && activeAudioTask?.id === selectedTask.id ? 'bg-[#1F6F5C] animate-pulse' : 'bg-neutral-300'}`}
                            style={{ height: isPlayingAudio && activeAudioTask?.id === selectedTask.id ? `${Math.max(20, (h * (0.6 + Math.sin((audioElapsedSec + i) * 1.2) * 0.4)))}%` : `${h * 0.35}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Transcrição Inspiradora Expansível */}
                    <div className="pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => {
                          soundEffects.playSoftTap();
                          setShowTranscript(!showTranscript);
                        }}
                        className="text-[11px] text-[#1F6F5C] font-medium hover:underline flex items-center justify-between w-full cursor-pointer"
                      >
                        <span>{showTranscript ? 'Ocultar transcrição' : 'Ler palavras de encorajamento'}</span>
                        {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {showTranscript && (
                        <p className="text-xs font-serif italic text-[#2D3748] mt-1.5 bg-[#F7F9F8] p-2.5 rounded-lg leading-relaxed border-l-2 border-[#1F6F5C]">
                          "{selectedTask.audioCoach.transcript}"
                        </p>
                      )}
                    </div>
                  </div>
                )}


                {/* O Que Fazer */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E6E8E6]">
                  <strong className="text-xs text-[#1A1D1B] block mb-1">O que fazer:</strong>
                  <p className="text-xs text-[#5B615D] leading-relaxed">
                    {selectedTask.whatToDo}
                  </p>
                </div>

                {/* Como saber que ficou bom */}
                <div className="p-3.5 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20">
                  <strong className="text-xs text-[#1F6F5C] block mb-1.5">Como saber que ficou bom:</strong>
                  <ul className="space-y-1.5 text-xs text-[#1A1D1B]">
                    {selectedTask.howToKnowItIsGood.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3BAA6B] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recursos de apoio */}
                {selectedTask.resources && selectedTask.resources.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#E6E8E6]">
                    <strong className="text-xs text-[#1A1D1B] block mb-2">📎 Recursos de apoio:</strong>
                    <div className="space-y-1.5">
                      {selectedTask.resources.map((res, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-[#1F6F5C] bg-[#F7F9F8] p-2 rounded-lg">
                          <span>• {res.title}</span>
                          <span className="text-[10px] text-[#5B615D] bg-white px-1.5 py-0.5 rounded border border-[#E6E8E6]">
                            {res.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    toggleTaskStatus(selectedTask.id);
                    setCurrentScreen('home');
                  }}
                  className={`w-full py-3.5 text-sm font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                    selectedTask.status === 'completed'
                      ? 'bg-neutral-200 text-[#1A1D1B]'
                      : 'bg-[#1F6F5C] hover:bg-[#2E8B73] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedTask.status === 'completed' ? 'Marcar como pendente' : 'Marcar como feita'}</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setActiveTab('coach');
                    setCurrentScreen('home');
                  }}
                  className="w-full py-2 text-xs font-semibold text-[#1F6F5C] text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Preciso de ajuda nisso (Abrir Coach)</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA D4: CHAT COM IA COACH */}
          {/* ============================================================== */}
          {currentScreen === 'home' && activeTab === 'coach' && (
            <div key="tab-coach" className="flex-1 flex flex-col justify-between p-4 select-none animate-tab-fade">
              {/* Header do Chat */}
              <div className="pb-2 border-b border-[#E6E8E6] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-[#1A1D1B]">Coach Prumo</h3>
                      <span className="text-[9px] bg-emerald-100 text-[#1F6F5C] px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Gemini 3.8
                      </span>
                    </div>
                    <span className="text-[10px] text-[#3BAA6B] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3BAA6B] animate-pulse" /> Online · Contexto de {userName}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                  IA em Tempo Real
                </span>

              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                {coachMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#1F6F5C] text-white rounded-br-xs'
                          : 'bg-white border border-[#E6E8E6] text-[#1A1D1B] rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                      <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-[#5B615D]'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#E6E8E6] p-3 rounded-2xl text-[11px] text-[#5B615D] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-bounce" style={{ animationDelay: '0.4s' }} />
                      <span className="ml-1">Coach digitando...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sugestões Rápidas (Chips de pergunta) */}
              <div className="space-y-2 pt-2 border-t border-[#E6E8E6]">
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {[
                    'Como abordar sem parecer chato?',
                    'Não sei quem chamar para testar',
                    'Qual preço devo colocar?'
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug)}
                      className="px-2.5 py-1 bg-white border border-[#E6E8E6] hover:border-[#1F6F5C] text-[#5B615D] rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                {/* Input de Mensagem */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escreva sua dúvida..."
                    className="flex-1 px-3 py-2 bg-white border border-[#E6E8E6] rounded-xl text-xs focus:outline-none focus:border-[#1F6F5C]"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="p-2 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white rounded-xl cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA D6: VOCÊ / PERFIL */}
          {/* ============================================================== */}
          {currentScreen === 'home' && activeTab === 'profile' && (
            <div key="tab-profile" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1F6F5C] text-white font-bold flex items-center justify-center text-lg">
                    {userName[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A1D1B]">{userName}</h3>
                    <span className="text-xs text-[#5B615D]">Plano Gratuito</span>
                  </div>
                </div>

                {/* Upgrade Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F6F5C] to-[#164e41] text-white shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2A93B] block mb-1">
                    Prumo Premium
                  </span>
                  <h4 className="text-sm font-bold">Desbloqueie o Roteiro Completo</h4>
                  <p className="text-xs text-white/80 mt-1 mb-3">
                    Acesso a todas as fases de Marketing, Lançamento e Coach de IA ilimitado.
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playSoftTap();
                      setCurrentScreen('paywall');
                    }}
                    className="w-full py-2 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Conhecer Planos
                  </button>
                </div>

                {/* Opções de Conta */}
                <div className="space-y-2 text-xs">
                  <div 
                    onClick={() => {
                      soundEffects.playSoftTap();
                      setCurrentScreen('result');
                    }}
                    className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                  >
                    <span>Ver Diagnóstico Completo</span>
                    <ChevronRight className="w-4 h-4 text-[#5B615D]" />
                  </div>
                  <div 
                    onClick={() => {
                      soundEffects.playSoftTap();
                      setCurrentScreen('anamnese');
                      setCurrentSectionIndex(0);
                      setCurrentQuestionIndex(0);
                    }}
                    className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                  >
                    <span>Refazer Anamnese (1x no Free)</span>
                    <ChevronRight className="w-4 h-4 text-[#5B615D]" />
                  </div>
                  <div 
                    onClick={handleToggleSound}
                    className="p-3 bg-white border border-[#E6E8E6] rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                  >
                    <span>Sons do app: {isSoundMuted ? 'Desligados' : 'Ligados'}</span>
                    {isSoundMuted ? <VolumeX className="w-4 h-4 text-[#5B615D]" /> : <Volume2 className="w-4 h-4 text-[#1F6F5C]" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA E2: PAYWALL CONTEXTUAL (BOTTOM SHEET SIMULATOR) */}
          {/* ============================================================== */}
          {currentScreen === 'paywall' && (
            <div className="flex-1 flex flex-col justify-between p-6 select-none bg-white animate-slide-up">
              <div>
                <button
                  onClick={() => {
                    soundEffects.playBack();
                    setCurrentScreen('home');
                  }}
                  className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-[#E3F2ED] text-[#1F6F5C] flex items-center justify-center text-xl mb-3">
                  🧭
                </div>

                <h2 className="text-xl font-bold font-display text-[#1A1D1B]">
                  Desbloqueie o roteiro completo
                </h2>
                <p className="text-xs text-[#5B615D] mt-1 mb-5">
                  Tudo o que você precisa para ir da validação até a primeira venda.
                </p>

                <div className="space-y-2.5 text-xs text-[#1A1D1B] mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
                    <span>Todas as fases (Fundação, Marketing e Lançamento)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
                    <span>Coach de IA ilimitado para destravar em tempo real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
                    <span>Relatório semanal de progresso e ajustes de rota</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] shrink-0" />
                    <span>Exportar tarefas para Notion e PDF</span>
                  </div>
                </div>

                {/* Planos */}
                <div className="space-y-2.5">
                  <div 
                    onClick={() => soundEffects.playSelectOption()}
                    className="p-3.5 rounded-xl border-2 border-[#1F6F5C] bg-[#E3F2ED]/50 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs text-[#1A1D1B]">Anual</strong>
                        <span className="text-[10px] bg-[#F2A93B] text-[#1A1D1B] font-bold px-1.5 py-0.2 rounded">Economize 36%</span>
                      </div>
                      <span className="text-[11px] text-[#5B615D]">R$ 299/ano (apenas R$ 24,90/mês)</span>
                    </div>
                    <span className="text-xs font-bold text-[#1F6F5C]">Melhor escolha</span>
                  </div>

                  <div 
                    onClick={() => soundEffects.playSelectOption()}
                    className="p-3.5 rounded-xl border border-[#E6E8E6] bg-white flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                  >
                    <div>
                      <strong className="text-xs text-[#1A1D1B] block">Mensal</strong>
                      <span className="text-[11px] text-[#5B615D]">R$ 39/mês</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    soundEffects.playCompleteTask();
                    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
                    setCurrentScreen('home');
                  }}
                  className="w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Assinar Agora (Desbloquear)
                </button>
                <button
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setCurrentScreen('home');
                  }}
                  className="w-full py-2 text-xs text-[#5B615D] hover:text-[#1A1D1B] text-center cursor-pointer"
                >
                  Continuar grátis
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* BARRA DE NAVEGAÇÃO INFERIOR (BOTTOM TAB BAR NATIVA) */}
          {/* ============================================================== */}
          {currentScreen === 'home' && (
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
                        setActiveTab(tab.id);
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
          )}


        </div>

        {/* Barra de Navegação Gestual do Android (Gesture Pill) */}
        <div className="hidden h-4 w-full sm:flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-neutral-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
