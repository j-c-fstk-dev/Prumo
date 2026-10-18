import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { commitAndSeal, onboard } from './helpers';

// Caderno do projeto (docs/etapas/27-caderno.md)
test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('caderno: ficha preenchida, anotações, nota da tarefa, resposta do coach salva e tudo persiste', async ({ page }) => {
  await onboard(page);
  await commitAndSeal(page);

  // Nota da tarefa
  await page.getByRole('button', { name: 'Abrir tarefa' }).click();
  await page.getByPlaceholder(/O que você fez, o que as pessoas disseram/).fill('Ana disse que pagaria.');
  await page.locator('button:has(svg.lucide-arrow-left)').first().click();

  // Coach: salvar e copiar uma resposta
  await page.getByRole('button', { name: 'Coach' }).click();
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await page.getByPlaceholder('Escreva sua dúvida...').fill('Qual preço devo colocar?');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await page.getByRole('button', { name: 'Salvar no caderno' }).click();
  await expect(page.getByRole('button', { name: 'No caderno' })).toBeVisible();
  await page.getByRole('button', { name: 'Copiar' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('preço');

  // Caderno
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ficha do meu produto' })).toBeVisible();
  await expect(page.getByText('Preço de teste')).toBeVisible();
  await page.getByRole('button', { name: 'Editar', exact: true }).first().click();
  await page.getByLabel('Minha frase').fill('Eu ajudo pessoas em transição a se apresentar');
  await page.getByRole('button', { name: 'Pronto' }).click();

  await page.getByLabel('Nova anotação').fill('Testar oferta no grupo do bairro');
  await page.getByRole('radio', { name: /Ideias/ }).click();
  await page.getByRole('button', { name: 'Salvar anotação' }).click();

  await expect(page.getByText('Testar oferta no grupo do bairro')).toBeVisible();
  await expect(page.getByText(/🧭 Do coach ·/)).toBeVisible();
  await expect(page.getByText('Ana disse que pagaria.')).toBeVisible();

  // Busca em todo o caderno (ícone de lupa): anotações, ficha e notas das tarefas
  await page.getByRole('button', { name: 'Buscar no caderno' }).click();
  const busca = page.getByLabel('Buscar em todo o caderno');
  await busca.fill('bairro');
  await expect(page.getByText('1 resultado')).toBeVisible();
  await expect(page.locator('mark', { hasText: 'bairro' })).toBeVisible();
  await busca.fill('transicao');
  await expect(page.getByText(/Ficha · Minha frase/)).toBeVisible();
  await busca.fill('ana pagaria');
  await expect(page.getByText(/✍️ Tarefa/)).toBeVisible();
  await busca.fill('xyzabc');
  await expect(page.getByText('Nada encontrado no caderno.')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar busca' }).click();
  await expect(page.getByRole('heading', { name: 'Ficha do meu produto' })).toBeVisible();

  // Persiste depois de recarregar
  await page.reload();
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await expect(page.getByText('Testar oferta no grupo do bairro')).toBeVisible();
  await expect(page.getByText('Eu ajudo pessoas em transição a se apresentar')).toBeVisible();
});

test('pessoas: adicionar, mensagem pronta com WhatsApp, etapas, teste "2 de 5", próximo passo e busca', async ({ page }) => {
  await onboard(page);
  await commitAndSeal(page);
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByRole('tab', { name: /Pessoas/ }).click();
  await expect(page.getByText('0 de 0 pessoas disseram sim')).toBeVisible();

  // Adicionar
  await page.getByRole('button', { name: 'Adicionar pessoa' }).click();
  await page.getByLabel('Nome', { exact: true }).fill('Ana Souza');
  await page.getByLabel('WhatsApp').fill('(11) 98765-4321');
  await page.getByRole('radio', { name: 'Indicação' }).click();
  await page.getByLabel('Nota').fill('Quer começar em novembro');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await expect(page.getByText('Ana Souza')).toBeVisible();

  // Mensagem pronta com o primeiro nome e link do WhatsApp
  await page.getByRole('button', { name: 'Mensagem pronta' }).click();
  await expect(page.getByLabel('Mensagem para Ana Souza')).toHaveValue(/^Oi, Ana!/);
  const wa = page.getByRole('link', { name: 'WhatsApp' });
  await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/5511987654321\?text=Oi%2C%20Ana!/);

  // Mudar de etapa conta no teste
  await page.getByLabel('Etapa de Ana Souza').selectOption('interessado');
  await expect(page.getByText('1 de 1 pessoa disse sim')).toBeVisible();

  // Próximo passo atrasado aparece em "Pra hoje"
  await page.getByLabel('Próximo passo com Ana Souza', { exact: true }).fill('Mandar proposta');
  await page.getByLabel('Data do próximo passo com Ana Souza').fill('2026-01-01');
  await expect(page.getByText('Pra hoje')).toBeVisible();

  // Busca do caderno acha a pessoa pela nota
  await page.getByRole('button', { name: 'Buscar no caderno' }).click();
  await page.getByLabel('Buscar em todo o caderno').fill('novembro');
  await expect(page.getByText(/👥 Pessoa · ✨ Interessado/)).toBeVisible();
  await page.getByRole('button', { name: 'Fechar busca' }).click();

  // Persiste
  await page.reload();
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByRole('tab', { name: /Pessoas \(1\)/ }).click();
  await expect(page.getByLabel('Etapa de Ana Souza')).toHaveValue('interessado');
});

test('pessoas: o coach sugere a mensagem sem receber o nome nem o telefone', async ({ page }) => {
  const sent: string[] = [];
  await page.route('**/api/coach/message', async (route) => {
    sent.push(route.request().postData() ?? '');
    await route.fulfill({ json: { mode: 'live', text: 'Oi, [nome]! Lembrei de você por causa da nossa conversa.' } });
  });
  await onboard(page);
  await commitAndSeal(page);
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByRole('tab', { name: /Pessoas/ }).click();
  await page.getByRole('button', { name: 'Adicionar pessoa' }).click();
  await page.getByLabel('Nome', { exact: true }).fill('Ana Souza');
  await page.getByLabel('WhatsApp').fill('11987654321');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();

  await page.getByRole('button', { name: /Pedir ajuda ao coach/ }).click();
  await expect(page.getByText(/Não vão/)).toBeVisible();
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await page.getByLabel('Contexto para o coach').fill('ela está sem tempo este mês');
  await page.getByRole('button', { name: 'Pedir sugestão' }).click();
  await expect(page.getByLabel('Sugestão do coach')).toHaveValue('Oi, Ana! Lembrei de você por causa da nossa conversa.');
  await page.getByRole('button', { name: 'Usar esta' }).click();
  await expect(page.getByLabel('Mensagem para Ana Souza')).toHaveValue(/^Oi, Ana!/);
  await expect(page.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', /Lembrei%20de%20voc%C3%AA/);

  expect(sent).toHaveLength(1);
  expect(sent[0]).toContain('ela está sem tempo este mês');
  expect(sent[0]).not.toContain('Ana');
  expect(sent[0]).not.toContain('98765');
});

test('fotos: anexar na anotação, ver, persistir, exportar em .zip e apagar junto com a anotação', async ({ page }) => {
  const imgKeys = () =>
    page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const req = indexedDB.open('prumo', 1);
          req.onsuccess = () => {
            const keys = req.result.transaction('kv').objectStore('kv').getAllKeys();
            keys.onsuccess = () => resolve((keys.result as string[]).filter((k) => String(k).startsWith('img:')).length);
          };
        }),
    );

  await onboard(page);
  await commitAndSeal(page);
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByLabel('Nova anotação').fill('Foto da embalagem. Vídeo: https://youtu.be/abc123');
  await page.getByLabel('Escolher fotos').setInputFiles('public/icons/icon-512.png');
  await expect(page.getByRole('button', { name: 'Ver foto' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Salvar anotação' }).click();

  // Anotação com miniatura e link clicável
  await expect(page.getByRole('link', { name: 'https://youtu.be/abc123' })).toHaveAttribute('href', 'https://youtu.be/abc123');
  await expect(page.getByRole('button', { name: 'Ver foto' })).toHaveCount(1);
  expect(await imgKeys()).toBe(1);
  await page.getByRole('button', { name: 'Ver foto' }).click();
  await expect(page.getByRole('img', { name: 'Foto anexada' })).toBeVisible();
  await page.getByRole('button', { name: 'Fechar foto' }).click();

  // Persiste
  await page.reload();
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ver foto' })).toHaveCount(1);

  // Exportar vira .zip com o texto e a foto
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar' }).first().click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('caderno-prumo.zip');
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(readFileSync(await file.path()));
  expect(Object.keys(zip.files)).toEqual(expect.arrayContaining(['caderno-prumo.txt', 'fotos/foto-01.jpg']));
  expect(await zip.file('caderno-prumo.txt')!.async('string')).toContain('📷 fotos/foto-01.jpg');

  // Apagar a anotação apaga a foto do aparelho
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Apagar' }).first().click();
  await expect(page.getByRole('button', { name: 'Ver foto' })).toHaveCount(0);
  await expect.poll(imgKeys).toBe(0);
});
