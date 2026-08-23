import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Lead } from "@/models";
import { leadSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";

/** Public: submit a contact enquiry. */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  if (!process.env.MONGODB_URI) {
    console.error("[leads] MONGODB_URI is not configured — enquiry not saved.");
    return NextResponse.json(
      { error: "The enquiry service is not available right now. Please email us directly." },
      { status: 503 }
    );
  }

  try {
    await dbConnect();
    await Lead.create(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[leads] Failed to save enquiry:", error);
    return NextResponse.json(
      { error: "We couldn't submit your enquiry. Please try again or email us directly." },
      { status: 500 }
    );
  }
}

/** Admin only: list enquiries. */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  await dbConnect();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ leads });
}
