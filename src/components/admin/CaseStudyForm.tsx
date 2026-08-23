"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Field, Toggle, fieldClass } from "@/components/admin/form-fields";
import { DeleteButton } from "@/components/admin/DeleteButton";

export interface CaseStudyFormValues {
  _id?: string;
  title: string;
  slug: string;
  clientIndustry: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  takeaway: string;
  coverImage: string;
  metrics: { label: string; value: string }[];
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

const EMPTY: CaseStudyFormValues = {
  title: "",
  slug: "",
  clientIndustry: "",
  summary: "",
  challenge: "",
  solution: "",
  result: "",
  takeaway: "",
  coverImage: "",
  metrics: [],
  isFeatured: false,
  isActive: true,
  order: 0,
};

export function CaseStudyForm({ initial }: { initial?: CaseStudyFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial?._id);
  const [values, setValues] = useState<CaseStudyFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CaseStudyFormValues>(key: K, value: CaseStudyFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateMetric(index: number, key: "label" | "value", value: string) {
    setValues((prev) => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) =>
        i === index ? { ...metric, [key]: value } : metric
      ),
    }));
  }

  function addMetric() {
    if (values.metrics.length >= 6) return;
    setValues((prev) => ({ ...prev, metrics: [...prev.metrics, { label: "", value: "" }] }));
  }

  function removeMetric(index: number) {
    setValues((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const endpoint = isEdit ? `/api/case-studies/${initial!._id}` : "/api/case-studies";

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          order: Number(values.order),
          metrics: values.metrics.filter((metric) => metric.label && metric.value),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Couldn't save that.");
        return;
      }

      toast.success(isEdit ? "Case study updated." : "Case study created.");
      router.push("/admin/case-studies");
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
        href="/admin/case-studies"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        All case studies
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">
          {isEdit ? "Edit case study" : "New case study"}
        </h1>
        {isEdit && (
          <DeleteButton
            endpoint={`/api/case-studies/${initial!._id}`}
            label="Case study"
            redirectTo="/admin/case-studies"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-6">
        <Field label="Title" htmlFor="title">
          <input
            id="title"
            required
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field label="Cover image" htmlFor="coverImage" hint="Path to an image in /public, e.g. /images/case-tech.jpg">
          <input
            id="coverImage"
            value={values.coverImage}
            onChange={(event) => set("coverImage", event.target.value)}
            className={fieldClass}
            placeholder="/images/case-tech.jpg"
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate.">
            <input
              id="slug"
              value={values.slug}
              onChange={(event) => set("slug", event.target.value)}
              className={fieldClass}
              placeholder="auto-generated"
            />
          </Field>
          <Field label="Client industry" htmlFor="clientIndustry">
            <input
              id="clientIndustry"
              required
              value={values.clientIndustry}
              onChange={(event) => set("clientIndustry", event.target.value)}
              className={fieldClass}
              placeholder="Hospitality"
            />
          </Field>
        </div>

        <Field label="Summary" htmlFor="summary" hint="Shown on listing cards.">
          <textarea
            id="summary"
            required
            rows={3}
            value={values.summary}
            onChange={(event) => set("summary", event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        {(
          [
            ["challenge", "The challenge"],
            ["solution", "Our approach"],
            ["result", "The result"],
            ["takeaway", "The takeaway"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label} htmlFor={key}>
            <textarea
              id={key}
              required
              rows={4}
              value={values[key]}
              onChange={(event) => set(key, event.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </Field>
        ))}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-400">
              Metrics (up to 6)
            </p>
            <button
              type="button"
              onClick={addMetric}
              disabled={values.metrics.length >= 6}
              className="inline-flex items-center gap-1.5 text-xs text-brand-300 transition-colors hover:text-brand-200 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add metric
            </button>
          </div>

          {values.metrics.length === 0 ? (
            <p className="rounded-xl border border-dashed border-paper/15 px-4 py-6 text-center text-xs text-ink-500">
              No metrics yet.
            </p>
          ) : (
            <div className="space-y-3">
              {values.metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    aria-label={`Metric ${index + 1} value`}
                    value={metric.value}
                    onChange={(event) => updateMetric(index, "value", event.target.value)}
                    className={`${fieldClass} sm:w-40`}
                    placeholder="6 weeks"
                  />
                  <input
                    aria-label={`Metric ${index + 1} label`}
                    value={metric.label}
                    onChange={(event) => updateMetric(index, "label", event.target.value)}
                    className={fieldClass}
                    placeholder="Time to investor-ready accounts"
                  />
                  <button
                    type="button"
                    onClick={() => removeMetric(index)}
                    aria-label={`Remove metric ${index + 1}`}
                    className="shrink-0 rounded-full border border-paper/15 p-2 text-ink-400 transition-colors hover:border-brand-500/60 hover:text-brand-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
          <input
            id="order"
            type="number"
            min={0}
            value={values.order}
            onChange={(event) => set("order", Number(event.target.value))}
            className={`${fieldClass} sm:w-40`}
          />
        </Field>

        <div className="flex flex-wrap gap-8 pt-2">
          <Toggle
            label="Featured"
            checked={values.isFeatured}
            onChange={(value) => set("isFeatured", value)}
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
            {isEdit ? "Save changes" : "Create case study"}
          </button>
          <Link
            href="/admin/case-studies"
            className="text-sm text-ink-400 transition-colors hover:text-paper"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
