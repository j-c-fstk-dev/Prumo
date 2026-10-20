import React, { useState } from 'react';
import { ProtectDataCard } from '../components/ProtectData';
import {
  ChevronRight,
  ExternalLink,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { SITE } from '../../landing/site';
import { PrumoMeaning } from '../components/PrumoMeaning';
import { PaceChooser } from '../components/PaceChooser';

export const ProfileTab: React.FC = () => {
  const { userName, isSoundMuted, tapSounds, timeline, plan, trialDaysLeft, theme, actions } = useApp();
  const themeLabel = { auto: 'Automático (segue o celular)', light: 'Pergaminho (claro)', dark: 'Noite (escuro)' }[theme];
  const planLabel = {
    open_beta: 'Acesso completo · fase de testes',
    founder_trial: `Premium de fundador · ${trialDaysLeft} dias restantes`,
    premium: 'Premium',
    free: 'Plano grátis',
  }[plan];

  return (
    <div key="tab-profile" className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-tab-fade">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-display text-ink">Você</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-lg">
            {userName[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">{userName}</h3>
            <span className="text-sm text-muted">{planLabel}</span>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="p-4 rounded-2xl bg-night-sky shadow-sm" style={{ color: 'var(--night-text)' }}>
          <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--gold)' }}>
            Prumo Premium
          </span>
          <h4 className="text-base font-bold">Acelere o seu caminho</h4>
          <p className="text-sm mt-1 mb-3" style={{ color: 'var(--night-muted)' }}>
            Coach ilimitado, kit de execução completo e áudios guiados. O roteiro continua grátis.
          </p>
          <button
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('paywall');
            }}
            className="w-full py-2 font-bold text-sm rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: 'var(--gold)', color: 'var(--night-900)' }}
          >
            Conhecer Planos
          </button>
        </div>

        {/* Instalar, proteção do navegador e backup (etapa 30) */}
        <ProtectDataCard />

        {/* Linha do tempo de conquistas (registrar o progresso ajuda a chegar lá: Harkin et al. 2016) */}

        <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">

          <span className="text-sm font-bold text-ink block">Sua linha do tempo</span>

          {timeline.length === 0 ? (

            <p className="text-[13px] text-muted">Suas conquistas aparecem aqui conforme você avança.</p>

          ) : (

            <ol className="space-y-1.5">

              {timeline.map((e) => (

                <li key={`${e.kind}-${e.at}`} className="flex items-start gap-2 text-sm">

                  <span style={{ color: 'var(--gold-deco)' }}>{e.kind === 'capitulo' ? '✦' : '•'}</span>

                  <span className="flex-1 text-ink">{e.title}</span>

                  <span className="text-xs text-muted shrink-0">{new Date(e.at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>

                </li>

              ))}

            </ol>

          )}

        </div>


        {/* Opções de Conta */}
        <div className="space-y-2 text-sm">
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('result');
            }}
            className="p-3 bg-surface border border-line rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-2"
          >
            <span>Ver meu resultado completo</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </div>
          <div 
            onClick={() => {
              soundEffects.playSoftTap();
              actions.go('anamnese');
              actions.startAnamnese();
            }}
            className="p-3 bg-surface border border-line rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-2"
          >
            <span>Refazer as perguntas</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </div>
          {/* Ritmo (etapa 53) */}
          <div className="p-3 bg-surface border border-line rounded-xl space-y-2">
            <span className="block">Seu ritmo</span>
            <PaceChooser />
          </div>
          <div
            onClick={actions.cycleTheme}
            className="p-3 bg-surface border border-line rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-2"
          >
            <span>Tema: {themeLabel}</span>
            <span aria-hidden="true">{theme === 'dark' ? '🌙' : theme === 'light' ? '📜' : '🌓'}</span>
          </div>
          <div 
            onClick={actions.toggleSound}
            className="p-3 bg-surface border border-line rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-2"
          >
            <span>Sons do app: {isSoundMuted ? 'Desligados' : 'Ligados'}</span>
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-muted" /> : <Volume2 className="w-4 h-4 text-primary" />}
          </div>
          {!isSoundMuted && (
            <div
              onClick={actions.toggleTapSounds}
              className="p-3 bg-surface border border-line rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-2"
            >
              <span>
                Sons de toque: {tapSounds ? 'Ligados' : 'Desligados'}
                <span className="block text-xs text-muted">Botões e trocas de tela. Conquistas sempre têm som.</span>
              </span>
            </div>
          )}

        </div>

        <DeleteAllData />

        {/* Sobre (etapa 39): links da apresentação, das políticas e do código */}
        <div className="pt-2 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block px-1">Sobre o Prumo</span>
          {/* Guia do app e o que é o Prumo (etapas 47 e 49) */}
          <div className="rounded-xl bg-surface border border-line divide-y divide-line text-sm">
            <button onClick={actions.startGuide} className="w-full p-3 flex items-center justify-between hover:bg-surface-2 cursor-pointer text-left">
              <span>🧭 Guia do app</span>
              <ChevronRight className="w-4 h-4 text-muted" />
            </button>
            <details className="group">
              <summary className="p-3 flex items-center justify-between cursor-pointer list-none">
                <span>O que é o Prumo?</span>
                <ChevronRight className="w-4 h-4 text-muted transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-3 pb-3 text-[13px] text-muted leading-relaxed">
                <PrumoMeaning />
              </p>
            </details>
          </div>
          {/* Nossa história: texto em src/landing/site.ts (até lá, aparece "em breve") */}
          <div className="p-3 rounded-xl bg-surface border border-line">
            <strong className="text-sm text-ink block mb-1">Nossa história</strong>
            <p className={`text-[13px] leading-relaxed whitespace-pre-line ${SITE.about ? 'text-ink' : 'text-muted italic'}`}>
              {SITE.about || 'Em breve, a história de quem faz o Prumo.'}
            </p>
          </div>
          <div className="rounded-xl bg-surface border border-line divide-y divide-line text-sm">
            {[
              { href: '/', label: 'Página do Prumo' },
              { href: '/privacidade/', label: 'Política de privacidade' },
              { href: '/termos/', label: 'Termos de uso' },
              { href: SITE.email && `mailto:${SITE.email}`, label: 'Falar com a gente' },
              { href: SITE.instagram, label: 'Instagram', external: true },
              { href: SITE.tiktok, label: 'TikTok', external: true },
              { href: SITE.repo, label: 'Código-fonte (AGPL-3.0)', external: true },
            ].map((l) =>
              !l.href ? (
                <span key={l.label} className="p-3 flex items-center justify-between text-muted">
                  <span>{l.label}</span>
                  <span className="text-xs">em breve</span>
                </span>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="p-3 flex items-center justify-between hover:bg-surface-2"
                >
                  <span>{l.label}</span>
                  {l.external ? <ExternalLink className="w-4 h-4 text-muted" /> : <ChevronRight className="w-4 h-4 text-muted" />}
                </a>
              ),
            )}
          </div>
          <p className="text-xs text-muted px-1 pt-1">Versão {__APP_VERSION__} · fase de testes</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Apagar tudo (etapa 37, LGPD): some com respostas, cartas, anotações, pessoas, fotos e preferências
 * deste aparelho. Pede confirmação e lembra de exportar antes.
 */
const DeleteAllData: React.FC = () => {
  const { actions } = useApp();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return (
      <button
        onClick={() => setAsking(true)}
        className="w-full p-3 rounded-xl border border-line text-sm text-muted hover:text-ink inline-flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" /> Apagar todos os meus dados
      </button>
    );
  }
  return (
    <div className="p-4 rounded-2xl border border-gold-line bg-gold-soft space-y-2.5" role="alertdialog" aria-label="Apagar todos os dados">
      <strong className="block text-sm text-ink">Apagar tudo deste celular?</strong>
      <p className="text-[13px] text-ink leading-relaxed">
        Somem suas respostas, o resultado, as cartas, as tarefas, o Caderno (anotações, pessoas e fotos) e as preferências. Não dá para
        desfazer. Se quiser guardar uma cópia, use antes o <strong>Fazer backup</strong>, logo acima.
      </p>
      <p className="text-xs text-muted">O Prumo não guarda seus dados em servidor, então não sobra cópia em lugar nenhum.</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await actions.resetAll();
          }}
          className="min-h-10 rounded-xl bg-ink text-canvas text-sm font-semibold cursor-pointer disabled:opacity-50"
        >
          {busy ? 'Apagando…' : 'Sim, apagar tudo'}
        </button>
        <button onClick={() => setAsking(false)} className="min-h-10 rounded-xl border border-line text-sm text-ink cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  );
};
