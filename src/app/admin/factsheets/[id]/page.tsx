import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Factsheet, FactsheetCategory } from "@/models";
import { FactsheetForm } from "@/components/admin/FactsheetForm";

export const dynamic = "force-dynamic";

export default async function AdminFactsheetEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const [factsheet, categories] = await Promise.all([
    Factsheet.findById(id).lean().catch(() => null),
    FactsheetCategory.find().sort({ order: 1 }).lean(),
  ]);

  if (!factsheet) notFound();

  return (
    <FactsheetForm
      categories={categories.map((category) => ({ slug: category.slug, title: category.title }))}
      initial={{
        _id: String(factsheet._id),
        categorySlug: factsheet.categorySlug,
        title: factsheet.title,
        slug: factsheet.slug,
        summary: factsheet.summary ?? "",
        body: factsheet.body ?? "",
        order: factsheet.order,
        isActive: factsheet.isActive,
      }}
    />
  );
}
