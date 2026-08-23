import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { CaseStudy } from "@/models";
import { caseStudySchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import { parseAdminBody, requireAdmin, handleApiError } from "@/lib/api-helpers";

export async function GET() {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  await dbConnect();
  const caseStudies = await CaseStudy.find().sort({ order: 1 }).lean();
  return NextResponse.json({ caseStudies });
}

export async function POST(request: Request) {
  const { error, data } = await parseAdminBody(request, caseStudySchema);
  if (error) return error;

  try {
    const caseStudy = await CaseStudy.create({
      ...data,
      slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title),
    });
    return NextResponse.json({ caseStudy }, { status: 201 });
  } catch (caught) {
    return handleApiError("case-studies.POST", caught);
  }
}
