import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ContactCTA } from "@/components/home/ContactCTA";
import {
  getFactsheetBySlug,
  getFactsheetCategories,
  getFactsheetCategoryBySlug,
  getFactsheetsByCategory,
  getSiteSettings,
} from "@/lib/content";

export async function generateStaticParams() {
  const categories = await getFactsheetCategories();
  const params: { category: string; slug: string }[] = [];
  for (const category of categories) {
    const factsheets = await getFactsheetsByCategory(category.slug);
    for (const factsheet of factsheets) {
      params.push({ category: category.slug, slug: factsheet.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const factsheet = await getFactsheetBySlug(categorySlug, slug);
  if (!factsheet) return { title: "Factsheet not found" };
  return { title: factsheet.title, description: factsheet.summary };
}

export default async function FactsheetDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const [category, factsheet, settings] = await Promise.all([
    getFactsheetCategoryBySlug(categorySlug),
    getFactsheetBySlug(categorySlug, slug),
    getSiteSettings(),
  ]);

  if (!category || !factsheet) notFound();

  return (
    <>
      <PageHeader eyebrow={category.title} lines={[factsheet.title]} />

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href={`/factsheets/${category.slug}`}
            className="group mb-14 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All {category.title} factsheets
          </Link>

          {factsheet.body.length > 0 ? (
            <div className="space-y-6 text-lg leading-relaxed text-ink-600">
              {factsheet.body.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.05}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-9">
                <h2 className="font-display text-xl text-ink-900">
                  This factsheet is being prepared
                </h2>
                <p className="mt-4 leading-relaxed text-ink-600">
                  {factsheet.summary ||
                    "We're preparing full guidance on this topic. In the meantime, get in touch and we'll be glad to help directly."}
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-700 transition-colors hover:text-brand-600"
                >
                  <Mail className="h-4 w-4" />
                  Contact us about {factsheet.title.toLowerCase()}
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <ContactCTA settings={settings} />
    </>
  );
}
