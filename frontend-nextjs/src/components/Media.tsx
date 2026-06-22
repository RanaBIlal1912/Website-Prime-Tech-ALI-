import Image from "next/image";
import { cn, gradientFor, resolveImage } from "@/lib/utils";

interface MediaProps {
  src: string | null | undefined;
  alt: string;
  /** seed for the deterministic fallback gradient (e.g. slug/title) */
  seed?: string;
  /** large icon/emoji shown on the fallback tile */
  icon?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** render fill image (parent must be relative + sized) */
  fill?: boolean;
  width?: number;
  height?: number;
}

/**
 * Renders a next/image when a real URL is present, otherwise a branded
 * gradient placeholder with an optional icon. The backend seeds empty image
 * fields, so the fallback is the common path and must look intentional.
 */
export function Media({
  src,
  alt,
  seed = alt,
  icon,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  fill = true,
  width,
  height,
}: MediaProps) {
  const url = resolveImage(src);

  if (url) {
    return (
      <div className={cn("relative overflow-hidden bg-ink-card2", className)}>
        <Image
          src={url}
          alt={alt}
          {...(fill ? { fill: true } : { width: width ?? 800, height: height ?? 600 })}
          sizes={sizes}
          priority={priority}
          className={cn("object-cover transition-transform duration-500 hover:scale-105", imgClassName)}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradientFor(seed),
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {icon ? (
        <span className="relative select-none text-5xl drop-shadow-lg sm:text-6xl" aria-hidden>
          {icon}
        </span>
      ) : (
        <span className="relative select-none text-2xl font-bold tracking-tight text-white/70" aria-hidden>
          Prime Tech
        </span>
      )}
    </div>
  );
}
