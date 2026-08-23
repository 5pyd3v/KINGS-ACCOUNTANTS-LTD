import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { dbConnect } from "@/lib/db";
import { CaseStudy } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  await dbConnect();
  const caseStudies = await CaseStudy.find().sort({ order: 1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">Case Studies</h1>
          <p className="mt-2 text-sm text-ink-400">{caseStudies.length} total</p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          New case study
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-paper/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper/[0.04] text-xs uppercase tracking-[0.16em] text-ink-400">
            <tr>
              <th className="px-6 py-4 font-normal">Title</th>
              <th className="hidden px-6 py-4 font-normal md:table-cell">Industry</th>
              <th className="px-6 py-4 font-normal">Order</th>
              <th className="px-6 py-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper/[0.07]">
            {caseStudies.map((caseStudy) => (
              <tr
                key={String(caseStudy._id)}
                className="bg-paper/[0.015] transition-colors hover:bg-paper/[0.04]"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/case-studies/${caseStudy._id}`}
                    className="flex items-center gap-2 text-paper hover:text-brand-300"
                  >
                    {caseStudy.isFeatured && (
                      <Star className="h-3.5 w-3.5 fill-current text-brand-400" />
                    )}
                    {caseStudy.title}
                  </Link>
                </td>
                <td className="hidden px-6 py-4 text-ink-300 md:table-cell">
                  {caseStudy.clientIndustry}
                </td>
                <td className="px-6 py-4 text-ink-300">{caseStudy.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      caseStudy.isActive
                        ? "rounded-full bg-brand-700/30 px-3 py-1 text-xs text-brand-200"
                        : "rounded-full border border-paper/15 px-3 py-1 text-xs text-ink-400"
                    }
                  >
                    {caseStudy.isActive ? "Active" : "Hidden"}
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
