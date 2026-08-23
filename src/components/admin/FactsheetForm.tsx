"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Field, Toggle, fieldClass } from "@/components/admin/form-fields";
import { DeleteButton } from "@/components/admin/DeleteButton";

export interface FactsheetFormValues {
  _id?: string;
  categorySlug: string;
  title: string;
  slug: string;
  summary: string;
  body: string[];
  order: number;
  isActive: boolean;
}

export interface CategoryOption {
  slug: string;
  title: string;
}

const emptyValues = (defaultCategorySlug: string): FactsheetFormValues => ({
  categorySlug: defaultCategorySlug,
  title: "",
  slug: "",
  summary: "",
  body: [],
  order: 0,
  isActive: true,
});

export function FactsheetForm({
  initial,
  categories,
}: {
  initial?: FactsheetFormValues;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?._id);
  const [values, setValues] = useState<FactsheetFormValues>(
    initial ?? emptyValues(categories[0]?.slug ?? "")
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FactsheetFormValues>(key: K, value: FactsheetFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateParagraph(index: number, value: string) {
    setValues((prev) => ({
      ...prev,
      body: prev.body.map((paragraph, i) => (i === index ? value : paragraph)),
    }));
  }

  function addParagraph() {
    setValues((prev) => ({ ...prev, body: [...prev.body, ""] }));
  }

  function removeParagraph(index: number) {
    setValues((prev) => ({ ...prev, body: prev.body.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const endpoint = isEdit ? `/api/factsheets/${initial!._id}` : "/api/factsheets";

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          order: Number(values.order),
          body: values.body.map((p) => p.trim()).filter(Boolean),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Couldn't save that.");
        return;
      }

      toast.success(isEdit ? "Factsheet updated." : "Factsheet created.");
      router.push("/admin/factsheets");
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
        href="/admin/factsheets"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        All factsheets
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">
          {isEdit ? "Edit factsheet" : "New factsheet"}
        </h1>
        {isEdit && (
          <DeleteButton
            endpoint={`/api/factsheets/${initial!._id}`}
            label="Factsheet"
            redirectTo="/admin/factsheets"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-6">
        <Field label="Category" htmlFor="categorySlug">
          <select
            id="categorySlug"
            required
            value={values.categorySlug}
            onChange={(event) => set("categorySlug", event.target.value)}
            className={fieldClass}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug} className="bg-ink-900">
                {category.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Title" htmlFor="title">
          <input
            id="title"
            required
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <input
            id="slug"
            value={values.slug}
            onChange={(event) => set("slug", event.target.value)}
            className={fieldClass}
            placeholder="auto-generated"
          />
        </Field>

        <Field
          label="Summary"
          htmlFor="summary"
          hint="Shown on the category listing and as a fallback if the body is empty."
        >
          <textarea
            id="summary"
            rows={2}
            value={values.summary}
            onChange={(event) => set("summary", event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-400">
              Body (one paragraph per box)
            </p>
            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-1.5 text-xs text-brand-300 transition-colors hover:text-brand-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add paragraph
            </button>
          </div>

          {values.body.length === 0 ? (
            <p className="rounded-xl border border-dashed border-paper/15 px-4 py-6 text-center text-xs text-ink-500">
              No body content yet — this factsheet will show as &ldquo;coming soon&rdquo; on the
              site.
            </p>
          ) : (
            <div className="space-y-3">
              {values.body.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-3">
                  <textarea
                    aria-label={`Paragraph ${index + 1}`}
                    value={paragraph}
                    rows={3}
                    onChange={(event) => updateParagraph(index, event.target.value)}
                    className={`${fieldClass} resize-none`}
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    aria-label={`Remove paragraph ${index + 1}`}
                    className="mt-2 shrink-0 rounded-full border border-paper/15 p-2 text-ink-400 transition-colors hover:border-brand-500/60 hover:text-brand-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Order" htmlFor="order" hint="Lower numbers appear first within the category.">
          <input
            id="order"
            type="number"
            min={0}
            value={values.order}
            onChange={(event) => set("order", Number(event.target.value))}
            className={`${fieldClass} sm:w-40`}
          />
        </Field>

        <div className="pt-2">
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
            {isEdit ? "Save changes" : "Create factsheet"}
          </button>
          <Link
            href="/admin/factsheets"
            className="text-sm text-ink-400 transition-colors hover:text-paper"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
