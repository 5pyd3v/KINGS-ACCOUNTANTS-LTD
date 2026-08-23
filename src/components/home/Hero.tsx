"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BRAND, type SiteSettingsView } from "@/lib/site-config";
import heroImage from "../../../public/images/hero-meeting.jpg";

export function Hero({ settings }: { settings: SiteSettingsView }) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroMetric = settings.trustMetrics[0];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950"
    >
      {/* Full-bleed background image with a slow cinematic zoom */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 22, ease: "linear" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="Kings Accountants advisors in a client meeting"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-paper) 1px, transparent 1px)",
            backgroundSize: "5.5rem 100%",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-6 pb-28 pt-48 sm:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-200"
        >
          <span className="h-px w-8 bg-brand-200" />
          {BRAND.city} &middot; {BRAND.descriptor}
        </motion.p>

        <AnimatedHeading
          lines={["Your trusted", "partner in business."]}
          className="max-w-3xl font-display text-6xl leading-[1.08] text-paper sm:text-7xl lg:text-8xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="mt-8 max-w-lg text-lg text-paper/70"
        >
          {settings.subTagline} — an independent firm of Accountants and Tax
          Advisors, working alongside you as an extended part of your team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="/contact" variant="primary">
            Book a consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton
            href="/services"
            variant="secondary"
            className="border-paper/30 text-paper hover:border-paper hover:text-paper"
          >
            Explore services
          </MagneticButton>
        </motion.div>

        {heroMetric && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 flex items-center gap-4"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/20 bg-paper/10 text-paper backdrop-blur">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="font-display text-2xl leading-none text-paper">
                {heroMetric.value !== null ? `${heroMetric.value}${heroMetric.suffix}` : heroMetric.display}
              </p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-paper/50">
                {heroMetric.label}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="absolute bottom-10 right-10 hidden flex-col items-center gap-2 text-paper/50 lg:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-px bg-paper/30"
        />
      </motion.div>
    </section>
  );
}
