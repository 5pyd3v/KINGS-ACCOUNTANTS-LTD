import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  iconName: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
  /** Dark gradient surface with a gold icon — used sparingly for visual rhythm in a grid. */
  spotlight?: boolean;
  iconSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/** The site's standard icon + title + body card, with a colored top accent and icon badge by default. */
export function FeatureCard({
  iconName,
  title,
  body,
  href,
  cta,
  spotlight = false,
  iconSize = "md",
  className,
}: FeatureCardProps) {
  const content = (
    <>
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[3px]",
          spotlight
            ? "bg-gradient-to-r from-gilt-400 via-gilt-500 to-brand-400"
            : "bg-gradient-to-r from-brand-500 via-brand-600 to-gilt-500"
        )}
      />
      {!spotlight && (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}
      <div className="relative">
        <IconBadge name={iconName} size={iconSize} spotlight={spotlight} />
        <h3
          className={cn(
            "mt-6 font-display text-xl leading-snug",
            spotlight ? "text-paper" : "text-ink-900"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed",
            spotlight ? "text-paper/65" : "text-ink-500"
          )}
        >
          {body}
        </p>
      </div>
      {cta && (
        <span
          className={cn(
            "relative mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-500",
            spotlight
              ? "text-gilt-300/80 group-hover:text-gilt-200"
              : "text-ink-400 group-hover:text-brand-700"
          )}
        >
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
    </>
  );

  const cardClass = cn(
    "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 sm:p-8",
    spotlight
      ? "bg-gradient-to-br from-ink-900 to-ink-950 shadow-[0_1px_2px_rgba(0,0,0,0.25),0_20px_48px_-18px_rgba(16,13,12,0.5)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.25),0_32px_64px_-16px_rgba(16,13,12,0.65)]"
      : "border border-ink-100 bg-gradient-to-b from-paper to-paper-dim/60 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
