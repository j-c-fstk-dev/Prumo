/**
 * Limite de uso do coach (Fase 2.4): protege a chave e o custo da IA.
 * A regra é pura e testável; quem guarda os contadores é o Durable Object do Worker
 * (worker/limiter.ts). Só conta quando a IA vai mesmo ser chamada: crise, mensagem
 * inválida e modo offline não gastam a cota.
 */

export interface LimitRule {
  key: string;
  max: number;
}

export interface CounterStore {
  get(key: string): number;
  set(key: string, value: number): void;
}

export type LimitEnv = Partial<
  Record<'COACH_LIMIT_DEVICE_DAY' | 'COACH_LIMIT_DEVICE_MINUTE' | 'COACH_LIMIT_IP_DAY' | 'COACH_LIMIT_TOTAL_DAY', string>
>;

/** Padrões pensados para a fase de testes; ajustáveis por variável de ambiente sem mexer no código */
export const DEFAULT_LIMITS = {
  deviceDay: 30,
  deviceMinute: 5,
  ipDay: 100,
  totalDay: 1500,
};

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/** Dia e minuto em UTC: a cota diária vira à meia-noite UTC (21h no horário de Brasília) */
export function periodKeys(now: Date): { day: string; minute: string } {
  const iso = now.toISOString();
  return { day: iso.slice(0, 10), minute: iso.slice(0, 16) };
}

/** Identificador do aparelho mandado pelo app: só letras, números e hífen, no máximo 64 */
export function cleanClientId(raw: unknown): string {
  return typeof raw === 'string' ? raw.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64) : '';
}

export function buildRules(env: LimitEnv, who: { clientId: string; ip: string }, now: Date): LimitRule[] {
  const { day, minute } = periodKeys(now);
  const device = who.clientId || `ip-${who.ip}`;
  return [
    { key: `d:${day}:total`, max: num(env.COACH_LIMIT_TOTAL_DAY, DEFAULT_LIMITS.totalDay) },
    { key: `d:${day}:ip:${who.ip}`, max: num(env.COACH_LIMIT_IP_DAY, DEFAULT_LIMITS.ipDay) },
    { key: `d:${day}:dev:${device}`, max: num(env.COACH_LIMIT_DEVICE_DAY, DEFAULT_LIMITS.deviceDay) },
    { key: `m:${minute}:dev:${device}`, max: num(env.COACH_LIMIT_DEVICE_MINUTE, DEFAULT_LIMITS.deviceMinute) },
  ];
}

/** Tudo ou nada: se alguma regra estourou, nada é contado */
export function consume(store: CounterStore, rules: LimitRule[]): { allowed: boolean; blockedBy?: string } {
  for (const r of rules) {
    if (store.get(r.key) >= r.max) return { allowed: false, blockedBy: r.key };
  }
  for (const r of rules) store.set(r.key, store.get(r.key) + 1);
  return { allowed: true };
}

export function limitReply(name: string, blockedBy: string | undefined, taskTitle?: string): string {
  const who = name?.trim() || 'Ei';
  const next = taskTitle ? ` Que tal dar mais um passinho em "${taskTitle}"?` : '';
  if (blockedBy?.startsWith('m:')) {
    return `Calma, ${who}: muitas mensagens em pouco tempo. Respira um minutinho e me manda de novo.`;
  }
  return `${who}, por hoje a gente já conversou bastante! O coach volta amanhã.${next} Se travar, o kit da tarefa tem modelos prontos pra te ajudar.`;
}
