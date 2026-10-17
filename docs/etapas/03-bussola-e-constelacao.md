# Etapa 03: Bússola, splash e constelação

**Data:** 2026-10-17 · Base: [pesquisa 04](../pesquisa/04-sons-e-movimento.md) e [03](../pesquisa/03-cores-e-tipografia.md)

## O que foi feito

| Componente | Arquivo | Onde aparece |
|---|---|---|
| **Bússola da marca** (SVG próprio; agulha `settle` / `seek` / `still`) | `src/components/brand/CompassMark.tsx` | boas-vindas, tela de cálculo |
| **Splash** com céu estrelado e agulha que oscila e se assenta no norte | `src/components/brand/CompassSplash.tsx` | abertura do app |
| **Constelação do capítulo**: cada tarefa concluída acende uma estrela, ligada à anterior | `src/components/brand/Constellation.tsx` | home, acima do próximo passo |
| Tokens da paleta "Noite" + animações | `src/index.css` | — |
| Favicon da bússola | `public/favicon.svg` | aba do navegador |

### Regras de comportamento
- **Splash:** ritual completo de cerca de 2,6 s na **1ª abertura**; cerca de 0,9 s nas seguintes. Um toque pula.
- **Tela de cálculo:** a agulha **procura** enquanto o cálculo roda e **se assenta** quando o diagnóstico fica pronto.
- **Constelação:** estrela acesa em dourado; a próxima pulsa em lavanda; as que faltam aparecem como contorno.
  A animação de "acender" só toca na estrela recém-concluída.
- **`prefers-reduced-motion`:** tudo fica estático (WCAG 2.3.3).

## Verificação

`tsc --noEmit` ✅ · prints da splash (1ª abertura e retorno), da home, da tarefa concluída
(estrela acendendo e linha desenhada) e do modo de movimento reduzido ✅

## Próximos passos deste tema (quando)

| O quê | Quando | Por quê esperar |
|---|---|---|
| Aplicar a paleta "Pergaminho & Noite" em todas as telas | Fase 3 | O simulador (cerca de 2.000 linhas num arquivo só) será dividido em telas na Fase 1; recolorir antes seria trabalho dobrado |
| Transições de tela em 2 velocidades (dia a dia × rituais) | Fase 3 | Idem |
| Fim de capítulo: constelação completa brilha e ganha nome | Fase 1 (junto com capítulos reais) | Depende da persistência do progresso |
| Splash nativa do Android (ícone animado) | Fase 4 (Capacitor) | Só existe no app empacotado |
| Ícone do app e ícones PWA (512/192 px) | Fase 4 | Junto do manifest |
