import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className }: Props) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-content sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-content-muted">{subtitle}</p> : null}
    </Reveal>
  );
}
