# Etapa 35: Pessoas como agenda de contatos

**Pedido:** no Caderno, mostrar as pessoas como uma lista de contatos do celular, com nome e etapa, e o resto ao tocar no nome. Quem vira cliente não pode "sumir" dos contatos.

## Por que sumia
A 1ª etapa se chamava **"Contato"**, e o filtro dela parecia ser "a lista de contatos". Quando a pessoa virava cliente, ela saía desse filtro e dava a impressão de ter saído da agenda.

## O que mudou
- **A etapa "Contato" virou "Novo"** (👋). O filtro de tudo virou **"Todos"**, então "contatos" passa a ser a lista inteira.
- **A lista fica fechada:** inicial num círculo, nome e etapa num selinho colorido. Aparece **🔔 hoje** ou **⏰ atrasado** quando o próximo passo vence.
- **Tocar no nome abre a ficha ali mesmo** (contato, nota, fotos, próximo passo, mensagem pronta, coach, WhatsApp, ligar, editar e apagar). Só uma fica aberta por vez.
- **Quem está aberto não some ao mudar de etapa**, mesmo com um filtro ligado. Sai do filtro só quando a ficha fecha.
- **Ordem alfabética**, sem ligar para acento ("Ágata" fica no A). Com mais de 6 pessoas, aparecem as letras separando os grupos.
- **"Pra hoje"** continua no topo, e tocar num nome abre a ficha da pessoa.
- **Pessoa recém-adicionada já abre**, pronta para a mensagem.

## Arquivos
- `src/app/components/PeopleSection.tsx`
- `src/domain/people.ts` (nome da etapa)
- `src/app/state/AppStore.tsx`: `addPerson` passa a devolver o id da pessoa criada.
- `e2e/caderno.spec.ts`: um teste novo (ordem, uma aberta por vez, mudar de etapa com filtro) e o teste que confere que tudo continua salvo agora abre a ficha antes de checar.

## Verificação
138 testes de unidade e 20 de ponta a ponta, mais prints no tema claro e no escuro.
