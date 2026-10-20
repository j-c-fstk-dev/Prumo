# Etapas 49 e 50: volta do WhatsApp, "O que é o Prumo?" e o app Android (.apk)

Observações do terceiro teste com usuários.

## 49 · Volta do WhatsApp e o novo "O que é o Prumo?"
- **Problema:** ao mandar a mensagem pelo WhatsApp e voltar, o Android às vezes recarrega a página. Com isso:
  - a pergunta "Mandou a mensagem?" sumia;
  - a abertura de 8 s aparecia de novo.
- **Agora a pergunta fica salva** (`pendingSent`, válida por 12 h).
  - Ela aparece **na Início** e **na ficha da pessoa**, mesmo depois de recarregar.
  - "Sim, marcar" muda a etapa de 📇 Contato para 💬 Conversou.
  - Nas outras etapas, a pergunta só lembra de mudar a etapa quando a pessoa responder.
- **Abertura uma vez por aba:** recarregar a mesma aba entra direto no app (`prumo_splash_tab` no sessionStorage). Abrir o app de novo mostra a abertura normalmente.
- **"O que é o Prumo?"** agora fala do app, e não da ferramenta de pedreiro: "encontrar o seu norte no digital… como uma bússola".
  - A bússola substitui o fio de prumo (`PlumbLine` foi removido).
  - O texto aparece no 1º cartão da apresentação e em Você → Sobre o Prumo.

## 50 · App Android (.apk)
**Por quê:** alguns celulares, como os Samsung, não deixam instalar o app pela tela de início. O .apk é outro caminho.

**Como funciona:** o app é uma *Trusted Web Activity*. Ele abre `prumo.jardimdofazer.com.br/app/?origem=apk` em tela cheia, usando o Chrome do celular.
- Os dados ficam no mesmo lugar do site aberto no Chrome.
- **Mudanças no site chegam sozinhas.** Só é preciso gerar um .apk novo quando algo mudar em `android/` (ícone, nome, cores).

**Onde fica cada coisa:**
- **`android/`:** projeto gerado pelo Bubblewrap (`@bubblewrap/core` 1.27).
  - Pacote `br.com.jardimdofazer.prumo`, Android 7 ou mais novo (exigência da biblioteca do TWA).
  - O número da versão vem do workflow.
- **`.github/workflows/android.yml`:**
  - num PR, só confere se o projeto compila;
  - num push na `main` que mexe em `android/`, ou à mão (Actions → App Android → Run workflow), ele compila, **assina** e publica `Prumo.apk` nas Releases (`apk-1.0.N`).
- **Link fixo:** `https://github.com/j-c-fstk-dev/Prumo/releases/latest/download/Prumo.apk` pega sempre a última versão.

**Na página e no app:**
- **Página:** botão "Baixar para Android" ao lado de "Abrir o Prumo", na abertura e no convite final.
  - Não aparece no iPhone nem dentro do app.
  - Métrica: `apresentacao_baixar_apk`.
- **Dentro do app:** o convite "Instale o Prumo na tela de início" e o passo a passo de instalar não aparecem.
  - O app guarda que veio do .apk (`prumo_apk` no localStorage), pelo `?origem=apk` ou pelo referrer `android-app://`.
- **No Android pelo navegador:** o passo a passo de instalar ganhou o aviso "Não apareceu a opção? Baixe o app para Android".

### A chave de assinatura
O Android só atualiza um app se a nova versão for assinada com a **mesma chave**. Por isso:
- **Gere a chave uma vez e guarde uma cópia** (gerenciador de senhas ou Drive pessoal). Sem ela, não dá para publicar atualizações: as pessoas teriam que desinstalar e instalar de novo.
- A chave fica **só nos secrets do repositório**, nunca no código.

| Nome | Tipo | O que é |
| --- | --- | --- |
| `ANDROID_KEYSTORE_BASE64` | secret | o arquivo `android.keystore` em base64 |
| `ANDROID_KEYSTORE_PASSWORD` | secret | senha do keystore |
| `ANDROID_KEY_ALIAS` | secret | `prumo` |
| `ANDROID_KEY_PASSWORD` | secret | senha da chave (a mesma do keystore, se você só apertou Enter) |
| `ANDROID_CERT_SHA256` | **variável** | impressão digital SHA-256 do certificado |

### Tela cheia: Digital Asset Links
- O Worker responde `/.well-known/assetlinks.json` com a impressão digital da variável `ANDROID_CERT_SHA256`. O deploy passa essa variável com `--var`.
- **Sem ela,** o app funciona, mas com a barra de endereço do Chrome em cima.
- **Depois de cadastrar a variável,** rode o Deploy de novo (Actions → Deploy → Run workflow).
- A impressão também aparece no resumo de cada execução do workflow do .apk.

### Instalar no celular
1. Baixe pelo botão da página.
2. Abra o arquivo baixado.
3. O Android pede para **permitir instalar apps desta fonte** (Chrome ou Arquivos): permita.
4. **Samsung:** se o *Bloqueador automático* (Configurações → Segurança e privacidade) estiver ligado, ele impede a instalação. Desligue enquanto instala.
5. O Play Protect pode avisar "app desconhecido": toque em **Instalar mesmo assim**. Isso é normal fora da Play Store.

### Próximos passos possíveis
- Publicar na Play Store (conta de desenvolvedor, US$ 25 uma vez). O mesmo projeto gera um `.aab` com `bundleRelease`.
