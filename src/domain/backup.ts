/**
 * Backup completo do Prumo (etapa 40): um .zip com o caderno em texto (pra ler), as fotos e
 * prumo-backup.json (pra restaurar). Tudo continua só com a pessoa: o arquivo é gerado e lido no aparelho.
 */

export const BACKUP_FORMAT = 'prumo-backup';
export const BACKUP_VERSION = 1;
export const BACKUP_JSON = 'prumo-backup.json';
/** Acima disso, o arquivo nem é lido (um backup normal tem poucos MB) */
export const BACKUP_MAX_BYTES = 150 * 1024 * 1024;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: number;
  appVersion: string;
  /** O estado do app, como fica salvo no aparelho (sem o identificador do aparelho) */
  state: Record<string, unknown>;
  /** Foto (id) → caminho dentro do .zip */
  images: Record<string, string>;
}

export function buildBackup(input: {
  state: Record<string, unknown>;
  images: Record<string, string>;
  appVersion: string;
  now?: number;
}): BackupFile {
  // O id do aparelho é do aparelho: quem restaura num celular novo continua com o id dele
  const { clientId: _omit, ...state } = input.state;
  void _omit;
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: input.now ?? Date.now(),
    appVersion: input.appVersion,
    state,
    images: input.images,
  };
}

export type ParsedBackup = { ok: true; backup: BackupFile } | { ok: false; error: string };

const NOT_A_BACKUP = 'Esse arquivo não é um backup do Prumo. Escolha o arquivo prumo-backup (.zip ou .json) que você exportou.';

/** Confere se o texto é um backup do Prumo que esta versão do app sabe ler */
export function parseBackup(text: string): ParsedBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: NOT_A_BACKUP };
  }
  if (!raw || typeof raw !== 'object') return { ok: false, error: NOT_A_BACKUP };
  const b = raw as Partial<BackupFile>;
  if (b.format !== BACKUP_FORMAT || !b.state || typeof b.state !== 'object' || Array.isArray(b.state)) {
    return { ok: false, error: NOT_A_BACKUP };
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    return { ok: false, error: 'Esse backup foi feito numa versão mais nova do Prumo. Atualize o app (feche e abra de novo) e tente outra vez.' };
  }
  const images: Record<string, string> = {};
  if (b.images && typeof b.images === 'object') {
    for (const [id, path] of Object.entries(b.images)) if (typeof path === 'string') images[id] = path;
  }
  return {
    ok: true,
    backup: {
      format: BACKUP_FORMAT,
      version: b.version,
      exportedAt: typeof b.exportedAt === 'number' ? b.exportedAt : 0,
      appVersion: typeof b.appVersion === 'string' ? b.appVersion : '',
      state: b.state as Record<string, unknown>,
      images,
    },
  };
}

export interface BackupSummary {
  userName: string;
  exportedAt: number;
  notes: number;
  people: number;
  photos: number;
  tasksDone: number;
  checkIns: number;
}

const count = (v: unknown) => (Array.isArray(v) ? v.length : 0);

/** O que a pessoa vê antes de confirmar a restauração */
export function summarizeBackup(b: BackupFile, photosFound = Object.keys(b.images).length): BackupSummary {
  const s = b.state;
  const status = s.taskStatus && typeof s.taskStatus === 'object' ? Object.values(s.taskStatus as Record<string, unknown>) : [];
  return {
    userName: typeof s.userName === 'string' ? s.userName : '',
    exportedAt: b.exportedAt,
    notes: count(s.notes),
    people: count(s.people),
    photos: photosFound,
    tasksDone: status.filter((x) => x === 'completed').length,
    checkIns: count(s.checkIns),
  };
}
