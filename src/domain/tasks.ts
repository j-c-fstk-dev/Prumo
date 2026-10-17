/**
 * Monta o roteiro de tarefas a partir do diagnóstico: as tarefas que dependem do formato do
 * produto (serviço, sessão, guia, curso) e do canal mudam; as demais seguem o roteiro base.
 */

import { INITIAL_TASKS, TaskItem } from '../data/prumoData';
import type { ProductId } from './diagnosis';

type TaskOverride = Partial<Pick<TaskItem, 'title' | 'description' | 'whatToDo' | 'howToKnowItIsGood' | 'durationMinutes'>>;

/** t2: a "versão mínima entregável" muda conforme o formato */
const MINIMUM_VERSION: Record<ProductId, TaskOverride> = {
  servico: {
    title: 'Desenhar seu serviço mínimo',
    description: 'Defina o menor serviço que resolve o problema de alguém, do começo ao fim.',
    whatToDo:
      'Escreva em 5 linhas: o que você entrega, em quanto tempo, o que precisa receber da pessoa e o que fica pronto no final.',
    howToKnowItIsGood: [
      'Dá para entregar em até 1 semana',
      'Cabe nas horas que você tem por semana',
      'Você consegue explicar o serviço num áudio de 1 minuto',
    ],
  },
  sessao: {
    title: 'Montar o roteiro da sua sessão de 1 hora',
    description: 'Uma conversa com começo, meio e fim que deixa a pessoa com um plano nas mãos.',
    whatToDo:
      'Divida a hora em 3 partes: entender a situação (15 min), destravar o problema principal (30 min) e montar o plano de ação por escrito (15 min).',
    howToKnowItIsGood: [
      'A pessoa sai da sessão com um próximo passo claro',
      'Você consegue conduzir sem preparar nada novo a cada vez',
    ],
  },
  guia: {
    title: 'Montar o esboço do seu guia + modelo',
    description: 'O menor material que alguém consegue usar sozinho para resolver 1 problema.',
    whatToDo:
      'Escreva o sumário em até 7 tópicos e monte 1 página de exemplo (checklist, planilha ou modelo no Notion ou no Canva).',
    howToKnowItIsGood: [
      'Dá para ser usado e aplicado em menos de 1 dia',
      'Resolve 1 problema de ponta a ponta',
      'Você ficaria confortável em mostrar para alguém testar',
    ],
  },
  minicurso: {
    title: 'Roteirizar as aulas do mini-curso',
    description: 'Planeje aulas curtas e grave só a primeira, para testar antes de produzir tudo.',
    whatToDo:
      'Liste até 5 aulas de 5 a 10 minutos, cada uma resolvendo um passo. Grave só a aula 1, no celular, sem edição.',
    howToKnowItIsGood: [
      'Cada aula resolve um único passo',
      'A aula 1 se entende sem as outras',
      'Você gravou sem esperar o equipamento ideal',
    ],
  },
};

/** t4: preço de teste (referência inicial, não regra) */
const TEST_PRICE: Record<ProductId, string> = {
  servico: 'R$ 50 a R$ 150 por entrega de teste',
  sessao: 'R$ 50 a R$ 120 por sessão de teste',
  guia: 'R$ 19 a R$ 47',
  minicurso: 'R$ 47 a R$ 97',
};

export interface PlanInput {
  productId: ProductId;
  channel: string;
  test: string;
}

export function buildPlanTasks(plan: PlanInput | null): TaskItem[] {
  return INITIAL_TASKS.map((base) => {
    // No modelo aprovado o caminho inteiro é grátis (docs/pesquisa/06): nenhum capítulo trancado
    const task: TaskItem = { ...base, isLocked: false };
    if (!plan) return task;

    switch (task.id) {
      case 't2':
        return { ...task, ...MINIMUM_VERSION[plan.productId] };
      case 't4':
        return {
          ...task,
          whatToDo:
            `Defina o preço de teste (referência inicial: ${TEST_PRICE[plan.productId]}). ` +
            'Crie uma conta gratuita em uma plataforma de pagamento (ex.: Kiwify, Hotmart ou Asaas) ou combine Pix direto, e tenha o link pronto antes das conversas.',
        };
      case 't5':
        if (plan.channel.includes('Instagram')) return task;
        return {
          ...task,
          title: 'Ajudar em 2 grupos onde seu público tira dúvidas',
          description: 'Ser útil onde as pessoas já estão, sem precisar aparecer em vídeo.',
          whatToDo:
            'Encontre 2 grupos ou comunidades do seu tema (WhatsApp, Facebook, Reddit ou fóruns) e responda 3 dúvidas de forma útil, sem vender nada.',
          howToKnowItIsGood: ['Pelo menos 1 pessoa agradeceu ou puxou conversa com você'],
        };
      case 't6':
        return {
          ...task,
          title: 'Fazer o teste da sua hipótese',
          description: 'A hora de descobrir se as pessoas pagam pelo que você criou.',
          whatToDo: `${plan.test} Seja honesto: diga que é uma versão de teste com condição especial.`,
          howToKnowItIsGood: ['2 de 5 pessoas disseram sim (ou pagaram) em até 14 dias', 'Você anotou o que fez as outras dizerem não'],
        };
      default:
        return task;
    }
  });
}
