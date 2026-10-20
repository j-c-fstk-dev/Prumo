/**
 * Proteção dos dados no aparelho (etapa 30).
 * - Safari (iPhone): apaga o que o site guardou depois de 7 dias de uso do navegador sem abrir o site,
 *   a não ser que ele esteja na Tela de Início (https://webkit.org/tracking-prevention/).
 * - Chrome: decide sozinho se concede o armazenamento persistente; app instalado pesa a favor.
 * Por isso o caminho principal é instalar o app; o pedido de persistência é um reforço.
 */

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

let deferredPrompt: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  // O Chrome avisa que o app pode ser instalado; guardamos o aviso para um botão "Instalar"
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as InstallPromptEvent;
    listeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((l) => l());
  });
}

export function onInstallChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function canPromptInstall(): boolean {
  return deferredPrompt !== null;
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  listeners.forEach((l) => l());
  return outcome === 'accepted';
}

/** O .apk mais recente, publicado pelo workflow "App Android" (etapa 50) */
export const APK_URL = 'https://github.com/j-c-fstk-dev/Prumo/releases/latest/download/Prumo.apk';

const APK_KEY = 'prumo_apk';

/**
 * Aberto pelo app Android (.apk, etapa 50). O app abre /app/?origem=apk e o Android manda o
 * referrer android-app://; guardamos para as próximas páginas, que não trazem mais nenhum dos dois.
 */
export function isApk(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(APK_KEY) === '1') return true;
    const fromApk =
      new URLSearchParams(window.location.search).get('origem') === 'apk' || document.referrer.startsWith('android-app://br.com.jardimdofazer.prumo');
    if (fromApk) localStorage.setItem(APK_KEY, '1');
    return fromApk;
  } catch {
    return false;
  }
}

/** Aberto como app instalado (Tela de Início ou o .apk), não dentro do navegador */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    isApk() ||
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export type Platform = 'ios' | 'android' | 'outro';

export function platform(ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''): Platform {
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && typeof document !== 'undefined' && 'ontouchend' in document)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'outro';
}

/** Pede ao navegador para não apagar os dados quando faltar espaço. Devolve se ficou protegido. */
export async function requestPersistence(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function isPersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted?.()) ?? false;
  } catch {
    return false;
  }
}
