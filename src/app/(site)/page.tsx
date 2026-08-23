import { Hero } from "@/components/home/Hero";
import { ServicesBento } from "@/components/home/ServicesBento";
import { Metrics } from "@/components/home/Metrics";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CaseStudiesCarousel } from "@/components/home/CaseStudiesCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCTA } from "@/components/home/ContactCTA";
import {
  getServices,
  getCaseStudies,
  getTestimonials,
  getSiteSettings,
} from "@/lib/content";

export default async function HomePage() {
  const [services, caseStudies, testimonials, settings] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ServicesBento services={services} />
      <Metrics settings={settings} />
      <WhyChooseUs settings={settings} />
      <CaseStudiesCarousel caseStudies={caseStudies} />
      <Testimonials testimonials={testimonials} />
      <ContactCTA settings={settings} />
    </>
  );
}
