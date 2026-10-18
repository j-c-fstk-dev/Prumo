/**
 * Protocolo de crise do coach (docs/pesquisa/07): se a mensagem indicar risco à vida,
 * o servidor NÃO chama a IA e responde com acolhimento e contatos de ajuda.
 * Roda no servidor, então não depende de a IA "lembrar" de fazer isso.
 *
 * As expressões são de alto sinal, para evitar falso positivo em conversas de negócio
 * (ex.: "estou sem saída com o preço" não dispara; "não quero mais viver" dispara).
 */

const CRISIS_PATTERNS = [
  'suicid',
  'me matar',
  'tirar minha vida',
  'tirar a minha vida',
  'acabar com a minha vida',
  'acabar com minha vida',
  'nao quero mais viver',
  'nao aguento mais viver',
  'quero morrer',
  'queria morrer',
  'vontade de morrer',
  'penso em morrer',
  'me machucar',
  'me ferir',
  'automutil',
  'auto mutil',
  'me cortar',
  'sumir pra sempre',
  'sumir para sempre',
  'overdose',
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function detectCrisis(text: string): boolean {
  const t = ` ${normalize(text)} `;
  return CRISIS_PATTERNS.some((p) => t.includes(` ${p}`));
}

export function crisisReply(name: string): string {
  const who = name?.trim() || 'Ei';
  return [
    `${who}, obrigado por me contar. Sinto muito que você esteja passando por isso, e você não precisa passar por isso sozinho(a).`,
    'Se você estiver em perigo agora, ligue 192 (SAMU) ou vá ao pronto-socorro mais próximo.',
    'Para conversar com alguém agora, o CVV atende de graça, 24 horas por dia: ligue 188 ou converse pelo chat em cvv.org.br.',
    'Eu sou um coach para as tarefas do seu plano e não substituo ajuda profissional. O seu plano pode esperar. Quando você se sentir pronto(a), eu continuo aqui.',
  ].join('\n\n');
}
