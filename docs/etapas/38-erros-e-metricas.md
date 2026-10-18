# Etapa 38: registro de erros e métricas

## Erros → logs do Cloudflare
- `src/utils/telemetry.ts` captura erros não tratados, promessas rejeitadas e telas que quebram (`ErrorBoundary`).
- Envia para `POST /api/log`: tipo, mensagem técnica, 4 linhas da pilha, arquivo e linha, tela atual, versão e se o app está instalado.
- **Antes de enviar**, o app corta os textos e troca o que parece e-mail ou telefone por `[email]` / `[numero]`. No máximo 5 erros diferentes por sessão.
- O servidor (`server/log.ts`) aceita só esses campos, com tamanho máximo, e escreve uma linha `{"type":"client_error",...}` no log.
- **Onde ver:** Cloudflare → Workers & Pages → prumo → Logs. Filtre por `client_error`. As denúncias do coach aparecem como `coach_report`.
- **Tela de erro:** se uma tela quebrar, aparece "Algo saiu do prumo por aqui", avisando que os dados continuam salvos, com um botão "Recarregar".

## Métricas → Umami (cloud.umami.is)
- Script do Umami no app e na apresentação, com `data-domains="prumo.jardimdofazer.com.br"`: só conta no site publicado, nunca nos testes nem em desenvolvimento.
- Sem cookies, e nunca com texto da pessoa. Eventos:

| Evento | Quando | Dado extra |
|---|---|---|
| `app_aberto` | ao abrir o app depois de começar a jornada | `dia` (dia da jornada) |
| `diagnostico_concluido` / `caminho_trocado` | resultado salvo | `caminho` (categoria do produto) |
| `jornada_iniciada` | fim do compromisso | |
| `carta_selada` | cartas seladas | |
| `tarefa_concluida` | tarefa do roteiro feita | `capitulo` |
| `checkin` | check-in do dia | `humor` |
| `coach_mensagem` | mensagem ao coach | |
| `pessoa_adicionada`, `mensagem_enviada` | Caderno → Pessoas | `canal` (whatsapp/email) |
| `caderno_exportado` | exportou o caderno | |
| `apresentacao_abrir_app` | clique em "Abrir" na apresentação | `onde` |

- **Retorno no dia 2 e no dia 7:** no Umami, Eventos → `app_aberto` → filtre pela propriedade `dia`.

## Versão
`package.json` passou a ter a versão `0.9.0` (fase de testes). Ela aparece no "Sobre" e nos registros de erro.
