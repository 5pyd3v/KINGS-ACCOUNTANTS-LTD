/**
 * Read-side content accessors.
 *
 * Each accessor attempts MongoDB first and falls back to the canonical seed
 * content when no database is configured or the connection fails. That keeps
 * the public site renderable in local dev and during deploys before the CMS is
 * populated, without scattering try/catch through every page.
 */
import "server-only";
import { dbConnect } from "@/lib/db";
import {
  Service,
  CaseStudy,
  Testimonial,
  SiteSetting,
  SITE_SETTING_KEY,
  FactsheetCategory,
  Factsheet,
} from "@/models";
import {
  SERVICES,
  CASE_STUDIES,
  TESTIMONIALS,
  type ServiceSeed,
  type CaseStudySeed,
  type TestimonialSeed,
} from "@/lib/seed-data";
import { DEFAULT_SITE_SETTINGS, type SiteSettingsView } from "@/lib/site-config";
import {
  FACTSHEET_CATEGORIES,
  type FactsheetCategorySeed,
  type FactsheetSeedItem,
} from "@/lib/factsheets-seed-data";

export type ServiceView = ServiceSeed;
export type CaseStudyView = CaseStudySeed;
export type TestimonialView = TestimonialSeed;

let warnedOnce = false;

async function withDb<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.MONGODB_URI) return fallback;

  try {
    await dbConnect();
    return await operation();
  } catch (error) {
    if (!warnedOnce) {
      warnedOnce = true;
      console.warn(
        "[content] Database unavailable, serving fallback content:",
        error instanceof Error ? error.message : error
      );
    }
    return fallback;
  }
}

export async function getServices(): Promise<ServiceView[]> {
  return withDb(async () => {
    const docs = await Service.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return SERVICES;
    return docs.map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      brief: doc.brief,
      detailedContent: doc.detailedContent ?? "",
      iconName: doc.iconName,
      isActive: doc.isActive,
      order: doc.order,
    }));
  }, SERVICES);
}

export async function getServiceBySlug(slug: string): Promise<ServiceView | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getCaseStudies(): Promise<CaseStudyView[]> {
  return withDb(async () => {
    const docs = await CaseStudy.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return CASE_STUDIES;
    return docs.map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      clientIndustry: doc.clientIndustry,
      summary: doc.summary,
      challenge: doc.challenge,
      solution: doc.solution,
      result: doc.result,
      takeaway: doc.takeaway,
      metrics: (doc.metrics ?? []).map((metric) => ({
        label: metric.label,
        value: metric.value,
      })),
      coverImage: doc.coverImage ?? "",
      isFeatured: doc.isFeatured,
      isActive: doc.isActive,
      order: doc.order,
    }));
  }, CASE_STUDIES);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyView | null> {
  const caseStudies = await getCaseStudies();
  return caseStudies.find((caseStudy) => caseStudy.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  return withDb(async () => {
    const docs = await Testimonial.find({ isActive: true })
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    if (docs.length === 0) return TESTIMONIALS;
    return docs.map((doc) => ({
      clientName: doc.clientName,
      role: doc.role ?? "",
      company: doc.company ?? "",
      quote: doc.quote,
      rating: doc.rating,
      featured: doc.featured,
      isActive: doc.isActive,
    }));
  }, TESTIMONIALS);
}

export async function getSiteSettings(): Promise<SiteSettingsView> {
  return withDb(async () => {
    const doc = await SiteSetting.findOne({ key: SITE_SETTING_KEY }).lean();
    if (!doc) return DEFAULT_SITE_SETTINGS;
    return {
      tagline: doc.tagline,
      subTagline: doc.subTagline,
      welcomeHeadline: doc.welcomeHeadline,
      intro: doc.intro,
      approach: doc.approach,
      clientBase: doc.clientBase,
      valueProposition: doc.valueProposition,
      addressLines: doc.addressLines ?? [],
      phone: doc.phone,
      phoneHref: doc.phoneHref,
      email: doc.email,
      whyChooseUs: (doc.whyChooseUs ?? []).map((pillar) => ({
        title: pillar.title,
        body: pillar.body,
        iconName: pillar.iconName,
      })),
      trustMetrics: (doc.trustMetrics ?? []).map((metric) => ({
        value: metric.value ?? null,
        display: metric.display ?? "",
        suffix: metric.suffix ?? "",
        label: metric.label,
      })),
    };
  }, DEFAULT_SITE_SETTINGS);
}

export type FactsheetCategoryView = Omit<FactsheetCategorySeed, "factsheets">;
export type FactsheetView = FactsheetSeedItem;

function toCategoryView(category: FactsheetCategorySeed): FactsheetCategoryView {
  return {
    slug: category.slug,
    title: category.title,
    description: category.description,
    order: category.order,
  };
}

export async function getFactsheetCategories(): Promise<FactsheetCategoryView[]> {
  return withDb(async () => {
    const docs = await FactsheetCategory.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) {
      return FACTSHEET_CATEGORIES.map(toCategoryView);
    }
    return docs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      description: doc.description ?? "",
      order: doc.order,
    }));
  }, FACTSHEET_CATEGORIES.map(toCategoryView));
}

export async function getFactsheetCategoryBySlug(
  slug: string
): Promise<FactsheetCategoryView | null> {
  const categories = await getFactsheetCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getFactsheetsByCategory(categorySlug: string): Promise<FactsheetView[]> {
  return withDb(async () => {
    const docs = await Factsheet.find({ categorySlug, isActive: true })
      .sort({ order: 1 })
      .lean();
    if (docs.length === 0) {
      const fallback = FACTSHEET_CATEGORIES.find((category) => category.slug === categorySlug);
      return fallback?.factsheets ?? [];
    }
    return docs.map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      summary: doc.summary ?? "",
      body: doc.body ?? [],
      order: doc.order,
    }));
  }, FACTSHEET_CATEGORIES.find((category) => category.slug === categorySlug)?.factsheets ?? []);
}

export async function getFactsheetBySlug(
  categorySlug: string,
  slug: string
): Promise<FactsheetView | null> {
  const factsheets = await getFactsheetsByCategory(categorySlug);
  return factsheets.find((factsheet) => factsheet.slug === slug) ?? null;
}
