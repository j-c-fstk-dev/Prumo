/**
 * Fotos do Caderno (etapa 31). Ficam no mesmo banco do aparelho, mas cada uma numa chave própria
 * ("img:<id>"), fora do estado principal: assim salvar uma anotação não regrava todas as fotos.
 */

import { useEffect, useState } from 'react';
import { deleteValue, loadValue, saveValue } from './storage';

export const MAX_IMAGES_PER_ITEM = 4;
const key = (id: string) => `img:${id}`;

export async function saveImage(blob: Blob): Promise<string> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await saveValue(key(id), blob);
  return id;
}

export function loadImage(id: string): Promise<Blob | undefined> {
  return loadValue<Blob>(key(id));
}

export async function deleteImages(ids: string[] | undefined): Promise<void> {
  for (const id of ids ?? []) await deleteValue(key(id));
}

/** URL temporária para mostrar a foto; liberada quando o componente sai da tela */
export function useImageUrl(id: string): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let created: string | null = null;
    void loadImage(id).then((blob) => {
      if (!alive || !blob) return;
      created = URL.createObjectURL(blob);
      setUrl(created);
    });
    return () => {
      alive = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [id]);
  return url;
}
