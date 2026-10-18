/**
 * Dados do responsável pelo Prumo, usados na apresentação, nas páginas legais e no "Sobre" do app.
 * Enquanto estiverem vazios, as páginas mostram "[a preencher]" e o link de contato não aparece.
 */
export const SITE = {
  /** Nome de quem responde pelo app (pessoa ou MEI) */
  owner: '',
  /** CNPJ do MEI, se houver */
  cnpj: '',
  /** E-mail para privacidade e contato (canal exigido pela ANPD) */
  email: '',
  /** Texto curto de apresentação (aparece no "Sobre" do app). Vazio: o bloco não aparece */
  about: '',
  /** Redes sociais (endereço completo, ex.: https://instagram.com/...). Vazio: o link não aparece */
  instagram: '',
  tiktok: '',
  /** Data da última revisão dos termos e da política */
  legalUpdated: '18 de outubro de 2026',
  repo: 'https://github.com/j-c-fstk-dev/Prumo',
} as const;

export const filled = (v: string) => v || '[a preencher]';
