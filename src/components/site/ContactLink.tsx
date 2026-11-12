import { siteConfig } from "@/lib/site-config";
import { SiteIcon } from "@/components/ui/SiteIcon";

export function ContactLink({ children = "Conversar com Ely", location, className = "" }: { children?: React.ReactNode; location: string; className?: string }) {
  return <a className={`contact-button ${className}`} href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-location={location}><SiteIcon name="whatsapp" size={19} /><span>{children}</span><span className="button-arrow"><SiteIcon name="arrow-up-right" size={16} /></span><span className="sr-only"> (abre o WhatsApp em outra aba)</span></a>;
}
