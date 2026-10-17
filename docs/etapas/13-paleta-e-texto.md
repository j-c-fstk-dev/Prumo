# Etapa 13: Paleta "Pergaminho & Noite", tema e texto maior (Fase 3, passo 1)

**Data:** 2026-10-17 · Base: [pesquisa 03](../pesquisa/03-cores-e-tipografia.md)

## Cores com nome e função

As cerca de 400 cores fixas espalhadas pelas telas viraram **tokens semânticos** (em `src/index.css`), cada um
com valor no tema claro e no escuro:

| Token | Função | Pergaminho (claro) | Noite (escuro) |
|---|---|---|---|
| `canvas` | fundo das telas | `#FBF8F2` | `#15122A` |
| `surface` / `surface-2` | cartões / caixas internas | `#FFFFFF` / `#F3EFF8` | `#211C3D` / `#2A2450` |
| `ink` / `muted` | texto / texto secundário | `#1E1B2E` / `#5E5873` | `#EDE8F7` / `#A9A2C2` |
| `line` | bordas | `#E4DDEC` | `#3A3360` |
| `primary` (+ `hover`, `soft`, `on-primary`) | botões, links, destaques | `#4B3F8C` índigo | `#B9A6FF` lavanda |
| `success` (+ `soft`) | conclusão | `#2F6B5E` sálvia | `#7FC8B2` |
| `gold` (+ `text`, `soft`, `line`, `ink`) | âncora, avisos, selos | dourados | dourados |

- **Contraste WCAG AA conferido** nas 18 combinações de uso de cada tema (36 no total), todas ≥ 4,5:1.
- No código, as classes ficam como `bg-primary`, `text-muted`, `border-line`... Mudar a marca no futuro é
  editar **um arquivo**.
- O cartão Premium do perfil virou um cartão "Noite" (céu + dourado), igual nos dois temas.

## Tema

- **Automático** (segue o celular) por padrão; o **claro é o melhor para leitura** (pesquisa 03).
- Perfil → "Tema": Automático → Pergaminho → Noite. Fica salvo no aparelho e também troca a cor da barra do navegador.

## Texto maior

Escala subida um degrau em todas as telas do app: 9/10 px → 12 px · 11 px → 13 px · 12 px → 14 px ·
14 px → 16 px · 16 px → 18 px.

| | Antes | Depois |
|---|---|---|
| Usos de texto ≤ 12 px | ~122 de ~143 (**85%**) | 33 de 224 (**15%**), só rótulos curtos |

## Verificação

- Tour de prints de 11 telas nos dois temas (boas-vindas, anamnese com sugestão, resultado, compromisso,
  cartas, home, roteiro, tarefa, coach, perfil): legível e sem quebra de layout ✅
- Correções achadas nos prints: o anel do compromisso ainda usava as cores antigas no SVG; a constelação
  ganhou borda sutil para não sumir no fundo noturno ✅
- `npm test` (52) ✅ · build ✅ · teste ponta a ponta completo ✅

## Ainda nesta fase

Alvos de toque de 48 px nos botões de ícone, duas velocidades de animação, sons com ataque suave,
citações nas telas e o kit de ferramentas (proposta em discussão).
