"use client";

import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { ServiceIcon } from "@/components/shared/ServiceIcon";
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
                <div className="group h-full rounded-2xl border border-ink-100 bg-paper p-7 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-100 bg-gradient-to-br from-paper-dim to-paper text-brand-700 shadow-[0_2px_8px_-2px_rgba(26,22,19,0.1)] transition-all duration-500 group-hover:border-brand-200 group-hover:from-brand-50 group-hover:to-brand-100/60">
                    <ServiceIcon name={pillar.iconName} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-lg text-ink-900">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
