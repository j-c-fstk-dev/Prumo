# Etapa 44: ciclos depois do roteiro

Quarta e última etapa do plano "90 dias de verdade".

## Quando aparece
Com o **roteiro concluído** ou a partir do **Dia 90**, a Início oferece **"Escolher o próximo ciclo"**:
- no cartão "Roteiro concluído";
- ou no cartão do Dia 90, se o roteiro não foi concluído.

Também aparece ao **fim de um ciclo** (30 dias) ou quando a **meta do ciclo é batida**.

## A tela "Próximo ciclo"
- **Os números de verdade primeiro:**
  - dias de jornada, passos feitos e rotinas feitas;
  - conversas, quantos disseram sim e clientes (do Caderno → Pessoas);
  - com um link para reler a carta.
- **Três escolhas honestas:**
  - 🌳 **Deu certo: continuar e crescer.** 30 dias com uma meta de **clientes novos**. Conta quem vira "Cliente" no Caderno durante o ciclo. A meta sugerida é pequena: clientes atuais + 1, entre 2 e 10.
  - 🔧 **Quase: ajustar e testar de novo.** 30 dias com uma meta de **conversas novas** (sugestão: 5). Conta quem sai de "Novo" durante o ciclo. Tem campo para "o que você vai mudar".
  - 🧭 **Não rolou: trocar de caminho.** Confirma e recomeça o roteiro do passo 1, com um novo Dia 1, e abre o resultado para escolher outra aposta.
    - **Ficam:** Caderno, pessoas, cartas, rotinas e linha do tempo.
    - **A jornada anterior** vai para a linha do tempo.

## Cartão do ciclo (Início)
- Mostra "Ciclo N · Crescer" (ou Ajustar), o dia X de 30, a meta com barra de progresso e o foco escolhido.
- Tem atalho para as Pessoas e, quando der, "Fechar o ciclo e escolher o próximo".
- O subtítulo da Início mostra o ciclo.
- A meta **conta sozinha pelo histórico de etapas das pessoas** (`stageHistory`). Nada sai do aparelho.
- Durante os ciclos, **todas as rotinas valem**, conforme a etapa 42.

## Dados
- `cycles: Cycle[]` e `pastJourneys: PastJourney[]` no estado salvo. Entram no backup completo.
- Linha do tempo: "Começou o ciclo: …" e "Jornada anterior: … (N passos)".
- Regras em `src/domain/cycles.ts`, com testes.
- Métricas: `ciclo_iniciado` (com tipo e meta) e `caminho_trocado` (com `depois_do_roteiro`).
