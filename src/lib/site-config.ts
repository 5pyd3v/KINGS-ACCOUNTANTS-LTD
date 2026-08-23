/**
 * DEFAULT firm-level content, sourced from kings-accountants.co.uk.
 *
 * This is the seed payload written into the `sitesettings` collection and the
 * fallback used if the database is unreachable. At runtime the app reads these
 * values from MongoDB via `getSiteSettings()`, so edits made in the admin CMS
 * are what actually render.
 */

export interface Pillar {
  title: string;
  body: string;
  iconName: string;
}

export interface TrustMetric {
  value: number | null;
  display: string;
  suffix: string;
  label: string;
}

export interface SiteSettingsView {
  tagline: string;
  subTagline: string;
  welcomeHeadline: string;
  intro: string;
  approach: string;
  clientBase: string;
  valueProposition: string;
  addressLines: string[];
  phone: string;
  phoneHref: string;
  email: string;
  whyChooseUs: Pillar[];
  trustMetrics: TrustMetric[];
}

/** Brand constants that are not CMS-managed. */
export const BRAND = {
  name: "Kings Accountants Ltd",
  descriptor: "Accountants and Tax Advisors",
  city: "Birmingham",
} as const;

export const DEFAULT_SITE_SETTINGS: SiteSettingsView = {
  tagline: "Your trusted partner in business!",
  subTagline: "Enabling our clients achieve their strategic aspirations",
  welcomeHeadline: "Where financial royalty meets impeccable service!",
  intro:
    "Kings Accountants is an independent firm of Accountants and Tax advisors based in Birmingham, providing Accounting, Tax, Compliance and Consultancy services to small and medium size businesses across a range of industry sectors, based all over the UK.",
  approach:
    "We provide a professional service, working alongside our clients as trusted partners, acting as an extended part of our client's team.",
  clientBase:
    "We act for a varied portfolio of UK and internationally based clients, including high net worth individuals, owner-managed businesses, Companies and not-for-profit organisations.",
  valueProposition:
    "Client satisfaction is at the core of what we do. Your unique needs allow us to tailor innovative solutions that directly address your challenges. We don't believe in one-size-fits-all approaches; instead, we craft bespoke strategies that ensure your success.",
  addressLines: ["484 Alcester Road South", "Birmingham", "England", "B14 6EP"],
  phone: "0121 441 4363",
  phoneHref: "tel:+441214414363",
  email: "info@kings-accountants.co.uk",
  whyChooseUs: [
    {
      title: "Best In Industry",
      body: "Experience excellence with our unrivaled services, setting new standards in the industry.",
      iconName: "Award",
    },
    {
      title: "99% Success Rate",
      body: "Join the ranks of our thriving clients and benefit from our proven track record of 99% success.",
      iconName: "TrendingUp",
    },
    {
      title: "Award Winning",
      body: "Trust the expertise recognized by prestigious awards, assuring you of exceptional service.",
      iconName: "Trophy",
    },
    {
      title: "100% Happy Client",
      body: "Your satisfaction is our ultimate goal - experience the joy of being part of our 100% happy client community.",
      iconName: "Smile",
    },
    {
      title: "Professional Advisors",
      body: "Elevate your business with the guidance of our skilled and certified professional advisors, delivering results that speak for themselves.",
      iconName: "UserCheck",
    },
    {
      title: "24/7 Customer Support",
      body: "Our 24/7 Customer Support is Always Here to Serve You.",
      iconName: "Headset",
    },
  ],
  trustMetrics: [
    { value: 99, suffix: "%", label: "Success Rate", display: "" },
    { value: 100, suffix: "%", label: "Happy Clients", display: "" },
    { value: null, suffix: "", label: "Winning Firm", display: "Award" },
    { value: 24, suffix: "/7", label: "Customer Support", display: "" },
  ],
};

/** Convenience: full address on one line. */
export function addressInline(lines: string[]) {
  return lines.join(", ");
}
