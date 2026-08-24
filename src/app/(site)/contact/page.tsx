import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/shared/ContactForm";
import { getServices, getSiteSettings } from "@/lib/content";
import receptionImage from "../../../../public/images/office-reception.jpg";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kings Accountants Ltd, Accountants and Tax Advisors in Birmingham.",
};

export default async function ContactPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        lines={["Let's start the", "conversation."]}
        intro="Tell us a little about your business and what you're looking for. One of our advisors will be in touch."
        image={receptionImage}
      />

      <section className="bg-paper py-14 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
            <div className="space-y-10 lg:sticky lg:top-32 lg:self-start">
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Office</p>
                  <address className="mt-3 not-italic leading-relaxed text-ink-700">
                    {settings.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Telephone</p>
                  <a
                    href={settings.phoneHref}
                    className="mt-3 block text-ink-700 transition-colors hover:text-brand-700"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Email</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-3 block break-all text-ink-700 transition-colors hover:text-brand-700"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            <ContactForm serviceOptions={services.map((service) => service.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
