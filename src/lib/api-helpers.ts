import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }
  return null;
}

/**
 * Guards an admin mutation: checks the session, connects to the DB, and
 * validates the JSON body. Returns either an error response to bail with, or
 * the parsed data.
 */
export async function parseAdminBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<{ error: NextResponse; data?: never } | { error?: never; data: T }> {
  const unauthorised = await requireAdmin();
  if (unauthorised) return { error: unauthorised };

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return { error: NextResponse.json({ error: "Invalid request body." }, { status: 400 }) };
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: NextResponse.json(
        { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      ),
    };
  }

  await dbConnect();
  return { data: parsed.data };
}

export function handleApiError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
  const message =
    error instanceof Error && error.message.includes("duplicate key")
      ? "That slug is already in use. Please choose another."
      : "Something went wrong. Please try again.";
  return NextResponse.json({ error: message }, { status: 500 });
}
