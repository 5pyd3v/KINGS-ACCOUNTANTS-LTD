"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DeleteButton({
  endpoint,
  label,
  redirectTo,
}: {
  endpoint: string;
  label: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      // Reset the confirm state so a stray click can't delete much later.
      setTimeout(() => setConfirming(false), 4000);
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Couldn't delete that.");
        return;
      }

      toast.success(`${label} deleted.`);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors disabled:opacity-60",
        confirming
          ? "border-brand-500 bg-brand-700 text-paper"
          : "border-paper/15 text-ink-400 hover:border-brand-500/60 hover:text-brand-300"
      )}
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      {confirming ? "Click again to confirm" : "Delete"}
    </button>
  );
}
