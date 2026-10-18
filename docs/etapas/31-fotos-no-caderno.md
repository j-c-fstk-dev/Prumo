# Etapa 31: Fotos no Caderno (vídeo só como link) e exportação em .zip

**Data:** 2026-10-18 · Decisão do dono: vídeo só como link.

## O que entrou
| Item | O quê |
|---|---|
| **Foto nas anotações** | Botão **📷 Foto** ao anotar (até 4 por anotação); dá para tirar ou pôr fotos ao editar |
| **Foto nas pessoas** | Botão **📷 Foto** em cada pessoa (ex.: print da conversa, foto do pedido) |
| **Compressão** | Cada foto é reduzida no aparelho para no máximo 1600 px, JPEG 80% (de 3–8 MB para cerca de 200–400 KB), com fundo branco para PNG transparente |
| **Ver** | Miniaturas; toque para ver em tela cheia |
| **Vídeo** | Não é guardado: o texto avisa "Vídeo? Cole o link no texto." e **links ficam clicáveis** nas anotações e nas notas das pessoas |
| **Exportar** | Sem fotos: texto, como antes. Com fotos: **caderno-prumo.zip** com o texto e a pasta `fotos/`; o texto cita "📷 fotos/foto-01.jpg" embaixo de cada item. No celular abre o compartilhar com o arquivo; no computador baixa |

## Decisões técnicas
- Fotos ficam no mesmo banco do aparelho, mas **cada uma numa chave própria** (`img:<id>`), fora do estado
  principal: salvar uma anotação não regrava todas as fotos.
- A foto só é lida quando aparece na tela, e a memória é liberada quando ela sai.
- Fotos da anotação nova só são guardadas ao tocar em "Salvar anotação" (rascunho não deixa lixo).
- Apagar a anotação ou a pessoa apaga as fotos dela do aparelho.
- A biblioteca de .zip só é carregada na hora de exportar (não pesa na abertura).

## Testes
- Redução mantendo a proporção; links separados do texto sem pegar a pontuação; exportação cita as fotos
- Ponta a ponta: anexar, miniatura, tela cheia, link clicável, persistir após recarregar, .zip com o texto
  e a foto, e apagar a anotação remove a foto do armazenamento
