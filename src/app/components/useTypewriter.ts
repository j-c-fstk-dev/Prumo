import { useEffect, useRef, useState } from 'react';

/** Duração total da "digitação", qualquer que seja o tamanho do texto */
const TOTAL_MS = 1600;
const TICK_MS = 24;

const prefersLessMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Efeito de digitação (etapa 46): o texto aparece aos poucos, como se o coach estivesse escrevendo.
 * Quem pede menos movimento vê o texto inteiro na hora. `skip()` mostra tudo de uma vez.
 */
export function useTypewriter(onText: (text: string) => void) {
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const full = useRef('');

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const skip = () => {
    stop();
    onText(full.current);
    setTyping(false);
  };

  const start = (text: string) => {
    stop();
    full.current = text;
    if (prefersLessMotion() || !text) {
      onText(text);
      setTyping(false);
      return;
    }
    const step = Math.max(1, Math.ceil(text.length / (TOTAL_MS / TICK_MS)));
    let shown = 0;
    setTyping(true);
    onText('');
    timer.current = setInterval(() => {
      shown = Math.min(text.length, shown + step);
      onText(text.slice(0, shown));
      if (shown >= text.length) {
        stop();
        setTyping(false);
      }
    }, TICK_MS);
  };

  useEffect(() => stop, []);
  return { typing, start, skip };
}
