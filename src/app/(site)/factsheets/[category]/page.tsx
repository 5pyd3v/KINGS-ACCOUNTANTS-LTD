import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { IconBadge } from "@/components/shared/IconBadge";
import { ContactCTA } from "@/components/home/ContactCTA";
import {
  getFactsheetCategories,
  getFactsheetCategoryBySlug,
  getFactsheetsByCategory,
  getSiteSettings,
} from "@/lib/content";

export async function generateStaticParams() {
  const categories = await getFactsheetCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getFactsheetCategoryBySlug(categorySlug);
  if (!category) return { title: "Category not found" };
  return { title: `${category.title} Factsheets`, description: category.description };
}

export default async function FactsheetCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const [category, factsheets, settings] = await Promise.all([
    getFactsheetCategoryBySlug(categorySlug),
    getFactsheetsByCategory(categorySlug),
    getSiteSettings(),
  ]);

  if (!category) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Factsheets"
        lines={[category.title]}
        intro={category.description || undefined}
      />

      <section className="bg-paper py-14 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/factsheets"
            className="group mb-14 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All factsheets
          </Link>

          <div className="divide-y divide-ink-100 border-y border-ink-100">
            {factsheets.map((factsheet, index) => (
              <Reveal key={factsheet.slug} delay={index * 0.03}>
                <Link
                  href={`/factsheets/${category.slug}/${factsheet.slug}`}
                  className="group grid gap-4 rounded-2xl py-7 transition-all duration-300 hover:-mx-6 hover:bg-paper-dim hover:px-6 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_16px_40px_-20px_rgba(26,22,19,0.14)] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8"
                >
                  <IconBadge name="FileCheck2" size="sm" />
                  <div>
                    <h2 className="font-display text-lg leading-snug text-ink-900 transition-colors duration-300 group-hover:text-brand-700">
                      {factsheet.title}
                    </h2>
                    {factsheet.summary && (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
                        {factsheet.summary}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700 md:self-center">
                    Read more
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
