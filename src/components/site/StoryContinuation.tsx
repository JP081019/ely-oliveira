"use client";

import { useId, useState } from "react";
import { SiteIcon } from "@/components/ui/SiteIcon";

export function StoryContinuation({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className="story-continuation"><div id={id} hidden={!open} className="story-rest">{children}</div><button className="text-link story-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>{open ? "Recolher minha história" : "Continue minha história"}<SiteIcon name={open ? "dash-lg" : "plus-lg"} size={16} /></button></div>;
}
