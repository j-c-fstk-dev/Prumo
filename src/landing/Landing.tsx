import React from 'react';
import { ArrowRight, Check, Download, Lock, X } from 'lucide-react';
import { Seeker } from '../components/brand/Seeker';
import { Starfield } from '../components/brand/CompassSplash';
import { CompassMark } from '../components/brand/CompassMark';
import { track } from '../utils/telemetry';
import { APK_URL, isApk, platform } from '../utils/install';
import { SiteFooter } from './SiteFooter';

/**
 * Página de apresentação (etapa 39). Mesma identidade do app (Pergaminho & Noite, Fraunces, a bússola
 * e o bonequinho), prints reais e textos no guia de voz: sem promessa de renda.
 */

const APP_URL = '/app/';

const OpenApp: React.FC<{ where: string; className?: string; children?: React.ReactNode }> = ({ where, className = '', children }) => (
  <a
    href={APP_URL}
    onClick={() => track('apresentacao_abrir_app', { onde: where })}
    className={`inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl font-semibold text-base shadow-md transition-transform active:scale-[0.98] ${className}`}
    style={{ background: 'var(--gold)', color: 'var(--night-900)' }}
  >
    {children ?? 'Abrir o Prumo'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
  </a>
);

/** Baixar o app Android: some no iPhone (não instala .apk) e dentro do próprio app */
const DownloadApk: React.FC<{ where: string }> = ({ where }) =>
  platform() === 'ios' || isApk() ? null : (
    <a
      href={APK_URL}
      onClick={() => track('apresentacao_baixar_apk', { onde: where })}
      className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-xl font-semibold text-base border transition-transform active:scale-[0.98]"
      style={{ borderColor: 'rgba(227,184,96,.55)', color: 'var(--gold)' }}
    >
      <Download className="w-4 h-4" aria-hidden="true" /> Baixar para Android
    </a>
  );

/** Print real do app numa moldura simples de celular */
const Phone: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => (
  <div className={`shrink-0 rounded-[30px] p-[6px] bg-[#15122A] shadow-xl ring-1 ring-black/10 ${className}`}>
    <img src={src} alt={alt} width={390} height={844} loading="lazy" decoding="async" className="block w-full h-auto rounded-[24px]" />
  </div>
);

const STEPS = [
  {
    n: '1',
    title: 'Responda umas perguntas',
    text: 'Sobre o que você já sabe fazer, quanto tempo tem e como prefere aparecer. Leva uns 15 minutos, e dá pra escrever com as suas palavras.',
    img: '/landing/perguntas.jpg',
    alt: 'Tela de pergunta do Prumo com opções para escolher',
  },
  {
    n: '2',
    title: 'Veja 3 caminhos pra testar',
    text: 'O que oferecer, pra quem e onde achar essas pessoas. Você escolhe um, troca depois se quiser, ou cria o seu.',
    img: '/landing/resultado.jpg',
    alt: 'Resultado do Prumo com o caminho sugerido, o que oferecer e pra quem',
  },
  {
    n: '3',
    title: 'Siga um passo de cada vez',
    text: 'Um roteiro de 13 semanas, em 4 capítulos: passos pequenos e rotinas curtas que se repetem. Cada passo vira uma estrela da sua constelação.',
    img: '/landing/inicio.jpg',
    alt: 'Tela de início do Prumo com o check-in do dia e o próximo passo',
  },
];

const FEATURES = [
  {
    title: 'Um coach pra destravar',
    text: 'Pergunte quando travar numa tarefa. O coach usa inteligência artificial, conhece o seu caminho e responde curto. Não é terapia, e diz isso.',
    img: '/landing/coach.jpg',
    alt: 'Conversa com o coach do Prumo',
  },
  {
    title: 'Um caderno pro seu projeto',
    text: 'Ficha do que você oferece, anotações com fotos e a lista de pessoas com quem você vai conversar, com mensagem pronta pro WhatsApp.',
    img: '/landing/pessoas.jpg',
    alt: 'Lista de pessoas no caderno do Prumo, com a etapa de cada uma',
  },
];

const FOR = ['Quer testar uma ideia de renda no digital sem largar tudo', 'Tem pouco tempo e precisa de passos pequenos', 'Já tentou sozinho e travou em "por onde começo?"'];
const NOT_FOR = ['Quer uma fórmula de dinheiro rápido', 'Procura um curso longo pra assistir', 'Está passando por um momento difícil e precisa de apoio profissional'];

const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: 'Quanto custa?', a: 'Nada, durante a fase de testes. Quando houver plano pago, o roteiro continua grátis, e você vai saber antes de qualquer cobrança.' },
  {
    q: 'Precisa instalar?',
    a: 'Não. Abre no navegador do celular. Se quiser, dá pra colocar na tela de início, como um app, e isso ajuda a proteger os seus dados.',
  },
  {
    q: 'Onde ficam as minhas respostas?',
    a: 'No seu celular. O Prumo não tem cadastro nem guarda as suas respostas em servidor. Você pode exportar o caderno ou apagar tudo quando quiser.',
  },
  {
    q: 'A inteligência artificial vê os meus contatos?',
    a: 'Não. Quando você pede ajuda ao coach, vai só o necessário pra ele responder: o seu caminho, a tarefa e o que você digitou. Nome, telefone e e-mail das pessoas nunca saem do celular.',
  },
  { q: 'Funciona sem internet?', a: 'Depois da primeira visita, sim. Só o coach precisa de internet.' },
  { q: 'Garante que eu vou ganhar dinheiro?', a: 'Não, e desconfie de quem garante. O Prumo ajuda você a fazer uma aposta pequena, testar com pessoas reais e decidir com o que aprendeu.' },
];

export const Landing: React.FC = () => (
  <div className="min-h-[100dvh] bg-canvas text-ink">
    {/* Topo */}
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-display font-bold text-xl" style={{ color: 'var(--night-text)' }}>
          <CompassMark size={28} tone="night" /> Prumo
        </span>
        <a href={APP_URL} onClick={() => track('apresentacao_abrir_app', { onde: 'topo' })} className="text-sm font-semibold px-3 py-2 rounded-lg" style={{ color: 'var(--gold)' }}>
          Abrir o app
        </a>
      </div>
    </header>

    {/* Abertura: o mesmo céu do app */}
    <section className="relative overflow-hidden bg-night-sky" style={{ color: 'var(--night-text)' }}>
      <Starfield count={34} seed={11} maxRadius={0.16} opacity={0.75} />
      <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-14 sm:pt-28 sm:pb-20 grid sm:grid-cols-[1.1fr_1fr] gap-8 items-center">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider mb-4 px-2.5 py-1 rounded-full border" style={{ color: 'var(--gold)', borderColor: 'rgba(227,184,96,.4)' }}>
            Fase de testes · grátis
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight">Ache o seu caminho no digital.</h1>
          <p className="mt-4 text-lg leading-relaxed max-w-[34ch]" style={{ color: 'var(--night-muted)' }}>
            Em uns 15 minutos você descobre o que oferecer, pra quem e por onde começar. Depois, o Prumo te acompanha em passos pequenos por 90 dias.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <OpenApp where="abertura" />
            <DownloadApk where="abertura" />
            <a href="#como-funciona" className="min-h-12 px-4 inline-flex items-center text-sm font-semibold" style={{ color: 'var(--night-text)' }}>
              Como funciona
            </a>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--night-muted)' }}>
            Sem cadastro. Abre no navegador do celular ou como app no Android (.apk).
          </p>
        </div>
        <div className="flex justify-center sm:justify-end" aria-hidden="true">
          <Seeker size={280} />
        </div>
      </div>
    </section>

    {/* Como funciona */}
    <section id="como-funciona" className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
      <h2 className="font-display text-3xl font-bold tracking-tight">Como funciona</h2>
      <p className="mt-2 text-muted max-w-[52ch]">Três passos. Nenhum exige experiência com internet, só vontade de testar.</p>
      <ol className="mt-10 grid gap-12 sm:grid-cols-3 sm:gap-8">
        {STEPS.map((s) => (
          <li key={s.n} className="flex flex-col gap-4">
            <Phone src={s.img} alt={s.alt} className="w-[200px] sm:w-[220px] self-center sm:self-start" />
            <div>
              <span className="font-display text-2xl font-bold text-primary">{s.n}.</span>
              <h3 className="text-lg font-bold mt-1">{s.title}</h3>
              <p className="mt-1 text-[15px] text-muted leading-relaxed">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    {/* O que vem junto */}
    <section className="bg-surface border-y border-line">
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 space-y-16">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`flex flex-col gap-8 items-center sm:flex-row ${i % 2 ? 'sm:flex-row-reverse' : ''}`}>
            <Phone src={f.img} alt={f.alt} className="w-[210px] sm:w-[240px]" />
            <div className="max-w-[46ch]">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{f.title}</h2>
              <p className="mt-3 text-[16px] text-muted leading-relaxed">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Pra quem é */}
    <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
      <h2 className="font-display text-3xl font-bold tracking-tight">É pra você?</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="p-5 rounded-2xl border border-line bg-surface">
          <h3 className="font-bold">É pra quem…</h3>
          <ul className="mt-3 space-y-2.5">
            {FOR.map((t) => (
              <li key={t} className="flex gap-2.5 text-[15px] leading-snug">
                <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 rounded-2xl border border-line bg-surface">
          <h3 className="font-bold">Não é pra quem…</h3>
          <ul className="mt-3 space-y-2.5">
            {NOT_FOR.map((t) => (
              <li key={t} className="flex gap-2.5 text-[15px] leading-snug text-muted">
                <X className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Se você não está bem, o CVV atende de graça, 24 horas: ligue <a href="tel:188" className="font-semibold text-ink underline">188</a>.
          </p>
        </div>
      </div>
    </section>

    {/* Seus dados */}
    <section className="max-w-5xl mx-auto px-4 pb-16 sm:pb-20">
      <div className="p-6 sm:p-8 rounded-2xl bg-primary-soft border border-primary/25 flex flex-col sm:flex-row gap-4 sm:items-start">
        <Lock className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Seus dados ficam com você</h2>
          <p className="mt-2 text-[15px] leading-relaxed max-w-[60ch]">
            Respostas, cartas, anotações e contatos ficam guardados no seu celular, não num servidor nosso. O coach recebe só o mínimo pra responder, e
            nunca o nome ou o contato das pessoas da sua lista. O código do Prumo é aberto: qualquer pessoa pode conferir.
          </p>
          <a href="/privacidade/" className="inline-block mt-3 text-sm font-semibold text-primary underline underline-offset-2">
            Ler a política de privacidade
          </a>
        </div>
      </div>
    </section>

    {/* Perguntas */}
    <section className="max-w-3xl mx-auto px-4 pb-16 sm:pb-20">
      <h2 className="font-display text-3xl font-bold tracking-tight">Perguntas</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {FAQ.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold">
              {f.q}
              <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 text-[15px] text-muted leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>

    {/* Convite final */}
    <section className="relative overflow-hidden bg-night-sky" style={{ color: 'var(--night-text)' }}>
      <Starfield count={20} seed={3} maxRadius={0.16} opacity={0.75} />
      <div className="relative max-w-5xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <CompassMark size={56} tone="night" />
        <h2 className="font-display text-3xl font-bold tracking-tight">Bora dar o primeiro passo?</h2>
        <p style={{ color: 'var(--night-muted)' }}>São uns 15 minutos. Você sai sabendo o que testar primeiro.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <OpenApp where="final">Começar agora</OpenApp>
          <DownloadApk where="final" />
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
);
