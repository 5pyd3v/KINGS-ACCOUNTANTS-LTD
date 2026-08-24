import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { FactsheetCategory } from "@/models";
import { factsheetCategorySchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import {
  parseAdminBody,
  requireAdmin,
  handleApiError,
  revalidateFactsheets,
} from "@/lib/api-helpers";

export async function GET() {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  await dbConnect();
  const categories = await FactsheetCategory.find().sort({ order: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const { error, data } = await parseAdminBody(request, factsheetCategorySchema);
  if (error) return error;

  try {
    const category = await FactsheetCategory.create({
      ...data,
      slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title),
    });
    revalidateFactsheets();
    return NextResponse.json({ category }, { status: 201 });
  } catch (caught) {
    return handleApiError("factsheet-categories.POST", caught);
  }
}
