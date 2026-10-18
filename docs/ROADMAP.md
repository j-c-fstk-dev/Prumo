# Roadmap do MVP Prumo

Plano por fases até o lançamento na Play Store. Cada etapa concluída ganha um registro
em [`docs/etapas/`](etapas/). As decisões de produto se apoiam em [`docs/pesquisa/`](pesquisa/).

**Branch de trabalho:** `claude/eager-clarke-ji5m9c`

## Decisões já tomadas

| Data | Decisão |
|---|---|
| 2026-10-17 | App como **PWA** (React). Android depois, via Capacitor ou TWA, sem reescrever o código |
| 2026-10-17 | Código Kotlin mantido apenas como referência em `/devhub` |
| 2026-10-17 | Pesquisa embasada **antes** das features; modo sequencial (uma frente por vez) |
| 2026-10-17 | Conta Play Console como **organização** (MEI + D-U-N-S): dispensa o teste com 12 testadores |
| 2026-10-17 | **Paywall pronto, mas desligado**; liga após período de teste dos primeiros usuários |
| 2026-10-17 | Provedor de IA **genérico** (Gemini, Claude ou API compatível com OpenAI, como Z.ai) |
| 2026-10-17 | Licença **AGPL-3.0-or-later** ([etapa 02](etapas/02-licenca.md)) |
| 2026-10-17 | Identidade **bússola + constelação** ([etapa 03](etapas/03-bussola-e-constelacao.md)) |
| 2026-10-17 | "Mapa humano" (astrologia/numerologia) → pós-MVP, opcional, antes da anamnese |

## Pendências do responsável

- [ ] Solicitar D-U-N-S e abrir conta de organização na Play Console (US$ 25, pagamento único)
- [ ] Escolher o provedor de IA (pode ficar para a Fase 2)
- [ ] Deixar o repositório público (necessário para a AGPL fazer sentido)
- [ ] Registrar a marca "Prumo" no INPI
- [ ] Criar e-mail de privacidade (canal exigido pela ANPD)
- [ ] Passar o nome do app de "mapa humano" para análise

## Fases

### Fase 0: Faxina ✅
Registro: [etapa 00](etapas/00-faxina.md)

### Pesquisa de base ✅
- [x] Frente 1: método de decisão
- [x] Frente 2: hábitos e engajamento
- [x] Frente 3: cores e tipografia (paleta "Pergaminho & Noite"; texto do app pequeno demais)
- [x] Frente 4: sons e movimento
- [x] Frente 5: citações com fonte (`src/data/citacoes.ts`)
- [x] Frente 6: concorrentes e freemium ("caminho grátis, aceleração paga")
- [x] Frente 7: LGPD e políticas da Play Store (checklist jurídico)

### Fase 1: Núcleo funcional ✅
Fechamento: [etapa 12](etapas/12-fim-da-fase-1.md)

- [x] Persistência local (IndexedDB) + app dividido em telas ([etapa 04](etapas/04-telas-e-persistencia.md))
- [x] Remover dados de exemplo fixos ([etapa 05](etapas/05-sem-dados-de-exemplo.md))
- [x] Motor de diagnóstico + hipótese/teste/sinal + 2 alternativas + pivô ([etapa 06](etapas/06-motor-de-diagnostico.md))
- [x] Campos abertos com confirmação + perda aceitável + obstáculo/plano B ([etapa 07](etapas/07-campos-abertos.md))
- [x] Tarefas do roteiro adaptadas ao formato e ao canal ([etapa 08](etapas/08-tarefas.md))
- [x] Tarefas pessoais (criar, editar, apagar, reordenar) + "quando vou fazer" ([etapa 08](etapas/08-tarefas.md))
- [x] Carta do eu futuro em duas vias, escrita pela pessoa ([etapa 09](etapas/09-carta-em-duas-vias.md))
- [x] Check-in diário, sequência gentil (descanso + remendo), acolhimento, linha do tempo e fim de capítulo ([etapa 10](etapas/10-ritmo-diario.md))
- [x] Estrutura de paywall com chave, desligada ([etapa 11](etapas/11-paywall.md))

### Fase 2: Backend no ar
- [x] Camada de IA genérica (etapa 01)
- [x] Deploy na Cloudflare: Worker + arquivos estáticos + publicação automática ([etapa 18](etapas/18-cloudflare.md)); falta você configurar token e secrets
- [x] Limite de uso por pessoa no servidor + registro de custo por chamada ([etapa 22](etapas/22-limite-de-uso.md))
- [x] Status honesto do coach + erros no log do servidor ([etapa 17](etapas/17-seguranca-do-coach-e-ci.md))
- [x] Testes ponta a ponta no repositório + CI no GitHub Actions ([etapa 17](etapas/17-seguranca-do-coach-e-ci.md))
- [x] Botão "denunciar resposta" no coach ([etapa 17](etapas/17-seguranca-do-coach-e-ci.md))
- [x] Protocolo de crise no servidor (CVV 188, SAMU 192) + aviso "não é terapia" ([etapa 17](etapas/17-seguranca-do-coach-e-ci.md))
- [x] Consentimento antes do 1º uso do coach; contexto mínimo e limites de tamanho ([etapa 17](etapas/17-seguranca-do-coach-e-ci.md))

### Fase 3: Alma e conteúdo
- [x] Splash da bússola + constelação de progresso ([etapa 03](etapas/03-bussola-e-constelacao.md))
- [x] Paleta "Pergaminho & Noite", tema claro/escuro e texto maior ([etapa 13](etapas/13-paleta-e-texto.md))
- [x] Alvos de toque (44/40 px) + duas velocidades de animação ([etapa 15](etapas/15-movimento-sons-citacoes.md))
- [x] Sons com ataque suave; sons de toque opcionais ([etapa 15](etapas/15-movimento-sons-citacoes.md))
- [x] Citações e cartões "Você sabia?" nas telas e na rotação diária ([etapa 15](etapas/15-movimento-sons-citacoes.md))
- [x] Ferramentas complementares em 3 camadas ([etapa 14](etapas/14-ferramentas.md)); **revisão trimestral** da caixa curada
- [x] Mensagens autocompassivas de retorno; convites de recomeço em datas-marco (feito na [etapa 10](etapas/10-ritmo-diario.md))
- [x] Micro-áudios com voz sintética do aparelho ([etapa 16](etapas/16-kit-e-voz.md)); voz humana fica para depois
- [x] Kit de execução: 5 modelos personalizados ([etapa 16](etapas/16-kit-e-voz.md))
- [ ] Ambiente sonoro de natureza opcional nas tarefas de foco (pesquisa 04): usar **gravações reais** com licença livre (CC0); a evidência é sobre sons naturais, não sintetizados

### Ajustes do 1º teste com usuários
Plano em 6 blocos: [etapa 19](etapas/19-ajustes-do-teste.md)
- [x] A: correções rápidas (âncora inteira, Salvar, texto livre, botão de segurar, "Pra hoje", ritmo mais calmo, voz desligada)
- [x] B1: apresentação inicial, blocos surgindo um por vez, telas de resultado/compromisso/carta, 90 dias e "Se travar, eu…" ([etapa 20](etapas/20-linguagem-parte-1.md))
- [x] B2: revisão dos textos restantes pelo [guia de voz](guia-de-voz.md) + telas que não rolavam ([etapa 21](etapas/21-linguagem-parte-2.md))
- [x] C: 3 caminhos diferentes + "Quero criar o meu" com ajuda da IA ([etapa 23](etapas/23-tres-caminhos-e-criar-o-meu.md))
- [x] D1: frases rotativas na anamnese, lembrete do dia pelo momento, citações trocando por dia ([etapa 24](etapas/24-frases-e-lembretes.md))
- [x] D2: 44 citações publicadas de autores de livros famosos, com fonte ([etapa 26](etapas/26-citacoes-de-livros.md)); falta uma pessoa conferir a pontuação clicando nos links
- [x] E: ilustração da abertura, música, comemoração "chuva de estrelas" e sons de sino mais delicados ([etapa 25](etapas/25-sons-abertura-e-comemoracao.md))
- [ ] F: mapa humano (opcional, depois do MVP)

### Caderno do projeto
- [x] Aba Caderno (ficha, anotações com etiquetas, notas por tarefa, exportar) + copiar/salvar respostas do coach ([etapa 27](etapas/27-caderno.md))
- [x] Pessoas (mini-CRM): etapas, próximo passo, mensagem pronta no WhatsApp/e-mail, agenda do Android e o teste "2 de 5" contado sozinho ([etapa 28](etapas/28-pessoas.md))

### Continuar usando depois de dar certo (plano em 4 fases)
- [x] 1. Pessoas (etapa 28)
- [ ] 2. Vendas e resultados: registrar vendas, painel do mês, marcos comemorados
- [ ] 3. Jornada "Crescer": ciclos mensais, revisão do mês, coach com números (nunca nomes)
- [ ] 4. Lista de contato do dia: uma pessoa por vez, sem envio em massa
- [ ] Backup na nuvem (com conta; junto da Fase 4 e do Premium)

### Fase 4: Jurídico e empacotamento
- [ ] Termos de uso + Política de privacidade (LGPD), com revisão jurídica — ver [checklist](pesquisa/07-lgpd-e-play-store.md#checklist-jurídico-do-mvp)
- [ ] "Exportar meus dados" e "Apagar tudo" nas configurações
- [ ] APK com API alvo 36 (Android 16)
- [ ] PWA instalável (manifest, service worker, ícones)
- [ ] Capacitor + GitHub Actions gerando o AAB assinado
- [ ] Notificações locais (1 por dia, horário escolhido)
- [ ] Voz sintética no Android: plugin nativo de text-to-speech (o WebView pode não ter Web Speech)

### Fase 5: Lançamento
- [ ] Landing page
- [ ] Ficha da Play Store (textos, prints, classificação etária)
- [ ] Métricas gratuitas (PostHog free / Umami)
- [ ] Teste com 10–20 pessoas reais antes de abrir

### Pós-MVP
- [ ] "Mapa humano" (nome e abordagem a definir)
- [ ] Login + sincronização (Supabase free)
- [ ] Ligar o paywall; parceiro de prumo / comunidade
