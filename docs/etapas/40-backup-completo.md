# Etapa 40: backup completo e restaurar

**Pedido:** dar para restaurar o que foi exportado, por exemplo ao trocar de celular, e não só ler.

## Antes
O "Exportar caderno" gerava um texto para ler, mais as fotos. Não dava para restaurar, e ficavam de fora as respostas, o resultado, as cartas, as tarefas e os check-ins.

## Fazer backup
- **Onde:** aba Você → "Fazer backup". O "Exportar" do Caderno faz o mesmo.
- **O que gera:** sempre um arquivo `prumo-backup-AAAA-MM-DD.zip` com:
  - `caderno-prumo.txt`: o texto legível de sempre;
  - `fotos/`: as fotos;
  - `prumo-backup.json`: **tudo** o que o app guarda (formato `prumo-backup`, versão 1), menos o id do aparelho.
- Tudo é gerado no próprio celular: nada passa por servidor.

## Restaurar
- **Onde:**
  - aba Você → "Restaurar de um backup";
  - na tela de boas-vindas, em "Já usa o Prumo? Restaurar um backup", para quem chega num celular novo.
- **Aceita** o `.zip` ou só o `.json`. Reconhece o .zip pelo conteúdo, não pelo nome, porque arquivos vindos do Drive ou do WhatsApp podem perder a extensão.
- **Mostra um resumo antes:** data, nome, tarefas, check-ins, anotações, pessoas e fotos.
- **Só substitui depois de confirmar**, avisando que não dá para desfazer. Não mistura com o que já está no celular, porque isso geraria duplicatas.
- **Checagens:**
  - o formato e a versão do arquivo;
  - a mesma conferência de quando o app abre (`migrate`);
  - o tamanho máximo, de 150 MB.

  Um arquivo que não é backup do Prumo é recusado com uma explicação. Um backup de versão mais nova pede para atualizar o app.
- **Backups antigos**, só com o texto, não dão para restaurar. A mensagem pede um backup novo.

## Arquivos
- `src/domain/backup.ts` (+ testes): montar, conferir e resumir o backup.
- `src/app/components/useBackup.ts`: gerar o .zip e ler o arquivo escolhido.
- `src/app/components/RestoreBackup.tsx`: escolher o arquivo, ver o resumo e confirmar.
- `AppStore`: `snapshot()` e `restoreBackup()`.

## Junto
- O "Sobre" agora mostra **Nossa história**, **Instagram** e **TikTok** como "em breve" até os dados serem preenchidos em `src/landing/site.ts`.
- O rodapé da página de apresentação mostra Contato, Instagram e TikTok do mesmo jeito.

## Verificação
- Teste de ponta a ponta com a ida e volta completa:
  1. Faz o backup com uma foto.
  2. Apaga tudo.
  3. Tenta um arquivo errado e ele é recusado.
  4. Restaura pela tela de boas-vindas.
  5. Confere que a anotação, a foto e a pessoa voltaram.
- 144 testes de unidade e 24 de ponta a ponta.
