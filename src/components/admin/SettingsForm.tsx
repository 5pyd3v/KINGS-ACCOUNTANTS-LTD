"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Field, fieldClass } from "@/components/admin/form-fields";
import { ICON_NAMES } from "@/components/shared/ServiceIcon";
import type { SiteSettingsView } from "@/lib/site-config";

export function SettingsForm({ initial }: { initial: SiteSettingsView }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteSettingsView>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteSettingsView>(key: K, value: SiteSettingsView[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          addressLines: values.addressLines.filter((line) => line.trim()),
          whyChooseUs: values.whyChooseUs.filter((p) => p.title.trim() && p.body.trim()),
          trustMetrics: values.trustMetrics.filter((m) => m.label.trim()),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Couldn't save settings.");
        return;
      }

      toast.success("Site settings saved.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-10">
      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.22em] text-brand-300">Messaging</h2>

        <Field label="Tagline" htmlFor="tagline">
          <input
            id="tagline"
            value={values.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field label="Sub tagline" htmlFor="subTagline" hint="Shown under the hero heading.">
          <input
            id="subTagline"
            value={values.subTagline}
            onChange={(e) => set("subTagline", e.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field label="Welcome headline" htmlFor="welcomeHeadline">
          <input
            id="welcomeHeadline"
            value={values.welcomeHeadline}
            onChange={(e) => set("welcomeHeadline", e.target.value)}
            className={fieldClass}
          />
        </Field>

        {(
          [
            ["intro", "Intro"],
            ["approach", "Approach"],
            ["clientBase", "Client base"],
            ["valueProposition", "Value proposition"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label} htmlFor={key}>
            <textarea
              id={key}
              rows={4}
              value={values[key]}
              onChange={(e) => set(key, e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </Field>
        ))}
      </section>

      <section className="space-y-6 border-t border-paper/10 pt-10">
        <h2 className="text-xs uppercase tracking-[0.22em] text-brand-300">Contact</h2>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-400">Address lines</p>
            <button
              type="button"
              onClick={() => set("addressLines", [...values.addressLines, ""])}
              disabled={values.addressLines.length >= 8}
              className="inline-flex items-center gap-1.5 text-xs text-brand-300 transition-colors hover:text-brand-200 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add line
            </button>
          </div>
          <div className="space-y-3">
            {values.addressLines.map((line, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  aria-label={`Address line ${index + 1}`}
                  value={line}
                  onChange={(e) =>
                    set(
                      "addressLines",
                      values.addressLines.map((l, i) => (i === index ? e.target.value : l))
                    )
                  }
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "addressLines",
                      values.addressLines.filter((_, i) => i !== index)
                    )
                  }
                  aria-label={`Remove address line ${index + 1}`}
                  className="shrink-0 rounded-full border border-paper/15 p-2 text-ink-400 transition-colors hover:border-brand-500/60 hover:text-brand-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Phone" htmlFor="phone">
            <input
              id="phone"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Phone link" htmlFor="phoneHref" hint="e.g. tel:+441214414363">
            <input
              id="phoneHref"
              value={values.phoneHref}
              onChange={(e) => set("phoneHref", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 border-t border-paper/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.22em] text-brand-300">Why choose us</h2>
          <button
            type="button"
            onClick={() =>
              set("whyChooseUs", [
                ...values.whyChooseUs,
                { title: "", body: "", iconName: ICON_NAMES[0] },
              ])
            }
            disabled={values.whyChooseUs.length >= 12}
            className="inline-flex items-center gap-1.5 text-xs text-brand-300 transition-colors hover:text-brand-200 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add pillar
          </button>
        </div>

        {values.whyChooseUs.map((pillar, index) => (
          <div key={index} className="rounded-xl border border-paper/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <input
                  aria-label={`Pillar ${index + 1} title`}
                  value={pillar.title}
                  placeholder="Title"
                  onChange={(e) =>
                    set(
                      "whyChooseUs",
                      values.whyChooseUs.map((p, i) =>
                        i === index ? { ...p, title: e.target.value } : p
                      )
                    )
                  }
                  className={fieldClass}
                />
                <textarea
                  aria-label={`Pillar ${index + 1} body`}
                  value={pillar.body}
                  rows={2}
                  placeholder="Description"
                  onChange={(e) =>
                    set(
                      "whyChooseUs",
                      values.whyChooseUs.map((p, i) =>
                        i === index ? { ...p, body: e.target.value } : p
                      )
                    )
                  }
                  className={`${fieldClass} resize-none`}
                />
                <select
                  aria-label={`Pillar ${index + 1} icon`}
                  value={pillar.iconName}
                  onChange={(e) =>
                    set(
                      "whyChooseUs",
                      values.whyChooseUs.map((p, i) =>
                        i === index ? { ...p, iconName: e.target.value } : p
                      )
                    )
                  }
                  className={fieldClass}
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name} className="bg-ink-900">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() =>
                  set(
                    "whyChooseUs",
                    values.whyChooseUs.filter((_, i) => i !== index)
                  )
                }
                aria-label={`Remove pillar ${index + 1}`}
                className="shrink-0 rounded-full border border-paper/15 p-2 text-ink-400 transition-colors hover:border-brand-500/60 hover:text-brand-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4 border-t border-paper/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.22em] text-brand-300">Trust metrics</h2>
          <button
            type="button"
            onClick={() =>
              set("trustMetrics", [
                ...values.trustMetrics,
                { value: 0, display: "", suffix: "", label: "" },
              ])
            }
            disabled={values.trustMetrics.length >= 8}
            className="inline-flex items-center gap-1.5 text-xs text-brand-300 transition-colors hover:text-brand-200 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add metric
          </button>
        </div>
        <p className="text-xs text-ink-500">
          Leave the number blank to show static text (e.g. &ldquo;Award&rdquo;) instead of a
          count-up.
        </p>

        {values.trustMetrics.map((metric, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              aria-label={`Metric ${index + 1} number`}
              type="number"
              value={metric.value ?? ""}
              placeholder="99"
              onChange={(e) =>
                set(
                  "trustMetrics",
                  values.trustMetrics.map((m, i) =>
                    i === index
                      ? {
                          ...m,
                          value: e.target.value === "" ? null : Number(e.target.value),
                        }
                      : m
                  )
                )
              }
              className={`${fieldClass} sm:w-24`}
            />
            <input
              aria-label={`Metric ${index + 1} suffix`}
              value={metric.suffix}
              placeholder="%"
              onChange={(e) =>
                set(
                  "trustMetrics",
                  values.trustMetrics.map((m, i) =>
                    i === index ? { ...m, suffix: e.target.value } : m
                  )
                )
              }
              className={`${fieldClass} sm:w-20`}
            />
            <input
              aria-label={`Metric ${index + 1} display text`}
              value={metric.display}
              placeholder="Award"
              onChange={(e) =>
                set(
                  "trustMetrics",
                  values.trustMetrics.map((m, i) =>
                    i === index ? { ...m, display: e.target.value } : m
                  )
                )
              }
              className={`${fieldClass} sm:w-32`}
            />
            <input
              aria-label={`Metric ${index + 1} label`}
              value={metric.label}
              placeholder="Success Rate"
              onChange={(e) =>
                set(
                  "trustMetrics",
                  values.trustMetrics.map((m, i) =>
                    i === index ? { ...m, label: e.target.value } : m
                  )
                )
              }
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() =>
                set(
                  "trustMetrics",
                  values.trustMetrics.filter((_, i) => i !== index)
                )
              }
              aria-label={`Remove metric ${index + 1}`}
              className="shrink-0 rounded-full border border-paper/15 p-2 text-ink-400 transition-colors hover:border-brand-500/60 hover:text-brand-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </section>

      <div className="border-t border-paper/10 pt-8">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-brand-600 disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save settings
        </button>
      </div>
    </form>
  );
}
