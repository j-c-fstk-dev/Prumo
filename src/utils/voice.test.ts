import { describe, expect, it } from 'vitest';
import { estimateSeconds, formatDuration, isVoiceSupported } from './voice';

describe('voz sintética', () => {
  it('estima a duração pelo número de palavras', () => {
    const words = Array.from({ length: 143 }, () => 'palavra').join(' ');
    expect(estimateSeconds(words)).toBe(60);
    expect(estimateSeconds('oi')).toBe(5); // mínimo
  });
  it('formata minutos e segundos', () => {
    expect(formatDuration(75)).toBe('1:15');
    expect(formatDuration(9)).toBe('0:09');
  });
  it('fora do navegador não há voz (e nada quebra)', () => {
    expect(isVoiceSupported()).toBe(false);
  });
});
