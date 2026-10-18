# Etapa 00: Faxina (Fase 0)

**Data:** 2026-10-17 · **Commit:** `9c47171`

## O que mudou

- **App em tela cheia no celular.** A moldura de aparelho só aparece no desktop (≥ 640 px),
  como preview.
- **DevHub isolado em `/devhub`** com carregamento sob demanda. O bundle do app caiu de
  mais de 800 KB para 318 KB (96 KB gzip).
- **Restos do AI Studio removidos:** `metadata.json`, `.aistudio/`, header `User-Agent`.
  O plano narrativo original foi arquivado em `docs/historico/`.
- README, `index.html` (pt-BR, título, descrição, `theme-color`) e `.env.example` reescritos.
- No perfil, o atalho "Ver código Kotlin" virou o liga/desliga de sons.

## Arquivos principais

- `src/App.tsx`: novo ponto de entrada (app ou DevHub conforme a rota)
- `src/DevHub.tsx`: antigo `App.tsx`
- `src/components/prototype/PrumoAppSimulator.tsx`: moldura responsiva

## Verificação

`tsc --noEmit` ✅ · `vite build` ✅ · prints em 390 px e 1280 px conferidos
