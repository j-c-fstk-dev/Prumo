# Etapa 36: enviar a mensagem sem procurar

**Pedido:** não estava claro onde ficava a mensagem para WhatsApp ou e-mail, nem onde enviar a partir do modal do coach.

## Antes
- O envio era um link pequeno de texto, igual a "Editar" e "Apagar".
- Ele só aparecia depois de abrir "Mensagem pronta".
- No modal do coach não havia envio: era preciso tocar em "Usar esta", o modal fechava, e só então achar o link na ficha.
- O modal abria preso ao topo da área que rola, então podia aparecer cortado.

## O que mudou
1. **Botões de envio de verdade:** **"Enviar no WhatsApp"** (verde) e **"Enviar por e-mail"**, grandes, embaixo da mensagem. Sem contato cadastrado, aparece **"Adicionar WhatsApp ou e-mail para enviar"**, que abre a edição.
2. **Enviar direto do modal do coach.** Depois da sugestão, os mesmos botões de envio, mais "Editar antes" (leva o texto para a caixa da ficha), "Outra" e "Copiar". O modal agora abre sempre na parte visível da tela.
3. **Ficha em blocos:**
   - **Conversar:** Mensagem pronta, Pedir ajuda ao coach e Ligar, três botões do mesmo tamanho.
   - **Gerenciar:** Foto, Editar e Apagar, discretos no fim, separados por uma linha.
4. **Depois de enviar:** se a pessoa está em 👋 Novo, aparece "Mandou a mensagem? Quer marcar como 💬 Conversou?", com "Sim, marcar" ou "Ainda não". Nas outras etapas, só um lembrete para mudar a etapa quando a pessoa responder.

## Arquivos
- `src/app/components/PeopleSection.tsx`: `SendButtons`, modal com envio e portal, ficha em blocos e pergunta depois do envio.
- `src/components/prototype/PrumoAppSimulator.tsx`: `id="app-screen"`, para o modal abrir na tela do app.
- `e2e/caderno.spec.ts`: o teste do coach agora envia pelo modal, responde "Sim, marcar" e confere que nada da pessoa vai para a IA também na 2ª sugestão.

## Verificação
138 testes de unidade e 20 de ponta a ponta, mais prints da ficha, do modal e da pergunta depois do envio.
