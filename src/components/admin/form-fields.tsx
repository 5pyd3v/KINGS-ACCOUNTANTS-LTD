"use client";

import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-xl border border-paper/15 bg-ink-900 px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-ink-500 focus:border-brand-500";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2.5 block text-xs uppercase tracking-[0.18em] text-ink-400"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-300",
          checked ? "bg-brand-600" : "bg-paper/15"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform duration-300",
            checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
          )}
        />
      </span>
      <span className="text-sm text-ink-300">{label}</span>
    </button>
  );
}
