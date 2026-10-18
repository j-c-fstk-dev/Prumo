import React from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { installErrorReporting } from '../utils/telemetry';
import { CompassMark } from '../components/brand/CompassMark';
import { SiteFooter } from './SiteFooter';
import { SITE, filled } from './site';

/**
 * Política de privacidade e Termos de uso (etapa 39).
 * RASCUNHO: precisa de revisão jurídica antes do lançamento aberto (docs/pesquisa/07).
 * Os textos descrevem o que o código faz hoje; ao mudar o que é coletado, atualize aqui também.
 */

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="font-display text-2xl font-bold tracking-tight mt-10 mb-3">{children}</h2>;
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="mt-3 leading-relaxed">{children}</p>;
const UL: React.FC<{ children: React.ReactNode }> = ({ children }) => <ul className="mt-3 space-y-2 list-disc pl-5 leading-relaxed">{children}</ul>;

const Contact = () => (SITE.email ? <a className="text-primary underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> : <span>[e-mail a preencher]</span>);

const Owner = () => (
  <>
    {filled(SITE.owner)}
    {SITE.cnpj && <>, CNPJ {SITE.cnpj}</>}
  </>
);

const Privacy: React.FC = () => (
  <>
    <h1 className="font-display text-4xl font-bold tracking-tight">Política de privacidade</h1>
    <p className="mt-2 text-sm text-muted">Última atualização: {SITE.legalUpdated}</p>

    <div className="mt-6 p-4 rounded-xl bg-primary-soft border border-primary/25">
      <strong>Resumo em 4 frases.</strong> O que você escreve no Prumo fica no seu celular. Não há cadastro nem cópia das suas respostas em servidor
      nosso. Quando você usa o coach, vai só o necessário pra ele responder, e nunca o nome ou o contato das pessoas da sua lista. Você pode exportar
      ou apagar tudo a qualquer momento.
    </div>

    <H2>1. Quem é o responsável</H2>
    <P>
      O Prumo é mantido por <Owner />, que é o controlador dos dados tratados nos servidores descritos abaixo (Lei 13.709/2018, LGPD). Para
      qualquer assunto de privacidade, escreva para <Contact />.
    </P>

    <H2>2. O que fica só no seu celular</H2>
    <P>Estes dados ficam guardados no armazenamento do navegador do seu aparelho e não são enviados para nós:</P>
    <UL>
      <li>o nome que você digita, suas respostas às perguntas e o que você escreve com as suas palavras;</li>
      <li>o resultado, as cartas para o seu eu do futuro, as tarefas, os check-ins e a sua linha do tempo;</li>
      <li>o Caderno: ficha do produto, anotações, fotos e a lista de pessoas (nome, telefone, e-mail e notas);</li>
      <li>suas preferências (tema, sons).</li>
    </UL>
    <P>
      Como esses dados não saem do aparelho, nós não temos como vê-los, recuperá-los ou apagá-los por você. Se você limpar os dados do navegador
      ou trocar de celular, eles somem. Use <strong>Fazer backup</strong> (aba Você) para guardar uma cópia num arquivo seu, e <strong>Restaurar de um backup</strong> para trazer tudo de volta.
    </P>
    <P>
      A lista de pessoas guarda dados de terceiros. Guarde só o necessário, e só de quem você conhece ou com quem vai de fato conversar.
    </P>

    <H2>3. O que sai do celular, e por quê</H2>
    <h3 className="font-bold mt-5">Coach (só se você usar, e depois de aceitar o aviso)</h3>
    <P>Para o coach responder, enviamos ao nosso servidor e ao provedor de inteligência artificial:</P>
    <UL>
      <li>seu primeiro nome, como você se apresentou no app;</li>
      <li>um resumo do seu caminho (o que oferecer, pra quem, onde achar essas pessoas) e a tarefa em que você está;</li>
      <li>a sua frase-âncora e o objetivo que você escolheu;</li>
      <li>a sua mensagem e as últimas mensagens da conversa;</li>
      <li>ao pedir uma mensagem para alguém da lista: só a etapa da conversa e o contexto que você digitar. O nome, o telefone e o e-mail da pessoa não são enviados.</li>
    </UL>
    <P>
      Nosso servidor não guarda as conversas. O provedor de IA processa o texto para gerar a resposta, de acordo com os termos dele. Evite escrever
      dados de saúde, religião ou outros dados sensíveis no coach.
    </P>

    <h3 className="font-bold mt-5">Limite de uso</h3>
    <P>
      Para o coach não ser usado em excesso, contamos quantas mensagens cada aparelho envia por dia, usando um identificador aleatório criado no app
      (não é o seu nome nem o número do celular) e o endereço IP. Esses contadores valem só para o dia e são apagados no dia seguinte.
    </P>

    <h3 className="font-bold mt-5">Denúncia de resposta</h3>
    <P>Se você denunciar uma resposta do coach, recebemos o texto da resposta e o motivo escolhido, para revisar e melhorar o coach.</P>

    <h3 className="font-bold mt-5">Registros de erro</h3>
    <P>
      Quando algo quebra no app, ele envia uma mensagem técnica do erro, a tela em que estava e a versão do app. Antes de enviar, o app tira o que
      parece e-mail ou telefone. Esses registros ficam por poucos dias no painel do nosso provedor de hospedagem.
    </P>

    <h3 className="font-bold mt-5">Métricas de uso</h3>
    <P>
      Usamos o Umami, uma ferramenta de métricas sem cookies que não identifica você. Ela registra as páginas abertas e alguns acontecimentos (por
      exemplo, &quot;concluiu as perguntas&quot;, &quot;concluiu uma tarefa&quot; ou &quot;abriu o app no dia 7 da jornada&quot;), além do tipo de
      aparelho, navegador e país aproximado. Nunca enviamos para lá o que você escreve.
    </P>

    <H2>4. Com quem compartilhamos</H2>
    <UL>
      <li>
        <strong>Cloudflare</strong> (hospedagem do site e do servidor do coach, Estados Unidos e rede mundial);
      </li>
      <li>
        <strong>Provedor de inteligência artificial</strong> do coach. Hoje: Z.ai (Zhipu AI), com servidores fora do Brasil{' '}
        <span className="text-muted">[confirmar país e termos de tratamento de dados]</span>;
      </li>
      <li>
        <strong>Umami</strong> (métricas sem cookies, servidores fora do Brasil).
      </li>
    </UL>
    <P>Não vendemos dados. Não usamos os seus dados para publicidade.</P>

    <H2>5. Transferência internacional</H2>
    <P>
      Os serviços acima ficam fora do Brasil. Ao usar o coach, você concorda com o envio descrito na seção 3 para esses países, nos termos da LGPD e
      da regulamentação da ANPD sobre transferência internacional.
    </P>

    <H2>6. Bases legais</H2>
    <UL>
      <li>Coach: o seu consentimento, dado no aviso antes do primeiro uso. Você pode parar de usar o coach quando quiser.</li>
      <li>Limite de uso, registros de erro e métricas sem identificação: o legítimo interesse de manter o app seguro, funcionando e melhorando.</li>
    </UL>

    <H2>7. Seus direitos</H2>
    <P>
      Você tem direito a confirmar, acessar, corrigir, levar e apagar os seus dados, e a revogar o consentimento (LGPD, art. 18). No Prumo:
    </P>
    <UL>
      <li>
        <strong>Ver e levar:</strong> aba Você → Fazer backup (um .zip com tudo, que pode ser restaurado em outro aparelho);
      </li>
      <li>
        <strong>Corrigir:</strong> edite no próprio app;
      </li>
      <li>
        <strong>Apagar:</strong> aba Você → Apagar todos os meus dados;
      </li>
      <li>
        <strong>Qualquer outro pedido</strong>, ou dúvida sobre os dados dos servidores: <Contact />.
      </li>
    </UL>
    <P>Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</P>

    <H2>8. Idade</H2>
    <P>O Prumo é feito para maiores de 18 anos.</P>

    <H2>9. Mudanças nesta política</H2>
    <P>Se mudarmos o que é coletado, atualizamos esta página e a data no topo. Mudanças importantes também são avisadas dentro do app.</P>
  </>
);

const Terms: React.FC = () => (
  <>
    <h1 className="font-display text-4xl font-bold tracking-tight">Termos de uso</h1>
    <p className="mt-2 text-sm text-muted">Última atualização: {SITE.legalUpdated}</p>

    <H2>1. O que é o Prumo</H2>
    <P>
      O Prumo é um app que ajuda você a escolher uma aposta pequena no digital, testar com pessoas reais e seguir um roteiro de passos. É mantido por{' '}
      <Owner />. Ao usar o app, você concorda com estes termos e com a <a className="text-primary underline" href="/privacidade/">política de privacidade</a>.
    </P>

    <H2>2. O que o Prumo não é</H2>
    <UL>
      <li>
        <strong>Não é promessa de renda.</strong> Os caminhos e as sugestões são pontos de partida para testar. O resultado depende de muitas coisas
        fora do app.
      </li>
      <li>
        <strong>Não é consultoria</strong> jurídica, contábil, financeira ou de saúde.
      </li>
      <li>
        <strong>Não é terapia.</strong> Se você não está bem, procure ajuda profissional. O CVV atende de graça, 24 horas, pelo 188. Em emergência,
        ligue 192 (SAMU).
      </li>
    </UL>

    <H2>3. O coach de inteligência artificial</H2>
    <P>
      As respostas do coach são geradas por inteligência artificial e podem conter erros. Confira antes de seguir uma orientação importante. Se uma
      resposta for ofensiva ou inadequada, use o botão de denunciar. Existe um limite diário de uso para manter o serviço no ar.
    </P>

    <H2>4. Seus dados e seu conteúdo</H2>
    <P>
      O que você escreve é seu e fica no seu celular. Você é responsável pelo que guarda no app, inclusive os dados de outras pessoas na lista de
      contatos: guarde só o necessário e use-os apenas para conversar com elas, nunca para envio em massa ou spam.
    </P>

    <H2>5. Preço</H2>
    <P>
      Durante a fase de testes, o Prumo é grátis. Se houver plano pago, o preço, a renovação e o jeito de cancelar serão mostrados antes de qualquer
      cobrança, e valerá o direito de arrependimento de 7 dias (Código de Defesa do Consumidor, art. 49).
    </P>

    <H2>6. Disponibilidade</H2>
    <P>
      O app está em fase de testes e pode mudar, ficar fora do ar ou ter falhas. Como os dados ficam no seu aparelho, exporte o caderno de vez em
      quando.
    </P>

    <H2>7. Código aberto</H2>
    <P>
      O código do Prumo é aberto, sob a licença AGPL-3.0-or-later, e está em{' '}
      <a className="text-primary underline" href={SITE.repo} target="_blank" rel="noopener noreferrer">
        github.com/j-c-fstk-dev/Prumo
      </a>
      . O nome e a identidade visual do Prumo não fazem parte da licença.
    </P>

    <H2>8. Idade</H2>
    <P>O Prumo é para maiores de 18 anos.</P>

    <H2>9. Contato e lei aplicável</H2>
    <P>
      Dúvidas: <Contact />. Estes termos seguem as leis do Brasil.
    </P>
  </>
);

const LegalPage: React.FC<{ page: string }> = ({ page }) => (
  <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
    <header className="border-b border-line bg-surface">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2 font-display font-bold text-lg">
          <CompassMark size={24} className="text-primary" /> Prumo
        </a>
        <a href="/app/" className="text-sm font-semibold text-primary">
          Abrir o app
        </a>
      </div>
    </header>
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 text-[16px]">
      <p className="mb-6 p-3 rounded-lg bg-gold-soft border border-gold-line text-sm text-gold-ink">
        Versão provisória, em revisão jurídica. Ela descreve o que o app faz hoje.
      </p>
      {page === 'termos' ? <Terms /> : <Privacy />}
    </main>
    <SiteFooter />
  </div>
);

installErrorReporting();
const root = document.getElementById('root')!;
createRoot(root).render(<LegalPage page={root.dataset.page ?? 'privacidade'} />);
