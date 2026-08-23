import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceIcon } from "@/components/shared/ServiceIcon";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getServiceBySlug, getServices, getSiteSettings } from "@/lib/content";
import officeImage from "../../../../../public/images/office-building.jpg";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.title, description: service.brief };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getSiteSettings(),
  ]);

  if (!service) notFound();

  const others = allServices.filter((item) => item.slug !== service.slug).slice(0, 3);
  const paragraphs = service.detailedContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader eyebrow="Service" lines={[service.title]} intro={service.brief} image={officeImage} />

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/services"
            className="group mb-14 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All services
          </Link>

          <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-100 bg-paper-dim text-brand-700">
                <ServiceIcon name={service.iconName} className="h-7 w-7" />
              </span>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-ink-600">
              {paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-ink-100 bg-paper-dim py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-display text-2xl text-ink-900">Other services</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {others.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.07}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-ink-100 bg-paper p-7 transition-colors duration-500 hover:border-brand-200"
                  >
                    <div>
                      <span className="inline-flex text-brand-700">
                        <ServiceIcon name={item.iconName} className="h-5 w-5" />
                      </span>
                      <h3 className="mt-5 font-display text-lg leading-snug text-ink-900">
                        {item.title}
                      </h3>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-500 group-hover:text-brand-700">
                      Read more
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCTA settings={settings} />
    </>
  );
}
