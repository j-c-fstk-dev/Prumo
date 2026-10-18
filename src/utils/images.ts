/**
 * Reduz a foto antes de guardar: no máximo 1600 px no lado maior, em JPEG 80%. Uma foto de celular
 * (3 a 8 MB) vira algo em torno de 200 a 400 KB, sem diferença visível na tela.
 */

export const IMAGE_MAX_SIDE = 1600;
const QUALITY = 0.8;

/** Medidas finais mantendo a proporção (pura, testada) */
export function fitWithin(width: number, height: number, max = IMAGE_MAX_SIDE): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export async function compressImage(file: Blob): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Não é uma imagem');
  const bitmap = await createImageBitmap(file);
  const { width, height } = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Sem canvas');
  // Fundo branco: PNG com transparência não fica preto ao virar JPEG
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao comprimir'))), 'image/jpeg', QUALITY),
  );
}

/** Acha links (http/https) num texto, para mostrar como clicáveis (vídeos ficam como link) */
export function splitLinks(text: string): { text: string; href?: string }[] {
  const parts: { text: string; href?: string }[] = [];
  const re = /https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]]/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[0], href: m[0] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
