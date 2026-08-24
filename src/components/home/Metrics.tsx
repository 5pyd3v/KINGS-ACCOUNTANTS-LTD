"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import type { SiteSettingsView } from "@/lib/site-config";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Reduced motion collapses the count-up to an immediate jump rather than
    // branching to a synchronous setState, which would cascade renders.
    const controls = animate(0, to, {
      duration: prefersReducedMotion ? 0 : 1.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, to, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export function Metrics({ settings }: { settings: SiteSettingsView }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-14 text-paper sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "6rem 100%",
        }}
      />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-brand-800 opacity-30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4">
          {settings.trustMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-l border-paper/15 pl-6"
            >
              <p className="font-display text-4xl leading-none text-paper sm:text-5xl">
                {metric.value === null ? (
                  metric.display
                ) : (
                  <Counter to={metric.value} suffix={metric.suffix} />
                )}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-paper/50">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
