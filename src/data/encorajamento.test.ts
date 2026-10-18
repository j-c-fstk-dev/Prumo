import { describe, expect, it } from 'vitest';
import { ENCORAJAMENTO_ANAMNESE, LEMBRETES_GERAIS, lembreteDoDia, type ContextoLembrete } from './encorajamento';

const ctx = (iso: string, extra: Partial<ContextoLembrete> = {}): ContextoLembrete => ({
  date: new Date(`${iso}T12:00:00`),
  chapterId: 1,
  daysSinceStart: 10,
  daysAway: 0,
  ...extra,
});

describe('frases de encorajamento', () => {
  it('a anamnese tem frases suficientes para não repetir numa rodada (13 perguntas)', () => {
    expect(ENCORAJAMENTO_ANAMNESE.length).toBeGreaterThanOrEqual(40);
    expect(new Set(ENCORAJAMENTO_ANAMNESE).size).toBe(ENCORAJAMENTO_ANAMNESE.length);
  });

  it('seguem o guia de voz: sem jargão e sem promessa de renda', () => {
    const todas = [...ENCORAJAMENTO_ANAMNESE, ...LEMBRETES_GERAIS].join(' ').toLowerCase();
    for (const proibido of ['nicho', 'hipótese', 'anamnese', 'garantid', 'fique rico', 'renda passiva']) {
      expect(todas, proibido).not.toContain(proibido);
    }
  });

  it('mensagem de segunda-feira só aparece na segunda', () => {
    // 4 semanas de dias: nenhuma frase com "Segunda" fora da segunda-feira
    for (let d = 1; d <= 28; d++) {
      const date = new Date(2026, 9, d, 12);
      const texto = lembreteDoDia({ date, chapterId: 2, daysSinceStart: 20, daysAway: 0 });
      if (/^Segunda/.test(texto)) expect(date.getDay()).toBe(1);
      if (/^Sexta/.test(texto)) expect(date.getDay()).toBe(5);
    }
  });

  it('primeiro dia e volta depois de uns dias recebem mensagens próprias', () => {
    const primeiro = lembreteDoDia(ctx('2026-10-14', { daysSinceStart: 0 }));
    const volta = lembreteDoDia(ctx('2026-10-14', { daysAway: 4 }));
    expect(primeiro.length).toBeGreaterThan(0);
    expect(volta.length).toBeGreaterThan(0);
  });

  it('muda de um dia para o outro', () => {
    const textos = new Set(Array.from({ length: 7 }, (_, i) => lembreteDoDia(ctx(`2026-10-${String(12 + i).padStart(2, '0')}`))));
    expect(textos.size).toBeGreaterThanOrEqual(4);
  });
});
