import { describe, expect, it } from 'vitest';
import { buildRules, cleanClientId, consume, DEFAULT_LIMITS, limitReply, type CounterStore } from './limits';

function memoryStore(): CounterStore & { data: Map<string, number> } {
  const data = new Map<string, number>();
  return { data, get: (k) => data.get(k) ?? 0, set: (k, v) => void data.set(k, v) };
}

const NOW = new Date('2026-10-18T12:34:56Z');
const who = { clientId: 'abc', ip: '1.2.3.4' };

describe('limite de uso do coach', () => {
  it('libera até o limite diário do aparelho e então bloqueia', () => {
    const store = memoryStore();
    const env = { COACH_LIMIT_DEVICE_MINUTE: '1000' };
    for (let i = 0; i < DEFAULT_LIMITS.deviceDay; i++) {
      expect(consume(store, buildRules(env, who, NOW)).allowed).toBe(true);
    }
    const r = consume(store, buildRules(env, who, NOW));
    expect(r.allowed).toBe(false);
    expect(r.blockedBy).toContain(':dev:abc');
  });

  it('o limite por minuto segura rajadas e libera no minuto seguinte', () => {
    const store = memoryStore();
    for (let i = 0; i < DEFAULT_LIMITS.deviceMinute; i++) consume(store, buildRules({}, who, NOW));
    expect(consume(store, buildRules({}, who, NOW)).blockedBy).toMatch(/^m:/);
    expect(consume(store, buildRules({}, who, new Date('2026-10-18T12:35:01Z'))).allowed).toBe(true);
  });

  it('um novo dia (UTC) zera a cota', () => {
    const store = memoryStore();
    const env = { COACH_LIMIT_DEVICE_DAY: '2', COACH_LIMIT_DEVICE_MINUTE: '1000' };
    consume(store, buildRules(env, who, NOW));
    consume(store, buildRules(env, who, NOW));
    expect(consume(store, buildRules(env, who, NOW)).allowed).toBe(false);
    expect(consume(store, buildRules(env, who, new Date('2026-10-19T00:00:01Z'))).allowed).toBe(true);
  });

  it('bloqueado não conta: nenhuma regra é incrementada', () => {
    const store = memoryStore();
    const env = { COACH_LIMIT_TOTAL_DAY: '1' };
    consume(store, buildRules(env, who, NOW));
    const before = new Map(store.data);
    consume(store, buildRules(env, { clientId: 'outro', ip: '9.9.9.9' }, NOW));
    expect(store.data).toEqual(before);
  });

  it('trocar o id do aparelho não escapa do limite por IP nem do total', () => {
    const store = memoryStore();
    const env = { COACH_LIMIT_IP_DAY: '3', COACH_LIMIT_DEVICE_MINUTE: '1000' };
    for (let i = 0; i < 3; i++) consume(store, buildRules(env, { clientId: `fake${i}`, ip: '1.2.3.4' }, NOW));
    expect(consume(store, buildRules(env, { clientId: 'fake9', ip: '1.2.3.4' }, NOW)).blockedBy).toContain(':ip:');
  });

  it('valores de ambiente inválidos caem no padrão', () => {
    const rules = buildRules({ COACH_LIMIT_DEVICE_DAY: 'abc', COACH_LIMIT_TOTAL_DAY: '-5' }, who, NOW);
    expect(rules.find((r) => r.key.includes(':dev:') && r.key.startsWith('d:'))!.max).toBe(DEFAULT_LIMITS.deviceDay);
    expect(rules.find((r) => r.key.endsWith(':total'))!.max).toBe(DEFAULT_LIMITS.totalDay);
  });

  it('limpa o id do aparelho e escreve uma resposta acolhedora', () => {
    expect(cleanClientId('a<b>c; DROP')).toBe('abcDROP');
    expect(cleanClientId(42)).toBe('');
    expect(limitReply('Jo', 'd:2026-10-18:dev:abc', 'Mostrar pra 3 pessoas')).toContain('volta amanhã');
    expect(limitReply('Jo', 'm:2026-10-18T12:34:dev:abc')).toContain('minutinho');
  });
});
