import { useApp } from '../state/AppStore';
import { loadImage } from '../state/images';
import { exportNotebook, profileValues } from '../../domain/notebook';
import { BACKUP_JSON, BACKUP_MAX_BYTES, buildBackup, parseBackup, summarizeBackup, type BackupFile, type BackupSummary } from '../../domain/backup';
import { journeyDayKey } from '../../domain/journey';
import { shareFileOrDownload } from '../../utils/share';

/**
 * Backup completo (etapa 40), usado no Caderno e no cartão "Proteja seus dados".
 * Sempre um .zip: caderno-prumo.txt (pra ler), prumo-backup.json (pra restaurar) e fotos/.
 */
export function useBackupExport() {
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

    // Carregado só na hora: a biblioteca de .zip não pesa na abertura do app
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    zip.file('caderno-prumo.txt', text);
    const images: Record<string, string> = {};
    for (const id of ids) {
      const blob = await loadImage(id);
      if (!blob) continue;
      zip.file(names.get(id)!, blob);
      images[id] = names.get(id)!;
    }
    const backup = buildBackup({ state: actions.snapshot(), images, appVersion: __APP_VERSION__ });
    zip.file(BACKUP_JSON, JSON.stringify(backup));
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
    const how = await shareFileOrDownload(blob, `prumo-backup-${journeyDayKey()}.zip`, 'Backup do Prumo');
    if (how !== 'cancelled') actions.markExported();
    return how;
  };
}

export type ReadBackup = { ok: true; backup: BackupFile; photos: Record<string, Blob>; summary: BackupSummary } | { ok: false; error: string };

/** Lê o arquivo escolhido (.zip do backup ou só o .json) e devolve o resumo para confirmar */
export async function readBackupFile(file: File): Promise<ReadBackup> {
  if (file.size > BACKUP_MAX_BYTES) return { ok: false, error: 'Esse arquivo é grande demais para ser um backup do Prumo.' };
  // Reconhece o .zip pelo conteúdo ("PK"), não pelo nome: arquivos baixados ou enviados por apps podem perder a extensão
  const head = new Uint8Array(await file.slice(0, 2).arrayBuffer());
  const isZip = head[0] === 0x50 && head[1] === 0x4b;
  if (!isZip) {
    const parsed = parseBackup(await file.text());
    if (!parsed.ok) return parsed;
    return { ok: true, backup: parsed.backup, photos: {}, summary: summarizeBackup(parsed.backup, 0) };
  }
  try {
    const { default: JSZip } = await import('jszip');
    const zip = await JSZip.loadAsync(file);
    // Aceita o .json na raiz ou dentro de uma pasta (quando a pessoa descompacta e compacta de novo)
    const entry = zip.file(BACKUP_JSON) ?? zip.file(new RegExp(`(^|/)${BACKUP_JSON.replace('.', '\\.')}$`))[0];
    if (!entry) {
      return {
        ok: false,
        error: 'Esse .zip não tem o arquivo prumo-backup.json. Backups antigos (só com o caderno em texto) não dão para restaurar: faça um backup novo.',
      };
    }
    const parsed = parseBackup(await entry.async('string'));
    if (!parsed.ok) return parsed;
    const base = entry.name.slice(0, entry.name.length - BACKUP_JSON.length);
    const photos: Record<string, Blob> = {};
    for (const [id, path] of Object.entries(parsed.backup.images)) {
      const img = zip.file(base + path);
      if (img) photos[id] = new Blob([await img.async('arraybuffer')], { type: 'image/jpeg' });
    }
    return { ok: true, backup: parsed.backup, photos, summary: summarizeBackup(parsed.backup, Object.keys(photos).length) };
  } catch {
    return { ok: false, error: 'Não deu para abrir esse arquivo. Confira se é o .zip do backup do Prumo.' };
  }
}
