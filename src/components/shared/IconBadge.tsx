import { ServiceIcon } from "@/components/shared/ServiceIcon";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
};

const ICON_SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

/** Solid gradient-filled icon chip — the site's default colored icon treatment. */
export function IconBadge({
  name,
  size = "md",
  spotlight = false,
  className,
}: {
  name: string;
  size?: keyof typeof SIZES;
  /** Gold-on-dark variant, for use on dark ("spotlight") card surfaces. */
  spotlight?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-500",
        SIZES[size],
        spotlight
          ? "bg-gradient-to-br from-gilt-400 to-gilt-600 text-ink-950 shadow-[0_8px_20px_-6px_rgba(180,146,79,0.55)] ring-gilt-300/40"
          : "bg-gradient-to-br from-brand-600 to-brand-800 text-paper shadow-[0_8px_20px_-6px_rgba(139,26,58,0.45)] ring-brand-900/10 group-hover:shadow-[0_10px_28px_-6px_rgba(139,26,58,0.6)]",
        className
      )}
    >
      <ServiceIcon name={name} className={ICON_SIZES[size]} />
    </span>
  );
}
