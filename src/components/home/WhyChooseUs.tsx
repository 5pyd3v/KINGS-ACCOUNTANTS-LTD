"use client";

import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { FeatureCard } from "@/components/shared/FeatureCard";
import type { SiteSettingsView } from "@/lib/site-config";

export function WhyChooseUs({ settings }: { settings: SiteSettingsView }) {
  return (
    <section className="relative overflow-hidden bg-paper-dim py-28">
      <div className="pointer-events-none absolute left-1/3 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-50 opacity-50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-700">
                <span className="h-px w-8 bg-brand-700" />
                Why choose us
              </p>
            </Reveal>
            <ScrollHeading
              lines={[settings.welcomeHeadline]}
              className="max-w-md font-display text-4xl leading-[1.25] text-ink-900 sm:text-[2.75rem]"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-ink-500">
                {settings.valueProposition}
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {settings.whyChooseUs.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.06}>
                <FeatureCard
                  iconName={pillar.iconName}
                  title={pillar.title}
                  body={pillar.body}
                  spotlight={index === 0}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
