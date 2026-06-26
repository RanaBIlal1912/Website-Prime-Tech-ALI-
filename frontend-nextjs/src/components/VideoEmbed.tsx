import { youTubeId } from "@/lib/utils";

/** Privacy-friendly YouTube embed (nocookie). Falls back gracefully on bad input. */
export function VideoEmbed({ src, title }: { src: string; title: string }) {
  const id = youTubeId(src);
  if (!id) return null;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-brand border border-white/[0.06]">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
