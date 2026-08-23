import Link from "next/link";
import { Plus } from "lucide-react";
import { dbConnect } from "@/lib/db";
import { FactsheetCategory, Factsheet } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminFactsheetCategoriesPage() {
  await dbConnect();
  const categories = await FactsheetCategory.find().sort({ order: 1 }).lean();
  const counts = await Factsheet.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$categorySlug", count: { $sum: 1 } } },
  ]);
  const countBySlug = new Map(counts.map((c) => [c._id, c.count]));

  return (
    <div>
      <Link
        href="/admin/factsheets"
        className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-brand-300"
      >
        ← All factsheets
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">Factsheet Categories</h1>
          <p className="mt-2 text-sm text-ink-400">{categories.length} total</p>
        </div>
        <Link
          href="/admin/factsheets/categories/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          New category
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-paper/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper/[0.04] text-xs uppercase tracking-[0.16em] text-ink-400">
            <tr>
              <th className="px-6 py-4 font-normal">Category</th>
              <th className="hidden px-6 py-4 font-normal lg:table-cell">Slug</th>
              <th className="px-6 py-4 font-normal">Factsheets</th>
              <th className="px-6 py-4 font-normal">Order</th>
              <th className="px-6 py-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper/[0.07]">
            {categories.map((category) => (
              <tr
                key={String(category._id)}
                className="bg-paper/[0.015] transition-colors hover:bg-paper/[0.04]"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/factsheets/categories/${category._id}`}
                    className="text-paper hover:text-brand-300"
                  >
                    {category.title}
                  </Link>
                </td>
                <td className="hidden px-6 py-4 font-mono text-xs text-ink-400 lg:table-cell">
                  {category.slug}
                </td>
                <td className="px-6 py-4 text-ink-300">{countBySlug.get(category.slug) ?? 0}</td>
                <td className="px-6 py-4 text-ink-300">{category.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      category.isActive
                        ? "rounded-full bg-brand-700/30 px-3 py-1 text-xs text-brand-200"
                        : "rounded-full border border-paper/15 px-3 py-1 text-xs text-ink-400"
                    }
                  >
                    {category.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
