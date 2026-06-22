"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import type { StatItem } from "@/lib/types";

function Counter({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, stat.value]);

  return (
    <span ref={ref}>
      {value}
      {stat.suffix}
    </span>
  );
}

export function StatsCounter({ items }: { items: StatItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {items.map((stat, i) => (
        <div key={i} className="glass rounded-brand p-6 text-center">
          <div className="text-3xl" aria-hidden>
            {stat.icon}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-content sm:text-4xl">
            <Counter stat={stat} />
          </div>
          <div className="mt-1 text-sm text-content-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
