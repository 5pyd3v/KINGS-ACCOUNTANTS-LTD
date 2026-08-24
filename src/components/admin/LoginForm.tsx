"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { LogoMark } from "@/components/shared/LogoMark";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <div className="mb-10 flex justify-center">
        <div className="rounded-xl bg-paper px-5 py-4">
          <LogoMark className="h-9" />
        </div>
      </div>

      <form
        action={formAction}
        className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-8 backdrop-blur"
      >
        <h1 className="font-display text-2xl text-paper">Admin sign in</h1>
        <p className="mt-2 text-sm text-ink-400">
          Manage services, case studies, testimonials and enquiries.
        </p>

        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2.5 block text-xs uppercase tracking-[0.18em] text-ink-400"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-paper/15 bg-ink-900 px-5 py-3.5 text-sm text-paper outline-none transition-colors placeholder:text-ink-500 focus:border-brand-500"
              placeholder="admin@kings-accountants.co.uk"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2.5 block text-xs uppercase tracking-[0.18em] text-ink-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-paper/15 bg-ink-900 px-5 py-3.5 text-sm text-paper outline-none transition-colors placeholder:text-ink-500 focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        {state.error && (
          <p className="mt-5 rounded-lg border border-brand-500/40 bg-brand-700/15 px-4 py-3 text-xs text-brand-200">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>
    </motion.div>
  );
}
