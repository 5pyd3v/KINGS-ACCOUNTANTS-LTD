import { getSiteSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">Site Settings</h1>
      <p className="mt-2 text-sm text-ink-400">
        Firm messaging, contact details, trust metrics and the pillars shown across the site.
      </p>
      <SettingsForm initial={settings} />
    </div>
  );
}
