import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl text-brand-700">404</p>
      <h1 className="font-display text-2xl text-ink-900">Page not found</h1>
      <Link href="/" className="text-sm text-brand-700 underline underline-offset-4">
        Return home
      </Link>
    </div>
  );
}
