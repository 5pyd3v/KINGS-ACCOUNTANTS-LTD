import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceIcon } from "@/components/shared/ServiceIcon";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getServices, getSiteSettings } from "@/lib/content";
import officeImage from "../../../../public/images/office-building.jpg";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Accounting, tax, compliance and consultancy services from Kings Accountants Ltd — statutory accounts, bookkeeping, company formation, financial analysis, tax advisory, and payroll.",
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="What we do"
        lines={["Accounting, tax and", "advisory, handled properly."]}
        intro="We look after your accounting and compliance needs so you can focus on what you do best for your business."
        image={officeImage}
      />

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="divide-y divide-ink-100 border-y border-ink-100">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-6 py-10 transition-colors md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-ink-100 bg-paper-dim text-brand-700 transition-colors duration-500 group-hover:border-brand-200 group-hover:bg-brand-50">
                    <ServiceIcon name={service.iconName} />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl leading-snug text-ink-900 transition-colors duration-300 group-hover:text-brand-700">
                      {service.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
                      {service.brief}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA settings={settings} />
    </>
  );
}
