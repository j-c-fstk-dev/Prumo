# Etapa 23: Bloco C, 3 caminhos diferentes e "Quero criar o meu"

**Data:** 2026-10-18 · Plano: [etapa 19](19-ajustes-do-teste.md)

## Achados do teste
- "Não gostei do meu prumo sugerido, seria legal ter mais opções."
- "2 alternativas repetidas: tem que ser 3 opções totalmente diferentes."
- "Ter a opção de criar a sua própria jornada, com a IA ajudando."

## O que mudou
| Antes | Agora |
|---|---|
| A 2ª alternativa usava o **mesmo tema** da sugestão principal (só mudava o formato) | As 3 sugestões são **temas diferentes**: o 1º, o 2º e o 3º mais compatíveis com as respostas. Testado com vários perfis |
| Alternativas escondidas em "Ver 2 alternativas" | Visíveis no fim do resultado: "Não é bem isso? Escolha outro caminho", com "Escolher este caminho" em cada uma. Ao escolher, a tela volta ao topo mostrando o caminho novo |
| Sem como fugir das sugestões | **"✏️ Quero criar o meu"**: a pessoa diz o que vai oferecer, pra quem, que problema resolve e como quer começar (fazer pela pessoa, conversa de 1 hora, guia com modelo, mini-curso) |

## "Quero criar o meu"
- **Funciona sem IA:** os 3 campos e o formato bastam. A jornada inteira se adapta (tarefas pelo formato,
  kit de execução, preço de teste, aposta "X pagam por Y pra resolver Z").
- O que vem das respostas continua valendo: onde achar as pessoas, prazo e "Se travar, eu…".
- **Ajuda opcional da IA:** a pessoa conta a ideia do jeito dela e toca em "Organizar com a IA". O servidor
  (`/api/coach/idea`) pede à IA um JSON com os 3 campos e o formato, valida e corta campos longos. A
  pessoa revisa tudo antes de usar. Conta no limite de uso (etapa 22); com mensagem de crise, a IA não
  é chamada e aparece o CVV; sem IA ou com limite atingido, a tela avisa e os campos seguem funcionando.
- As 3 sugestões continuam disponíveis para trocar depois.

## Testes
- 108 testes de regra (novos: temas distintos em vários perfis, caminho próprio, troca de volta para
  uma sugestão, leitura do JSON da IA, limite e crise na sugestão)
- Novo teste ponta a ponta: trocar de caminho e criar o próprio (sem IA)
