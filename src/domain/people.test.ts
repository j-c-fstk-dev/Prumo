import { describe, expect, it } from 'vitest';
import {
  cleanPerson,
  countByStage,
  dueFollowUps,
  emailLink,
  messageFor,
  phoneLink,
  testStats,
  waNumber,
  whatsappLink,
  type Person,
  type Stage,
} from './people';
import type { KitContext } from './kit';

const ctx: KitContext = { name: 'Jo', audience: 'Pequenos negócios', pain: 'parecer amador nas redes', product: 'Guia prático + modelo pronto', productId: 'guia' };

const person = (stage: Stage, extra: Partial<Person> = {}): Person => ({
  id: Math.random().toString(36),
  name: 'Ana Souza',
  stage,
  stageHistory: [],
  createdAt: 0,
  updatedAt: 0,
  ...extra,
});

describe('pessoas', () => {
  it('monta o número do WhatsApp (Brasil sem DDI ganha 55) e recusa número curto', () => {
    expect(waNumber('(11) 98765-4321')).toBe('5511987654321');
    expect(waNumber('+55 11 98765-4321')).toBe('5511987654321');
    expect(waNumber('+351 912 345 678')).toBe('351912345678');
    expect(waNumber('1234')).toBeNull();
    expect(whatsappLink('11987654321', 'Oi, Ana! Tudo bem?')).toBe('https://wa.me/5511987654321?text=Oi%2C%20Ana!%20Tudo%20bem%3F');
  });

  it('e-mail e ligação só com dados válidos', () => {
    expect(emailLink('ana@exemplo.com', 'Assunto', 'Corpo')).toBe('mailto:ana%40exemplo.com?subject=Assunto&body=Corpo');
    expect(emailLink('ana@', 'a', 'b')).toBeNull();
    expect(phoneLink('(11) 98765-4321')).toBe('tel:11987654321');
    expect(phoneLink('')).toBeNull();
  });

  it('a mensagem pronta muda com a etapa e usa o primeiro nome', () => {
    const convite = messageFor(person('contato'), ctx).text;
    expect(convite.startsWith('Oi, Ana!')).toBe(true);
    expect(convite).not.toContain('[nome]');
    expect(messageFor(person('interessado'), ctx).text).toContain('condição especial de teste');
    expect(messageFor(person('cliente'), ctx).text).toContain('Como estava a situação antes?');
    expect(messageFor(person('agora_nao'), ctx).text).toContain('Sem pressão');
  });

  it('conta o teste "2 de 5": quem conversou e quem disse sim', () => {
    const people = [person('contato'), person('conversou'), person('interessado'), person('cliente'), person('agora_nao')];
    expect(testStats(people)).toEqual({ talked: 4, yes: 2, clients: 1, goalMet: true });
    expect(testStats([person('contato')])).toEqual({ talked: 0, yes: 0, clients: 0, goalMet: false });
    expect(countByStage(people).contato).toBe(1);
  });

  it('próximos passos de hoje e atrasados, sem quem disse "agora não"', () => {
    const people = [
      person('conversou', { name: 'B', nextDate: '2026-10-20' }),
      person('conversou', { name: 'A', nextDate: '2026-10-15' }),
      person('interessado', { name: 'C', nextDate: '2026-10-18' }),
      person('agora_nao', { name: 'D', nextDate: '2026-10-10' }),
    ];
    expect(dueFollowUps(people, '2026-10-18').map((p) => p.name)).toEqual(['A', 'C']);
  });

  it('limpa e corta os campos', () => {
    const p = cleanPerson({ name: '  Ana  ', note: 'x'.repeat(3000) });
    expect(p.name).toBe('Ana');
    expect(p.note).toHaveLength(2000);
  });
});
