import { useApp } from '../state/AppStore';
import { loadImage } from '../state/images';
import { exportNotebook, profileValues } from '../../domain/notebook';
import { shareFileOrDownload, shareOrDownload } from '../../utils/share';

/**
 * Exportar o Caderno inteiro (usado no Caderno e no cartão "Proteja seus dados").
 * Sem fotos: texto simples. Com fotos: um .zip com o texto e a pasta fotos/ (etapa 31).
 */
export function useNotebookExport() {
  const { userName, diagnosis, notes, profileOverrides, taskNotes, tasks, people, actions } = useApp();
  return async (): Promise<'shared' | 'downloaded' | 'cancelled'> => {
    const taskNoteList = tasks.filter((t) => taskNotes[t.id]?.trim()).map((t) => ({ title: t.title, text: taskNotes[t.id] }));
    const ids = [...notes.flatMap((n) => n.images ?? []), ...people.flatMap((p) => p.images ?? [])];
    const names = new Map(ids.map((id, i) => [id, `fotos/foto-${String(i + 1).padStart(2, '0')}.jpg`]));
    const text = exportNotebook({
      userName,
      profile: profileValues(diagnosis, profileOverrides),
      notes,
      taskNotes: taskNoteList,
      people,
      photoName: ids.length ? (id) => names.get(id) ?? '' : undefined,
    });

    let how: 'shared' | 'downloaded' | 'cancelled';
    if (!ids.length) {
      how = await shareOrDownload(text, 'Caderno do Prumo', 'caderno-prumo.txt');
    } else {
      // Carregado só na hora: a biblioteca de .zip não pesa na abertura do app
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      zip.file('caderno-prumo.txt', text);
      for (const id of ids) {
        const blob = await loadImage(id);
        if (blob) zip.file(names.get(id)!, blob);
      }
      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
      how = await shareFileOrDownload(blob, 'caderno-prumo.zip', 'Caderno do Prumo');
    }
    if (how !== 'cancelled') actions.markExported();
    return how;
  };
}
