import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { Reveal } from "@/components/shared/Reveal";
import type { CaseStudyView } from "@/lib/content";

/** Fixed grid of case studies — no scroll-jacking or horizontal scroll. */
export function CaseStudiesCarousel({ caseStudies }: { caseStudies: CaseStudyView[] }) {
  return (
    <section className="bg-paper-dim py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-700">
                <span className="h-px w-8 bg-brand-700" />
                Success stories
              </p>
            </Reveal>
            <ScrollHeading
              lines={["Real mandates.", "Measurable outcomes."]}
              className="max-w-2xl font-display text-4xl leading-[1.2] text-ink-900 sm:text-5xl"
            />
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/insights"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-brand-700"
            >
              All insights
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {caseStudies.map((caseStudy, index) => (
            <Reveal key={caseStudy.slug} delay={index * 0.08}>
              <CaseStudyCard caseStudy={caseStudy} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudyView }) {
  return (
    <Link
      href={`/insights/${caseStudy.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-paper shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]"
    >
      {caseStudy.coverImage && (
        <div className="relative h-40 shrink-0 overflow-hidden">
          <Image
            src={caseStudy.coverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 34vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/10 to-transparent" />
          <div className="absolute inset-0 bg-brand-900/10 mix-blend-multiply" />
        </div>
      )}

      <div className="relative flex flex-1 flex-col justify-between p-9">
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand-700">
            {caseStudy.clientIndustry}
          </p>
          <h3 className="mt-4 font-display text-2xl leading-snug text-ink-900">
            {caseStudy.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">{caseStudy.summary}</p>
        </div>

        <div className="relative">
          <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-ink-100 pt-6">
            {caseStudy.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label}>
                <p className="font-display text-lg text-ink-900">{metric.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-400">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700">
            Read the story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
