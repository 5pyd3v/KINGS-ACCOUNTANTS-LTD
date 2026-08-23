"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  serviceOptions: string[];
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  serviceOfInterest: string;
  message: string;
};

const STEPS = [
  { id: 0, label: "About you" },
  { id: 1, label: "What you need" },
  { id: 2, label: "Your message" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ serviceOptions }: ContactFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    serviceOfInterest: "",
    message: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(current: number) {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (current === 0) {
      if (form.fullName.trim().length < 2) next.fullName = "Please enter your name.";
      if (!EMAIL_PATTERN.test(form.email.trim()))
        next.email = "Please enter a valid email address.";
    }

    if (current === 2 && form.message.trim().length < 10) {
      next.message = "Please tell us a little more (at least 10 characters).";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateStep(2)) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      toast.success("Thank you — your enquiry is on its way.");
    } catch {
      toast.error("We couldn't reach the server. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-brand-200 bg-brand-50 p-12 text-center"
      >
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-paper">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-7 font-display text-2xl text-ink-900">Enquiry received</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-600">
          Thank you for getting in touch. One of our advisors will respond to you
          shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-100 bg-paper p-8 sm:p-10">
      {/* Step indicator */}
      <div className="mb-10 flex items-center gap-3">
        {STEPS.map((item, index) => (
          <div key={item.id} className="flex flex-1 items-center gap-3">
            <div className="flex-1">
              <div className="h-px w-full bg-ink-100">
                <motion.div
                  initial={false}
                  animate={{ scaleX: index <= step ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="h-px bg-brand-700"
                />
              </div>
              <p
                className={cn(
                  "mt-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
                  index <= step ? "text-brand-700" : "text-ink-300"
                )}
              >
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {step === 0 && (
            <>
              <Field label="Full name" error={errors.fullName} htmlFor="fullName">
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  className={inputClass(!!errors.fullName)}
                  placeholder="Jane Smith"
                />
              </Field>
              <Field label="Email address" error={errors.email} htmlFor="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={inputClass(!!errors.email)}
                  placeholder="jane@company.co.uk"
                />
              </Field>
              <Field label="Phone (optional)" htmlFor="phone">
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className={inputClass(false)}
                  placeholder="0121 000 0000"
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <Field label="What can we help with?" htmlFor="serviceOfInterest">
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((option) => {
                  const active = form.serviceOfInterest === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => update("serviceOfInterest", active ? "" : option)}
                      className={cn(
                        "rounded-xl border px-5 py-4 text-left text-sm transition-all duration-300",
                        active
                          ? "border-brand-600 bg-brand-50 text-brand-800"
                          : "border-ink-200 text-ink-600 hover:border-brand-300 hover:text-ink-900"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                Not sure? Leave this blank and tell us more on the next step.
              </p>
            </Field>
          )}

          {step === 2 && (
            <Field label="Your message" error={errors.message} htmlFor="message">
              <textarea
                id="message"
                rows={7}
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                className={cn(inputClass(!!errors.message), "resize-none")}
                placeholder="Tell us a little about your business and what you're looking for."
              />
            </Field>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-100 pt-8">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className={cn(
            "group inline-flex items-center gap-2 text-sm transition-colors",
            step === 0
              ? "cursor-not-allowed text-ink-300"
              : "text-ink-600 hover:text-brand-700"
          )}
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send enquiry
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-3 block text-xs uppercase tracking-[0.18em] text-ink-500"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-brand-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-paper px-5 py-4 text-sm text-ink-900 outline-none transition-colors duration-300 placeholder:text-ink-300",
    hasError
      ? "border-brand-500 focus:border-brand-600"
      : "border-ink-200 focus:border-brand-600"
  );
}
