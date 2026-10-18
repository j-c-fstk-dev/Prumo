/**
 * Caixa de ferramentas curada (decisão em docs/etapas/14-ferramentas.md).
 *
 * Regras:
 *  - O motor sugere CATEGORIAS; as marcas são só exemplos.
 *  - Nada de preço, plano ou limite: isso muda o tempo todo. A interface sempre pede para
 *    conferir as condições no site (garantido por teste em tasks.test.ts).
 *  - "revisadoEm" = quando confirmamos que a ferramenta existe e serve para a categoria.
 *    Revisão a cada 3 meses. Nenhuma indicação é paga; se um dia houver link de afiliado,
 *    ele precisa ser identificado na tela.
 */

export interface ToolExample {
  name: string;
  /** Site oficial (opcional para coisas que já estão no celular) */
  url?: string;
}

export interface ToolCategory {
  id: ToolCategoryId;
  label: string;
  /** Para que serve, em uma frase */
  description: string;
  /** Como usar bem nesta jornada */
  tip: string;
  examples: ToolExample[];
}

export type ToolCategoryId =
  | 'ia_texto'
  | 'design'
  | 'documentos'
  | 'pagamento'
  | 'formulario'
  | 'agenda'
  | 'videochamada'
  | 'gravacao'
  | 'mensagens';

export const TOOLBOX_REVISED_AT = '2026-10';

export const TOOL_CATEGORIES: Record<ToolCategoryId, ToolCategory> = {
  ia_texto: {
    id: 'ia_texto',
    label: 'Assistente de IA para rascunhos',
    description: 'Ajuda a destravar a página em branco: ideias, roteiros, títulos e mensagens.',
    tip: 'Peça o primeiro rascunho e depois reescreva com a sua voz. Não cole dados pessoais de clientes.',
    examples: [
      { name: 'ChatGPT', url: 'https://chatgpt.com' },
      { name: 'Gemini', url: 'https://gemini.google.com' },
      { name: 'Claude', url: 'https://claude.ai' },
    ],
  },
  design: {
    id: 'design',
    label: 'Editor de design',
    description: 'Para criar artes, capas, carrosséis e páginas de material sem saber design.',
    tip: 'Comece por um modelo pronto e troque só textos e cores. Feito é melhor que perfeito.',
    examples: [
      { name: 'Canva', url: 'https://www.canva.com' },
      { name: 'Adobe Express', url: 'https://www.adobe.com/express/' },
    ],
  },
  documentos: {
    id: 'documentos',
    label: 'Documentos e planilhas',
    description: 'Para escrever o guia, montar checklists, modelos e organizar o que você entrega.',
    tip: 'Um documento simples e bem organizado já é um produto. Exporte em PDF para enviar.',
    examples: [
      { name: 'Google Docs e Planilhas', url: 'https://docs.google.com' },
      { name: 'Notion', url: 'https://www.notion.so' },
    ],
  },
  pagamento: {
    id: 'pagamento',
    label: 'Receber pagamentos',
    description: 'Para cobrar por Pix ou cartão, com link de pagamento ou checkout.',
    tip: 'No teste, o Pix do seu próprio banco já basta. Plataformas de checkout ajudam quando o volume crescer.',
    examples: [
      { name: 'Pix do seu banco', url: 'https://www.bcb.gov.br/estabilidadefinanceira/pix' },
      { name: 'Mercado Pago', url: 'https://www.mercadopago.com.br' },
      { name: 'Kiwify', url: 'https://kiwify.com.br' },
      { name: 'Hotmart', url: 'https://hotmart.com/pt-br' },
    ],
  },
  formulario: {
    id: 'formulario',
    label: 'Formulários e pesquisas',
    description: 'Para ouvir as pessoas: perguntas de validação, inscrições e depoimentos.',
    tip: 'No máximo 5 perguntas. Pergunte sobre o problema delas, não sobre o seu produto.',
    examples: [
      { name: 'Google Forms', url: 'https://forms.google.com' },
      { name: 'Tally', url: 'https://tally.so' },
    ],
  },
  agenda: {
    id: 'agenda',
    label: 'Agendamento',
    description: 'Para a pessoa escolher um horário livre sem troca infinita de mensagens.',
    tip: 'Abra poucos horários por semana, dentro do tempo que você tem de verdade.',
    examples: [
      { name: 'Google Agenda', url: 'https://calendar.google.com' },
      { name: 'Calendly', url: 'https://calendly.com' },
    ],
  },
  videochamada: {
    id: 'videochamada',
    label: 'Videochamada',
    description: 'Para sessões e conversas a distância, com ou sem câmera.',
    tip: 'Câmera é opcional: uma chamada só de voz com tela compartilhada funciona muito bem.',
    examples: [
      { name: 'Google Meet', url: 'https://meet.google.com' },
      { name: 'Zoom', url: 'https://zoom.us' },
    ],
  },
  gravacao: {
    id: 'gravacao',
    label: 'Gravar e editar vídeo curto',
    description: 'Para aulas curtas, reels e demonstrações gravadas no celular.',
    tip: 'Luz de janela, celular apoiado e um assunto por vídeo. Sem edição na primeira versão.',
    examples: [
      { name: 'Câmera do celular' },
      { name: 'CapCut', url: 'https://www.capcut.com' },
    ],
  },
  mensagens: {
    id: 'mensagens',
    label: 'Conversas com clientes',
    description: 'Para convidar, responder e acompanhar as pessoas do seu teste.',
    tip: 'Use etiquetas para saber em que ponto está cada conversa e respostas rápidas para não travar.',
    examples: [{ name: 'WhatsApp Business', url: 'https://business.whatsapp.com' }],
  },
};
