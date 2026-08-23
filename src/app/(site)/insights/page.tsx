import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getCaseStudies, getSiteSettings } from "@/lib/content";
import insightsImage from "../../../../public/images/case-tech.jpg";

export const metadata: Metadata = {
  title: "Insights & Case Studies",
  description:
    "How Kings Accountants Ltd has helped businesses across technology, hospitality, e-commerce and beyond achieve measurable financial outcomes.",
};

export default async function InsightsPage() {
  const [caseStudies, settings] = await Promise.all([getCaseStudies(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        lines={["Real mandates.", "Measurable outcomes."]}
        intro="A closer look at the work behind the numbers — the challenges our clients brought us, and what changed."
        image={insightsImage}
      />

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {caseStudies.map((caseStudy, index) => (
              <Reveal key={caseStudy.slug} delay={index * 0.07}>
                <Link
                  href={`/insights/${caseStudy.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-paper shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]"
                >
                  {caseStudy.coverImage && (
                    <div className="relative h-48 shrink-0 overflow-hidden">
                      <Image
                        src={caseStudy.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-paper-dim via-paper-dim/5 to-transparent" />
                      <div className="absolute inset-0 bg-brand-900/10 mix-blend-multiply" />
                    </div>
                  )}
                  <div className="relative flex flex-1 flex-col justify-between p-9">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand-700">
                        {caseStudy.clientIndustry}
                      </p>
                      <h2 className="mt-4 max-w-md font-display text-2xl leading-snug text-ink-900">
                        {caseStudy.title}
                      </h2>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
                        {caseStudy.summary}
                      </p>
                    </div>
                    <div className="relative mt-10">
                      <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-6">
                        {caseStudy.metrics.slice(0, 3).map((metric) => (
                          <div
                            key={metric.label}
                            className="rounded-xl bg-brand-50 px-4 py-2.5 ring-1 ring-inset ring-brand-100"
                          >
                            <p className="font-display text-lg text-brand-800">{metric.value}</p>
                            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-brand-600/70">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700">
                        Read the story
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA settings={settings} />
    </>
  );
}
