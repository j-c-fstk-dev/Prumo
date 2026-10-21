import { describe, expect, it, vi } from 'vitest';
import { setCohort, track } from './telemetry';

describe('métricas (etapa 54)', () => {
  it('todo evento leva a turma (semana em que a pessoa começou), sem identificar ninguém', () => {
    const calls: unknown[] = [];
    vi.stubGlobal('window', { umami: { track: vi.fn((e: string, d: unknown) => calls.push([e, d])) } });
    setCohort('2026-10-19');
    track('app_aberto', { dia: 3 });
    track('guia_aberto');
    expect(calls).toEqual([
      ['app_aberto', { dia: 3, turma: '2026-10-19' }],
      ['guia_aberto', { turma: '2026-10-19' }],
    ]);
    setCohort(null);
    vi.unstubAllGlobals();
  });
});
