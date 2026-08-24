"use client";

import { useRef } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { Reveal } from "@/components/shared/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { addressInline, type SiteSettingsView } from "@/lib/site-config";

export function ContactCTA({ settings }: { settings: SiteSettingsView }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-950 py-16 text-paper sm:py-24 lg:py-32">
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-brand-800 opacity-40 blur-3xl"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "6rem 100%",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-300">
                <span className="h-px w-8 bg-brand-300" />
                Start the conversation
              </p>
            </Reveal>
            <ScrollHeading
              lines={["Let's talk about", "where you're headed."]}
              className="max-w-3xl font-display text-4xl leading-[1.2] text-paper sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-lg text-lg text-paper/60">
                A short conversation is usually enough to tell whether we are the
                right fit. No obligation, no jargon.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-10">
                <MagneticButton href="/contact" variant="primary">
                  Book a consultation
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="space-y-8 border-t border-paper/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-paper/40">Office</p>
                  <p className="mt-2 text-paper/85">{addressInline(settings.addressLines)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-paper/40">Enquiries</p>
                  <a href={`mailto:${settings.email}`} className="mt-2 block break-all text-paper/85 transition-colors hover:text-brand-300">{settings.email}</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
