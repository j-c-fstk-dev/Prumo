import { describe, expect, it } from 'vitest';
import { ANDROID_PACKAGE, assetLinks } from './assetLinks';

const HEX = 'ab'.repeat(32);
const COLONS = 'AB:'.repeat(31) + 'AB';

describe('assetLinks', () => {
  it('sem impressão configurada devolve lista vazia', () => {
    expect(assetLinks(undefined)).toEqual([]);
    expect(assetLinks('  ')).toEqual([]);
  });

  it('aceita com ou sem ":" e devolve no formato que o Android espera', () => {
    for (const fp of [HEX, COLONS, ` ${COLONS.toLowerCase()} `]) {
      expect(assetLinks(fp)).toEqual([
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: { namespace: 'android_app', package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: [COLONS] },
        },
      ]);
    }
  });

  it('várias impressões por vírgula; ignora o que não é SHA-256', () => {
    const [entry] = assetLinks(`${HEX}, CD:EF, ${'12'.repeat(32)}`) as { target: { sha256_cert_fingerprints: string[] } }[];
    expect(entry.target.sha256_cert_fingerprints).toEqual([COLONS, '12:'.repeat(31) + '12']);
  });
});
