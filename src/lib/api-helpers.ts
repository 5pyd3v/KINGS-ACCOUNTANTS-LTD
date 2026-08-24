import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

/**
 * Public pages are statically generated (`generateStaticParams`), so without
 * this, admin edits save to the database but never reach the live site until
 * the next full rebuild. Call the relevant one after every successful
 * create/update/delete so the affected pages regenerate on next visit.
 *
 * Every public route lives under the `(site)` route group — `revalidatePath`
 * matches on the underlying file structure, not the browser-visible URL, so
 * the group segment must be included in the pattern or the call silently
 * revalidates nothing (verified: the group-less form does not work here).
 */
export function revalidateFactsheets() {
  revalidatePath("/(site)/factsheets", "page");
  revalidatePath("/(site)/factsheets/[category]", "page");
  revalidatePath("/(site)/factsheets/[category]/[slug]", "page");
}

export function revalidateServices() {
  revalidatePath("/(site)", "page");
  revalidatePath("/(site)/contact", "page");
  revalidatePath("/(site)/services", "page");
  revalidatePath("/(site)/services/[slug]", "page");
}

export function revalidateCaseStudies() {
  revalidatePath("/(site)", "page");
  revalidatePath("/(site)/insights", "page");
  revalidatePath("/(site)/insights/[slug]", "page");
}

export function revalidateTestimonials() {
  revalidatePath("/(site)", "page");
}

/** Site settings render on every public page via ContactCTA, so revalidate everything. */
export function revalidateSiteSettings() {
  revalidatePath("/(site)", "layout");
}

export function handleApiError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
  const message =
    error instanceof Error && error.message.includes("duplicate key")
      ? "That slug is already in use. Please choose another."
      : "Something went wrong. Please try again.";
  return NextResponse.json({ error: message }, { status: 500 });
}
