"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  lines: string[];
  intro?: string;
  /** When provided, renders a full-bleed photographic banner instead of the plain light header. */
  image?: StaticImageData;
}

export function PageHeader({ eyebrow, lines, intro, image }: PageHeaderProps) {
  if (image) {
    return (
      <header className="relative flex min-h-[56vh] items-end overflow-hidden bg-ink-950 pb-16 pt-40">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-950/20 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-200"
          >
            <span className="h-px w-8 bg-brand-200" />
            {eyebrow}
          </motion.p>

          <AnimatedHeading
            lines={lines}
            className="max-w-4xl font-display text-4xl leading-[1.15] text-paper sm:text-5xl lg:text-6xl"
          />

          {intro && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70"
            >
              {intro}
            </motion.p>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("relative overflow-hidden border-b border-ink-100 bg-paper pb-20 pt-40")}>
      <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-100 opacity-50 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink-100) 1px, transparent 1px)",
          backgroundSize: "5.5rem 100%",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-700"
        >
          <span className="h-px w-8 bg-brand-700" />
          {eyebrow}
        </motion.p>

        <AnimatedHeading
          lines={lines}
          className="max-w-4xl font-display text-4xl leading-[1.2] text-ink-900 sm:text-5xl lg:text-6xl"
        />

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-500"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}
