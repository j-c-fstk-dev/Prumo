# Etapa 39: página de apresentação, app em /app/ e políticas

## Endereços
| Endereço | O quê |
|---|---|
| `/` | Página de apresentação |
| `/app/` | O app (o ícone instalado abre aqui: `start_url` do manifesto) |
| `/privacidade/` | Política de privacidade (rascunho) |
| `/termos/` | Termos de uso (rascunho) |
| `/app/?devhub` | DevHub (guias Android de referência). Antes ficava em `/devhub` |

- O manifesto ganhou `"id": "/"`, para quem já instalou continuar com o mesmo app.
- Quem abre a raiz pelo ícone antigo (instalado quando o app ficava em `/`) é levado direto para `/app/`.
- O Vite passou a montar várias páginas (`index.html`, `app/index.html`, `privacidade/index.html`, `termos/index.html`).
- O service worker guarda cada página pelo próprio caminho.

## Apresentação
- Mesma identidade do app: céu da abertura com o bonequinho, paleta Pergaminho & Noite, Fraunces, bússola.
- Seções:
  - Abertura com "Abrir o Prumo".
  - Como funciona, em 3 passos com prints reais.
  - Coach e Caderno.
  - "É pra você?", com quem é e quem não é o público (e o CVV).
  - Seus dados.
  - Perguntas.
  - Convite final.
  - Rodapé com políticas, termos e código.
- Textos no guia de voz, sem promessa de renda.
- **Prints reais:** `npm run prints` refaz os 5 prints de `public/landing/` a partir do app (`scripts/prints.spec.ts`). Rode de novo quando as telas mudarem.

## No computador
O `/app/` aparece centralizado no tamanho de um celular, sem a barra "Preview Prumo", o relógio "09:41", o "5G" e o notch do protótipo. Os sons e o "apagar tudo" ficam na aba Você.

## Sobre o Prumo (aba Você)
Links para a página do Prumo, a política, os termos, o contato (quando houver e-mail) e o código-fonte, além da versão do app.

## Políticas: rascunho para revisão jurídica
- `src/landing/legal.tsx` descreve o que o código faz hoje:
  - o que fica no celular;
  - o que vai para o coach;
  - os contadores do limite de uso, apagados no dia seguinte;
  - a denúncia de resposta;
  - os registros de erro;
  - o Umami;
  - os provedores (Cloudflare, Z.ai, Umami) e a transferência internacional;
  - as bases legais e os direitos com o caminho no app;
  - a idade (18+).
- No topo das páginas aparece "Versão provisória, em revisão jurídica".
- **A preencher em `src/landing/site.ts`:** nome do responsável, CNPJ (se houver) e e-mail de privacidade. Enquanto estiverem vazios, as páginas mostram "[a preencher]" e o link de contato não aparece.
- **A confirmar:** país e termos de tratamento de dados da Z.ai.
- **Ao mudar o que o app coleta, atualize a política junto.**
