"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { LogoMark } from "@/components/shared/LogoMark";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/factsheets", label: "Factsheets" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full border border-ink-200/70 bg-paper/95 shadow-[0_8px_32px_-12px_rgba(26,22,19,0.18)] transition-[padding] duration-500 ease-out md:bg-paper/70 md:backdrop-blur-md",
            scrolled ? "px-5 py-2.5" : "px-6 py-3.5"
          )}
        >
          <Link href="/" className="shrink-0" aria-label="Kings Accountants Ltd — home">
            <LogoMark
              className={cn(
                "transition-[height] duration-500 ease-out",
                scrolled ? "h-9" : "h-11"
              )}
            />
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative py-1 font-display text-[15px] tracking-wide transition-colors duration-300",
                      active ? "text-brand-700" : "text-ink-600 hover:text-brand-700"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-brand-700"
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                "hidden rounded-full bg-brand-700 text-sm font-medium text-paper transition-[padding,background-color] duration-500 hover:bg-brand-600 sm:inline-flex",
                scrolled ? "px-5 py-2" : "px-6 py-2.5"
              )}
            >
              Get in touch
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-paper md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <LogoMark className="h-9" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-2 px-6">
              {LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-ink-100 py-5 font-display text-3xl text-ink-900"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 pt-10">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-700 px-6 py-4 text-sm font-medium text-paper"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
