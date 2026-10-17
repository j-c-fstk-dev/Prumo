/**
 * Direitos de uso (freemium), modelo aprovado em docs/pesquisa/06:
 * "o caminho é grátis; a aceleração é paga". Todos os limites ficam AQUI, num lugar só.
 *
 * O paywall nasce DESLIGADO (VITE_PAYWALL_ENABLED). Desligado, todo mundo tem tudo.
 * Ligado, quem começou há menos de FOUNDER_TRIAL_DAYS tem premium completo (teste de fundador).
 */

export type Feature =
  | 'coach_message'
  | 'pivot'
  | 'execution_kit'
  | 'guided_audio'
  | 'multiple_projects'
  | 'export_pdf'
  | 'mapa_humano_full';

export const FREE_LIMITS = {
  /** Mensagens ao coach por semana (a IA custa por mensagem) */
  coachMessagesPerWeek: 5,
  /** Trocas de plano (alternativa ou refazer o diagnóstico) */
  pivots: 1,
  /** Modelos do kit de execução liberados por capítulo */
  executionKitPerChapter: 1,
  /** Capítulos com micro-áudios guiados */
  guidedAudioChapters: [1],
} as const;

export const FOUNDER_TRIAL_DAYS = 30;

export const PRICES = {
  monthly: 'R$ 19,90/mês',
  yearly: 'R$ 119,90/ano',
  yearlyPerMonth: '≈ R$ 10/mês',
  founderDiscount: '50% de desconto vitalício no anual para fundadores',
} as const;

export interface EntitlementContext {
  paywallEnabled: boolean;
  isPremium: boolean;
  /** Quando a pessoa começou (fim do onboarding), para o teste de fundador */
  startedAt?: number;
  now: number;
  usage: {
    coachMessagesThisWeek: number;
    pivots: number;
  };
  chapterId?: number;
  /** Quantos modelos do kit já foram usados neste capítulo */
  executionKitUsedInChapter?: number;
}

export interface Entitlement {
  allowed: boolean;
  /** Quanto ainda resta no grátis (quando há limite numérico) */
  remaining?: number;
  reason?: string;
}

export type Plan = 'open_beta' | 'founder_trial' | 'premium' | 'free';

export function currentPlan(ctx: Pick<EntitlementContext, 'paywallEnabled' | 'isPremium' | 'startedAt' | 'now'>): Plan {
  if (!ctx.paywallEnabled) return 'open_beta';
  if (ctx.isPremium) return 'premium';
  if (ctx.startedAt && ctx.now - ctx.startedAt < FOUNDER_TRIAL_DAYS * 86_400_000) return 'founder_trial';
  return 'free';
}

export function trialDaysLeft(startedAt: number | undefined, now: number): number {
  if (!startedAt) return 0;
  return Math.max(0, Math.ceil((startedAt + FOUNDER_TRIAL_DAYS * 86_400_000 - now) / 86_400_000));
}

export function can(feature: Feature, ctx: EntitlementContext): Entitlement {
  if (currentPlan(ctx) !== 'free') return { allowed: true };

  switch (feature) {
    case 'coach_message': {
      const remaining = Math.max(0, FREE_LIMITS.coachMessagesPerWeek - ctx.usage.coachMessagesThisWeek);
      return remaining > 0
        ? { allowed: true, remaining }
        : { allowed: false, remaining: 0, reason: `No plano grátis são ${FREE_LIMITS.coachMessagesPerWeek} mensagens por semana. Elas renovam na segunda-feira.` };
    }
    case 'pivot': {
      const remaining = Math.max(0, FREE_LIMITS.pivots - ctx.usage.pivots);
      return remaining > 0
        ? { allowed: true, remaining }
        : { allowed: false, remaining: 0, reason: 'No plano grátis você pode trocar de plano 1 vez.' };
    }
    case 'execution_kit': {
      const used = ctx.executionKitUsedInChapter ?? 0;
      const remaining = Math.max(0, FREE_LIMITS.executionKitPerChapter - used);
      return remaining > 0 ? { allowed: true, remaining } : { allowed: false, remaining: 0, reason: 'No plano grátis há 1 modelo por capítulo.' };
    }
    case 'guided_audio':
      return (FREE_LIMITS.guidedAudioChapters as readonly number[]).includes(ctx.chapterId ?? 1)
        ? { allowed: true }
        : { allowed: false, reason: 'No plano grátis os áudios guiados são do Capítulo 1.' };
    case 'multiple_projects':
    case 'export_pdf':
    case 'mapa_humano_full':
      return { allowed: false, reason: 'Recurso do Premium.' };
  }
}
