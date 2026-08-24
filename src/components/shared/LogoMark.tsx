import { cn } from "@/lib/utils";

/**
 * The real logo artwork, recolored with the site's signature burgundy-to-gold
 * gradient (the same formula used on every card's top accent bar and on
 * primary buttons) instead of its native flat single-tone burgundy — which is
 * what read as dull and disconnected from the rest of the theme. The PNG is
 * used purely as an alpha mask so the shape is untouched; only the fill
 * changes. Renders a div, not an <img>, since a gradient fill requires a
 * background rather than an image `src`.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Kings Accountants Ltd — Accountants and Tax Advisors"
      className={cn(
        "inline-block aspect-[940/201] w-auto shrink-0 bg-gradient-to-r from-brand-500 via-brand-700 to-gilt-500",
        "[mask-image:url('/logo/kings-accountants-logo.png')] [mask-position:left_center] [mask-repeat:no-repeat] [mask-size:contain]",
        "[-webkit-mask-image:url('/logo/kings-accountants-logo.png')] [-webkit-mask-position:left_center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]",
        className
      )}
    />
  );
}
