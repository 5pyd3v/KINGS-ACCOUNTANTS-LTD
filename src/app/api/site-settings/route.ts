import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SiteSetting, SITE_SETTING_KEY } from "@/models";
import { siteSettingsSchema } from "@/lib/validation";
import {
  parseAdminBody,
  requireAdmin,
  handleApiError,
  revalidateSiteSettings,
} from "@/lib/api-helpers";

export async function GET() {
  const unauthorised = await requireAdmin();
  if (unauthorised) return unauthorised;

  await dbConnect();
  const settings = await SiteSetting.findOne({ key: SITE_SETTING_KEY }).lean();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const { error, data } = await parseAdminBody(request, siteSettingsSchema);
  if (error) return error;

  try {
    const settings = await SiteSetting.findOneAndUpdate(
      { key: SITE_SETTING_KEY },
      { $set: { ...data, key: SITE_SETTING_KEY } },
      { new: true, upsert: true, runValidators: true }
    );
    revalidateSiteSettings();
    return NextResponse.json({ settings });
  } catch (caught) {
    return handleApiError("site-settings.PUT", caught);
  }
}
