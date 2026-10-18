/**
 * Voz sintética do próprio aparelho (Web Speech API): gratuita, offline e sem enviar texto
 * a lugar nenhum. Usada nos micro-áudios de encorajamento até existirem gravações humanas.
 *
 * Atenção para a Fase 4: o WebView do Android (Capacitor) pode não ter speechSynthesis.
 * Lá, trocar por um plugin nativo de text-to-speech mantendo esta mesma interface.
 */

const RATE = 0.95;
/** Ritmo médio de fala em português (palavras por minuto) já ajustado pela velocidade */
const WORDS_PER_MINUTE = 150 * RATE;

export function isVoiceSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function ptVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'pt-BR') ?? voices.find((v) => v.lang.toLowerCase().startsWith('pt'));
}

/** Duração estimada da leitura, em segundos. */
export function estimateSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round((words / WORDS_PER_MINUTE) * 60));
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Lê o texto em voz alta. Devolve false se o aparelho não tem leitor de voz.
 * onEnd(false) = a leitura falhou (ex.: nenhuma voz instalada).
 */
export function speak(text: string, onEnd: (ok: boolean) => void): boolean {
  if (!isVoiceSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  const voice = ptVoice();
  if (voice) u.voice = voice;
  u.rate = RATE;
  u.pitch = 1;
  u.onend = () => onEnd(true);
  // "interrupted"/"canceled" vêm de parar de propósito; qualquer outro erro é falta de voz
  u.onerror = (e) => onEnd(e.error === 'interrupted' || e.error === 'canceled');
  synth.speak(u);
  return true;
}

export function stopSpeaking(): void {
  if (isVoiceSupported()) window.speechSynthesis.cancel();
}
