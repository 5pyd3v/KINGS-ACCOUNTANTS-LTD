import { NextResponse } from "next/server";
import { CaseStudy } from "@/models";
import { caseStudySchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import { parseAdminBody, requireAdmin, handleApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error, data } = await parseAdminBody(request, caseStudySchema);
  if (error) return error;

  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      { ...data, slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title) },
      { new: true, runValidators: true }
    );
    if (!caseStudy) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ caseStudy });
  } catch (caught) {
    return handleApiError("case-studies.PUT", caught);
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
    const deleted = await CaseStudy.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (caught) {
    return handleApiError("case-studies.DELETE", caught);
  }
}
