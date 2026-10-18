import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useApp } from '../state/AppStore';
import { readBackupFile, type ReadBackup } from './useBackup';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Restaurar de um backup (etapa 40): escolhe o arquivo, mostra o resumo e só substitui depois de confirmar.
 * Fica no cartão "Proteja seus dados" e na tela de boas-vindas (para quem chegou num celular novo).
 */
export const RestoreBackup: React.FC<{ variant?: 'button' | 'link' }> = ({ variant = 'button' }) => {
  const { actions } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [read, setRead] = useState<ReadBackup | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (
    <input
      ref={input}
      type="file"
      accept=".zip,.json,application/zip,application/json"
      hidden
      aria-label="Escolher arquivo de backup"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setBusy(true);
        setRead(await readBackupFile(file));
        setBusy(false);
      }}
    />
  );

  const trigger =
    variant === 'link' ? (
      <button onClick={() => input.current?.click()} className="min-h-10 text-sm text-muted underline underline-offset-2 cursor-pointer">
        {busy ? 'Lendo o arquivo…' : 'Já usa o Prumo? Restaurar um backup'}
      </button>
    ) : (
      <button
        onClick={() => input.current?.click()}
        className="w-full min-h-10 rounded-xl border border-line text-sm text-ink inline-flex items-center justify-center gap-1.5 cursor-pointer hover:border-primary"
      >
        <Upload className="w-4 h-4" /> {busy ? 'Lendo o arquivo…' : 'Restaurar de um backup'}
      </button>
    );

  return (
    <div className="space-y-2 text-left">
      {pick}
      {!read?.ok && trigger}
      {read && !read.ok && (
        <p className="text-[13px] text-gold-ink bg-gold-soft border border-gold-line rounded-lg p-2.5 leading-snug" role="alert">
          {read.error}
        </p>
      )}
      {read?.ok && (
        <div className="p-3.5 rounded-xl border border-primary/40 bg-primary-soft space-y-2.5" role="alertdialog" aria-label="Confirmar restauração">
          <strong className="block text-sm text-ink">
            Backup de {read.summary.exportedAt ? new Date(read.summary.exportedAt).toLocaleDateString('pt-BR') : 'data desconhecida'}
            {read.summary.userName && ` · ${read.summary.userName}`}
          </strong>
          <p className="text-[13px] text-ink">
            {[
              plural(read.summary.tasksDone, 'tarefa concluída', 'tarefas concluídas'),
              plural(read.summary.checkIns, 'check-in', 'check-ins'),
              plural(read.summary.notes, 'anotação', 'anotações'),
              plural(read.summary.people, 'pessoa', 'pessoas'),
              plural(read.summary.photos, 'foto', 'fotos'),
            ].join(' · ')}
          </p>
          <p className="text-[13px] text-ink leading-snug">
            Restaurar <strong>substitui tudo o que está neste celular</strong> pelo que está no backup. Não dá para desfazer.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const ok = await actions.restoreBackup(read.backup.state, read.photos);
                setBusy(false);
                setRead(ok ? null : { ok: false, error: 'Não deu para restaurar esse backup. Ele pode estar danificado.' });
              }}
              className="min-h-10 rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              {busy ? 'Restaurando…' : 'Substituir e restaurar'}
            </button>
            <button onClick={() => setRead(null)} className="min-h-10 rounded-xl border border-line bg-surface text-sm text-ink cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
