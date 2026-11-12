export type IconName = "house-door" | "person-heart" | "diagram-3" | "chat-heart" | "mortarboard" | "patch-question" | "whatsapp" | "arrow-right" | "arrow-up-right" | "arrow-down" | "plus-lg" | "dash-lg" | "list" | "x-lg" | "camera-video" | "instagram" | "facebook" | "shield-lock" | "gear" | "check2-circle" | "heart" | "people";

export function SiteIcon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return <svg className={`site-icon ${className}`} width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><use href={`/icons.svg#${name}`} /></svg>;
}
