import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { SiteIcon } from "@/components/ui/SiteIcon";

export function JPCreativeSignature() {
  return <a className="jp-signature" href={siteConfig.agency} target="_blank" rel="noopener noreferrer"><Image src={siteConfig.assets.agency} alt="" width={44} height={44} sizes="44px" /><span>Desenvolvido pela <strong>JP Creative</strong></span><SiteIcon name="arrow-up-right" size={14} /><span className="sr-only"> (outra aba)</span></a>;
}
