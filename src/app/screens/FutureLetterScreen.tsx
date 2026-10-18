import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Bookmark, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANAMNESE_SECTIONS } from '../../data/prumoData';
import { draftToFuture, hasWrittenReply, starterFromFuture } from '../../domain/letter';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

type Step = 'to' | 'from' | 'sealed';

const textareaClass =
  'w-full p-3 text-sm font-serif leading-relaxed rounded-xl border border-gold-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-none';

/**
 * Carta ao eu futuro em duas vias (docs/pesquisa/02, Chishima & Wilson):
 * 1) a pessoa escreve para si daqui a 90 dias (com rascunho editável);
 * 2) responde como esse eu futuro (só a primeira linha vem pronta);
 * 3) as duas ficam seladas e podem ser relidas.
 */
export const FutureLetterScreen: React.FC = () => {
  const { userName, personalAnchor, diagnosis, answers, letter, onboardingDone, actions } = useApp();
  const [step, setStep] = useState<Step>(letter?.sealedAt ? 'sealed' : 'to');

  const obstacleLabel = ANAMNESE_SECTIONS.flatMap((s) => s.questions)
    .find((q) => q.id === 'q5_obstacle')
    ?.options.find((o) => o.id === answers.q5_obstacle?.[0])?.label;

  // Preenche os rascunhos na primeira vez
  useEffect(() => {
    if (!letter?.toFuture) {
      actions.setLetter({
        toFuture: draftToFuture({ name: userName, product: diagnosis.product, anchor: personalAnchor, obstacleLabel, planB: diagnosis.planB }),
      });
    }
    if (!letter?.fromFuture) actions.setLetter({ fromFuture: starterFromFuture(userName) });
  }, []);

  const toFuture = letter?.toFuture ?? '';
  const fromFuture = letter?.fromFuture ?? '';
  const canSeal = hasWrittenReply(fromFuture, userName);

  const enterJourney = () => {
    soundEffects.playCompleteTask();
    actions.completeOnboarding();
    actions.goTab('home');
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  };

  const primaryButton =
    'w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2';

  if (step === 'to') {
    return (
      <div key="to" className="flex-1 flex flex-col justify-between p-5 select-none animate-fadeIn bg-gradient-to-b from-canvas to-gold-soft overflow-y-auto">
        <div className="space-y-3 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-[13px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Carta 1 de 2</span>
          </div>
          <h2 className="text-xl font-bold font-display text-ink leading-tight">Escreva para você daqui a 90 dias</h2>
          <p className="text-sm text-muted leading-relaxed">
            Uma carta pra você ler daqui a 3 meses. Já deixamos um rascunho: mude o que quiser. Quanto mais tiver o seu jeito de falar, melhor.
          </p>
          <textarea
            rows={12}
            value={toFuture}
            onChange={(e) => actions.setLetter({ toFuture: e.target.value })}
            className={textareaClass}
            aria-label="Carta para o seu eu de daqui a 90 dias"
          />
        </div>
        <div className="pt-3">
          <button
            disabled={toFuture.trim().length < 20}
            onClick={() => {
              soundEffects.playTransition();
              setStep('from');
            }}
            className={primaryButton}
          >
            <span>Agora, a resposta do seu eu futuro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'from') {
    return (
      <div key="from" className="flex-1 flex flex-col justify-between p-5 select-none animate-fadeIn bg-gradient-to-b from-canvas to-gold-soft overflow-y-auto">
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                soundEffects.playBack();
                setStep('to');
              }}
              className="-ml-3 min-w-11 min-h-11 inline-flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              aria-label="Voltar para a carta 1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[13px] font-semibold text-primary">Carta 2 de 2</span>
          </div>
          <h2 className="text-xl font-bold font-display text-ink leading-tight">Responda como o seu eu de 90 dias</h2>
          <p className="text-sm text-muted leading-relaxed">
            Agora imagine que deu certo. O que você fez? Como foram os dias difíceis? O que diria pra você de hoje?
            Essa parte é só sua: escrever essa resposta é o que mais ajuda a manter o combinado.
          </p>
          <textarea
            rows={10}
            value={fromFuture}
            onChange={(e) => actions.setLetter({ fromFuture: e.target.value })}
            placeholder="Escreva com suas palavras..."
            className={textareaClass}
            aria-label="Resposta do seu eu de daqui a 90 dias"
          />
          {!canSeal && <p className="text-[13px] text-muted">Escreva pelo menos algumas frases para selar a carta.</p>}
        </div>
        <div className="pt-3">
          <button
            disabled={!canSeal}
            onClick={() => {
              soundEffects.playCommitmentSuccess();
              actions.sealLetter();
              setStep('sealed');
            }}
            className={primaryButton}
          >
            <Bookmark className="w-4 h-4" />
            <span>Selar as cartas</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key="sealed" className="flex-1 flex flex-col justify-between p-5 select-none animate-letter-unroll bg-gradient-to-b from-canvas to-gold-soft overflow-y-auto">
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-[13px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cartas seladas</span>
          </div>
          <button
            onClick={() => {
              soundEffects.playSoftTap();
              setStep('to');
            }}
            className="text-[13px] text-muted flex items-center gap-1 cursor-pointer"
          >
            <Pencil className="w-3 h-3" /> Editar
          </button>
        </div>

        {/* Pergaminho com as duas vias */}
        <div className="p-4 rounded-2xl bg-surface border border-gold-line/80 shadow-md space-y-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-ink block mb-1">De você, hoje</span>
            <p className="text-sm text-ink font-serif leading-relaxed whitespace-pre-line">{toFuture}</p>
          </div>
          <div className="border-t border-gold-soft pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Do seu eu de 90 dias</span>
            <p className="text-sm text-ink font-serif leading-relaxed whitespace-pre-line">{fromFuture}</p>
          </div>
          <div className="pt-2.5 border-t border-gold-soft flex items-center gap-1.5 text-[13px] text-gold-ink font-medium">
            <Bookmark className="w-3.5 h-3.5 text-primary" />
            <span>Pacto selado{letter?.sealedAt ? ` em ${new Date(letter.sealedAt).toLocaleDateString('pt-BR')}` : ''}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-line">
        {onboardingDone ? (
          <button
            onClick={() => {
              soundEffects.playBack();
              actions.goTab('home');
            }}
            className={primaryButton}
          >
            <span>Voltar para a jornada</span>
          </button>
        ) : (
          <button onClick={enterJourney} className={primaryButton}>
            <span>Começar a jornada</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
