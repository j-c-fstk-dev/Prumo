import { describe, expect, it } from 'vitest';
import {
  cleanPerson,
  countByStage,
  dueFollowUps,
  emailLink,
  messageFor,
  phoneLink,
  funnel,
  normalizePerson,
  testVerdict,
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
    expect(messageFor(person('conversou'), ctx).text).toContain('preço de fundador');
    expect(messageFor(person('proposta'), ctx).text).toContain('devolvo em até 7 dias');
    expect(messageFor(person('cliente'), ctx).text).toContain('Como estava a situação antes?');
    expect(messageFor(person('agora_nao'), ctx).text).toContain('Sem pressão');
  });

  it('funil único: conta até onde cada pessoa chegou, mesmo pulando etapas ou dizendo "agora não" depois', () => {
    const people = [
      person('contato'),
      person('conversou'),
      person('proposta'),
      person('compromisso', { commitments: ['tempo'] }),
      person('cliente'),
      person('agora_nao', { stageHistory: [{ stage: 'proposta', at: 1 }, { stage: 'agora_nao', at: 2 }] }),
    ];
    expect(funnel(people)).toEqual({ names: 6, talked: 5, presented: 4, committed: 2, money: 1, clients: 1 });
    expect(countByStage(people).contato).toBe(1);
    // Indicou alguém sem mudar a etapa: conta como compromisso
    expect(funnel([person('conversou', { commitments: ['indicacao'] })]).committed).toBe(1);
  });

  it('decisão da semana 6: compromissos, não sins', () => {
    const f = (presented: number, committed: number, money: number) => ({ names: 20, talked: 8, presented, committed, money, clients: 0 });
    expect(testVerdict(f(3, 2, 1))).toBe('seguir');
    expect(testVerdict(f(3, 1, 0))).toBeNull();
    expect(testVerdict(f(5, 2, 0))).toBe('ajustar');
    expect(testVerdict(f(5, 0, 0))).toBe('trocar');
  });

  it('dados antigos: "Interessado" vira "Viu a proposta", também no histórico', () => {
    const old = person('interessado' as Stage, { stageHistory: [{ stage: 'interessado' as Stage, at: 1 }] });
    const p = normalizePerson(old);
    expect(p.stage).toBe('proposta');
    expect(p.stageHistory[0].stage).toBe('proposta');
  });

  it('próximos passos de hoje e atrasados, sem quem disse "agora não"', () => {
    const people = [
      person('conversou', { name: 'B', nextDate: '2026-10-20' }),
      person('conversou', { name: 'A', nextDate: '2026-10-15' }),
      person('proposta', { name: 'C', nextDate: '2026-10-18' }),
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
