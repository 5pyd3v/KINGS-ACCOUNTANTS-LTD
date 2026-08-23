import { z } from "zod";
import { LEAD_STATUSES } from "@/lib/constants";

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email address").trim().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  serviceOfInterest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more").max(4000),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const leadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().max(200).optional().or(z.literal("")),
  brief: z.string().trim().min(10).max(1000),
  detailedContent: z.string().trim().max(20000).optional().or(z.literal("")),
  iconName: z.string().trim().min(1).max(60),
  isActive: z.boolean(),
  order: z.number().int().min(0).max(999),
});

export const caseStudySchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().max(200).optional().or(z.literal("")),
  clientIndustry: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(10).max(1000),
  challenge: z.string().trim().min(10).max(8000),
  solution: z.string().trim().min(10).max(8000),
  result: z.string().trim().min(10).max(8000),
  takeaway: z.string().trim().min(10).max(2000),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  metrics: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(120),
        value: z.string().trim().min(1).max(60),
      })
    )
    .max(6),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  order: z.number().int().min(0).max(999),
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  quote: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
  featured: z.boolean(),
  isActive: z.boolean(),
});

export const siteSettingsSchema = z.object({
  tagline: z.string().trim().max(300),
  subTagline: z.string().trim().max(300),
  welcomeHeadline: z.string().trim().max(300),
  intro: z.string().trim().max(4000),
  approach: z.string().trim().max(4000),
  clientBase: z.string().trim().max(4000),
  valueProposition: z.string().trim().max(4000),
  addressLines: z.array(z.string().trim().max(200)).max(8),
  phone: z.string().trim().max(60),
  phoneHref: z.string().trim().max(80),
  email: z.email().trim().max(200),
  whyChooseUs: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(120),
        body: z.string().trim().min(1).max(1000),
        iconName: z.string().trim().min(1).max(60),
      })
    )
    .max(12),
  trustMetrics: z
    .array(
      z.object({
        value: z.number().int().min(0).max(1000000).nullable(),
        display: z.string().trim().max(40),
        suffix: z.string().trim().max(10),
        label: z.string().trim().min(1).max(80),
      })
    )
    .max(8),
});

export const factsheetCategorySchema = z.object({
  title: z.string().trim().min(2).max(150),
  slug: z.string().trim().max(150).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  order: z.number().int().min(0).max(999),
  isActive: z.boolean(),
});

export const factsheetSchema = z.object({
  categorySlug: z.string().trim().min(1).max(150),
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().max(200).optional().or(z.literal("")),
  summary: z.string().trim().max(1000).optional().or(z.literal("")),
  body: z.string().max(30000).optional().or(z.literal("")),
  order: z.number().int().min(0).max(999),
  isActive: z.boolean(),
});
