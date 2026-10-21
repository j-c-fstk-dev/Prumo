import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { SwitchPath } from '../components/SwitchPath';
import { useApp } from '../state/AppStore';
import { funnel } from '../../domain/people';
import { CYCLE_DAYS, CYCLE_LABEL, CYCLE_NOTE_LIMIT, suggestedTarget, type CycleKind } from '../../domain/cycles';
import { Reveal } from '../components/Reveal';

type Choice = CycleKind | 'trocar';

const OPTIONS: { id: Choice; emoji: string; title: string; text: string }[] = [
  { id: 'continuar', emoji: '🌳', title: 'Deu certo: continuar e crescer', text: `Mais ${CYCLE_DAYS} dias com uma meta de clientes novos. As rotinas seguem com você.` },
  { id: 'ajustar', emoji: '🔧', title: 'Quase: ajustar e testar de novo', text: `Mude uma coisa e teste com outras pessoas por ${CYCLE_DAYS} dias, com uma meta de conversas.` },
  { id: 'trocar', emoji: '🧭', title: 'Não rolou: trocar de caminho', text: 'Tudo bem. Você escolhe outra aposta e começa um roteiro novo. O que você fez fica na sua história.' },
];

/**
 * Próximo ciclo (etapa 44): depois do roteiro (ou do Dia 90, ou ao fim de um ciclo), uma decisão
 * honesta baseada no que aconteceu, com os números do Caderno na frente.
 */
export const NextCycleScreen: React.FC = () => {
  const { tasks, people, routineLog, journeyDay, cycleInfo, actions } = useApp();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [target, setTarget] = useState(0);
  const [note, setNote] = useState('');

  const stats = funnel(people);
  const done = tasks.filter((t) => t.status === 'completed').length;
  const routinesDone = Object.values(routineLog).reduce((n, days) => n + days.length, 0);

  const pick = (c: Choice) => {
    soundEffects.playSelectOption();
    setChoice(c);
    if (c !== 'trocar') setTarget(suggestedTarget(c, people));
  };

  return (
    <div className="flex-1 flex flex-col p-5 select-none overflow-y-auto animate-fadeIn space-y-4">
      <button onClick={() => actions.goTab('home')} className="self-start min-h-10 inline-flex items-center gap-1 text-sm text-muted cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <Reveal i={0}>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Próximo ciclo</span>
        <h2 className="text-2xl font-bold font-display text-ink leading-tight mt-1">
          {cycleInfo ? `Fim do ciclo ${cycleInfo.number}. E agora?` : 'Você chegou ao fim do roteiro. E agora?'}
        </h2>
        <p className="text-sm text-muted mt-1">Olhe o que aconteceu de verdade e escolha com calma. Não existe resposta errada.</p>
      </Reveal>

      <Reveal i={1}>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            [journeyDay ?? 0, 'dias de jornada'],
            [done, 'passos feitos'],
            [routinesDone, 'rotinas feitas'],
            [stats.talked, 'conversas'],
            [stats.committed, 'compromissos'],
            [stats.clients, 'clientes'],
          ].map(([n, label]) => (
            <div key={label} className="p-2.5 rounded-xl bg-surface border border-line">
              <strong className="block text-xl font-display text-ink">{n}</strong>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>
        {cycleInfo && (
          <p className="text-[13px] text-ink mt-2">
            Meta do ciclo: {cycleInfo.count} de {cycleInfo.target} {CYCLE_LABEL[cycleInfo.kind].unit[1]}
            {cycleInfo.goalMet ? ' ✦ batida!' : '.'}
          </p>
        )}
        <button onClick={() => actions.go('future_letter')} className="mt-2 text-sm font-semibold text-primary underline underline-offset-2 cursor-pointer">
          Reler a carta do começo
        </button>
      </Reveal>

      <Reveal i={2}>
        <div className="space-y-2" role="radiogroup" aria-label="Próximo passo">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={choice === o.id}
              onClick={() => pick(o.id)}
              className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                choice === o.id ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-primary'
              }`}
            >
              <strong className="text-sm text-ink block">
                {o.emoji} {o.title}
              </strong>
              <span className="text-[13px] text-muted block mt-0.5 leading-snug">{o.text}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {(choice === 'continuar' || choice === 'ajustar') && (
        <div className="p-4 rounded-2xl bg-surface border border-primary/40 space-y-3 animate-fadeIn">
          <label className="block">
            <span className="text-sm font-semibold text-ink block mb-1">
              Meta dos próximos {CYCLE_DAYS} dias: {choice === 'continuar' ? 'quantos clientes novos?' : 'quantas conversas novas?'}
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={target || ''}
              onChange={(e) => setTarget(Number(e.target.value))}
              aria-label="Meta do ciclo"
              className="w-28 px-3 py-2 text-base rounded-xl border border-line bg-surface text-ink focus:outline-none focus:border-primary"
            />
            <span className="text-xs text-muted block mt-1">
              {choice === 'continuar'
                ? 'Conta quem virar "Cliente" no Caderno durante o ciclo. Pequena e possível ganha de grande e bonita.'
                : 'Conta quem sair de "Novo" no Caderno durante o ciclo (conversou, se interessou ou comprou).'}
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink block mb-1">{choice === 'ajustar' ? 'O que você vai mudar?' : 'No que você vai focar?'} (opcional)</span>
            <textarea
              rows={2}
              maxLength={CYCLE_NOTE_LIMIT}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={choice === 'ajustar' ? 'Ex: o preço, ou falar com outro tipo de pessoa' : 'Ex: pedir indicação a todo cliente'}
              aria-label="Foco do ciclo"
              className="w-full px-3 py-2 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary resize-none"
            />
          </label>
          <button
            disabled={!target}
            onClick={() => {
              soundEffects.playCompleteTask();
              actions.startCycle(choice, target, note);
            }}
            className="w-full min-h-11 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-on-primary text-sm font-semibold cursor-pointer"
          >
            Começar o ciclo
          </button>
        </div>
      )}

      {choice === 'trocar' && <SwitchPath onCancel={() => setChoice(null)} />}
    </div>
  );
};
