import { expect, type Page } from '@playwright/test';

/** Espera a splash da bússola sair */
export async function openApp(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Começar diagnóstico' }).or(page.getByText(/^Olá, /))).toBeVisible({ timeout: 10_000 });
}

/**
 * Faz o onboarding completo: cadastro, anamnese (1ª opção de cada pergunta), compromisso e cartas.
 * Com a 1ª opção de tudo, o motor recomenda: nicho de carreira, formato guia, aviso de prazo curto.
 */
export async function onboard(page: Page, name = 'Jo', opts: { confirmText?: string } = {}) {
  await openApp(page);
  await page.getByRole('button', { name: 'Começar diagnóstico' }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
  await page.getByPlaceholder('Seu nome').fill(name);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Pular' }).click();

  let answered = 0;
  for (let i = 0; i < 40; i++) {
    if (await page.getByText('Montando seu prumo').isVisible()) break;
    const valueSignal = page.getByRole('button', { name: 'Entendido, vamos lá' });
    if (await valueSignal.isVisible()) {
      await valueSignal.click();
      continue;
    }
    const cont = page.getByRole('button', { name: 'Continuar' });
    await expect(cont).toBeVisible();
    await page.locator('div.max-h-\\[300px\\] > div').first().click();
    if (answered === 0 && opts.confirmText) {
      await page.getByRole('button', { name: /Detalhar com suas próprias palavras/ }).click();
      await page.locator('textarea').fill(opts.confirmText);
      await page.getByRole('button', { name: 'Sim' }).click();
    }
    await cont.click();
    answered++;
  }
  expect(answered).toBe(13);

  await expect(page.getByText('este é o seu prumo digital')).toBeVisible({ timeout: 10_000 });
}

/** Do resultado até a home: ritual de segurar, carta 1, resposta própria e selo */
export async function commitAndSeal(page: Page) {
  await page.getByRole('button', { name: /Assumir meu Prumo/ }).click();
  const hold = page.getByRole('button', { name: /Segure aqui/ });
  const box = (await hold.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(2900);
  await page.mouse.up();
  await expect(page.getByText('Escreva para você daqui a 90 dias')).toBeVisible();
  await page.getByRole('button', { name: /resposta do seu eu futuro/ }).click();
  const reply = page.getByLabel('Resposta do seu eu de daqui a 90 dias');
  await reply.fill((await reply.inputValue()) + 'Deu certo. Mostrei para 5 pessoas e 2 compraram. Nos dias cansados fiz só 5 minutos.');
  await page.getByRole('button', { name: 'Selar as cartas' }).click();
  await page.getByRole('button', { name: /Entrar na Jornada/ }).click();
  await expect(page.getByText(/^Olá, /)).toBeVisible();
}

/** Grava um estado pronto no IndexedDB (para cenários de datas) e recarrega */
export async function seedState(page: Page, patch: Record<string, unknown>) {
  // Espera o app terminar de carregar, para nada sobrescrever o estado semeado
  await expect(page.getByRole('button', { name: 'Começar diagnóstico' }).or(page.getByText(/^Olá, /))).toBeVisible({ timeout: 10_000 });
  await page.evaluate(async (patch) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const req = indexedDB.open('prumo', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('kv');
      req.onsuccess = () => resolve(req.result);
    });
    const state = {
      version: 1, userName: 'Jo', macroGoal: 'renda_extra', answers: {}, reflections: {},
      textOptions: { confirmed: {}, dismissed: {} }, taskStatus: {}, planEdits: {}, personalTasks: [],
      coachMessages: [], diagnosis: null, letter: null, actionsByDay: {}, repairedDays: [], checkIns: [],
      completedAt: {}, celebratedChapters: [], isPremium: false, onboardingDone: true, ...patch,
    };
    await new Promise<void>((resolve) => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(state, 'prumo_state');
      tx.oncomplete = () => resolve();
    });
  }, patch);
  await page.reload();
  await expect(page.getByText(/^Olá, /)).toBeVisible({ timeout: 10_000 });
}

/** Data local AAAA-MM-DD a "delta" dias de hoje */
export function dayKey(delta = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
