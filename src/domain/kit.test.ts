import { describe, expect, it } from 'vitest';
import { buildKitText, kitForTask, KIT_ITEMS, suggestTestPrice, type KitContext } from './kit';
import { buildPlanTasks } from './tasks';

const ctx: KitContext = {
  name: 'Jo',
  audience: 'Autônomos e freelancers sobrecarregados',
  pain: 'a sensação de estar sempre atrasado',
  product: 'Guia prático + modelo pronto: organização da rotina',
  productId: 'guia',
};

describe('modelos do kit', () => {
  it('a mensagem de convite usa o público, a dor e o produto, e não promete venda', () => {
    const t = buildKitText('convite', ctx);
    expect(t).toContain('autônomos e freelancers');
    expect(t).toContain('sempre atrasado');
    expect(t).toContain('guia prático');
    expect(t).toContain('não vou te vender nada');
  });

  it('o roteiro pergunta sobre o passado, não sobre o futuro hipotético', () => {
    const t = buildKitText('roteiro_conversa', ctx);
    expect(t).toContain('última vez');
    expect(t).toContain('Evite: "você compraria?"');
  });

  it('a página de venda usa a promessa da pessoa quando existe', () => {
    expect(buildKitText('pagina_venda', { ...ctx, promise: 'Eu ajudo freelancers a entregar no prazo' })).toMatch(/^# Eu ajudo freelancers/);
    expect(buildKitText('pagina_venda', ctx)).toMatch(/^# Uma ajuda prática/);
  });

  it('o pedido de depoimento pede permissão para usar', () => {
    expect(buildKitText('depoimento', ctx)).toContain('Posso usar a sua resposta');
  });

  it('todo modelo aponta para tarefas que existem no roteiro', () => {
    const ids = new Set(buildPlanTasks(null).map((t) => t.id));
    for (const k of KIT_ITEMS) for (const t of k.tasks) expect(ids.has(t), `${k.id}→${t}`).toBe(true);
    expect(kitForTask('t4').map((k) => k.id)).toEqual(['preco']);
  });
});

describe('calculadora de preço de teste', () => {
  it('custo baixo: sugere o começo da faixa do formato', () => {
    const r = suggestTestPrice({ productId: 'guia', hoursPerSale: 0.2, hourValue: 30, costPerSale: 2 });
    expect(r.range).toEqual([19, 47]);
    expect(r.suggested).toBe(19);
    expect(r.suggested).toBeGreaterThanOrEqual(r.range[0]);
  });

  it('custo dentro da faixa: o preço paga o tempo', () => {
    const r = suggestTestPrice({ productId: 'sessao', hoursPerSale: 1.5, hourValue: 50, costPerSale: 0 });
    expect(r.floor).toBe(75);
    expect(r.suggested).toBe(77);
    expect(r.note).toContain('paga o seu tempo');
  });

  it('custo acima da faixa: avisa com honestidade em vez de esconder', () => {
    const r = suggestTestPrice({ productId: 'servico', hoursPerSale: 5, hourValue: 60, costPerSale: 10 });
    expect(r.floor).toBe(310);
    expect(r.suggested).toBeGreaterThanOrEqual(r.floor);
    expect(r.note).toContain('diminua a entrega');
  });

  it('a sugestão nunca fica abaixo do custo nem fora da faixa quando o custo cabe nela', () => {
    for (let h = 0; h <= 3; h += 0.25) {
      const r = suggestTestPrice({ productId: 'sessao', hoursPerSale: h, hourValue: 40, costPerSale: 0 });
      expect(r.suggested).toBeGreaterThanOrEqual(Math.min(r.floor, r.range[1]));
      if (r.floor <= r.range[1]) expect(r.suggested).toBeGreaterThanOrEqual(r.range[0]);
      if (r.floor <= r.range[1]) expect(r.suggested).toBeLessThanOrEqual(r.range[1]);
    }
  });

  it('valores negativos não quebram', () => {
    expect(suggestTestPrice({ productId: 'guia', hoursPerSale: -1, hourValue: -5, costPerSale: -3 }).floor).toBe(0);
  });
});
