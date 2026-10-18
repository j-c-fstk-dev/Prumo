import { describe, expect, it } from 'vitest';
import { draftToFuture, hasWrittenReply, starterFromFuture } from './letter';

const ctx = {
  name: 'Jo',
  product: 'Guia prático + modelo pronto: organização da rotina',
  anchor: 'Recebi meus primeiros pagamentos com a consciência tranquila',
  obstacleLabel: 'Querer deixar tudo perfeito antes de mostrar',
  planB: 'mostro a versão de hoje mesmo assim.',
};

describe('draftToFuture', () => {
  it('usa o produto, o obstáculo, o plano B e a âncora da pessoa', () => {
    const d = draftToFuture(ctx);
    expect(d).toContain('guia prático + modelo pronto');
    expect(d).toContain('querer deixar tudo perfeito');
    expect(d).toContain('mostro a versão de hoje');
    expect(d).toContain('recebi meus primeiros pagamentos');
  });

  it('funciona sem obstáculo informado', () => {
    expect(draftToFuture({ ...ctx, obstacleLabel: undefined })).toContain('nos dias difíceis');
  });
});

describe('hasWrittenReply', () => {
  it('não libera só com a frase inicial', () => {
    expect(hasWrittenReply(starterFromFuture('Jo'), 'Jo')).toBe(false);
    expect(hasWrittenReply(starterFromFuture('Jo') + 'Valeu.', 'Jo')).toBe(false);
  });

  it('libera quando a pessoa escreve a própria resposta', () => {
    const reply = starterFromFuture('Jo') + 'Valeu a pena sim. Vendi para 3 pessoas e aprendi a mostrar antes de ficar perfeito.';
    expect(hasWrittenReply(reply, 'Jo')).toBe(true);
  });
});
