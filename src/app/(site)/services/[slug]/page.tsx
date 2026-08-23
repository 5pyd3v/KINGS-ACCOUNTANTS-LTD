import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { IconBadge } from "@/components/shared/IconBadge";
import { FeatureCard } from "@/components/shared/FeatureCard";
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
              <IconBadge name={service.iconName} size="xl" className="rounded-2xl" />
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
                  <FeatureCard
                    href={`/services/${item.slug}`}
                    iconName={item.iconName}
                    title={item.title}
                    body={item.brief}
                    cta="Read more"
                    className="h-full"
                  />
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
