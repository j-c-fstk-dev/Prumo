# Etapa 25: Bloco E, sons, abertura e comemoração

**Data:** 2026-10-18 · Plano: [etapa 19](19-ajustes-do-teste.md)

## Achados do teste
- "Animação de pessoa com bússola na mão, olhando pro céu buscando o caminho."
- "Som no splash, tipo musiquinha inspiradora", no clima do app Fabulous.
- "Comemoração pode ser algo mais mágico, e os sons têm que ser mais delicados, menos rápidos e artificiais.
  Sons dos cliques também."

## Referência: o clima do Fabulous
Segundo o estudo de caso publicado pelo Google Design (com relatos dos criadores, então é a versão da
empresa), o Fabulous usa um **sininho como deixa** para o hábito e, nas rotinas, **música com tons suaves e
sons de gota d'água**. Foi esse clima que seguimos, sem copiar nenhum som deles.

## O que mudou
| Onde | Antes | Agora |
|---|---|---|
| Timbre de todos os sons | "Bip" curto de onda simples, alguns com onda triangular | **Sino/kalimba**: senoide com poucos parciais suaves que somem antes da nota principal, como num sino de verdade |
| Envelope | Ataque de 8 ms e queda de 50 a 450 ms | Ataque de 15 a 40 ms e queda de 0,5 a 3 s |
| Ambiente | Som "seco" | **Eco de sala suave** gerado no aparelho (reverb) |
| Notas | Várias escalas | Pentatônica (soam bem em qualquer combinação) |
| Toque comum | Clique de madeira | Gotinha d'água bem baixa (continua desligado por padrão) |
| Tarefa feita | Arpejo rápido de 4 notas | 3 sininhos subindo devagar |
| Compromisso selado | Acorde com onda triangular | Sino grave e aberto que soa por uns 3 s |
| **Capítulo concluído** | Mesmo som do compromisso + confete rápido | **"Chuva de estrelas"**: sininhos agudos caindo sobre um acorde suave, estrelas douradas e lilás caindo devagar (2 ondas) e céu estrelado piscando atrás da constelação |
| **Abertura (1ª vez)** | Bússola girando e entrada automática | **Ilustração**: pessoa no alto de um morro, com a bússola acesa na mão, olhando o céu enquanto uma constelação se desenha. Depois aparece **"Toque para começar"** e, no toque, toca uma **música curta** (~7 s: acorde suave + melodia de kalimba) |
| Abertura (outras vezes) | Bússola curta | Igual, sem música e sem esperar toque |

## Por que a música só toca depois do toque
Os navegadores bloqueiam som antes de a pessoa tocar na tela. Por isso a abertura termina num botão.
A música toca só na primeira vez que o app é aberto, para não cansar, e respeita o "som desligado".

## Honestidade sobre os sons
Todos são **gerados por código no aparelho** (sem arquivos, sem rede, sem direito autoral). Ficaram bem
mais suaves, mas não são gravações de instrumentos de verdade. Se depois quiserem, dá para trocar por
gravações com licença livre (CC0), junto com o item pendente do ambiente sonoro de natureza.

## Testes
- Novo teste ponta a ponta: na 1ª abertura a ilustração aparece e espera o toque; ao recarregar, entra sozinha
- 13 testes ponta a ponta e 113 de regra
- Conferido em captura de tela com animação ligada (morro esfumado, constelação desenhada, botão)
