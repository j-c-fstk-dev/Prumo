# Etapa 37: apagar meus dados e abrir sem internet

Primeiro item da lista "antes de apresentar como produto".

## Apagar todos os meus dados (LGPD)
- Fica na aba **Você**, no fim: **"Apagar todos os meus dados"**.
- Pede confirmação. Diz o que some (respostas, resultado, cartas, tarefas, Caderno com pessoas e fotos, preferências), que não dá para desfazer, e lembra de usar antes o **Exportar caderno**.
- Apaga o banco do aparelho (IndexedDB, inclusive as fotos) e as preferências do `localStorage` que começam com `prumo_`, e volta para a tela inicial.
- Antes, só existia o "Reiniciar" da moldura de preview no computador.

## Abrir sem internet (service worker)
- `public/sw.js`, registrado só no site publicado (`import.meta.env.PROD`).
- **Páginas:** tenta a rede primeiro, para pegar a versão nova logo, e sem sinal usa a última guardada.
- **Arquivos do app e fontes:** usa o que está guardado e atualiza por trás. Os arquivos têm hash no nome, então uma versão nova nunca mistura com a antiga.
- **`/api` (coach) nunca passa pelo service worker.** Sem internet, o coach já responde em modo offline, como antes.
- Os dados da pessoa continuam no IndexedDB e não dependem do cache.
- **Requisito para a Play Store:** é o que permite empacotar o app como APK (TWA).

## Verificação
- Teste novo de ponta a ponta: apagar pede confirmação, "Cancelar" não apaga, e depois de apagar nada do estado antigo fica salvo.
- Modo sem internet testado à mão com o build de produção (`vite preview` + Playwright): 1ª visita online, recarregar sem rede, o app abre normalmente.
- 138 testes de unidade e 21 de ponta a ponta.
