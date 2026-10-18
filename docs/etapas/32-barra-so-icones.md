# Etapa 32: barra só com ícones

**Pedido:** tirar o texto da barra de baixo para ela ficar mais baixa, tirar o círculo em volta da Início e deixar só um sinal de qual aba está aberta.

## O que mudou
- A barra agora tem só os ícones: Roteiro · Coach · **Início** (no meio, um pouco maior) · Caderno · Você.
- A altura caiu de 68px (mais a curva de 20px) para 56px. Sem o círculo, a curva também saiu.
- A aba aberta fica na cor principal, com o traço do ícone mais grosso e um tracinho embaixo.
- O nome de cada aba continua no `aria-label`, para leitor de tela e para os testes, e aparece como dica ao passar o mouse.
- Cada tela já tinha um título (Olá, Roteiro, Coach Prumo, Caderno). A tela **Você** ganhou o título "Você".

## Arquivos
- `src/app/screens/BottomNav.tsx`
- `src/app/screens/ProfileTab.tsx`

## Verificação
- 134 testes de unidade e 18 de ponta a ponta passando. Os testes acham as abas pelo nome, que agora vem do `aria-label`.
- Prints conferidos no tema claro e no escuro.
