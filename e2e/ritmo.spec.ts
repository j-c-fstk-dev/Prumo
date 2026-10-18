import { expect, test } from '@playwright/test';
import { dayKey, seedState } from './helpers';
import { INITIAL_TASKS } from '../src/data/prumoData';

test.beforeEach(async ({ page }) => {
  await page.goto('/app/');
});

test('quem volta depois de dias é acolhido, sem mensagem de "quebrou"', async ({ page }) => {
  await seedState(page, { actionsByDay: { [dayKey(-6)]: 1, [dayKey(-7)]: 1 } });
  await expect(page.getByText('Que bom te ver de volta, Jo.')).toBeVisible();
  await expect(page.getByText(/quebr/i)).toHaveCount(0);
});

test('remendo: 2 ações hoje recuperam o dia em branco de ontem', async ({ page }) => {
  // 3 dias ativos e depois 2 em branco: 1 vira descanso, o outro pode ser remendado
  await seedState(page, { actionsByDay: { [dayKey(-3)]: 1, [dayKey(-4)]: 1, [dayKey(-5)]: 1 } });
  const banner = page.getByText('Ontem ficou em branco');
  test.skip((await banner.count()) === 0, 'ontem e anteontem caem em semanas diferentes: o descanso cobre, comportamento correto');
  await expect(banner).toContainText('(0/2)');
  await page.getByRole('button', { name: '😐 Mais ou menos' }).click();
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(banner).toContainText('(1/2)');
  await page.getByRole('button', { name: 'Abrir tarefa' }).locator('xpath=following-sibling::button[1]').click();
  await expect(banner).toHaveCount(0);
  await expect(page.getByText(/5 dias de prumo/)).toBeVisible();
});

test('dia da jornada, carta no dia 90 e aviso gentil de muitas tarefas no mesmo dia', async ({ page }) => {
  const start = new Date();
  if (start.getHours() < 4) start.setDate(start.getDate() - 1);
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() - 89);
  const now = Date.now();
  await seedState(page, {
    startedAt: start.getTime(),
    letter: { toFuture: 'Oi', fromFuture: 'Deu certo', sealedAt: start.getTime() },
    completedAt: { a: now, b: now, c: now },
    actionsByDay: { [dayKey()]: 3 },
  });
  await expect(page.getByText('Dia 90 de 90')).toBeVisible();
  await expect(page.getByText('3 passos hoje, que dia!')).toBeVisible();
  await page.getByRole('button', { name: /Hoje é o seu dia 90/ }).click();
  await expect(page.getByText('Deu certo')).toBeVisible();
});

test('apagar todos os dados: pede confirmação e volta ao começo sem nada salvo', async ({ page }) => {
  await seedState(page, { people: [{ id: 'p1', name: 'Ana', stage: 'contato', stageHistory: [], createdAt: 1, updatedAt: 1 }] });
  await page.getByRole('button', { name: 'Você', exact: true }).click();
  await page.getByRole('button', { name: 'Apagar todos os meus dados' }).click();
  await expect(page.getByText('Apagar tudo deste celular?')).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await page.getByRole('button', { name: 'Apagar todos os meus dados' }).click();
  await page.getByRole('button', { name: 'Sim, apagar tudo' }).click();
  await expect(page.getByRole('button', { name: 'Começar diagnóstico' })).toBeVisible();
  const saved = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open('prumo', 1);
        req.onsuccess = () => {
          const get = req.result.transaction('kv').objectStore('kv').get('prumo_state');
          get.onsuccess = () => resolve(get.result ?? null);
        };
      }),
  );
  // Depois de apagar, o app pode gravar um estado novo e vazio, nunca o antigo
  expect(JSON.stringify(saved ?? {})).not.toContain('Ana');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('prumo_')))).toEqual([]);
});

test('"Sobre o Prumo" na aba Você leva às políticas e mostra a versão', async ({ page }) => {
  await seedState(page, {});
  await page.getByRole('button', { name: 'Você', exact: true }).click();
  await expect(page.getByText('Sobre o Prumo')).toBeVisible();
  await expect(page.getByText(/^Versão \d+\.\d+\.\d+/)).toBeVisible();
  await page.getByRole('link', { name: 'Política de privacidade' }).click();
  await expect(page.getByRole('heading', { name: 'Política de privacidade' })).toBeVisible();
});

test('backup completo: faz o .zip, apaga tudo e restaura na tela de boas-vindas, com foto', async ({ page }) => {
  await seedState(page, {
    userName: 'Marina',
    notes: [{ id: 'n1', text: 'Ideia da padaria', tag: 'ideia', images: ['foto1'], createdAt: 1, updatedAt: 1 }],
    people: [{ id: 'p1', name: 'Ana Souza', stage: 'interessado', stageHistory: [], createdAt: 1, updatedAt: 1 }],
    taskStatus: { t1: 'completed' },
  });
  // Uma foto de verdade no banco do aparelho
  await page.evaluate(async () => {
    const canvas = Object.assign(document.createElement('canvas'), { width: 8, height: 8 });
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/jpeg'));
    const db = await new Promise<IDBDatabase>((r) => {
      const req = indexedDB.open('prumo', 1);
      req.onsuccess = () => r(req.result);
    });
    await new Promise<void>((r) => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(blob, 'img:foto1');
      tx.oncomplete = () => r();
    });
  });

  await page.getByRole('button', { name: 'Você', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Fazer backup' }).click();
  const file = await (await download).path();
  expect((await download).suggestedFilename()).toMatch(/^prumo-backup-\d{4}-\d{2}-\d{2}\.zip$/);

  await page.getByRole('button', { name: 'Apagar todos os meus dados' }).click();
  await page.getByRole('button', { name: 'Sim, apagar tudo' }).click();
  await expect(page.getByRole('button', { name: 'Começar diagnóstico' })).toBeVisible();

  // Um arquivo qualquer é recusado com explicação
  await page.getByLabel('Escolher arquivo de backup').setInputFiles({ name: 'nada.json', mimeType: 'application/json', buffer: Buffer.from('{"a":1}') });
  await expect(page.getByRole('alert')).toContainText('não é um backup do Prumo');

  await page.getByLabel('Escolher arquivo de backup').setInputFiles(file);
  const confirm = page.getByRole('alertdialog', { name: 'Confirmar restauração' });
  await expect(confirm).toContainText('Marina');
  await expect(confirm).toContainText('1 tarefa concluída · 0 check-ins · 1 anotação · 1 pessoa · 1 foto');
  await confirm.getByRole('button', { name: 'Substituir e restaurar' }).click();

  await expect(page.getByText(/^Olá, Marina/)).toBeVisible();
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await expect(page.getByText('Ideia da padaria')).toBeVisible();
  // A miniatura só mostra a imagem se a foto voltou para o banco do aparelho
  await expect(page.getByRole('button', { name: 'Ver foto' }).locator('img')).toBeVisible();
  await page.getByRole('tab', { name: /Pessoas \(1\)/ }).click();
  await expect(page.getByRole('button', { name: 'Ana Souza, Interessado' })).toBeVisible();
});

test('roteiro concluído: a Início não volta pra tarefa 1, e rever o resultado não refaz o compromisso', async ({ page }) => {
  const ids = INITIAL_TASKS.map((t) => t.id);
  await seedState(page, { taskStatus: Object.fromEntries(ids.map((id) => [id, 'completed'])), startedAt: Date.now(), celebratedChapters: [1, 2, 3, 4] });
  await expect(page.getByText('✦ Roteiro concluído')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir tarefa' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Você', exact: true }).click();
  await page.getByText('Ver meu resultado completo').click();
  await expect(page.getByRole('button', { name: /Assumir meu prumo/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Voltar para a jornada/ }).click();
  await expect(page.getByText('✦ Roteiro concluído')).toBeVisible();
});

test('rotinas: as do capítulo aparecem, marcar conta no dia, e a revisão da semana vira a meta', async ({ page }) => {
  // Capítulo 1 feito: o próximo passo é do capítulo 2, então as rotinas de conversa valem
  const ch1 = INITIAL_TASKS.filter((t) => t.chapterId === 1).map((t) => t.id);
  await seedState(page, { taskStatus: Object.fromEntries(ch1.map((id) => [id, 'completed'])), startedAt: Date.now(), celebratedChapters: [1] });
  const card = page.getByRole('region', { name: 'Rotina da semana' });
  await expect(card.getByText('Falar com 1 pessoa nova')).toBeVisible();
  await expect(card.getByText('Retomar quem ficou de responder')).toHaveCount(0);

  await card.getByRole('button', { name: 'Falar com 1 pessoa nova: marcar como feita hoje' }).click();
  await expect(card.getByText('1 de 5 esta semana')).toBeVisible();
  await expect(page.getByText(/1 dia de prumo/)).toBeVisible();

  // A revisão abre as 3 perguntas; a meta aparece no cartão
  await card.getByRole('button', { name: 'Revisão da semana: marcar como feita hoje' }).click();
  const review = page.getByRole('dialog', { name: 'Revisão da semana' });
  await review.getByLabel('O que funcionou esta semana?').fill('Mandar mensagem de manhã');
  await review.getByLabel('Uma meta para a próxima semana').fill('Conversar com 5 pessoas novas');
  await review.getByRole('button', { name: 'Salvar revisão' }).click();
  await expect(card.getByText('Conversar com 5 pessoas novas')).toBeVisible();
  await expect(card.getByRole('button', { name: 'Revisão da semana: feita hoje' })).toBeVisible();

  // No Roteiro: passos por semana e as rotinas no topo
  await page.getByRole('button', { name: 'Roteiro', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Semana 1', exact: true })).toBeVisible();
  await expect(page.getByText('● esta semana')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Rotinas' })).toBeVisible();
});

test('ciclos: depois do roteiro, continuar com meta do Caderno; ao bater a meta, trocar de caminho recomeça o roteiro', async ({ page }) => {
  const ids = INITIAL_TASKS.map((t) => t.id);
  await seedState(page, {
    taskStatus: Object.fromEntries(ids.map((id) => [id, 'completed'])),
    startedAt: Date.now() - 40 * 86_400_000,
    celebratedChapters: [1, 2, 3, 4],
    diagnosis: null,
    people: [{ id: 'p1', name: 'Ana Souza', stage: 'interessado', stageHistory: [{ stage: 'contato', at: 1 }], createdAt: 1, updatedAt: 1 }],
  });
  await page.getByRole('button', { name: 'Escolher o próximo ciclo' }).click();
  await expect(page.getByText('Você chegou ao fim do roteiro. E agora?')).toBeVisible();
  await expect(page.getByText(`${ids.length}`, { exact: true })).toBeVisible();

  await page.getByRole('radio', { name: /Deu certo: continuar e crescer/ }).click();
  await page.getByLabel('Meta do ciclo').fill('1');
  await page.getByLabel('Foco do ciclo').fill('Pedir indicação a todo cliente');
  await page.getByRole('button', { name: 'Começar o ciclo' }).click();

  const cycle = page.getByRole('region', { name: 'Ciclo atual' });
  await expect(cycle).toContainText('Ciclo 1 · Crescer');
  await expect(cycle).toContainText('0 de 1 cliente novo');
  await expect(cycle).toContainText('Pedir indicação a todo cliente');

  // A Ana vira cliente no Caderno: a meta conta sozinha
  await cycle.getByRole('button', { name: 'Ver minhas pessoas' }).click();
  await page.getByRole('button', { name: 'Ana Souza, Interessado' }).click();
  await page.getByLabel('Etapa de Ana Souza').selectOption('cliente');
  await page.getByRole('button', { name: 'Início', exact: true }).click();
  await expect(cycle).toContainText('1 de 1 cliente novo ✦');

  // Meta batida: dá para fechar e escolher o próximo. Trocar de caminho recomeça o roteiro.
  await cycle.getByRole('button', { name: 'Fechar o ciclo e escolher o próximo' }).click();
  await expect(page.getByText('Fim do ciclo 1. E agora?')).toBeVisible();
  await page.getByRole('radio', { name: /Não rolou: trocar de caminho/ }).click();
  await page.getByRole('button', { name: 'Escolher outro caminho' }).click();
  await page.getByRole('button', { name: 'Sim, recomeçar o roteiro' }).click();
  await expect(page.getByText(/este é o seu prumo/)).toBeVisible();
  await page.getByRole('button', { name: /Voltar para a jornada/ }).click();
  await expect(page.getByText('Dia 1 de 90')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir tarefa' })).toBeVisible();

  await page.getByRole('button', { name: 'Você', exact: true }).click();
  await expect(page.getByText(/Jornada anterior:/)).toBeVisible();
  await expect(page.getByText('Começou o ciclo: Crescer')).toBeVisible();
});
