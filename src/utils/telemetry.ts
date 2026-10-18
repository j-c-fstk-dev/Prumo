/**
 * Registro de erros e métricas (etapa 38).
 *
 * Erros: vão para /api/log e aparecem nos logs do Worker (Cloudflare → Workers → prumo → Logs).
 * Só a mensagem técnica, o arquivo e a tela: nada do que a pessoa escreveu, nenhum nome ou contato.
 *
 * Métricas: Umami (cloud.umami.is), sem cookies. Só nomes de eventos e números (ex.: dia da jornada),
 * nunca texto da pessoa. O script fica no HTML e só conta no domínio publicado.
 */

const MAX_REPORTS = 5;
const sent = new Set<string>();
let screen = 'inicio';

/** A tela atual, para o erro dizer onde aconteceu */
export function setScreenForLogs(name: string): void {
  screen = name;
}

/** Corta o texto e tira o que parece e-mail ou telefone, por garantia */
function scrub(text: string, max: number): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[numero]')
    .slice(0, max);
}

/** Só o caminho do arquivo e a linha, sem endereço completo */
function shortSource(source?: string, line?: number): string | undefined {
  if (!source) return undefined;
  try {
    const path = new URL(source, location.href).pathname;
    return line ? `${path}:${line}` : path;
  } catch {
    return undefined;
  }
}

export function reportError(error: unknown, extra: { source?: string; line?: number; kind?: string } = {}): void {
  try {
    const message = scrub(error instanceof Error ? `${error.name}: ${error.message}` : String(error), 300);
    if (sent.size >= MAX_REPORTS || sent.has(message)) return;
    sent.add(message);
    const stack = error instanceof Error && error.stack ? scrub(error.stack.split('\n').slice(0, 4).join(' | '), 600) : undefined;
    const body = JSON.stringify({
      kind: extra.kind ?? 'error',
      message,
      stack,
      source: shortSource(extra.source, extra.line),
      screen,
      version: __APP_VERSION__,
      standalone: window.matchMedia?.('(display-mode: standalone)').matches ?? false,
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon?.('/api/log', blob)) {
      void fetch('/api/log', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => undefined);
    }
  } catch {
    // registrar erro nunca pode quebrar o app
  }
}

export function installErrorReporting(): void {
  window.addEventListener('error', (e) => {
    // Erro de carregamento de um arquivo (imagem, script) não vem com .error; ignora
    if (!e.error && !e.message) return;
    reportError(e.error ?? e.message, { source: e.filename, line: e.lineno });
  });
  window.addEventListener('unhandledrejection', (e) => reportError(e.reason, { kind: 'promise' }));
}

type UmamiData = Record<string, string | number | boolean>;
declare global {
  interface Window {
    umami?: { track: (event: string, data?: UmamiData) => void };
  }
  const __APP_VERSION__: string;
}

const pending: [string, UmamiData | undefined][] = [];
let flushing = false;

/** O script do Umami carrega depois do app: eventos do começo esperam até ~10 s por ele */
function flush(tries = 0): void {
  if (window.umami) {
    for (const [e, d] of pending.splice(0)) {
      try {
        window.umami.track(e, d);
      } catch {
        // métricas são opcionais
      }
    }
    flushing = false;
    return;
  }
  if (tries >= 20) {
    pending.length = 0;
    flushing = false;
    return;
  }
  setTimeout(() => flush(tries + 1), 500);
}

/** Evento de uso (Umami). Nunca passe texto escrito pela pessoa aqui. */
export function track(event: string, data?: UmamiData): void {
  pending.push([event, data]);
  if (!flushing) {
    flushing = true;
    flush();
  }
}
