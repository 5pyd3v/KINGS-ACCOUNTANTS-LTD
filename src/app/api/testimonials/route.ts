import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/models";
import { testimonialSchema } from "@/lib/validation";
import { parseAdminBody, requireAdmin, handleApiError } from "@/lib/api-helpers";

export async function GET() {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  await dbConnect();
  const testimonials = await Testimonial.find().sort({ featured: -1, createdAt: -1 }).lean();
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const { error, data } = await parseAdminBody(request, testimonialSchema);
  if (error) return error;

  try {
    const testimonial = await Testimonial.create(data);
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (caught) {
    return handleApiError("testimonials.POST", caught);
  }
}
