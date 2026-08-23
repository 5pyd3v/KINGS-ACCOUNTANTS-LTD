import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { CaseStudy } from "@/models";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const caseStudy = await CaseStudy.findById(id).lean().catch(() => null);
  if (!caseStudy) notFound();

  return (
    <CaseStudyForm
      initial={{
        _id: String(caseStudy._id),
        title: caseStudy.title,
        slug: caseStudy.slug,
        clientIndustry: caseStudy.clientIndustry,
        summary: caseStudy.summary,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        result: caseStudy.result,
        takeaway: caseStudy.takeaway,
        coverImage: caseStudy.coverImage ?? "",
        metrics: (caseStudy.metrics ?? []).map((metric) => ({
          label: metric.label,
          value: metric.value,
        })),
        isFeatured: caseStudy.isFeatured,
        isActive: caseStudy.isActive,
        order: caseStudy.order,
      }}
    />
  );
}
