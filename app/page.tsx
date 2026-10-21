import Image from "next/image";
import { Certification } from "@/components/certification";
import { OctoberRoseBanner, OctoberRoseCampaign } from "@/components/october-rose";
import { Audience, ContactLink, FAQ, Header, Icon, Logo, Motion } from "@/components/interactive";

const steps = [
  ["Primeiro contato", "Uma conversa pelo WhatsApp para tirar dúvidas e encontrar um ponto de partida.", "chat-dots"],
  ["Triagem / anamnese", "Um momento para conhecer sua história e compreender o que você está buscando.", "journal-text"],
  ["Sessões online", "Encontros com técnica, escuta e acolhimento, em um espaço reservado por você.", "camera-video"],
  ["Continuidade do processo", "O acompanhamento segue considerando sua história e as necessidades do processo.", "arrow-repeat"],
];

export default function Home() {
  const ely = "/images/Logo - Ely Transparente.jpeg";
  const jp = "/images/Logo - JPCreative Transparente.jpeg";
  return <>
    <Motion /><OctoberRoseBanner /><Header logo={ely} />
    <main id="conteudo">
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-lines" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="hero-topline"><span>Terapia emocional · TRG</span><span>Um espaço de escuta. Um tempo para você.</span></div>
        <div className="hero-composition"><h1 id="hero-title"><span className="hero-line">Reconecte-se</span><span className="hero-line hero-second">com a sua</span><span className="hero-line hero-third">saúde emocional<span className="hero-period">.</span></span></h1><figure className="hero-portrait" data-reveal><Image src="/images/img1.jpeg" alt="Ely Oliveira, com identificação de terapeuta certificada TRG" width={1024} height={1536} sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 900px) 38vw, 360px" preload /></figure></div>
        <div className="hero-bottom"><p>Há caminhos para compreender o que você sente.<br className="desktop-break" /> E você pode percorrê-los com acolhimento.</p><div className="hero-actions"><ContactLink className="button button-light"><span>Quero conversar com a Ely</span><Icon name="arrow-up-right" /></ContactLink><a className="text-link" href="#atendimento">Entender como funciona <Icon name="arrow-down" /></a></div></div>
        <div className="hero-foot"><span><Icon name="geo-alt" /> 100% online · Em todo o Brasil</span><a href="#identificacao" aria-label="Continuar para a próxima seção">Permita-se um primeiro passo <Icon name="arrow-down" /></a></div>
      </section>

      <section className="intro section-pad" id="identificacao" aria-labelledby="intro-title">
        <div className="section-label"><span className="small-line" /> Antes de tudo, acolhimento</div>
        <div className="intro-grid"><h2 id="intro-title" data-reveal="lines">Você merece apoio<br />para superar<br /><em>o que te pesa.</em></h2><div className="intro-copy" data-reveal><p>Às vezes, é difícil explicar. A ansiedade ocupa espaço. Um medo limita. Uma lembrança ainda dói.</p><p>Você não precisa ter todas as respostas para buscar apoio. Podemos começar pelo que você sente agora.</p><span className="handwritten">com calma, no seu tempo.</span></div></div>
        <div className="emotion-words" aria-label="Situações que podem motivar a busca por apoio"><span data-reveal>Ansiedade</span><span data-reveal>Traumas</span><span data-reveal>Medos</span><span data-reveal>Pânico</span><span data-reveal>Fobia social</span><span data-reveal>Dor emocional</span></div>
      </section>

      <section className="statement" aria-labelledby="statement-title"><div className="statement-line" aria-hidden="true" /><p className="section-label">Há espaço para novos caminhos</p><h2 id="statement-title" data-reveal="clip">O que você sente hoje<br />não precisa ser<br /><em>pra sempre.</em></h2><span className="handwritten" data-reveal>um passo de cada vez</span></section>

      <section className="about section-pad" id="sobre" aria-labelledby="about-title"><div className="section-label"><span className="small-line" /> Quem acolhe a sua história</div><div className="about-grid"><div className="about-name" data-reveal="lines"><h2 id="about-title">Ely<br /><em>Oliveira.</em></h2><span>Terapeuta Emocional TRG</span><Image className="ely-portrait" src="/images/img2.jpeg" alt="Ely Oliveira em seu retrato profissional" width={1099} height={1431} sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 900px) 40vw, 420px" /></div><div className="about-copy" data-reveal><h3>Técnica e presença.<br />Escuta e cuidado.</h3><p>Meu trabalho reúne a Terapia de Reprocessamento Generativo, a escuta ativa e uma presença genuína para acolher sua história.</p><p>O acompanhamento se volta à raiz das emoções e aos padrões emocionais, respeitando a singularidade de cada pessoa.</p><div className="qualification"><Icon name="patch-check" /><p>Certificação em TRG pelo<br /><strong>Instituto de Ensino e Terapia do Brasil.</strong></p></div><p className="about-small">Atendimento online para crianças, jovens e adultos.</p></div></div></section>

      <Certification />
      <OctoberRoseCampaign />

      <section className="trg section-pad" id="trg" aria-labelledby="trg-title"><div className="trg-heading"><div><div className="section-label"><span className="small-line" /> A abordagem</div><h2 id="trg-title" data-reveal="lines">Olhar para a raiz.<br /><em>Acolher o que sente.</em></h2></div><span className="trg-monogram" aria-hidden="true">TRG</span></div><div className="trg-body"><h3>O que é TRG?</h3><div><p>A Terapia de Reprocessamento Generativo é a abordagem utilizada por Ely no trabalho com emoções e padrões emocionais.</p><p>Na proposta apresentada pela profissional, o processo envolve olhar para a raiz dessas emoções, com técnica, escuta e acolhimento.</p><p className="muted">A primeira conversa é um espaço para entender a abordagem e esclarecer suas dúvidas. Cada processo é individual, sem promessa de resultados iguais para todos.</p></div></div><div className="trg-path" data-reveal><span><Icon name="ear" /> Escutar</span><span><Icon name="search-heart" /> Compreender</span><span><Icon name="heart" /> Acolher</span></div></section>

      <section className="audience section-pad" aria-labelledby="audience-title"><div className="audience-heading"><div className="section-label"><span className="small-line" /> Para quem é</div><h2 id="audience-title" data-reveal="lines">Sua história não cabe<br /><em>em um rótulo.</em></h2><p>Algumas das demandas acolhidas no acompanhamento.<br />Selecione um tema para saber mais.</p></div><Audience /></section>

      <section className="process section-pad" id="atendimento" aria-labelledby="process-title"><div className="process-heading"><div className="section-label"><span className="small-line" /> Como funciona</div><h2 id="process-title" data-reveal="lines">O começo pode<br />ser <em>uma conversa.</em></h2><p>Da primeira mensagem à continuidade do cuidado,<br />cada etapa tem seu lugar.</p></div><ol className="process-list">{steps.map(([title, text, icon], i) => <li key={title} data-reveal="step"><div className="step-number">0{i + 1}</div><div className="step-copy"><Icon name={icon} /><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>

      <section className="online section-pad" aria-labelledby="online-title"><div className="online-title" data-reveal="lines"><span className="section-label">Perto, mesmo à distância</span><h2 id="online-title">O cuidado chega<br /><em>até você.</em></h2></div><div className="online-content"><p className="online-lead">100% online.<br />Em todo o Brasil.</p><p>Um encontro que cabe na sua rotina, em um lugar onde você se sinta confortável para conversar.</p><ul><li><Icon name="house-heart" /><span>Conforto do seu espaço</span></li><li><Icon name="shield-lock" /><span>Um ambiente reservado por você</span></li><li><Icon name="wifi" /><span>Facilidade de acesso, onde estiver</span></li></ul><small>Para as sessões, escolha um local privado e uma conexão estável.</small></div></section>

      <section className="investment section-pad" aria-labelledby="investment-title"><div><div className="section-label"><span className="small-line" /> Investimento no seu cuidado</div><h2 id="investment-title" data-reveal="lines">Clareza também<br />é <em>acolhimento.</em></h2><p>Informações para você decidir com tranquilidade.</p></div><div className="investment-values"><div className="price-row"><span>Sessão individual</span><p><small>R$</small> 300</p></div><div className="package-note"><Icon name="journal-check" /><div><strong>Pacote com 10% de desconto</strong><p>Possibilidade de 5 + 5 sessões.<br />Converse com a Ely sobre a organização do pacote.</p></div></div><p className="payment"><Icon name="credit-card" /> Até 3x sem juros no cartão.<br /><span>Acima disso, juros da operadora/maquininha.</span></p></div></section>

      <section className="faq section-pad" id="duvidas" aria-labelledby="faq-title"><div className="faq-heading"><div className="section-label"><span className="small-line" /> Dúvidas, com calma</div><h2 id="faq-title">Antes do<br /><em>primeiro passo.</em></h2><p>Algumas respostas que podem<br />ajudar você a começar.</p></div><FAQ /></section>

      <section className="final-cta section-pad" id="contato" aria-labelledby="contact-title"><div className="cta-top"><span className="section-label">Um convite ao cuidado</span><span className="handwritten">você merece esse espaço.</span></div><div className="contact-composition"><h2 id="contact-title" data-reveal="clip">Cuidar de você<br /><em>por inteiro.</em></h2><figure className="contact-portrait" data-reveal><Image src="/images/img4.jpeg" alt="Ely Oliveira ao lado da mensagem: Cuidando de você por inteiro" width={1099} height={1431} sizes="(max-width: 600px) 240px, 280px" /></figure></div><div className="cta-bottom"><p>Podemos começar com uma conversa.<br />Estou aqui para ouvir.</p><ContactLink className="button button-light"><span>Conversar com a Ely</span><Icon name="whatsapp" /></ContactLink></div></section>
    </main>
    <footer className="footer"><div className="footer-main"><div><a href="#inicio" className="brand" aria-label="Ely Oliveira — início"><Logo src={ely} brand="Ely" /></a><p>Ely Oliveira · Terapeuta Emocional TRG<br />Atendimento online em todo o Brasil.</p></div><div className="footer-contact"><ContactLink>+55 31 9777-9876 <Icon name="arrow-up-right" /></ContactLink><span>Atendimento para crianças, jovens e adultos.<br />Menores de 18 anos: autorização dos responsáveis.</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Ely Oliveira</span><a href="https://jpcreative.com.br" target="_blank" rel="noopener noreferrer" className="credits"><span>Desenvolvido por JP Creative</span><Logo src={jp} brand="JP Creative" /><Icon name="arrow-up-right" /></a></div></footer>
    <ContactLink className="floating-whatsapp" label="Conversar com Ely Oliveira pelo WhatsApp (abre em nova aba)"><span>Vamos conversar</span><Icon name="whatsapp" /></ContactLink>
  </>;
}
