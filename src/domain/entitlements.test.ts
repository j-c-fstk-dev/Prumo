import { describe, expect, it } from 'vitest';
import { can, currentPlan, FOUNDER_TRIAL_DAYS, FREE_LIMITS, trialDaysLeft, type EntitlementContext } from './entitlements';

const DAY = 86_400_000;
const NOW = 1_800_000_000_000;
const ctx = (over: Partial<EntitlementContext> = {}): EntitlementContext => ({
  paywallEnabled: true,
  isPremium: false,
  startedAt: NOW - 60 * DAY,
  now: NOW,
  usage: { coachMessagesThisWeek: 0, pivots: 0 },
  ...over,
});

describe('currentPlan', () => {
  it('com o paywall desligado, todo mundo está no teste aberto', () => {
    expect(currentPlan(ctx({ paywallEnabled: false }))).toBe('open_beta');
  });
  it(`fundador tem premium nos primeiros ${FOUNDER_TRIAL_DAYS} dias`, () => {
    expect(currentPlan(ctx({ startedAt: NOW - 10 * DAY }))).toBe('founder_trial');
    expect(currentPlan(ctx({ startedAt: NOW - 31 * DAY }))).toBe('free');
  });
  it('assinante é premium', () => {
    expect(currentPlan(ctx({ isPremium: true }))).toBe('premium');
  });
});

describe('can', () => {
  it('paywall desligado libera tudo, inclusive recursos premium', () => {
    const off = ctx({ paywallEnabled: false, usage: { coachMessagesThisWeek: 99, pivots: 9 } });
    expect(can('coach_message', off).allowed).toBe(true);
    expect(can('export_pdf', off).allowed).toBe(true);
  });

  it(`grátis: ${FREE_LIMITS.coachMessagesPerWeek} mensagens por semana ao coach`, () => {
    expect(can('coach_message', ctx({ usage: { coachMessagesThisWeek: 4, pivots: 0 } }))).toEqual({ allowed: true, remaining: 1 });
    const blocked = can('coach_message', ctx({ usage: { coachMessagesThisWeek: 5, pivots: 0 } }));
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toContain('segunda-feira');
  });

  it('grátis: 1 troca de plano', () => {
    expect(can('pivot', ctx()).allowed).toBe(true);
    expect(can('pivot', ctx({ usage: { coachMessagesThisWeek: 0, pivots: 1 } })).allowed).toBe(false);
  });

  it('grátis: áudios guiados só no capítulo 1', () => {
    expect(can('guided_audio', ctx({ chapterId: 1 })).allowed).toBe(true);
    expect(can('guided_audio', ctx({ chapterId: 2 })).allowed).toBe(false);
  });
});

describe('trialDaysLeft', () => {
  it('conta os dias restantes do teste de fundador', () => {
    expect(trialDaysLeft(NOW - 10 * DAY, NOW)).toBe(20);
    expect(trialDaysLeft(NOW - 40 * DAY, NOW)).toBe(0);
  });
});
