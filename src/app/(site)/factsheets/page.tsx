import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { IconBadge } from "@/components/shared/IconBadge";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getFactsheetCategories, getSiteSettings } from "@/lib/content";
import receptionImage from "../../../../public/images/office-reception.jpg";

export const metadata: Metadata = {
  title: "Factsheets",
  description:
    "Browse our library of factsheets covering tax, employment, VAT, pensions and more.",
};

export default async function FactsheetsPage() {
  const [categories, settings] = await Promise.all([
    getFactsheetCategories(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        lines={["Factsheets."]}
        intro="A library of practical guides covering the topics that come up most often — organised by subject area."
        image={receptionImage}
      />

      <section className="bg-paper py-14 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 0.05}>
                <Link
                  href={`/factsheets/${category.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-b from-paper to-paper-dim/60 p-7 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-500 via-brand-600 to-gilt-500" />
                  <div className="relative">
                    <IconBadge name="BookOpen" size="sm" />
                    <h2 className="mt-5 font-display text-xl leading-snug text-ink-900">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="mt-3 text-sm leading-relaxed text-ink-500">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700">
                    View factsheets
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
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
