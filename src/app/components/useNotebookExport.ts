import { useApp } from '../state/AppStore';
import { exportNotebook, profileValues } from '../../domain/notebook';
import { shareOrDownload } from '../../utils/share';

/** Exportar o Caderno inteiro (usado no Caderno e no cartão "Proteja seus dados") */
export function useNotebookExport() {
  const { userName, diagnosis, notes, profileOverrides, taskNotes, tasks, people, actions } = useApp();
  return async (): Promise<'shared' | 'downloaded' | 'cancelled'> => {
    const taskNoteList = tasks.filter((t) => taskNotes[t.id]?.trim()).map((t) => ({ title: t.title, text: taskNotes[t.id] }));
    const text = exportNotebook({ userName, profile: profileValues(diagnosis, profileOverrides), notes, taskNotes: taskNoteList, people });
    const how = await shareOrDownload(text, 'Caderno do Prumo', 'caderno-prumo.txt');
    if (how !== 'cancelled') actions.markExported();
    return how;
  };
}
