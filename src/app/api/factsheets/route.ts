import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Factsheet } from "@/models";
import { factsheetSchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import { sanitizeFactsheetHtml } from "@/lib/sanitize-html";
import {
  parseAdminBody,
  requireAdmin,
  handleApiError,
  revalidateFactsheets,
} from "@/lib/api-helpers";

export async function GET(request: Request) {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("categorySlug");

  const factsheets = await Factsheet.find(categorySlug ? { categorySlug } : {})
    .sort({ categorySlug: 1, order: 1 })
    .lean();
  return NextResponse.json({ factsheets });
}

export async function POST(request: Request) {
  const { error, data } = await parseAdminBody(request, factsheetSchema);
  if (error) return error;

  try {
    const factsheet = await Factsheet.create({
      ...data,
      slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title),
      body: data.body ? sanitizeFactsheetHtml(data.body) : "",
    });
    revalidateFactsheets();
    return NextResponse.json({ factsheet }, { status: 201 });
  } catch (caught) {
    return handleApiError("factsheets.POST", caught);
  }
}
