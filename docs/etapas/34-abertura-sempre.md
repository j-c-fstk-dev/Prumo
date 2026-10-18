# Etapa 34: abertura completa toda vez

**Pedido:** mostrar a animação do bonequinho toda vez que o app abre, no navegador e no celular, seguida da bússola, e só depois entrar em "Ache o seu caminho" ou na Início.

## Como ficou
1. **Cena 1 (~3,2s):** o bonequinho no morro, com a bússola acesa, e a constelação se desenhando. Embaixo, "Prumo · encontre seu norte".
2. **Cena 2 (~1,7s):** a bússola aparece e a agulha se assenta no norte.
3. **Entrada:** a abertura some e a pessoa cai na tela certa: "Ache o seu caminho" se ainda não fez o diagnóstico, a Início se já fez.

- **1ª abertura:** na cena 2 aparece "Toque para começar". O navegador só deixa tocar a música depois de um toque, então ela continua tocando só nessa vez.
- **Aberturas seguintes:** entra sozinha depois de ~5s. Um toque em qualquer lugar pula a abertura.

Antes, o bonequinho só aparecia na 1ª vez, e nas outras aberturas entrava só a bússola rápida.

## Arquivos
- `src/components/brand/CompassSplash.tsx`
- `e2e/helpers.ts`: novo `passSplash`, que espera a abertura (ou toca o botão) depois de abrir ou recarregar o app. Os testes usam ele depois de cada recarga.

## Verificação
138 testes de unidade e 19 de ponta a ponta passando, mais prints das duas cenas.
