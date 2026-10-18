import { describe, expect, it } from 'vitest';
import { fitWithin, splitLinks } from './images';

describe('fotos e links do caderno', () => {
  it('reduz mantendo a proporção e não aumenta foto pequena', () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1600, height: 1200 });
    expect(fitWithin(3000, 4000)).toEqual({ width: 1200, height: 1600 });
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });

  it('separa links do texto, sem pegar a pontuação do fim', () => {
    expect(splitLinks('Vídeo: https://youtu.be/abc123. Bom!')).toEqual([
      { text: 'Vídeo: ' },
      { text: 'https://youtu.be/abc123', href: 'https://youtu.be/abc123' },
      { text: '. Bom!' },
    ]);
    expect(splitLinks('sem link')).toEqual([{ text: 'sem link' }]);
    expect(splitLinks('(https://drive.google.com/file/d/x/view)')[1].href).toBe('https://drive.google.com/file/d/x/view');
  });
});
