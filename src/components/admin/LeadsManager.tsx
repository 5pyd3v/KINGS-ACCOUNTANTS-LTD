"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface LeadView {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  serviceOfInterest?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  Pending: "border-gilt-400/40 bg-gilt-400/10 text-gilt-300",
  Contacted: "border-brand-400/40 bg-brand-400/10 text-brand-200",
  Converted: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
};

export function LeadsManager({ leads }: { leads: LeadView[] }) {
  const [filter, setFilter] = useState<LeadStatus | "All">("All");
  const visible = filter === "All" ? leads : leads.filter((lead) => lead.status === filter);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {(["All", ...LEAD_STATUSES] as const).map((option) => {
          const count =
            option === "All"
              ? leads.length
              : leads.filter((lead) => lead.status === option).length;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-full px-4 py-2 text-xs transition-colors",
                filter === option
                  ? "bg-brand-700 text-paper"
                  : "border border-paper/15 text-ink-400 hover:text-paper"
              )}
            >
              {option} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-10 text-center text-sm text-ink-400">
          No enquiries {filter !== "All" && `with status "${filter}"`}.
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((lead) => (
            <LeadCard key={lead._id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead }: { lead: LeadView }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [updating, setUpdating] = useState(false);

  async function changeStatus(next: LeadStatus) {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    setUpdating(true);

    try {
      const response = await fetch(`/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (!response.ok) {
        setStatus(previous);
        const data = await response.json().catch(() => ({}));
        toast.error(data.error ?? "Couldn't update the status.");
        return;
      }

      toast.success(`Marked as ${next}.`);
      router.refresh();
    } catch {
      setStatus(previous);
      toast.error("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-paper">{lead.fullName}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-400">
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-300"
            >
              <Mail className="h-3.5 w-3.5" />
              {lead.email}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-300"
              >
                <Phone className="h-3.5 w-3.5" />
                {lead.phone}
              </a>
            )}
            <span>
              {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {updating && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400" />}
          {LEAD_STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => changeStatus(option)}
              disabled={updating}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors disabled:opacity-60",
                status === option
                  ? STATUS_STYLES[option]
                  : "border-paper/15 text-ink-500 hover:text-ink-200"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {lead.serviceOfInterest && (
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-brand-300">
          {lead.serviceOfInterest}
        </p>
      )}

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-300">
        {lead.message}
      </p>
    </motion.article>
  );
}
