import { octoberRoseCampaign as campaign } from "@/lib/campaigns";
import { ContactLink, Icon } from "./interactive";

export function OctoberRoseBanner() {
  if (!campaign.enabled) return null;
  return <aside className="october-bar" aria-label="Campanha de Outubro Rosa">
    <a href="#outubro-rosa"><span className="october-bar-message"><strong>Outubro Rosa</strong><span className="october-bar-long"> | Um convite ao autocuidado — </span><span className="october-bar-short"> · </span><span>{campaign.sessions} sessões por R$ {campaign.packagePrice}</span></span><span className="october-bar-action">Conhecer a campanha <Icon name="arrow-right" /></span></a>
  </aside>;
}

export function OctoberRoseCampaign() {
  if (!campaign.enabled) return null;
  const price = campaign.packagePrice.toFixed(2).replace(".", ",");
  const message = `Olá, Ely! Vi no seu site a campanha de Outubro Rosa com o pacote de ${campaign.sessions} sessões por R$ ${price}. Gostaria de saber mais informações.`;
  return <section className="october-campaign section-pad" id="outubro-rosa" aria-labelledby="october-title">
    <div className="october-art" aria-hidden="true" data-reveal="clip"><div className="october-petal petal-one" /><div className="october-petal petal-two" /><div className="october-petal petal-three" /><div className="october-petal petal-four" /><div className="october-stem" /><span className="october-art-note">Um espaço para<br /><em>cuidar de você.</em></span></div>
    <div className="october-copy">
      <div className="section-label" data-reveal><span className="small-line" /> OUTUBRO ROSA {campaign.year}</div>
      <h2 id="october-title" data-reveal="lines">{campaign.title}</h2>
      <p className="october-description" data-reveal>Neste Outubro Rosa, um convite para dedicar um tempo à sua saúde emocional, com um espaço de escuta, acolhimento e cuidado.</p>
      <div className="october-package" data-reveal><span>Pacote especial de outubro</span><p>{campaign.sessions} sessões de terapia</p><div className="october-price"><small>R$</small> {price}</div><span className="october-total">Valor total do pacote com {campaign.sessions} sessões.</span></div>
      <div className="october-terms" data-reveal><p>Condição especial de contratação durante outubro de {campaign.year}.</p><p>A realização das sessões e os detalhes de contratação e utilização são combinados diretamente com a profissional.</p></div>
      <div data-reveal><ContactLink className="button october-button" message={message}><span>Quero saber mais sobre o pacote</span><Icon name="whatsapp" /></ContactLink></div>
    </div>
  </section>;
}
