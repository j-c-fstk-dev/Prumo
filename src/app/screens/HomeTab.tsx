import React, { useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Flame,
  Play,
  Pause,
  Bookmark,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { estimateSeconds, formatDuration, VOICE_ENABLED } from '../../utils/voice';
import { Constellation } from '../../components/brand/Constellation';
import { PersonalTasks } from '../components/PersonalTasks';
import { DailyRhythm } from '../components/DailyRhythm';
import { DailyInspiration } from '../components/QuoteCard';
import { Reveal } from '../components/Reveal';
import { JourneyComplete } from '../components/JourneyComplete';
import { CycleCard } from '../components/CycleCard';
import { SentPrompt } from '../components/SentPrompt';
import { CYCLE_LABEL } from '../../domain/cycles';
import { RoutinesCard } from '../components/Routines';
import { WeekHint } from '../components/WeekHint';
import { InstallHint } from '../components/ProtectData';
import { lembreteDoDia } from '../../data/encorajamento';
import { JOURNEY_DAYS, journeyDayLabel } from '../../domain/journey';

export const HomeTab: React.FC = () => {
  const { userName, tasks, nextStepTask, personalAnchor, activeAudioTaskId, isPlayingAudio, audioElapsedSec, voiceUnavailable, streak, daysSinceStart, journeyDay, letter, journeyComplete, currentWeek, cycleInfo, canChooseCycle, guideSeenAt, guideOpen, pendingSentPerson, actions } = useApp();
  // Primeira visita à Início: o guia do app abre sozinho, depois que a tela termina de surgir (etapa 47)
  useEffect(() => {
    if (guideSeenAt || guideOpen) return;
    const t = setTimeout(actions.startGuide, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideSeenAt]);
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  // Progresso real de cada capítulo
  const DOTS = ['bg-primary', 'bg-gold', 'bg-[#7A5AF8]', 'bg-success'];
  // Capítulos vêm das próprias tarefas (etapa 43: são 4)
  const CHAPTERS = Array.from(new Map(tasks.map((t) => [t.chapterId, t.chapterTitle])).entries())
    .sort((a, b) => a[0] - b[0])
    .map(([id, title], i) => ({ id, label: title.replace(/^Capítulo (\d+):\s*/, 'Cap. $1: '), dot: DOTS[i % DOTS.length] }))
    .map((c) => {
    const inChapter = tasks.filter((t) => t.chapterId === c.id);
    const percent = inChapter.length ? Math.round((inChapter.filter((t) => t.status === 'completed').length / inChapter.length) * 100) : 0;
    return { ...c, percent, current: c.id === nextStepTask.chapterId };
  });

  return (
    <div key="tab-home" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
      <div className="space-y-3.5">
        {/* Header com Boas-Vindas */}
        <Reveal i={0}>
        <div className="flex items-center justify-between">
          <div>
            {journeyDay !== null && (
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-0.5">{journeyDayLabel(journeyDay)}</span>
            )}
            <h2 className="text-xl font-bold text-ink">
              Olá, {userName} 👋
            </h2>
            <p className="text-sm text-muted">
              {cycleInfo ? `Ciclo ${cycleInfo.number} · ${CYCLE_LABEL[cycleInfo.kind].title}` : journeyComplete ? 'Roteiro concluído ✦' : nextStepTask.chapterTitle}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
            <Compass className="w-5 h-5" />
          </div>
        </div>
        </Reveal>

        {/* Dia 90 em diante: hora de reabrir a carta que a pessoa escreveu no começo */}
        {journeyDay !== null && journeyDay >= JOURNEY_DAYS && letter?.sealedAt && (
          <Reveal i={1}>
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                actions.go('future_letter');
              }}
              className="w-full text-left p-4 rounded-2xl bg-gold-soft border border-gold-line cursor-pointer hover:border-primary transition-colors"
            >
              <strong className="block text-ink">📜 {journeyDay === JOURNEY_DAYS ? 'Hoje é o seu dia 90.' : 'Você passou dos 90 dias.'}</strong>
              <span className="text-sm text-gold-ink">Chegou a hora de reler a carta que você escreveu no começo e ver o quanto caminhou.</span>
            </button>
            {canChooseCycle && !journeyComplete && (
              <button
                onClick={() => {
                  soundEffects.playTransition();
                  actions.go('next_cycle');
                }}
                className="mt-2 w-full min-h-10 rounded-xl border border-gold-line text-sm font-semibold text-gold-ink cursor-pointer"
              >
                Escolher o próximo ciclo
              </button>
            )}
          </Reveal>
        )}

        {/* Voltou do WhatsApp (mesmo que a página tenha recarregado): "Mandou a mensagem?" (etapa 49) */}
        {pendingSentPerson && (
          <Reveal i={1}>
            <SentPrompt person={pendingSentPerson} onHome />
          </Reveal>
        )}

        {/* Ritmo diário: check-in, sequência gentil, remendo e boas-vindas de volta */}

        <Reveal i={1}>
        <DailyRhythm />
        </Reveal>

        {/* Convite para instalar o app (protege os dados no iPhone) */}
        <Reveal i={2}>
          <InstallHint />
        </Reveal>


        {/* ÂNCORA EMOCIONAL FIXA DO EU FUTURO */}
        <Reveal i={2}>
        <div className="p-3 rounded-xl bg-gold-soft/80 border border-gold-line/90 shadow-2xs flex items-start gap-2.5">
          <Bookmark className="w-4 h-4 text-gold-text shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-text block">
              Sua âncora
            </span>
            <p className="text-base text-ink font-serif italic leading-snug mt-1 break-words">
              "{personalAnchor}"
            </p>
          </div>
        </div>
        </Reveal>

        {/* CONSTELAÇÃO DO CAPÍTULO: cada tarefa concluída acende uma estrela */}
        <Reveal i={3}>
        <Constellation
          name={nextStepTask.chapterTitle.replace(/^Capítulo \d+:\s*/, '')}
          stars={tasks
            .filter(t => t.chapterId === nextStepTask.chapterId)
            .map(t => ({ id: t.id, title: t.title, done: t.status === 'completed' }))}
          seed={nextStepTask.chapterId * 13}
        />
        </Reveal>

        {/* CARTÃO DO PRÓXIMO PASSO (Com Ilustração-Âncora e Áudio Coach) */}
        <Reveal i={4}>
        {cycleInfo && <CycleCard />}
        {journeyComplete ? (
          !cycleInfo && <JourneyComplete />
        ) : (
        <div data-tour="proximo" className="p-4 rounded-2xl bg-primary-soft border border-primary/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{nextStepTask.anchorIllustration.symbol}</span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {nextStepTask.anchorIllustration.title}
              </span>
            </div>
            <span className="text-[13px] text-muted">
              ⏱ {nextStepTask.durationMinutes} min
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink">
            {nextStepTask.title}
          </h3>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {nextStepTask.description}
          </p>
          {nextStepTask.when ? (
            <p className="text-[13px] text-primary font-semibold mt-1.5">⏰ Combinado: {nextStepTask.when}</p>
          ) : (
            <button
              onClick={() => {
                actions.openTask(nextStepTask.id);
                actions.go('task_detail');
              }}
              className="mt-1.5 text-[13px] text-primary font-semibold underline underline-offset-2 cursor-pointer"
            >
              ⏰ Combinar quando e onde
            </button>
          )}
          {nextStepTask.week && <WeekHint week={nextStepTask.week} current={currentWeek} />}

          {/* Micro-áudio Coaching Pills */}
          {nextStepTask.audioCoach && VOICE_ENABLED && (
            <div className="mt-3 p-2.5 rounded-xl bg-surface/90 border border-primary/20 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => actions.toggleAudio(nextStepTask.id)}
                  className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  {isPlayingAudio && activeAudioTaskId === nextStepTask.id ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
                <div>
                  <span className="text-[13px] font-bold text-ink block">
                    {nextStepTask.audioCoach.narrator}
                  </span>
                  <span className="text-xs text-muted">
                    {isPlayingAudio && activeAudioTaskId === nextStepTask.id 
                      ? `${formatDuration(audioElapsedSec)} / ${formatDuration(estimateSeconds(nextStepTask.audioCoach.transcript))}` 
                      : voiceUnavailable && activeAudioTaskId === nextStepTask.id
                        ? 'Sem voz neste aparelho: abra a tarefa para ler'
                        : `Presença em áudio · ${formatDuration(estimateSeconds(nextStepTask.audioCoach.transcript))}`}
                  </span>
                </div>
              </div>

              {/* Ondas Sonoras Animadas */}
              <div className="flex items-center gap-0.5 h-4">
                {nextStepTask.audioCoach.audioWaveHeights.slice(0, 8).map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-0.75 rounded-full transition-all duration-300 ${isPlayingAudio && activeAudioTaskId === nextStepTask.id ? 'bg-primary animate-pulse' : 'bg-line'}`}
                    style={{ height: isPlayingAudio && activeAudioTaskId === nextStepTask.id ? `${Math.max(25, h * 0.8)}%` : `${h * 0.3}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                actions.openTask(nextStepTask.id);
                actions.go('task_detail');
              }}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold rounded-xl transition-all shadow-xs text-center cursor-pointer"
            >
              Abrir tarefa
            </button>
            <button
              onClick={() => actions.toggleTaskStatus(nextStepTask.id)}
              className="px-3 py-2.5 bg-surface border border-primary/30 text-primary text-sm font-semibold rounded-xl hover:bg-surface-2 transition-colors cursor-pointer"
              title="Concluir"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
                )}
        </Reveal>

        {/* Rotina da semana: o que se repete no capítulo (etapa 42) */}
        <Reveal i={5}>
          <RoutinesCard />
        </Reveal>

        {/* Tarefas pessoais: o app também serve para o dia a dia fora do plano */}

        <Reveal i={5}>
        <PersonalTasks title="Pra hoje · fora da jornada" />
        </Reveal>


        {/* Card de Progresso da História em Capítulos */}
        <Reveal i={6}>
        <div className="p-4 rounded-2xl bg-surface border border-line shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-ink">Sua jornada até aqui</span>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>

          {/* Barra linear geral */}
          <div className="w-full bg-line h-2 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Capítulos Narrativos */}
          <div className="space-y-1.5 text-[13px]">
            {CHAPTERS.map((c) => (
              <div key={c.id} className={`flex items-center justify-between ${c.current ? 'text-ink font-medium' : 'text-muted'}`}>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} /> {c.label}
                </span>
                <span className={c.current ? 'text-primary font-semibold' : ''}>
                  {c.percent}%{c.percent === 100 ? ' ✦' : c.current ? ' (agora)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Atalhos Rápidos */}
        <Reveal i={7}>
        <div className="grid grid-cols-2 gap-2.5">
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('future_letter');
            }}
            className="p-3 rounded-xl bg-surface border border-gold-line cursor-pointer hover:border-primary transition-colors"
          >
            <span className="text-lg block mb-1">📜</span>
            <strong className="text-sm text-ink block">Sua carta</strong>
            <span className="text-xs text-muted">Reler o combinado</span>
          </div>
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.goTab('coach');
            }}
            className="p-3 rounded-xl bg-surface border border-line cursor-pointer hover:border-primary transition-colors"
          >
            <span className="text-lg block mb-1">💬</span>
            <strong className="text-sm text-ink block">Coach Prumo</strong>
            <span className="text-xs text-muted">Travou? Fala comigo</span>
          </div>
        </div>
        </Reveal>

      </div>

      {/* Citação verificada ou achado de pesquisa, um por dia (docs/pesquisa/05) */}

      <Reveal i={8}>
      <div className="mt-3">

        <DailyInspiration />

      </div>
      </Reveal>


      {/* Dica de Presença */}
      <Reveal i={9}>
      <div className="p-3 rounded-xl bg-gold-soft border border-gold-line/60 text-sm text-gold-ink mt-3 flex items-start gap-2">
        <Flame className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <span>
          <strong>Lembrete do dia:</strong>{' '}
          {lembreteDoDia({ date: new Date(), chapterId: nextStepTask.chapterId, daysSinceStart: daysSinceStart ?? 0, daysAway: streak.daysAway })}
        </span>
      </div>
      </Reveal>
    </div>
  );
};
