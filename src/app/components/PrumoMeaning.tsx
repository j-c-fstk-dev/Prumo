import React from 'react';

/**
 * O que é prumo (etapa 45). Usado na apresentação inicial e no guia do app.
 * O fio de prumo é uma das ferramentas mais antigas da construção: a gravidade puxa o peso
 * sempre para o centro da Terra, então o fio mostra a vertical de verdade.
 */
export const PrumoMeaning: React.FC = () => (
  <>
    É uma das ferramentas mais antigas do pedreiro: <strong className="text-ink">um fio com um peso na ponta</strong>. A gravidade puxa o peso sempre
    para baixo, e o fio esticado mostra a linha reta de verdade.
    <br />
    <br />
    Antes de subir cada fileira de tijolos, o pedreiro confere o prumo. Assim a parede sobe firme, sem entortar. Daí vem o &quot;estar no prumo&quot;:
    estar alinhado, em equilíbrio.
    <br />
    <br />
    Aqui, o prumo é a sua referência: <strong className="text-ink">a direção que você escolheu</strong>, pra conferir a cada passo. Tijolo por tijolo,
    passo por passo.
  </>
);
