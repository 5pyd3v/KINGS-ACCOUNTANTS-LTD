"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field, Toggle, fieldClass } from "@/components/admin/form-fields";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ICON_NAMES } from "@/components/shared/ServiceIcon";

export interface ServiceFormValues {
  _id?: string;
  title: string;
  slug: string;
  brief: string;
  detailedContent: string;
  iconName: string;
  isActive: boolean;
  order: number;
}

const EMPTY: ServiceFormValues = {
  title: "",
  slug: "",
  brief: "",
  detailedContent: "",
  iconName: ICON_NAMES[0],
  isActive: true,
  order: 0,
};

export function ServiceForm({ initial }: { initial?: ServiceFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial?._id);
  const [values, setValues] = useState<ServiceFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const endpoint = isEdit ? `/api/services/${initial!._id}` : "/api/services";

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          brief: values.brief,
          detailedContent: values.detailedContent,
          iconName: values.iconName,
          isActive: values.isActive,
          order: Number(values.order),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Couldn't save that.");
        return;
      }

      toast.success(isEdit ? "Service updated." : "Service created.");
      router.push("/admin/services");
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
        href="/admin/services"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        All services
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">
          {isEdit ? "Edit service" : "New service"}
        </h1>
        {isEdit && (
          <DeleteButton
            endpoint={`/api/services/${initial!._id}`}
            label="Service"
            redirectTo="/admin/services"
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

        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <input
            id="slug"
            value={values.slug}
            onChange={(event) => set("slug", event.target.value)}
            className={fieldClass}
            placeholder="auto-generated"
          />
        </Field>

        <Field label="Brief" htmlFor="brief" hint="Shown on cards and listings.">
          <textarea
            id="brief"
            required
            rows={3}
            value={values.brief}
            onChange={(event) => set("brief", event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <Field
          label="Detailed content"
          htmlFor="detailedContent"
          hint="Shown on the service page. Separate paragraphs with a blank line."
        >
          <textarea
            id="detailedContent"
            rows={10}
            value={values.detailedContent}
            onChange={(event) => set("detailedContent", event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Icon" htmlFor="iconName">
            <select
              id="iconName"
              value={values.iconName}
              onChange={(event) => set("iconName", event.target.value)}
              className={fieldClass}
            >
              {ICON_NAMES.map((name) => (
                <option key={name} value={name} className="bg-ink-900">
                  {name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
            <input
              id="order"
              type="number"
              min={0}
              value={values.order}
              onChange={(event) => set("order", Number(event.target.value))}
              className={fieldClass}
            />
          </Field>
        </div>

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
            {isEdit ? "Save changes" : "Create service"}
          </button>
          <Link
            href="/admin/services"
            className="text-sm text-ink-400 transition-colors hover:text-paper"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
