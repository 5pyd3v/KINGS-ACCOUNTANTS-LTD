import Link from "next/link";
import { FolderCog, Plus } from "lucide-react";
import { dbConnect } from "@/lib/db";
import { FactsheetCategory, Factsheet } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminFactsheetsPage() {
  await dbConnect();
  const [categories, factsheets] = await Promise.all([
    FactsheetCategory.find().sort({ order: 1 }).lean(),
    Factsheet.find().sort({ categorySlug: 1, order: 1 }).lean(),
  ]);

  const factsheetsByCategory = new Map<string, typeof factsheets>();
  for (const factsheet of factsheets) {
    const list = factsheetsByCategory.get(factsheet.categorySlug) ?? [];
    list.push(factsheet);
    factsheetsByCategory.set(factsheet.categorySlug, list);
  }

  const withContent = factsheets.filter((f) => (f.body ?? "").trim().length > 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">Factsheets</h1>
          <p className="mt-2 text-sm text-ink-400">
            {factsheets.length} factsheets across {categories.length} categories &middot;{" "}
            {withContent} with published content
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/factsheets/categories"
            className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-5 py-2.5 text-sm text-ink-200 transition-colors hover:border-brand-500/50"
          >
            <FolderCog className="h-4 w-4" />
            Manage categories
          </Link>
          <Link
            href="/admin/factsheets/new"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            New factsheet
          </Link>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => {
          const items = factsheetsByCategory.get(category.slug) ?? [];
          return (
            <section key={String(category._id)}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg text-paper">{category.title}</h2>
                <span className="text-xs text-ink-500">{items.length} factsheets</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-paper/10">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-paper/[0.07]">
                    {items.map((factsheet) => {
                      const hasContent = (factsheet.body ?? "").trim().length > 0;
                      return (
                        <tr
                          key={String(factsheet._id)}
                          className="bg-paper/[0.015] transition-colors hover:bg-paper/[0.04]"
                        >
                          <td className="px-6 py-3.5">
                            <Link
                              href={`/admin/factsheets/${factsheet._id}`}
                              className="text-paper hover:text-brand-300"
                            >
                              {factsheet.title}
                            </Link>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <span
                              className={
                                hasContent
                                  ? "rounded-full bg-brand-700/30 px-3 py-1 text-xs text-brand-200"
                                  : "rounded-full border border-paper/15 px-3 py-1 text-xs text-ink-400"
                              }
                            >
                              {hasContent ? "Published" : "Placeholder"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td className="px-6 py-4 text-xs text-ink-500" colSpan={2}>
                          No factsheets in this category yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
