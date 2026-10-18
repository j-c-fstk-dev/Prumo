import { describe, expect, it } from 'vitest';
import { BACKUP_VERSION, buildBackup, parseBackup, summarizeBackup } from './backup';

const state = {
  version: 1,
  userName: 'Marina',
  clientId: 'aparelho-antigo',
  notes: [{ id: 'n1', text: 'oi', images: ['i1'] }],
  people: [{ id: 'p1', name: 'Ana' }, { id: 'p2', name: 'Beto' }],
  taskStatus: { t1: 'completed', t2: 'pending', t3: 'completed' },
  checkIns: [{ day: '2026-10-18' }],
};

describe('backup completo', () => {
  it('ida e volta: o que sai é o que volta, sem o id do aparelho', () => {
    const b = buildBackup({ state, images: { i1: 'fotos/foto-01.jpg' }, appVersion: '0.9.0', now: 123 });
    expect(b.state).not.toHaveProperty('clientId');
    const parsed = parseBackup(JSON.stringify(b));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.state.userName).toBe('Marina');
    expect(parsed.backup.images).toEqual({ i1: 'fotos/foto-01.jpg' });
    expect(summarizeBackup(parsed.backup)).toEqual({ userName: 'Marina', exportedAt: 123, notes: 1, people: 2, photos: 1, tasksDone: 2, checkIns: 1 });
  });

  it('recusa arquivos que não são backup, sem quebrar', () => {
    for (const text of ['', 'oi', '[]', '{"format":"outro","state":{}}', '{"format":"prumo-backup","version":1,"state":[]}']) {
      const r = parseBackup(text);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toMatch(/não é um backup do Prumo/);
    }
  });

  it('avisa quando o backup é de uma versão mais nova do app', () => {
    const r = parseBackup(JSON.stringify({ format: 'prumo-backup', version: BACKUP_VERSION + 1, state: {} }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/versão mais nova/);
  });

  it('ignora fotos com caminho inválido no índice', () => {
    const r = parseBackup(JSON.stringify({ format: 'prumo-backup', version: 1, state: {}, images: { a: 'fotos/a.jpg', b: 42 } }));
    expect(r.ok && r.backup.images).toEqual({ a: 'fotos/a.jpg' });
  });
});
