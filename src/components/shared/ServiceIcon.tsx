import {
  Award,
  BookOpen,
  Building2,
  FileCheck2,
  Headset,
  Landmark,
  LineChart,
  Smile,
  Sparkles,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icons are stored as names in the DB so the CMS can set them without shipping
 * components. Anything unrecognised falls back to a neutral mark rather than
 * rendering nothing.
 */
const ICONS: Record<string, LucideIcon> = {
  FileCheck2,
  BookOpen,
  Building2,
  LineChart,
  Landmark,
  Users,
  Award,
  TrendingUp,
  Trophy,
  Smile,
  UserCheck,
  Headset,
};

export const ICON_NAMES = Object.keys(ICONS);

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={cn("h-6 w-6", className)} strokeWidth={1.4} />;
}
