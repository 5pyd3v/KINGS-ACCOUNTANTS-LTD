import { NextResponse } from "next/server";
import { Factsheet } from "@/models";
import { factsheetSchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import { parseAdminBody, requireAdmin, handleApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error, data } = await parseAdminBody(request, factsheetSchema);
  if (error) return error;

  try {
    const factsheet = await Factsheet.findByIdAndUpdate(
      id,
      { ...data, slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title) },
      { new: true, runValidators: true }
    );
    if (!factsheet) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ factsheet });
  } catch (caught) {
    return handleApiError("factsheets.PUT", caught);
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
    const deleted = await Factsheet.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (caught) {
    return handleApiError("factsheets.DELETE", caught);
  }
}
