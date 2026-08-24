import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getCaseStudies, getCaseStudyBySlug, getSiteSettings } from "@/lib/content";

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) return { title: "Case study not found" };
  return { title: caseStudy.title, description: caseStudy.summary };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [caseStudy, settings] = await Promise.all([
    getCaseStudyBySlug(slug),
    getSiteSettings(),
  ]);

  if (!caseStudy) notFound();

  const sections = [
    { label: "The challenge", body: caseStudy.challenge },
    { label: "Our approach", body: caseStudy.solution },
    { label: "The result", body: caseStudy.result },
  ];

  return (
    <>
      <PageHeader
        eyebrow={caseStudy.clientIndustry}
        lines={[caseStudy.title]}
        intro={caseStudy.summary}
      />

      {caseStudy.coverImage && (
        <div className="bg-paper px-6 pt-16">
          <Reveal>
            <div className="relative mx-auto h-[22rem] w-full max-w-6xl overflow-hidden rounded-2xl sm:h-[28rem]">
              <Image
                src={caseStudy.coverImage}
                alt={caseStudy.title}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-brand-900/10 mix-blend-multiply" />
            </div>
          </Reveal>
        </div>
      )}

      <section className="bg-paper py-14 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/insights"
            className="group mb-14 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All insights
          </Link>

          {caseStudy.metrics.length > 0 && (
            <Reveal>
              <div className="mb-20 grid gap-px overflow-hidden rounded-2xl border border-brand-100 bg-brand-100 sm:grid-cols-3">
                {caseStudy.metrics.map((metric) => (
                  <div key={metric.label} className="bg-brand-50 px-8 py-10">
                    <p className="font-display text-3xl text-brand-800">{metric.value}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-brand-600/70">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <div className="grid gap-14 lg:grid-cols-[1fr_2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-400">Sector</p>
              <p className="mt-3 font-display text-xl text-ink-900">
                {caseStudy.clientIndustry}
              </p>
            </div>

            <div className="space-y-14">
              {sections.map((section, index) => (
                <Reveal key={section.label} delay={index * 0.06}>
                  <div>
                    <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-brand-700">
                      {section.label}
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-ink-600">{section.body}</p>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.2}>
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-9">
                  <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-brand-700">
                    The takeaway
                  </h2>
                  <p className="mt-5 font-display text-xl leading-relaxed text-ink-900">
                    {caseStudy.takeaway}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA settings={settings} />
    </>
  );
}
