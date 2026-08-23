"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { ServiceIcon } from "@/components/shared/ServiceIcon";
import type { ServiceView } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Bento rhythm across a 3-column grid: wide + narrow, three equal, full width.
 * Sums to exactly 9 units for six services so every row ends flush.
 */
const SPANS = [
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-3",
];

export function ServicesBento({ services }: { services: ServiceView[] }) {
  return (
    <section id="services" className="relative overflow-hidden bg-paper py-28">
      <div className="pointer-events-none absolute -left-32 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-50 opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gilt-200 opacity-40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-700">
                <span className="h-px w-8 bg-brand-700" />
                What we do
              </p>
            </Reveal>
            <ScrollHeading
              lines={["Advisory built around", "how you actually operate."]}
              className="max-w-2xl font-display text-4xl leading-[1.2] text-ink-900 sm:text-5xl"
            />
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-brand-700"
            >
              All services
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.07} className={cn(SPANS[index % SPANS.length])}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-ink-100 bg-paper p-8 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] transition-all duration-500 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]"
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-ink-100 bg-gradient-to-br from-paper to-paper-dim text-brand-700 shadow-[0_2px_8px_-2px_rgba(26,22,19,0.1)] transition-all duration-500 group-hover:border-brand-200 group-hover:from-brand-50 group-hover:to-brand-100/60">
                      <ServiceIcon name={service.iconName} />
                    </span>
                    <h3 className="mt-7 font-display text-xl leading-snug text-ink-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                      {service.brief}
                    </p>
                  </div>

                  <span className="relative mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
