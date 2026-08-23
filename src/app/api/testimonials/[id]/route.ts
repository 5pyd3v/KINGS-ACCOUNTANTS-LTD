import { NextResponse } from "next/server";
import { Testimonial } from "@/models";
import { testimonialSchema } from "@/lib/validation";
import { parseAdminBody, requireAdmin, handleApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error, data } = await parseAdminBody(request, testimonialSchema);
  if (error) return error;

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ testimonial });
  } catch (caught) {
    return handleApiError("testimonials.PUT", caught);
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
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (caught) {
    return handleApiError("testimonials.DELETE", caught);
  }
}
