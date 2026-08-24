import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models";
import { serviceSchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import {
  parseAdminBody,
  requireAdmin,
  handleApiError,
  revalidateServices,
} from "@/lib/api-helpers";

export async function GET() {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  await dbConnect();
  const services = await Service.find().sort({ order: 1 }).lean();
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const { error, data } = await parseAdminBody(request, serviceSchema);
  if (error) return error;

  try {
    const service = await Service.create({
      ...data,
      slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title),
    });
    revalidateServices();
    return NextResponse.json({ service }, { status: 201 });
  } catch (caught) {
    return handleApiError("services.POST", caught);
  }
}
