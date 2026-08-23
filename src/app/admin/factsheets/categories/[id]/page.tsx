import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { FactsheetCategory } from "@/models";
import { FactsheetCategoryForm } from "@/components/admin/FactsheetCategoryForm";

export const dynamic = "force-dynamic";

export default async function AdminFactsheetCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const category = await FactsheetCategory.findById(id).lean().catch(() => null);
  if (!category) notFound();

  return (
    <FactsheetCategoryForm
      initial={{
        _id: String(category._id),
        title: category.title,
        slug: category.slug,
        description: category.description ?? "",
        order: category.order,
        isActive: category.isActive,
      }}
    />
  );
}
