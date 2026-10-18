import React, { useEffect, useState } from 'react';
import { Download, ShieldCheck, Smartphone } from 'lucide-react';
import { useApp } from '../state/AppStore';
import { useNotebookExport } from './useNotebookExport';
import { canPromptInstall, isPersisted, isStandalone, onInstallChange, platform, promptInstall } from '../../utils/install';

function useInstallState() {
  const [, force] = useState(0);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => {
    void isPersisted().then(setPersisted);
    return onInstallChange(() => force((n) => n + 1));
  }, []);
  return { installed: isStandalone(), canPrompt: canPromptInstall(), persisted, os: platform() };
}

/** Passo a passo para instalar, conforme o aparelho */
const InstallSteps: React.FC<{ os: ReturnType<typeof platform>; canPrompt: boolean }> = ({ os, canPrompt }) => {
  if (canPrompt) {
    return (
      <button
        onClick={() => void promptInstall()}
        className="w-full min-h-10 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Smartphone className="w-4 h-4" /> Instalar o Prumo
      </button>
    );
  }
  if (os === 'ios') {
    return (
      <ol className="text-[13px] text-ink space-y-1 list-decimal pl-5">
        <li>Abra o Prumo no <strong>Safari</strong>.</li>
        <li>Toque em <strong>Compartilhar</strong> (o quadrado com a seta para cima).</li>
        <li>Escolha <strong>Adicionar à Tela de Início</strong> e depois <strong>Adicionar</strong>.</li>
        <li>Daqui pra frente, abra pelo ícone da bússola.</li>
      </ol>
    );
  }
  return (
    <ol className="text-[13px] text-ink space-y-1 list-decimal pl-5">
      <li>No <strong>Chrome</strong>, toque no menu <strong>⋮</strong> (canto de cima).</li>
      <li>Escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</li>
      <li>Daqui pra frente, abra pelo ícone da bússola.</li>
    </ol>
  );
};

/** Cartão completo (aba Você): instalar, proteção do navegador e backup */
export const ProtectDataCard: React.FC = () => {
  const { lastExportAt } = useApp();
  const runExport = useNotebookExport();
  const { installed, canPrompt, persisted, os } = useInstallState();
  const [msg, setMsg] = useState('');

  return (
    <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
      <h3 className="text-base font-bold text-ink flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-primary" /> Proteja seus dados
      </h3>
      <p className="text-[13px] text-muted leading-relaxed">
        Tudo o que você guarda no Prumo fica só neste celular. Três cuidados evitam perder suas anotações e contatos:
      </p>

      <div className="space-y-1.5">
        <strong className="text-sm text-ink block">1. {installed ? '✅ App instalado' : 'Instale o app na tela de início'}</strong>
        {!installed && (
          <>
            {os === 'ios' && (
              <p className="text-[13px] text-gold-ink bg-gold-soft rounded-lg p-2 leading-snug">
                No iPhone isso é importante: aberto só no Safari, o sistema pode apagar os dados do Prumo se ele ficar uns
                dias sem ser aberto. Na tela de início, isso não acontece.
              </p>
            )}
            <InstallSteps os={os} canPrompt={canPrompt} />
          </>
        )}
      </div>

      <div className="text-sm text-ink">
        <strong className="block">2. {persisted ? '✅ Armazenamento protegido' : 'Armazenamento protegido: ainda não'}</strong>
        {!persisted && (
          <span className="text-[13px] text-muted">O navegador decide sozinho. Instalar o app e usar com frequência ajuda.</span>
        )}
      </div>

      <div className="space-y-1.5">
        <strong className="text-sm text-ink block">
          3. Guarde uma cópia {lastExportAt ? `(última: ${new Date(lastExportAt).toLocaleDateString('pt-BR')})` : '(nenhuma ainda)'}
        </strong>
        <button
          onClick={async () => {
            const how = await runExport();
            if (how === 'downloaded') setMsg('Arquivo baixado ✓');
            if (how === 'shared') setMsg('Cópia enviada ✓');
          }}
          className="w-full min-h-10 rounded-xl border border-line text-sm text-ink inline-flex items-center justify-center gap-1.5 cursor-pointer hover:border-primary"
        >
          <Download className="w-4 h-4" /> Exportar caderno
        </button>
        {msg && <p className="text-[13px] text-primary font-semibold" role="status">{msg}</p>}
      </div>
    </div>
  );
};

/** Convite curto no Início, enquanto o app não está instalado (volta 7 dias depois de dispensado) */
export const InstallHint: React.FC = () => {
  const { installHintDismissedAt, actions } = useApp();
  const { installed, canPrompt, os } = useInstallState();
  const [open, setOpen] = useState(false);
  if (installed) return null;
  if (installHintDismissedAt && Date.now() - installHintDismissedAt < 7 * 86_400_000) return null;
  return (
    <div className="p-3 rounded-xl bg-primary-soft border border-primary/30 text-sm space-y-2">
      <div className="flex items-start gap-2">
        <Smartphone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-ink leading-snug">
          <strong>Instale o Prumo na tela de início</strong> para abrir mais rápido
          {os === 'ios' ? ' e não perder seus dados.' : ' e proteger seus dados.'}
        </p>
      </div>
      {open && <InstallSteps os={os} canPrompt={canPrompt} />}
      <div className="flex gap-2">
        {!open && (
          <button onClick={() => (canPrompt ? void promptInstall() : setOpen(true))} className="px-3 min-h-9 rounded-lg bg-primary text-on-primary text-[13px] font-semibold cursor-pointer">
            {canPrompt ? 'Instalar' : 'Como instalar'}
          </button>
        )}
        <button onClick={actions.dismissInstallHint} className="px-3 min-h-9 rounded-lg text-[13px] text-muted cursor-pointer">
          Agora não
        </button>
      </div>
    </div>
  );
};
