import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await dbConnect();
  const testimonials = await Testimonial.find().sort({ featured: -1, createdAt: -1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">Testimonials</h1>
          <p className="mt-2 text-sm text-ink-400">{testimonials.length} total</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          New testimonial
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Link
            key={String(testimonial._id)}
            href={`/admin/testimonials/${testimonial._id}`}
            className="flex flex-col justify-between rounded-2xl border border-paper/10 bg-paper/[0.03] p-6 transition-colors hover:border-brand-500/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-brand-400">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                {!testimonial.isActive && (
                  <span className="rounded-full border border-paper/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-400">
                    Hidden
                  </span>
                )}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink-200">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </div>
            <div className="mt-6 border-t border-paper/10 pt-4">
              <p className="text-sm text-paper">{testimonial.clientName}</p>
              <p className="mt-1 text-xs text-ink-500">
                {[testimonial.role, testimonial.company].filter(Boolean).join(", ") || "—"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
