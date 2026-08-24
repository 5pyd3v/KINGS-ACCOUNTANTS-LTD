import { NextResponse } from "next/server";
import { FactsheetCategory, Factsheet } from "@/models";
import { factsheetCategorySchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import {
  parseAdminBody,
  requireAdmin,
  handleApiError,
  revalidateFactsheets,
} from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error, data } = await parseAdminBody(request, factsheetCategorySchema);
  if (error) return error;

  try {
    const previous = await FactsheetCategory.findById(id);
    if (!previous) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const nextSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);

    const category = await FactsheetCategory.findByIdAndUpdate(
      id,
      { ...data, slug: nextSlug },
      { new: true, runValidators: true }
    );

    // categorySlug on Factsheet is denormalised for simpler queries — keep it
    // in sync if the category's slug changes, so its factsheets aren't orphaned.
    if (previous.slug !== nextSlug) {
      await Factsheet.updateMany({ categorySlug: previous.slug }, { categorySlug: nextSlug });
    }

    revalidateFactsheets();
    return NextResponse.json({ category });
  } catch (caught) {
    return handleApiError("factsheet-categories.PUT", caught);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  const { id } = await params;
  try {
    await dbConnect();
    const deleted = await FactsheetCategory.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    await Factsheet.deleteMany({ categorySlug: deleted.slug });
    revalidateFactsheets();
    return NextResponse.json({ ok: true });
  } catch (caught) {
    return handleApiError("factsheet-categories.DELETE", caught);
  }
}
