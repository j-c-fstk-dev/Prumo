/**
 * Monta o roteiro de tarefas a partir do diagnóstico: as tarefas que dependem do formato do
 * produto (serviço, sessão, guia, curso) e do canal mudam; as demais seguem o roteiro base.
 */

import { INITIAL_TASKS, TaskItem } from '../data/prumoData';
import type { ProductId } from './diagnosis';
import type { ToolCategoryId } from '../data/ferramentas';

type TaskOverride = Partial<Pick<TaskItem, 'title' | 'description' | 'whatToDo' | 'howToKnowItIsGood' | 'signals' | 'ifNoSignal' | 'durationMinutes'>>;

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
      'Escreva o sumário em até 7 tópicos e monte 1 página de exemplo (checklist, planilha ou modelo num editor de documentos ou de design).',
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

/** Ferramentas por tarefa (camada 1: o motor sugere categorias, nunca marcas) */
const BASE_TOOLS: Record<string, ToolCategoryId[]> = {
  t1: ['ia_texto'],
  t3: ['mensagens', 'formulario'],
  t4: ['pagamento'],
  t5: ['design', 'ia_texto'],
  t6: ['mensagens', 'pagamento'],
  t7: ['formulario', 'mensagens'],
  t8: ['mensagens'],
  t9: ['ia_texto', 'mensagens'],
  t11: ['mensagens', 'formulario'],
  t13: ['design', 'ia_texto', 'pagamento'],
  t15: ['documentos'],
  t17: ['agenda'],
  t21: ['mensagens', 'videochamada'],
  t22: ['agenda'],
  t18: ['documentos', 'design'],
};

/** t2 depende do formato do produto */
const MINIMUM_VERSION_TOOLS: Record<ProductId, ToolCategoryId[]> = {
  servico: ['documentos', 'ia_texto'],
  sessao: ['agenda', 'videochamada', 'documentos'],
  guia: ['documentos', 'design', 'ia_texto'],
  minicurso: ['gravacao', 'ia_texto', 'design'],
};

/** t4: preço de teste (referência inicial, não regra) */
export const TEST_PRICE: Record<ProductId, string> = {
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
    const task: TaskItem = { ...base, isLocked: false, toolCategories: BASE_TOOLS[base.id] ?? [] };
    if (!plan) return task;

    switch (task.id) {
      case 't2':
        return { ...task, ...MINIMUM_VERSION[plan.productId], toolCategories: MINIMUM_VERSION_TOOLS[plan.productId] };
      case 't4':
        return {
          ...task,
          whatToDo:
            `Defina o preço de fundador do teste (referência inicial: ${TEST_PRICE[plan.productId]}): barato, e dito como preço de teste. ` +
            'Para receber, a chave Pix ou o QR code do seu banco já bastam; link de pagamento é opcional. ' +
            'Escreva também como devolve: quem compra pela internet pode desistir em até 7 dias e receber tudo de volta (Código de Defesa do Consumidor, art. 49).',
        };
      case 't5':
        if (plan.channel.includes('Instagram')) return task;
        return {
          ...task,
          title: 'Ajudar em 2 grupos onde seu público tira dúvidas',
          description: 'Ser útil onde as pessoas já estão, sem precisar aparecer em vídeo.',
          whatToDo:
            'Encontre 2 grupos ou comunidades do seu tema (WhatsApp, Facebook, Reddit ou fóruns) e responda 3 dúvidas de forma útil, sem vender nada.',
          howToKnowItIsGood: ['Você encontrou 2 grupos do seu tema', 'Respondeu 3 dúvidas sem vender nada'],
          signals: ['Alguém agradeceu ou puxou conversa com você'],
          ifNoSignal: 'Grupo parado? Procure outro mais ativo e continue ajudando: confiança leva umas semanas.',
          toolCategories: ['mensagens', 'ia_texto'],
        };
      case 't6':
        return {
          ...task,
          title: 'Fazer o teste da sua aposta',
          description: 'A hora de descobrir se as pessoas pagam pelo que você criou.',
          whatToDo:
            `${plan.test} Seja honesto: diga que é um teste, com preço de fundador. ` +
            'Se ainda não tem coragem de cobrar, pode fazer de graça para 1 ou 2 pessoas, mas só em troca de um compromisso combinado antes: data marcada, depoimento autorizado ou uma indicação.',
          howToKnowItIsGood: ['Você ofereceu para 5 pessoas, uma de cada vez', 'Anotou no Caderno o que cada uma fez'],
          signals: ['2 compromissos, sendo pelo menos 1 em dinheiro (pagamento ou sinal)'],
          ifNoSignal: 'Teve compromisso, mas ninguém pagou? A dor existe: mude uma coisa só (a oferta ou o preço) e faça mais uma rodada.',
        };
      default:
        return task;
    }
  });
}
