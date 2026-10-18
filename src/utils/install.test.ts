import { describe, expect, it } from 'vitest';
import { platform } from './install';

describe('detecção do aparelho para o passo a passo de instalar', () => {
  it('reconhece iPhone, Android e o resto', () => {
    expect(platform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1')).toBe('ios');
    expect(platform('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36')).toBe('android');
    expect(platform('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36')).toBe('outro');
  });
});
