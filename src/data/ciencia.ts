/**
 * Cartões "Você sabia?": achados da pesquisa de base (docs/pesquisa/), em linguagem simples
 * e sem inflar números. Factuais e livres de direito autoral; reforçam o método do app.
 */

export interface CartaoCiencia {
  id: string;
  texto: string;
  estudo: string;
  fonte: string;
}

export const CARTOES_CIENCIA: CartaoCiencia[] = [
  {
    id: 'intencoes',
    texto: 'Dizer quando e onde você vai fazer algo aumenta bastante a chance de fazer.',
    estudo: '94 estudos · Gollwitzer & Sheeran, 2006',
    fonte: 'https://stafforini.com/works/gollwitzer-2006-implementation-intentions-and/',
  },
  {
    id: 'habito',
    texto: 'Criar um hábito leva cerca de 2 meses, e varia muito de pessoa para pessoa. Os "21 dias" são mito.',
    estudo: 'Lally et al., 2010 · Singh et al., 2024',
    fonte: 'https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally',
  },
  {
    id: 'autocompaixao',
    texto: 'Ser gentil consigo depois de uma falha aumenta a motivação para melhorar.',
    estudo: 'Breines & Chen, 2012',
    fonte: 'https://pubmed.ncbi.nlm.nih.gov/22645164/',
  },
  {
    id: 'recomeco',
    texto: 'Segunda-feira, início de mês e aniversário são ótimos momentos para recomeçar.',
    estudo: 'Dai, Milkman & Riis, 2014',
    fonte: 'https://faculty.wharton.upenn.edu/wp-content/uploads/2014/06/Dai_Fresh_Start_2014_Mgmt_Sci.pdf',
  },
  {
    id: 'registro',
    texto: 'Registrar o progresso ajuda a chegar lá, e anotar de verdade ajuda mais do que só lembrar.',
    estudo: '138 estudos · Harkin et al., 2016',
    fonte: 'https://eprints.whiterose.ac.uk/91437/',
  },
  {
    id: 'natureza',
    texto: 'Sons de água e de pássaros reduzem o estresse.',
    estudo: 'Buxton et al., 2021',
    fonte: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8040792',
  },
  {
    id: 'paixao',
    texto: 'Interesse se desenvolve fazendo. Esperar "achar a paixão" antes de começar costuma travar mais.',
    estudo: "O'Keefe, Dweck & Walton, 2018",
    fonte: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6180666',
  },
  {
    id: 'cientista',
    texto: 'Quem trata a ideia como hipótese e testa com pessoas reais tende a ter resultados melhores.',
    estudo: 'Camuffo et al., 2020',
    fonte: 'https://iris.unibocconi.it/handle/11565/4013977',
  },
];
