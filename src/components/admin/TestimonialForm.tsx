"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Field, Toggle, fieldClass } from "@/components/admin/form-fields";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { cn } from "@/lib/utils";

export interface TestimonialFormValues {
  _id?: string;
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  featured: boolean;
  isActive: boolean;
}

const EMPTY: TestimonialFormValues = {
  clientName: "",
  role: "",
  company: "",
  quote: "",
  rating: 5,
  featured: false,
  isActive: true,
};

export function TestimonialForm({ initial }: { initial?: TestimonialFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial?._id);
  const [values, setValues] = useState<TestimonialFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof TestimonialFormValues>(
    key: K,
    value: TestimonialFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const endpoint = isEdit ? `/api/testimonials/${initial!._id}` : "/api/testimonials";

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, rating: Number(values.rating) }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Couldn't save that.");
        return;
      }

      toast.success(isEdit ? "Testimonial updated." : "Testimonial created.");
      router.push("/admin/testimonials");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        All testimonials
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">
          {isEdit ? "Edit testimonial" : "New testimonial"}
        </h1>
        {isEdit && (
          <DeleteButton
            endpoint={`/api/testimonials/${initial!._id}`}
            label="Testimonial"
            redirectTo="/admin/testimonials"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Client name" htmlFor="clientName">
            <input
              id="clientName"
              required
              value={values.clientName}
              onChange={(event) => set("clientName", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Role" htmlFor="role" hint="Optional.">
            <input
              id="role"
              value={values.role}
              onChange={(event) => set("role", event.target.value)}
              className={fieldClass}
              placeholder="Managing Director"
            />
          </Field>
          <Field label="Company" htmlFor="company" hint="Optional.">
            <input
              id="company"
              value={values.company}
              onChange={(event) => set("company", event.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field label="Quote" htmlFor="quote">
          <textarea
            id="quote"
            required
            rows={5}
            value={values.quote}
            onChange={(event) => set("quote", event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <div>
          <p className="mb-2.5 text-xs uppercase tracking-[0.18em] text-ink-400">Rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => set("rating", star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                className="p-1"
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    star <= values.rating
                      ? "fill-current text-brand-400"
                      : "text-ink-600"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-8 pt-2">
          <Toggle
            label="Featured"
            checked={values.featured}
            onChange={(value) => set("featured", value)}
          />
          <Toggle
            label="Active (visible on the site)"
            checked={values.isActive}
            onChange={(value) => set("isActive", value)}
          />
        </div>

        <div className="flex items-center gap-4 border-t border-paper/10 pt-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-brand-600 disabled:opacity-70"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create testimonial"}
          </button>
          <Link
            href="/admin/testimonials"
            className="text-sm text-ink-400 transition-colors hover:text-paper"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
