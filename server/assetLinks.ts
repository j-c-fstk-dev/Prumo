/**
 * Digital Asset Links do app Android (etapa 50): prova para o Android que o app e o site são do mesmo dono.
 * Sem isso o app abre o site com a barra de endereço em cima.
 */

export const ANDROID_PACKAGE = 'br.com.jardimdofazer.prumo';

/** Aceita as impressões com ou sem ":", separadas por vírgula; ignora o que não for SHA-256 */
export function assetLinks(fingerprints: string | undefined): unknown[] {
  const list = (fingerprints ?? '')
    .split(',')
    .map((f) => f.replace(/[^0-9a-f]/gi, '').toUpperCase())
    .filter((f) => f.length === 64)
    .map((f) => f.match(/../g)!.join(':'));
  if (!list.length) return [];
  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: { namespace: 'android_app', package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: list },
    },
  ];
}
