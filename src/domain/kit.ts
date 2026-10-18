/**
 * Kit de execução: modelos prontos, montados com o diagnóstico da pessoa.
 * É o principal benefício do Premium (docs/pesquisa/06); no grátis, 1 modelo por capítulo.
 *
 * Tudo aqui é ponto de partida editável: a pessoa ajusta com a própria voz antes de usar.
 */

import type { ProductId } from './diagnosis';

export type KitId = 'convite' | 'roteiro_conversa' | 'preco' | 'pagina_venda' | 'depoimento';

export interface KitContext {
  name: string;
  audience: string;
  pain: string;
  product: string;
  productId: ProductId;
  /** A frase de promessa que a pessoa escreveu (se houver) */
  promise?: string;
}

export interface KitItem {
  id: KitId;
  title: string;
  description: string;
  /** Tarefas do roteiro em que este modelo aparece */
  tasks: string[];
  kind: 'text' | 'calculator';
  /** Mensagem de WhatsApp: mostra o botão de abrir no WhatsApp */
  isMessage?: boolean;
}

export const KIT_ITEMS: KitItem[] = [
  {
    id: 'convite',
    title: 'Mensagem de convite',
    description: 'Para chamar alguém do seu público para conversar ou testar, sem parecer vendedor.',
    tasks: ['t9', 't3', 't6'],
    kind: 'text',
    isMessage: true,
  },
  {
    id: 'roteiro_conversa',
    title: 'Roteiro de conversa de escuta',
    description: 'Perguntas sobre o que a pessoa já viveu, que dão respostas mais honestas do que "você compraria?".',
    tasks: ['t3'],
    kind: 'text',
  },
  {
    id: 'preco',
    title: 'Calculadora de preço de teste',
    description: 'Um preço que paga o seu tempo e não assusta no primeiro teste.',
    tasks: ['t4', 't16'],
    kind: 'calculator',
  },
  {
    id: 'pagina_venda',
    title: 'Página de venda simples',
    description: 'A estrutura de uma página (ou mensagem longa) que explica a oferta com clareza.',
    tasks: ['t6', 't13', 't7'],
    kind: 'text',
  },
  {
    id: 'depoimento',
    title: 'Pedido de depoimento',
    description: 'Para pedir um retorno honesto de quem testou, em 3 perguntas curtas.',
    tasks: ['t11', 't7', 't18'],
    kind: 'text',
    isMessage: true,
  },
];

export function kitForTask(taskId: string): KitItem[] {
  return KIT_ITEMS.filter((k) => k.tasks.includes(taskId));
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Texto do modelo, já preenchido com o plano da pessoa. */
export function buildKitText(id: Exclude<KitId, 'preco'>, c: KitContext): string {
  const product = lower(c.product);
  const audience = lower(c.audience);
  switch (id) {
    case 'convite':
      return [
        'Oi, [nome]! Tudo bem?',
        `Estou criando algo para ${audience} que passam por isto: ${c.pain}. E lembrei de você.`,
        'Posso te fazer 3 perguntas rápidas sobre como é isso no seu dia a dia? Leva uns 10 minutos e não vou te vender nada.',
        `Se fizer sentido depois, te mostro a primeira versão (${product}) com uma condição especial de teste.`,
        `Obrigado(a)! ${c.name}`,
      ].join('\n\n');
    case 'roteiro_conversa':
      return [
        'Antes: diga que não vai vender nada e que quer aprender com a experiência dela.',
        `1. Me conta a última vez que você passou por isso (${c.pain}). O que aconteceu?`,
        '2. O que você já tentou para resolver? Funcionou?',
        '3. Quanto tempo ou dinheiro isso já te custou?',
        '4. O que seria resolver isso de um jeito que te deixaria aliviado(a)?',
        '5. Quem mais você conhece que passa por isso?',
        'Depois: anote as palavras exatas que a pessoa usou. Elas valem mais do que qualquer texto que você escreveria.',
        'Evite: "você compraria?" ou "você acha uma boa ideia?". As pessoas tendem a dizer sim por gentileza.',
      ].join('\n\n');
    case 'pagina_venda':
      return [
        `# ${c.promise?.trim() || `Uma ajuda prática para ${audience}`}`,
        `## Para quem é\nPara ${audience} que passam por isto: ${c.pain}.`,
        '## O problema\n[Descreva a dor com as palavras que você ouviu nas conversas.]',
        `## O que você recebe\n${c.product}.\n- [Item 1]\n- [Item 2]\n- [Item 3]`,
        '## Como funciona\n[Em 2 ou 3 passos: o que acontece depois de comprar.]',
        '## Preço de teste\n[Valor] (condição especial para as primeiras pessoas, em troca de um retorno sincero).',
        '## Quem está por trás\n' + `Eu sou ${c.name}. [Por que você entende desse problema.]`,
        '## Quero participar\n[Link de pagamento ou "me chame no WhatsApp".]',
      ].join('\n\n');
    case 'depoimento':
      return [
        'Oi, [nome]! Muito obrigado(a) por testar.',
        'Pode me responder 3 perguntas curtinhas? Vale áudio também.',
        '1. Como estava a situação antes?',
        '2. O que mudou depois?',
        '3. Para quem você indicaria?',
        'Posso usar a sua resposta (com seu primeiro nome) para mostrar para outras pessoas? Se preferir anônimo, tudo bem.',
        `Um abraço, ${c.name}`,
      ].join('\n\n');
  }
}

/** Faixas de referência do preço de teste por formato (mesmas da tarefa t4). Não são regra. */
export const PRICE_RANGE: Record<ProductId, [number, number]> = {
  servico: [50, 150],
  sessao: [50, 120],
  guia: [19, 47],
  minicurso: [47, 97],
};

export interface PriceInput {
  productId: ProductId;
  /** Horas para preparar/entregar UMA venda (para guia e curso: horas de criação ÷ vendas esperadas) */
  hoursPerSale: number;
  /** Quanto vale 1 hora do seu trabalho hoje (R$) */
  hourValue: number;
  /** Custos por venda (taxas, materiais) em R$ */
  costPerSale: number;
}

export interface PriceResult {
  /** O que o seu tempo e os custos pedem */
  floor: number;
  range: [number, number];
  /** Sugestão de preço de teste: o começo da faixa, ou o custo arredondado para cima terminando em 7 */
  suggested: number;
  note: string;
}

/** Menor valor terminado em 7 que seja ≥ v (ex.: 75 → 77; 80 → 87). Nunca arredonda para baixo. */
const endIn7 = (v: number) => Math.max(7, Math.ceil((v - 7) / 10) * 10 + 7);

export function suggestTestPrice(i: PriceInput): PriceResult {
  const range = PRICE_RANGE[i.productId];
  const floor = Math.max(0, i.hoursPerSale) * Math.max(0, i.hourValue) + Math.max(0, i.costPerSale);
  let suggested: number;
  let note: string;
  if (floor <= range[0]) {
    suggested = range[0];
    note = 'Seu custo cabe com folga na faixa de teste. Comece pelo começo da faixa para facilitar o primeiro sim.';
  } else if (floor <= range[1]) {
    suggested = Math.min(range[1], endIn7(floor));
    note = 'O preço paga o seu tempo e ainda está dentro da faixa de teste.';
  } else {
    suggested = endIn7(floor);
    note =
      'O seu tempo pede mais do que a faixa de referência. Tudo bem: ou cobre esse valor, ou diminua a entrega para caber num teste menor.';
  }
  return { floor: Math.round(floor), range, suggested, note };
}
