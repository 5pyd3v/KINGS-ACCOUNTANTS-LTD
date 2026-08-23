"use client";

import { Star } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import type { TestimonialView } from "@/lib/content";

export function Testimonials({ testimonials }: { testimonials: TestimonialView[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6">
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
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-ink-100 bg-paper-dim/60 p-8">
                <div>
                  <div className="flex gap-1 text-brand-600">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-6 font-display text-lg leading-relaxed text-ink-800">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-8 border-t border-ink-100 pt-5">
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
