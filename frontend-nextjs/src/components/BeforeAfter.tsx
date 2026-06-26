"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { resolveImage } from "@/lib/utils";

/** Draggable before/after image comparison slider. */
export function BeforeAfter({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const beforeUrl = resolveImage(before);
  const afterUrl = resolveImage(after);
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  if (!beforeUrl || !afterUrl) return null;

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-brand border border-white/[0.06]"
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* After fills the box. Before fills the same box and is revealed by clip-path,
          so both stay perfectly aligned regardless of container width. */}
      <Image src={afterUrl} alt={`${alt} — after`} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={beforeUrl} alt={`${alt} — before`} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">After</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/80" style={{ left: `${pos}%` }} aria-hidden />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-x-0 bottom-4 mx-auto w-2/3 cursor-ew-resize accent-primary"
      />
    </div>
  );
}
