/**
 * Citações verificadas do Prumo. Política de curadoria em docs/pesquisa/05-citacoes.md.
 *
 * Regra: só entra com obra + localização conferidas. Traduções de textos estrangeiros
 * em domínio público são nossas (traducao: 'nossa'), feitas a partir do original ou de
 * tradução também em domínio público.
 */

export type TemaCitacao =
  | 'comecar'
  | 'medo'
  | 'perfeccionismo'
  | 'obstaculo'
  | 'habito'
  | 'proposito'
  | 'recursos';

export interface Citacao {
  id: string;
  texto: string;
  autor: string;
  obra: string;
  referencia: string;
  traducao: 'nossa' | 'original';
  dominioPublico: boolean;
  temas: TemaCitacao[];
  verificacao: string;
  status: 'verificada' | 'pendente';
}

export const CITACOES: Citacao[] = [
  {
    id: 'laozi-64',
    texto: 'Uma jornada de mil léguas começa sob os seus pés.',
    autor: 'Laozi',
    obra: 'Tao Te Ching',
    referencia: 'cap. 64',
    traducao: 'nossa',
    dominioPublico: true,
    temas: ['comecar', 'habito'],
    verificacao: 'https://en.wikipedia.org/wiki/A_journey_of_a_thousand_miles_begins_with_a_single_step',
    status: 'verificada',
  },
  {
    id: 'seneca-104',
    texto: 'Não é por serem difíceis que não ousamos; é por não ousarmos que as coisas são difíceis.',
    autor: 'Sêneca',
    obra: 'Cartas a Lucílio',
    referencia: 'carta 104, §26',
    traducao: 'nossa',
    dominioPublico: true,
    temas: ['medo', 'comecar'],
    verificacao: 'https://www.correiobraziliense.com.br/cbradar/seneca-licao-coragem-ousar-estoicismo/',
    status: 'verificada',
  },
  {
    id: 'widener-roosevelt',
    texto: 'Faça o que puder, com o que você tem, onde você está.',
    autor: 'Bill Widener (citado por Theodore Roosevelt)',
    obra: 'Theodore Roosevelt: An Autobiography',
    referencia: '1913, cap. "Outdoors and Indoors"',
    traducao: 'nossa',
    dominioPublico: true,
    temas: ['recursos', 'comecar'],
    verificacao: 'https://quoteinvestigator.com/2022/12/17/what-you-can/',
    status: 'verificada',
  },
  {
    id: 'voltaire-begueule',
    texto: 'O melhor é inimigo do bom.',
    autor: 'Voltaire (citando um provérbio italiano)',
    obra: 'La Bégueule',
    referencia: '1772, versos de abertura',
    traducao: 'nossa',
    dominioPublico: true,
    temas: ['perfeccionismo'],
    verificacao: 'https://fr.wikisource.org/wiki/Page:Voltaire_-_%C5%92uvres_compl%C3%A8tes_Garnier_tome10.djvu/60',
    status: 'verificada',
  },
  {
    id: 'marco-aurelio-5-20',
    texto: 'Aquilo que é obstáculo no caminho nos ajuda a seguir por ele.',
    autor: 'Marco Aurélio',
    obra: 'Meditações',
    referencia: 'livro 5, §20 (a partir da tradução de George Long, 1862)',
    traducao: 'nossa',
    dominioPublico: true,
    temas: ['obstaculo'],
    verificacao: 'https://lexundria.com/m_aur_med/5.20/lg',
    status: 'verificada',
  },
  {
    id: 'aristoteles-etica-2-1',
    texto: 'Tornamo-nos justos praticando atos justos, moderados praticando atos moderados, corajosos praticando atos de coragem.',
    autor: 'Aristóteles',
    obra: 'Ética a Nicômaco',
    referencia: 'livro II, cap. 1 (1103a–b)',
    traducao: 'nossa',
    dominioPublico: true,
    temas: ['habito'],
    verificacao: 'https://catalog.perseus.org/catalog/urn:cts:greekLit:tlg0086.tlg010.perseus-eng1',
    status: 'verificada',
  },
  {
    id: 'pessoa-mar-portugues',
    texto: 'Tudo vale a pena / Se a alma não é pequena.',
    autor: 'Fernando Pessoa',
    obra: 'Mensagem, "Mar Português"',
    referencia: '1934',
    traducao: 'original',
    dominioPublico: true,
    temas: ['proposito'],
    verificacao: 'https://estudospessoanos.fflch.usp.br/sites/estudospessoanos.fflch.usp.br/files/CG_Intro_Mensagem.pdf',
    status: 'pendente',
  },
  {
    id: 'rosa-coragem',
    texto: 'O que ela quer da gente é coragem.',
    autor: 'João Guimarães Rosa',
    obra: 'Grande Sertão: Veredas',
    referencia: '1956',
    traducao: 'original',
    // Obra protegida até 2038 (Lei 9.610/98, art. 41): uso só como citação curta e identificada
    dominioPublico: false,
    temas: ['medo', 'proposito'],
    verificacao: '',
    status: 'pendente',
  },
];

/** Só as citações prontas para aparecer no app. */
export function citacoesPublicaveis(tema?: TemaCitacao): Citacao[] {
  return CITACOES.filter((c) => c.status === 'verificada' && (!tema || c.temas.includes(tema)));
}
