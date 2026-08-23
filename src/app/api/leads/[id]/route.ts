import { NextResponse } from "next/server";
import { Lead } from "@/models";
import { leadStatusSchema } from "@/lib/validation";
import { parseAdminBody, requireAdmin, handleApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error, data } = await parseAdminBody(request, leadStatusSchema);
  if (error) return error;

  try {
    const lead = await Lead.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true, runValidators: true }
    );
    if (!lead) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ lead });
  } catch (caught) {
    return handleApiError("leads.PATCH", caught);
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
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (caught) {
    return handleApiError("leads.DELETE", caught);
  }
}
