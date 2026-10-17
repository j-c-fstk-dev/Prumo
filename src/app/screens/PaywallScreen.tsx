import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { FREE_LIMITS, FOUNDER_TRIAL_DAYS, PRICES } from '../../domain/entitlements';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

const PREMIUM_BENEFITS = [
  'Coach de IA ilimitado para destravar na hora',
  'Kit de execução completo: modelos de mensagem, roteiro de conversa, calculadora de preço e página de venda',
  'Trocar de plano quantas vezes precisar',
  'Micro-áudios guiados e ambiente sonoro em todos os capítulos',
  'Mais de um projeto ao mesmo tempo e plano em PDF',
];

const FREE_FOREVER = [
  'Diagnóstico completo e o roteiro inteiro, com os 3 capítulos',
  'Tarefas pessoais, check-in, constelação e lembretes',
  `Coach de IA: ${FREE_LIMITS.coachMessagesPerWeek} mensagens por semana`,
];

/**
 * Planos (modelo aprovado em docs/pesquisa/06): o caminho é grátis, a aceleração é paga.
 * A cobrança real (Google Play Billing) entra na Fase 4/5; até lá não há compra aqui.
 */
export const PaywallScreen: React.FC = () => {
  const { paywallEnabled, paywallReason, plan, trialDaysLeft, actions } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none bg-surface animate-slide-up overflow-y-auto">
      <div>
        <button
          onClick={() => {
            soundEffects.playBack();
            actions.go('home');
          }}
          className="p-1 -ml-1 text-muted hover:text-ink mb-2 cursor-pointer"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold font-display text-ink">Prumo Premium: acelere o caminho</h2>
        <p className="text-sm text-muted mt-1 mb-4">
          O caminho inteiro é grátis. O Premium dá velocidade, profundidade e companhia.
        </p>

        {paywallReason && (
          <div className="p-3 rounded-xl bg-gold-soft border border-gold-line text-sm text-gold-ink mb-4">{paywallReason}</div>
        )}

        {!paywallEnabled && (
          <div className="p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm text-primary mb-4 leading-relaxed">
            <strong>Fase de testes:</strong> as assinaturas ainda não estão abertas e tudo está liberado para você.
          </div>
        )}
        {plan === 'founder_trial' && (
          <div className="p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm text-primary mb-4">
            Você é fundador: Premium completo por mais <strong>{trialDaysLeft} dias</strong> (teste de {FOUNDER_TRIAL_DAYS} dias).
          </div>
        )}

        <span className="text-[13px] font-bold uppercase tracking-wider text-primary block mb-2">No Premium</span>
        <div className="space-y-2 text-sm text-ink mb-4">
          {PREMIUM_BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <span className="text-[13px] font-bold uppercase tracking-wider text-muted block mb-2">Grátis para sempre</span>
        <ul className="space-y-1 text-sm text-muted mb-5 list-disc pl-5">
          {FREE_FOREVER.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-xl border-2 border-primary bg-primary-soft/50">
            <div className="flex items-center justify-between">
              <strong className="text-sm text-ink">Anual</strong>
              <span className="text-sm font-bold text-primary">Melhor escolha</span>
            </div>
            <span className="text-[13px] text-muted block">
              {PRICES.yearly} ({PRICES.yearlyPerMonth})
            </span>
            <span className="text-xs text-primary block mt-0.5">{PRICES.founderDiscount}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-line bg-surface">
            <strong className="text-sm text-ink block">Mensal</strong>
            <span className="text-[13px] text-muted">{PRICES.monthly}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <button
          disabled
          className="w-full py-3.5 bg-primary disabled:opacity-50 text-on-primary font-semibold text-base rounded-xl shadow-md cursor-not-allowed"
        >
          Assinaturas em breve
        </button>
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.go('home');
          }}
          className="w-full py-2 text-sm text-muted hover:text-ink text-center cursor-pointer"
        >
          Continuar no grátis
        </button>
      </div>
    </div>
  );
};
