# Frente 7: LGPD, leis brasileiras e políticas da Play Store

**Pergunta:** o que é obrigatório para lançar o Prumo de forma legal e aprovada na loja?

> ⚠️ **Não sou advogado.** Isto é um mapa de requisitos levantado em fontes públicas
> (Google, ANPD, escritórios de advocacia) para orientar o produto e a conversa com um
> profissional. Antes de publicar, os Termos e a Política de Privacidade devem passar por revisão jurídica.

---

## 1. LGPD (Lei 13.709/2018)

### Porte: MEI tem regime simplificado 🟢
**Resolução CD/ANPD nº 2/2022:** MEI, ME e EPP são "agentes de tratamento de pequeno porte".
- **Não precisa nomear um encarregado (DPO)**, mas **precisa de um canal** de contato para os titulares
  exercerem seus direitos (ex.: e-mail `privacidade@...` + formulário).
- O registro das operações de tratamento pode ser simplificado.
- **Exceção:** quem faz tratamento de **alto risco** perde parte dos benefícios. Ver o ponto abaixo.

### O ponto mais delicado: o que a pessoa escreve nas reflexões
A anamnese tem **campos abertos** ("conte com suas palavras"). As pessoas podem escrever sobre
**saúde, religião, vida sexual**, que são **dados sensíveis** (art. 5º, II), com regras mais duras
(art. 11, consentimento específico e destacado).

**Decisões de produto que reduzem o risco:**
1. **Local primeiro:** as respostas ficam **no aparelho** (IndexedDB). Só vão ao servidor quando
   a pessoa usa o coach, e só o necessário. Isso já está planejado na Fase 1.
2. **Aviso no campo aberto:** "Evite escrever dados de saúde ou outros dados sensíveis."
3. **Consentimento destacado** antes do primeiro uso do coach de IA, explicando que o texto vai
   para um provedor de IA.
4. **Minimizar o contexto** enviado ao coach: só o diagnóstico, a tarefa atual e a âncora, sem as
   reflexões brutas.

### O coach de IA = transferência internacional 🟡
Gemini, Claude e Z.ai processam dados **fora do Brasil**. A Resolução CD/ANPD nº 19/2024 regula isso
(o prazo de adequação das cláusulas-padrão terminou em 23/08/2025).
- Escolher um provedor com termos de tratamento de dados (DPA) e verificar se aceita as cláusulas-padrão da ANPD.
- Informar na Política de Privacidade: **qual provedor, qual país, para quê**.
- Isso entra na **escolha do provedor** (pendência sua): é um critério além de preço e qualidade.

### Direitos do titular (art. 18)
Acesso, correção, exclusão, portabilidade e revogação do consentimento. No app:
**"Exportar meus dados"** e **"Apagar tudo"** nas configurações.

## 2. ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026) 🟡

Vale para serviços **direcionados a crianças e adolescentes ou de acesso provável por eles**.
A autodeclaração de idade **não basta** onde há conteúdo impróprio, e as lojas têm obrigações próprias
de aferição de idade (Decreto 12.880/2026, orientações da ANPD).

→ **Para o Prumo:** posicionar e classificar como **app para maiores de 18 anos** (público-alvo:
adultos buscando renda). Isso também evita as regras de dados de menores da LGPD (art. 14).
**Confirmar com advogado** se a classificação 18+ na loja é suficiente para o nosso caso.

## 3. Código de Defesa do Consumidor

- **Nada de promessa de renda.** "Ganhe R$ 5 mil por mês" é publicidade enganosa (CDC, art. 37).
  O tom do Prumo já é o certo: plano, hipótese e teste.
- **Assinatura:** preço, renovação automática e como cancelar devem ficar **claros antes de assinar**.
- Direito de arrependimento em 7 dias (art. 49) para compras online. Na Play, o reembolso é pelo Google,
  mas a regra deve constar nos Termos.

## 4. Google Play: requisitos obrigatórios

| Requisito | O que exige | Impacto no Prumo |
|---|---|---|
| **Política de privacidade** | URL pública + link no app | Página na landing page (Fase 4/5) |
| **Formulário de Segurança dos dados** (Data safety) | Declarar o que coleta, compartilha e por quê | Fácil se for "local primeiro" |
| **Exclusão de conta** | Se o app cria conta: excluir **dentro do app E por um link web**, sem precisar reinstalar | Se o MVP **não tiver conta** (só local), o requisito não se aplica. Quando o login vier (pós-MVP), as duas rotas são obrigatórias |
| **IA generativa** | App que gera conteúdo com IA deve ter **botão de denunciar conteúdo ofensivo dentro do app** | **Botão "denunciar resposta"** em cada mensagem do coach (Fase 2) |
| **Declaração de apps de saúde** | **Todo app** publicado preenche, mesmo sem recursos de saúde | Declarar que **não** é app de saúde; cuidado com o texto de bem-estar |
| **API alvo** | Novos apps/atualizações: **Android 16 (API 36)** desde 31/08/2026 | O Capacitor deve gerar o APK com API 36 (Fase 4) |
| **Conta de organização** | D-U-N-S + verificação | Já em andamento ✅ |
| **Classificação etária** | Questionário IARC | 18+ (ver ECA Digital) |

## 5. Responsabilidade do coach de IA (além da lei) 🟢 (boa prática)

O Prumo trabalha com **ansiedade, medo e frustração**. Uma IA conversando com pessoas fragilizadas
precisa de cuidados:
- **Não é terapia:** um aviso claro no coach e nos Termos.
- **Sinais de crise:** se a pessoa mencionar suicídio, autolesão ou desespero, o coach **para o
  roteiro de negócios** e indica o **CVV (ligue 188, 24 h, gratuito)** e o SAMU (192). Isso entra
  no prompt do sistema e numa checagem simples de palavras-chave no servidor (Fase 2).
- **Sem conselho financeiro, jurídico ou médico específico.**

## Checklist jurídico do MVP

- [ ] Canal de privacidade (e-mail) — exigência da Res. ANPD 2/2022
- [ ] Política de Privacidade (provedor de IA, país, finalidade, direitos, canal) — revisão jurídica
- [ ] Termos de Uso (não é terapia, sem promessa de renda, assinatura, arrependimento) — revisão jurídica
- [ ] Consentimento destacado antes do 1º uso do coach de IA
- [ ] Aviso de dados sensíveis nos campos abertos
- [ ] "Exportar meus dados" e "Apagar tudo" nas configurações
- [ ] Botão "denunciar resposta" no coach
- [ ] Protocolo de crise (CVV 188) no coach
- [ ] Classificação 18+ e declaração de saúde (não é app de saúde) no Play Console
- [ ] Verificar o DPA e as cláusulas-padrão do provedor de IA escolhido
- [ ] Registro da marca no INPI

## Fontes

- Res. CD/ANPD nº 2/2022 (pequeno porte): [Felsberg](https://www.felsberg.com.br/no-dia-internacional-da-protecao-de-dados-anpd-publica-nova-resolucao-que-regulamenta-a-aplicacao-da-lgpd-para-agentes-de-tratamento-de-pequeno-porte/) · [Confidata](https://confidata.com.br/blog/lgpd-pequenas-empresas-resolucao-pequeno-porte) · [checklist ANPD](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/checklist-vf.pdf)
- Res. CD/ANPD nº 19/2024 (transferência internacional): [Mattos Filho](https://www.mattosfilho.com.br/unico/regulamentacao-transferencia-internacional-dados/) · [Lefosse](https://lefosse.com/noticias/transferencia-internacional-de-dados-prazo-para-adocao-das-clausulas-padrao-da-anpd-se-encerra-em-23-de-agosto/)
- ECA Digital: [Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026) · [Mayer Brown](https://www.mayerbrown.com/pt/insights/publications/2026/04/enforcement-of-brazils-eca-digital-introduces-new-obligations-for-companies) · [Chambers (ANPD e verificação etária)](https://chambers.com/articles/eca-digital-é-regulamentado-e-anpd-publica-orientações-sobre-verificação-etária)
- Google Play, exclusão de conta: [Play Console Help](https://support.google.com/googleplay/android-developer/answer/13327111) · [USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/yan-jingwen)
- Google Play, IA generativa: [Play Console Help](https://support.google.com/googleplay/android-developer/answer/13985936?hl=en) · [9to5Google](https://9to5google.com/2023/10/25/google-play-gen-ai-policy/)
- Google Play, declaração de saúde: [Play Console Help](https://support.google.com/googleplay/android-developer/answer/14738291)
- Google Play, API alvo: [Android Developers](https://developer.android.com/google/play/requirements/target-sdk) · [Play Console Help](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en-419)
- LGPD: [Lei 13.709/2018 (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) · CDC: [Lei 8.078/1990 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm) · CVV: [cvv.org.br](https://cvv.org.br/)
