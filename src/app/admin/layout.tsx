import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // The sign-in page renders inside this layout but must not show the shell.
  if (!session) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider session={session}>
      <AdminShell userEmail={session.user?.email}>{children}</AdminShell>
    </SessionProvider>
  );
}
