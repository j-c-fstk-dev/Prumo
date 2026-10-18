# Etapa 30: Proteger os dados no aparelho (app instalável, armazenamento persistente e backup)

**Data:** 2026-10-18

## O problema (confirmado)
- **Safari/iPhone:** o WebKit apaga tudo o que um site guardou (inclusive IndexedDB, onde fica o Prumo)
  depois de **7 dias de uso do Safari sem interação com o site**. Sites **adicionados à Tela de Início**
  são exceção ([WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/)).
- **Chrome:** decide sozinho se concede o armazenamento persistente (protege contra limpeza por falta de
  espaço); app instalado pesa a favor ([web.dev: Storage for the web](https://web.dev/articles/storage-for-the-web)).
- Há relato (não confirmado pelo WebKit) de que o pedido de persistência **não** protege da regra dos 7
  dias no Safari. Por isso o caminho principal é **instalar o app**.

## O que entrou
| Item | O quê |
|---|---|
| **App instalável** | `manifest.webmanifest` (nome, tela cheia, cores da abertura), ícones PNG 192/512, versão "maskable" (bússola dentro da área segura do Android) e ícone do iPhone (180), gerados a partir do ícone da bússola; meta tags do iOS |
| **Persistência** | Ao terminar o onboarding, o app pede ao navegador para não apagar os dados (`navigator.storage.persist()`) |
| **Convite no Início** | "Instale o Prumo na tela de início…" com **Instalar** (Chrome, quando o navegador oferece) ou **Como instalar** (passo a passo do iPhone ou do Android). "Agora não" esconde por 7 dias. Some quando o app já está instalado |
| **Cartão "Proteja seus dados"** (aba Você) | 1) instalar (com aviso específico do iPhone), 2) se o armazenamento está protegido, 3) data da última cópia e botão **Exportar caderno** |
| **Lembrete de backup no Caderno** | Se há conteúdo e nunca exportou, ou faz mais de 14 dias |

Fora do escopo por enquanto: service worker (funcionar sem internet). Não é preciso para instalar nem
para proteger os dados, e um cache mal feito pode prender a pessoa numa versão velha do app.

## Testes
- Detecção do aparelho (iPhone, Android, outro)
- Ponta a ponta: manifesto e todos os ícones respondem, convite aparece, "Como instalar" mostra o passo a
  passo, "Agora não" esconde e continua escondido depois de recarregar, cartão no Perfil
- Worker local: manifesto servido como `application/manifest+json`, ícones como `image/png`
