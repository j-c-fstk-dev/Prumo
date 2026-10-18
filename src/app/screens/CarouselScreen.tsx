import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { CompassMark } from '../../components/brand/CompassMark';
import { useApp } from '../state/AppStore';
import { Reveal } from '../components/Reveal';

/** Apresentação inicial (etapa 20): o que é prumo, a constelação, como funciona e "é só o começo". */
const SLIDES: { icon: React.ReactNode; title: string; body: React.ReactNode }[] = [
  {
    icon: <CompassMark size={44} />,
    title: 'Mas afinal, o que é prumo?',
    body: (
      <>
        Sabe aquele fio com um peso na ponta que o pedreiro usa pra deixar a parede reta? <strong className="text-ink">Isso é um prumo.</strong>
        <br />
        <br />
        Aqui, ele é a sua direção: o próximo passo certo quando tudo parece meio torto.
      </>
    ),
  },
  {
    icon: '✨',
    title: 'Cada passo acende uma estrela',
    body: (
      <>
        Toda vez que você faz uma tarefa, uma estrela acende no seu céu.
        <br />
        <br />
        Com o tempo, elas se ligam e viram a sua <strong className="text-ink">constelação</strong>: o desenho de tudo o que você já caminhou.
      </>
    ),
  },
  {
    icon: '🗺️',
    title: 'Como funciona',
    body: (
      <ol className="text-left space-y-2.5 list-none">
        <li><strong className="text-ink">1.</strong> Você responde umas perguntas rápidas sobre você (uns 15 minutos).</li>
        <li><strong className="text-ink">2.</strong> O Prumo sugere um caminho pra você testar no digital.</li>
        <li><strong className="text-ink">3.</strong> Você segue uma jornada de 90 dias em 4 capítulos, com passos pequenos e rotinas curtas, no seu ritmo: um por dia já é ótimo, e dá pra fazer mais se quiser.</li>
      </ol>
    ),
  },
  {
    icon: '🌱',
    title: 'E isso é só o começo',
    body: (
      <>
        A cada capítulo, novos passos aparecem. Tem um coach pra tirar dúvidas e, se algo não funcionar, você ajusta o caminho sem culpa.
        <br />
        <br />
        <strong className="text-ink">Dê uns dias pra ele.</strong> É no caminhar que as coisas vão ficando claras.
      </>
    ),
  },
];

export const CarouselScreen: React.FC = () => {
  const { actions } = useApp();
  const [slide, setSlide] = useState(0);
  const last = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  const start = () => {
    soundEffects.playTransition();
    actions.startAnamnese();
    actions.go('value_signal');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 select-none overflow-y-auto animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => {
                soundEffects.playSoftTap();
                setSlide(i);
              }}
              aria-label={`Ir para: ${s.title}`}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${slide === i ? 'w-6 bg-primary' : 'w-2 bg-line'}`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            soundEffects.playSoftTap();
            actions.startAnamnese();
            actions.go('value_signal');
          }}
          className="min-h-11 px-2 text-sm text-muted hover:text-ink transition-colors cursor-pointer"
        >
          Pular
        </button>
      </div>

      <div key={`slide-${slide}`} className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <Reveal i={0}>
          <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto mb-4 text-3xl">
            {current.icon}
          </div>
        </Reveal>
        <Reveal i={1}>
          <h3 className="text-2xl font-bold font-display text-ink mb-3">{current.title}</h3>
        </Reveal>
        <Reveal i={2}>
          <div className="text-base text-muted leading-relaxed max-w-[290px] mx-auto">{current.body}</div>
        </Reveal>
      </div>

      <div className="pb-4">
        <button
          onClick={() => {
            if (last) return start();
            soundEffects.playTransition();
            setSlide((s) => s + 1);
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{last ? 'Bora começar' : 'Próximo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
