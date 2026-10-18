import React from 'react';
import { ProtectDataCard } from '../components/ProtectData';
import {
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';

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
          <a
            href="https://github.com/j-c-fstk-dev/Prumo"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-surface border border-line rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-2"
          >
            <span>Código-fonte (AGPL-3.0)</span>
            <ExternalLink className="w-4 h-4 text-muted" />
          </a>
        </div>
      </div>
    </div>
  );
};
