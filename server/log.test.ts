import { describe, expect, it } from 'vitest';
import { clientErrorLog } from './log';

describe('registro de erro do app', () => {
  it('guarda só os campos conhecidos, cortados no tamanho máximo', () => {
    const out = clientErrorLog({ message: 'x'.repeat(1000), screen: 'aba:caderno', standalone: true, nome: 'Ana', phone: '119' });
    expect(out.type).toBe('client_error');
    expect((out.message as string).length).toBe(300);
    expect(out.screen).toBe('aba:caderno');
    expect(out.standalone).toBe(true);
    expect(out).not.toHaveProperty('nome');
    expect(out).not.toHaveProperty('phone');
  });

  it('aceita lixo sem quebrar', () => {
    expect(clientErrorLog(null)).toEqual({ type: 'client_error' });
    expect(clientErrorLog({ message: 42 })).toEqual({ type: 'client_error' });
  });
});
