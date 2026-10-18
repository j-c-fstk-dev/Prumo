/**
 * Durable Object que guarda os contadores do limite de uso do coach (SQLite, plano grátis).
 * Uma instância única ("coach") processa uma chamada por vez, então a contagem é exata.
 * A regra está em server/limits.ts.
 */

import { DurableObject } from 'cloudflare:workers';
import { consume, type LimitRule } from '../server/limits.ts';

export class UsageLimiter extends DurableObject {
  private cleanedDay = '';

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env);
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL)');
  }

  async consume(rules: LimitRule[]): Promise<{ allowed: boolean; blockedBy?: string }> {
    const sql = this.ctx.storage.sql;
    // Uma vez por dia, apaga os contadores de dias anteriores (chaves "d:AAAA-MM-DD..." e "m:AAAA-MM-DD...")
    const today = new Date().toISOString().slice(0, 10);
    if (this.cleanedDay !== today) {
      sql.exec('DELETE FROM counters WHERE substr(key, 3, 10) < ?', today);
      this.cleanedDay = today;
    }
    return consume(
      {
        get: (key) => Number(sql.exec('SELECT value FROM counters WHERE key = ?', key).toArray()[0]?.value ?? 0),
        set: (key, value) =>
          void sql.exec('INSERT INTO counters (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, value),
      },
      rules,
    );
  }
}
