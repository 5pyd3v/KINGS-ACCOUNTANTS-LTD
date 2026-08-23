import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  // Only accept same-site relative paths, so the callback can't be used as an
  // open redirect to an external host.
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <LoginForm callbackUrl={safeCallback} />
    </div>
  );
}
