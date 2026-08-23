import { dbConnect } from "@/lib/db";
import { FactsheetCategory } from "@/models";
import { FactsheetForm } from "@/components/admin/FactsheetForm";

export const dynamic = "force-dynamic";

export default async function AdminFactsheetNewPage() {
  await dbConnect();
  const categories = await FactsheetCategory.find().sort({ order: 1 }).lean();

  return (
    <FactsheetForm
      categories={categories.map((category) => ({ slug: category.slug, title: category.title }))}
    />
  );
}
