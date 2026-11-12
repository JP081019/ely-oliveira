import { qualificationsContent } from "@/content/ely";
import { SiteIcon } from "@/components/ui/SiteIcon";

export function QualificationsSection() {
  return <section id="qualificacoes" className="qualifications-section section-space" data-chapter aria-labelledby="qualifications-title"><div className="content-width qualifications-layout"><div><span className="section-label">Formação e qualificações</span><h2 id="qualifications-title">{qualificationsContent.title}</h2><p>{qualificationsContent.introduction}</p><SiteIcon name="mortarboard" size={36} className="qualification-icon" /></div><div className="qualifications-list">{qualificationsContent.courses.map(course=><article className="qualification" key={course.name}><div className="course-meta"><span>{course.type}</span><span>{course.year}</span></div><h3>{course.name}</h3><p>{course.institution}</p><div className="course-meta"><span>{course.hours}</span><span>Concluído em {course.date}</span></div></article>)}<p className="qualifications-note">{qualificationsContent.note}</p></div></div></section>;
}
