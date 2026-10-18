# Etapa 29: Barra de baixo nova e o coach escrevendo mensagens para as pessoas

**Data:** 2026-10-18 · Ordem aprovada: barra → coach nas mensagens → proteção dos dados → fotos no Caderno

## Barra de baixo
- Ordem: **Roteiro · Coach · (Início) · Caderno · Você**.
- **Início no meio**, num círculo maior (56 px) e um pouco elevado; preenchido quando está ativa.
- A borda de cima faz uma **curva suave** que abraça o círculo, desenhada em SVG com as cores do tema
  (claro e escuro conferidos em captura de tela). Os outros ícones mantêm o tamanho e a área de toque.

## "✨ Pedir ajuda ao coach" em cada pessoa
- Abre uma janela: a pessoa conta um contexto, se quiser ("ela disse que está sem tempo"), e toca em
  **Pedir sugestão**. Volta uma mensagem curta de WhatsApp, com os botões **Usar esta** (vai para a
  mensagem da pessoa, pronta para abrir no WhatsApp ou e-mail), **Outra** e **Copiar**.
- **Privacidade:** a IA recebe só a etapa da conversa, o que a pessoa oferece, pra quem, e o contexto
  digitado. **Nunca o nome, o telefone ou o e-mail do contato**: a IA escreve "[nome]" e o app troca pelo
  primeiro nome no próprio celular. Um teste ponta a ponta confere o pedido enviado.
- Se o consentimento do coach ainda não foi dado, a janela explica o que vai e o que não vai antes.
- Conta no limite diário do coach; crise, limite e IA fora do ar têm avisos próprios.
- Rota nova no servidor: `/api/coach/message` (Worker e servidor local).

## Testes
- 3 testes de regra novos (nada do contato vai para a IA, etapa inválida/limite/crise/sem IA, limpeza
  do texto)
- Novo teste ponta a ponta com a IA simulada: sugestão com o nome trocado no aparelho, "Usar esta",
  link do WhatsApp com o texto e conferência de que o pedido não leva nome nem telefone
