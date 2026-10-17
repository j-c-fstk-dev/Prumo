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

### Fase 1: Núcleo funcional
- [x] Persistência local (IndexedDB) + app dividido em telas ([etapa 04](etapas/04-telas-e-persistencia.md))
- [x] Remover dados de exemplo fixos ([etapa 05](etapas/05-sem-dados-de-exemplo.md))
- [x] Motor de diagnóstico + hipótese/teste/sinal + 2 alternativas + pivô ([etapa 06](etapas/06-motor-de-diagnostico.md))
- [x] Campos abertos com confirmação + perda aceitável + obstáculo/plano B ([etapa 07](etapas/07-campos-abertos.md))
- [ ] Tarefas do roteiro adaptadas ao formato do produto (serviço / sessão / guia / curso)
- [ ] Tarefas pessoais + editar/reordenar tarefas do plano + campo "Quando vou fazer"
- [ ] Carta do eu futuro: rascunho editável + resposta escrita pelo usuário
- [ ] Sequência gentil (descanso + remendo), check-in diário, linha do tempo de conquistas
- [ ] Estrutura de paywall com feature flags (desligada)

### Fase 2: Backend no ar
- [x] Camada de IA genérica (etapa 01)
- [ ] Deploy gratuito (Cloudflare / Vercel / Render)
- [ ] Limite de uso por usuário (rate limit) e proteção da chave
- [ ] Logs de erro do coach visíveis (o fallback não pode esconder falhas)
- [ ] Botão "denunciar resposta" no coach (política de IA generativa da Play)
- [ ] Protocolo de crise no coach (CVV 188) + aviso "não é terapia"
- [ ] Consentimento destacado antes do 1º uso do coach; enviar só o contexto mínimo

### Fase 3: Alma e conteúdo
- [x] Splash da bússola + constelação de progresso ([etapa 03](etapas/03-bussola-e-constelacao.md))
- [ ] Paleta e tipografia (frente 3), sons (frente 4), citações (frente 5)
- [ ] Mensagens autocompassivas de retorno; convites de recomeço em datas-marco
- [ ] Áudios reais nos micro-áudios

### Fase 4: Jurídico e empacotamento
- [ ] Termos de uso + Política de privacidade (LGPD), com revisão jurídica — ver [checklist](pesquisa/07-lgpd-e-play-store.md#checklist-jurídico-do-mvp)
- [ ] "Exportar meus dados" e "Apagar tudo" nas configurações
- [ ] APK com API alvo 36 (Android 16)
- [ ] PWA instalável (manifest, service worker, ícones)
- [ ] Capacitor + GitHub Actions gerando o AAB assinado
- [ ] Notificações locais (1 por dia, horário escolhido)

### Fase 5: Lançamento
- [ ] Landing page
- [ ] Ficha da Play Store (textos, prints, classificação etária)
- [ ] Métricas gratuitas (PostHog free / Umami)
- [ ] Teste com 10–20 pessoas reais antes de abrir

### Pós-MVP
- [ ] "Mapa humano" (nome e abordagem a definir)
- [ ] Login + sincronização (Supabase free)
- [ ] Ligar o paywall; parceiro de prumo / comunidade
