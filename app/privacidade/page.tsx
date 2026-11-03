import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferences } from "@/components/site-analytics";
import { ContactLink } from "@/components/interactive";

export const metadata: Metadata = {
  title: "Política de privacidade | Ely Oliveira",
  description: "Saiba como este site usa estatísticas de acesso, cookies opcionais e links de contato, e como revisar suas preferências.",
  alternates: { canonical: "https://www.terapiaely.com.br/privacidade" },
  openGraph: { title: "Política de privacidade | Ely Oliveira", description: "Privacidade, estatísticas de acesso e preferências de cookies.", url: "https://www.terapiaely.com.br/privacidade" },
};

export default function Privacy() {
  return <main className="privacy-page section-pad" id="conteudo">
    <Link className="text-link" href="/">← Voltar ao site</Link>
    <p className="section-label">Ely Oliveira · Atendimento online</p>
    <h1>Política de <em>privacidade.</em></h1>
    <p>Atualizada em <time dateTime="2026-11-03">3 de novembro de 2026</time>.</p>
    <h2>Sobre este site</h2>
    <p>Este site apresenta o trabalho de Ely Oliveira e permite iniciar contato pelo WhatsApp. Não há formulário de cadastro, pagamento ou prontuário neste site. O atendimento e o tratamento de informações durante as sessões são combinados diretamente com a profissional.</p>
    <h2>Google Analytics e sua escolha</h2>
    <p>O Google Analytics 4 só é carregado após você aceitar os cookies analíticos. Ele permite medir visitas às páginas e cliques nos botões de WhatsApp. Os cliques informam apenas a posição e o tipo do botão. Não enviamos nome, telefone, e-mail, mensagens, formulários ou informações de saúde. Os endereços enviados pelo código de medição excluem parâmetros de busca e fragmentos.</p>
    <p>Não usamos publicidade personalizada nem remarketing. Ao recusar, você continua navegando normalmente. A preferência fica armazenada neste navegador até ser alterada ou até você limpar os dados locais. Ao retirar uma autorização anterior, o site interrompe o Analytics, remove seus cookies acessíveis e recarrega a página. Isso não apaga automaticamente dados já recebidos pelo Google.</p>
    <CookiePreferences />
    <h2>Estatísticas da Vercel</h2>
    <p>Usamos Vercel Web Analytics para estatísticas de navegação sem cookies. Essa ferramenta funciona separadamente da autorização de cookies do Google. O código limita os endereços medidos às páginas públicas, sem parâmetros de busca ou fragmentos, e não envia mensagens ou informações de saúde como eventos.</p>
    <p>Saiba mais na <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">documentação de privacidade da Vercel</a> e na <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">política de privacidade do Google</a>.</p>
    <h2>WhatsApp e outros serviços</h2>
    <p>Ao abrir o WhatsApp, você passa a usar um serviço externo, sujeito às políticas da Meta. As mensagens são enviadas somente quando você as confirma no próprio WhatsApp. Evite enviar informações sensíveis no primeiro contato. A hospedagem também pode manter registros técnicos de segurança e operação.</p>
    <h2>Contato e solicitações</h2>
    <p>Para dúvidas sobre privacidade, entre em contato com Ely Oliveira pelo <ContactLink location="footer">WhatsApp de atendimento</ContactLink>, informando apenas o necessário para sua solicitação.</p>
    <aside className="privacy-review"><h2>Informações em confirmação</h2><p>A responsável deverá confirmar, antes da publicação, o canal específico para solicitações de privacidade, a identificação formal do controlador, os prazos de retenção configurados e as condições aplicáveis ao atendimento. Esta página descreve a implementação técnica do site e deverá ser revisada com essas informações.</p></aside>
    <Link className="text-link" href="/">← Voltar ao site</Link>
  </main>;
}
