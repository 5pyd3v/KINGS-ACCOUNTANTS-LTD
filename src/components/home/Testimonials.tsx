"use client";

import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import type { TestimonialView } from "@/lib/content";

export function Testimonials({ testimonials }: { testimonials: TestimonialView[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-paper py-28">
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-gilt-200 opacity-30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-700">
              <span className="h-px w-8 bg-brand-700" />
              Client voices
            </p>
          </Reveal>
          <ScrollHeading
            lines={["Trusted by the businesses", "we help build."]}
            className="max-w-2xl font-display text-4xl leading-[1.2] text-ink-900 sm:text-5xl"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={`${testimonial.clientName}-${testimonial.company}`} delay={index * 0.08}>
              <figure className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-ink-100 bg-paper p-8 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_12px_32px_-16px_rgba(26,22,19,0.1)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(26,22,19,0.04),0_28px_56px_-20px_rgba(139,26,58,0.22)]">
                <Quote
                  className="absolute -right-2 -top-2 h-20 w-20 text-brand-50"
                  strokeWidth={0}
                  fill="currentColor"
                />
                <div className="relative">
                  <div className="flex gap-1 text-brand-600">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-6 font-display text-lg leading-relaxed text-ink-800">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="relative mt-8 border-t border-ink-100 pt-5">
                  <p className="text-sm font-medium text-ink-900">{testimonial.clientName}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-400">
                      {[testimonial.role, testimonial.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
