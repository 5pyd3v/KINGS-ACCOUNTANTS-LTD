"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/shared/LogoMark";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/factsheets", label: "Factsheets", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-ink-950 text-ink-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-paper/10 lg:flex">
        <div className="border-b border-paper/10 px-6 py-6">
          <Link href="/" className="block rounded-lg bg-paper px-3 py-2.5">
            <LogoMark className="h-7" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-brand-700 text-paper"
                        : "text-ink-300 hover:bg-paper/5 hover:text-paper"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-paper/10 px-3 py-4">
          {userEmail && (
            <p className="truncate px-3 pb-3 text-xs text-ink-400">{userEmail}</p>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-300 transition-colors hover:bg-paper/5 hover:text-paper"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.6} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        {/* Mobile nav */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-paper/10 px-4 py-3 lg:hidden">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs transition-colors",
                  active ? "bg-brand-700 text-paper" : "text-ink-300 hover:text-paper"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="px-6 py-10 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
