import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ScrollHeading } from "@/components/shared/ScrollHeading";
import { ServiceIcon } from "@/components/shared/ServiceIcon";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getSiteSettings } from "@/lib/content";
import aboutImage from "../../../../public/images/about-team.jpg";
import officeImage from "../../../../public/images/office-building.jpg";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kings Accountants is an independent firm of Accountants and Tax advisors based in Birmingham, serving small and medium size businesses across the UK.",
};

const FOCUS_AREAS = [
  {
    title: "Business Planning",
    body: "Specialised services to businesses and individuals in the UK, providing expert guidance for effective and efficient business setup and tailored tax-saving strategies.",
    iconName: "Building2",
  },
  {
    title: "Financial Analysis",
    body: "Unveiling insights and trends in numbers to make informed decisions.",
    iconName: "LineChart",
  },
  {
    title: "Legal Advisory",
    body: "Guiding you through the complexities of law with expertise and precision.",
    iconName: "Landmark",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="About the firm"
        lines={["Where financial royalty", "meets impeccable service."]}
        intro={settings.intro}
        image={aboutImage}
      />

      <section className="bg-paper py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <ScrollHeading
                lines={["Trusted partners,", "not just advisors."]}
                className="max-w-md font-display text-3xl leading-[1.25] text-ink-900 sm:text-4xl"
              />
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ink-600">
              <Reveal>
                <p>{settings.approach}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>{settings.clientBase}</p>
              </Reveal>
              <Reveal delay={0.2}>
                <p>{settings.valueProposition}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-paper-dim py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-brand-700">
              <span className="h-px w-8 bg-brand-700" />
              Areas of focus
            </p>
          </Reveal>
          <ScrollHeading
            lines={["Expertise across the", "questions that matter."]}
            className="max-w-2xl font-display text-4xl leading-[1.2] text-ink-900 sm:text-5xl"
          />

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {FOCUS_AREAS.map((area, index) => (
              <Reveal key={area.title} delay={index * 0.08}>
                <div className="group h-full rounded-2xl border border-ink-100 bg-paper p-7 transition-colors duration-500 hover:border-brand-200">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-100 bg-paper-dim text-brand-700 transition-colors duration-500 group-hover:border-brand-200 group-hover:bg-brand-50">
                    <ServiceIcon name={area.iconName} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-xl text-ink-900">{area.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{area.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-dim py-16">
        <Reveal>
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
              <Image
                src={officeImage}
                alt="Modern office building"
                fill
                placeholder="blur"
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink-950/45" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <p className="font-display text-2xl text-paper sm:text-3xl">
                  Based in Birmingham, working with businesses across the UK.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-paper py-28">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollHeading
            lines={["What sets us apart."]}
            className="font-display text-4xl leading-[1.2] text-ink-900 sm:text-5xl"
          />
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settings.whyChooseUs.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.06}>
                <div className="group h-full rounded-2xl border border-ink-100 bg-paper-dim/60 p-7 transition-colors duration-500 hover:border-brand-200">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-100 bg-paper text-brand-700 transition-colors duration-500 group-hover:border-brand-200 group-hover:bg-brand-50">
                    <ServiceIcon name={pillar.iconName} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-lg text-ink-900">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA settings={settings} />
    </>
  );
}
