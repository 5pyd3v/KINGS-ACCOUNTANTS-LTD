"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { FeatureCard } from "@/components/shared/FeatureCard";
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
    <section id="services" className="relative overflow-hidden bg-paper py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-50 opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gilt-200 opacity-40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col justify-between gap-8 sm:mb-16 lg:flex-row lg:items-end">
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
              <FeatureCard
                href={`/services/${service.slug}`}
                iconName={service.iconName}
                title={service.title}
                body={service.brief}
                cta="Learn more"
                spotlight={index === 0}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
