import { attendanceContent } from "@/content/ely";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { ContactLink } from "./ContactLink";

export function AttendanceSection() {
  return <section id="atendimento" className="attendance-section section-space" data-chapter aria-labelledby="attendance-title"><div className="content-width"><div className="attendance-top"><span className="section-label">Como funciona o atendimento</span><span className="online-tag"><SiteIcon name="camera-video" size={19} />100% online</span></div><div className="attendance-layout"><div className="attendance-heading"><h2 id="attendance-title">{attendanceContent.title}</h2><div className="attendance-detail"><SiteIcon name="people" size={24} /><p>Atendimento individual<br />e para casais.</p></div></div><div className="attendance-copy">{attendanceContent.paragraphs.map(paragraph=><p key={paragraph}>{paragraph.split(/(100% online)/).map((part,index)=>part === "100% online" ? <strong key={index}>{part}</strong> : part)}</p>)}<div className="attendance-invitation"><h3>{attendanceContent.question}</h3><p>{attendanceContent.invitation}</p><ContactLink location="atendimento">{attendanceContent.cta}</ContactLink></div></div></div></div></section>;
}
