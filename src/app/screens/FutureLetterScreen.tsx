import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Bookmark, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANAMNESE_SECTIONS } from '../../data/prumoData';
import { draftToFuture, hasWrittenReply, starterFromFuture } from '../../domain/letter';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

type Step = 'to' | 'from' | 'sealed';

const textareaClass =
  'w-full p-3 text-xs font-serif leading-relaxed rounded-xl border border-amber-300 bg-white text-[#1A1D1B] placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1F6F5C] resize-none';

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
    'w-full py-3.5 bg-[#1F6F5C] hover:bg-[#2E8B73] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2';

  if (step === 'to') {
    return (
      <div key="to" className="flex-1 flex flex-col justify-between p-5 select-none animate-fadeIn bg-gradient-to-b from-[#FDFCF9] to-[#F5EFE6] overflow-y-auto">
        <div className="space-y-3 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#1F6F5C] text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compromisso assinado · Carta 1 de 2</span>
          </div>
          <h2 className="text-xl font-bold font-display text-[#1A1D1B] leading-tight">Escreva para você daqui a 90 dias</h2>
          <p className="text-xs text-[#5B615D] leading-relaxed">
            Deixamos um rascunho com o seu plano. Mude o que quiser: quanto mais tiver o seu jeito de falar, melhor.
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
      <div key="from" className="flex-1 flex flex-col justify-between p-5 select-none animate-fadeIn bg-gradient-to-b from-[#FDFCF9] to-[#F5EFE6] overflow-y-auto">
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                soundEffects.playBack();
                setStep('to');
              }}
              className="p-1 -ml-1 text-[#5B615D] hover:text-[#1A1D1B] cursor-pointer"
              aria-label="Voltar para a carta 1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-[#1F6F5C]">Carta 2 de 2</span>
          </div>
          <h2 className="text-xl font-bold font-display text-[#1A1D1B] leading-tight">Responda como o seu eu de 90 dias</h2>
          <p className="text-xs text-[#5B615D] leading-relaxed">
            Imagine que deu certo. O que você fez? Como se sentiu nos dias difíceis? O que diria para quem está começando hoje?
            Esta parte é só sua: escrever a resposta é o que mais fortalece o compromisso.
          </p>
          <textarea
            rows={10}
            value={fromFuture}
            onChange={(e) => actions.setLetter({ fromFuture: e.target.value })}
            placeholder="Escreva com suas palavras..."
            className={textareaClass}
            aria-label="Resposta do seu eu de daqui a 90 dias"
          />
          {!canSeal && <p className="text-[11px] text-[#5B615D]">Escreva pelo menos algumas frases para selar a carta.</p>}
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
    <div key="sealed" className="flex-1 flex flex-col justify-between p-5 select-none animate-letter-unroll bg-gradient-to-b from-[#FDFCF9] to-[#F5EFE6] overflow-y-auto">
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#1F6F5C] text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cartas seladas</span>
          </div>
          <button
            onClick={() => {
              soundEffects.playSoftTap();
              setStep('to');
            }}
            className="text-[11px] text-[#5B615D] flex items-center gap-1 cursor-pointer"
          >
            <Pencil className="w-3 h-3" /> Editar
          </button>
        </div>

        {/* Pergaminho com as duas vias */}
        <div className="p-4 rounded-2xl bg-white border border-amber-300/80 shadow-md space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">De você, hoje</span>
            <p className="text-xs text-[#2D3748] font-serif leading-relaxed whitespace-pre-line">{toFuture}</p>
          </div>
          <div className="border-t border-amber-100 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block mb-1">Do seu eu de 90 dias</span>
            <p className="text-xs text-[#2D3748] font-serif leading-relaxed whitespace-pre-line">{fromFuture}</p>
          </div>
          <div className="pt-2.5 border-t border-amber-100 flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
            <Bookmark className="w-3.5 h-3.5 text-[#1F6F5C]" />
            <span>Pacto selado{letter?.sealedAt ? ` em ${new Date(letter.sealedAt).toLocaleDateString('pt-BR')}` : ''}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#E6E8E6]">
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
            <span>Entrar na Jornada (Capítulo 1)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
