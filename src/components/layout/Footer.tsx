import Image from "next/image";
import Link from "next/link";
import { getServices, getSiteSettings } from "@/lib/content";

const COMPANY_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services" },
  { href: "/factsheets", label: "Factsheets" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <footer className="border-t border-ink-100 bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo/kings-accountants-logo.png"
              alt="Kings Accountants Ltd — Accountants and Tax Advisors"
              width={940}
              height={201}
              className="h-10 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-500">
              {settings.intro}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-400">Company</p>
            <ul className="mt-6 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-400">Services</p>
            <ul className="mt-6 space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-400">Contact</p>
            <address className="mt-6 space-y-3 not-italic text-sm text-ink-600">
              <span className="block leading-relaxed">
                {settings.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <a
                href={settings.phoneHref}
                className="block transition-colors hover:text-brand-700"
              >
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="block break-all transition-colors hover:text-brand-700"
              >
                {settings.email}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Kings Accountants Ltd. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">
            {settings.addressLines[settings.addressLines.length - 2] ?? "Birmingham"},
            United Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
