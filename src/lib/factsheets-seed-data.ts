import { slugify } from "@/lib/slugify";
import factsheetContent from "@/lib/factsheet-content.json";

const content: Record<string, { summary: string; body: string[] }> = factsheetContent;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Wraps agent-drafted paragraphs as sanitized-editor-compatible HTML. */
function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

/**
 * Factsheets taxonomy and content.
 *
 * The category names and factsheet titles below mirror the real structure
 * published under /factsheets/ on kings-accountants.co.uk (11 categories,
 * ~105 named topics — mostly references to actual UK tax/legal instruments
 * such as "Stamp Duty Land Tax" or "Bribery Act 2010", which are factual
 * labels rather than creative content).
 *
 * The body content (src/lib/factsheet-content.json) is ORIGINAL — written
 * for this project, not copied from the live site. That site's /factsheets/
 * subdirectory turned out to be an unedited mirror of a different, unrelated
 * accountancy firm's website (confirmed via HTTrack mirror comments and
 * mismatched branding), so republishing its text under Kings Accountants'
 * name would mean passing off another real business's copyrighted copy.
 *
 * The generated content deliberately avoids stating specific tax rates,
 * percentages, or £ thresholds (those change every UK tax year and a stale
 * or wrong figure published as advice from a real firm is a real liability)
 * — it describes general mechanism and purpose instead. Treat it as a solid
 * first draft: it should be reviewed by a qualified advisor at the firm
 * before being relied on as the firm's official published guidance.
 */

export interface FactsheetSeedItem {
  title: string;
  slug: string;
  summary: string;
  /** Sanitized HTML body, authored via the admin rich-text editor. */
  body: string;
  order: number;
}

export interface FactsheetCategorySeed {
  slug: string;
  title: string;
  description: string;
  order: number;
  factsheets: FactsheetSeedItem[];
}

const PLACEHOLDER_SUMMARY =
  "Full guidance on this topic is being prepared for publication. Contact us in the meantime for advice.";

const RAW_CATEGORIES: { slug: string; title: string; description: string; titles: string[] }[] = [
  {
    slug: "capital-taxes",
    title: "Capital taxes",
    description:
      "Guidance on the taxes that arise on the disposal of capital assets, on death, and on property transactions.",
    titles: [
      "Capital gains tax",
      "Capital gains tax and the family home",
      "Inheritance tax - a summary",
      "Inheritance tax avoidance - pre-owned assets",
      "Land and Building Transaction Tax",
      "Land Transaction Tax",
      "Stamp Duty Land Tax",
      "Trusts",
    ],
  },
  {
    slug: "corporate-and-business-tax",
    title: "Corporate and business tax",
    description:
      "Tax planning and compliance topics for both unincorporated and corporate businesses.",
    titles: [
      "Business motoring - tax aspects",
      "Capital allowances",
      "Cash basis for the self-employed",
      "Companies - tax saving opportunities",
      "Corporation tax - quarterly instalment payments",
      "Corporation tax self assessment",
      "Fixed rate expenses",
      "Homeworking costs for the self-employed",
      "Incorporation",
      "Off-payroll working and Personal Service Companies",
      "Research and development",
      "The Construction Industry Scheme",
    ],
  },
  {
    slug: "employment-and-related-matters",
    title: "Employment and related matters",
    description: "Employment law fundamentals for employers and employees alike.",
    titles: [
      "Age discrimination",
      "Agency workers regulations",
      "Annual leave",
      "Dismissal procedures",
      "Managing absence",
      "National Minimum Wage",
      "Recruitment procedures - employment law",
      "Recruitment procedures - seven steps for good procedures",
      "Redundancy procedures",
      "Statutory sick, maternity and paternity pay",
    ],
  },
  {
    slug: "employment-issues-tax",
    title: "Employment issues (tax)",
    description: "The tax and National Insurance side of employing and being employed.",
    titles: [
      "Cars for employees",
      "Employee Expenses",
      "Employer supported childcare",
      "Employment benefits",
      "Homeworking and tax relief for employees",
      "National insurance",
      "Payroll - basic procedures",
      "Payroll Real Time Information",
      "Share ownership for employees - EMI",
      "Travel and subsistence for Directors and employees",
    ],
  },
  {
    slug: "general-business",
    title: "General business",
    description: "Practical issues that come up in the day-to-day running of a business.",
    titles: [
      "Bribery Act 2010",
      "Company secretarial duties",
      "Criminal Finances Act 2017",
      "Directors' responsibilities",
      "Franchising",
      "Fraud and how to spot it - ten step guide",
      "Grants",
      "Micro Entity Accounting",
      "Preparing for your accountant",
      "Register of people with significant control",
      "Running a limited company",
      "Securing business success",
      "Small Company Accounting",
      "Valuing your business",
    ],
  },
  {
    slug: "ict",
    title: "ICT",
    description: "Information and data security matters relevant to running a modern business.",
    titles: [
      "Bring your own device",
      "Data security - access",
      "Data security - cloud and outsourcing",
      "Data security - backup",
      "Data security - data loss risk reduction",
      "Data Security – Data Protection Regulatory Framework",
      "Data Security – Data Protection Regulation - Ensuring Compliance",
      "Internet and email access policy",
    ],
  },
  {
    slug: "pensions",
    title: "Pensions",
    description: "Pension scheme obligations and planning considerations.",
    titles: [
      "Occupational pension schemes: trustees' responsibilities",
      "Pensions - automatic enrolment",
      "Pensions - tax reliefs",
      "Pensions - tax treatment on death",
    ],
  },
  {
    slug: "personal-tax",
    title: "Personal tax",
    description: "Topics relevant to individual taxpayers and their personal financial planning.",
    titles: [
      "Charitable giving",
      "Child Benefit charge",
      "Dividends and interest",
      "Enterprise Investment Scheme",
      "Individual Savings Accounts",
      "Making Tax Digital for Individuals",
      "Non-domiciled individuals",
      "Personal tax - self assessment",
      "Personal tax - when is income tax and capital gains tax payable?",
      "Property investment - buy to let",
      "Property investment - tax aspects",
      "Seed Enterprise Investment Scheme",
      "Statutory Residence Test",
      "Taxation of the family",
      "Tax-Free Childcare",
      "Venture Capital Trusts",
    ],
  },
  {
    slug: "specialist-areas",
    title: "Specialist areas",
    description: "From charities and community organisations to insolvency and money laundering compliance.",
    titles: [
      "Charities in England and Wales: trustees' responsibilities",
      "Charities in Scotland: trustees' responsibilities",
      "Community amateur sports clubs",
      "Insolvency",
      "Limited liability partnerships",
      "Money laundering",
      "Money laundering - high value dealers",
      "Social enterprise entity structures",
    ],
  },
  {
    slug: "starting-up-in-business",
    title: "Starting up in business",
    description: "What to consider before and during the early stages of launching a business.",
    titles: [
      "Business plans",
      "Business structures - which should I use?",
      "Considerations when starting a business",
      "Could I really make a go of it?",
      "Credit control",
      "Insuring your business",
      "Raising finance",
      "Sources of finance",
    ],
  },
  {
    slug: "vat",
    title: "VAT",
    description: "VAT registration, schemes, and compliance considerations for your business.",
    titles: [
      "VAT - a summary",
      "VAT - annual accounting scheme",
      "VAT - bad debt relief",
      "VAT - cash accounting",
      "VAT - flat rate scheme",
      "VAT - Making Tax Digital",
      "VAT - seven key points for the smaller business",
    ],
  },
];

export const FACTSHEET_CATEGORIES: FactsheetCategorySeed[] = RAW_CATEGORIES.map(
  (category, categoryIndex) => ({
    slug: category.slug,
    title: category.title,
    description: category.description,
    order: categoryIndex,
    factsheets: category.titles.map((title, titleIndex) => {
      const entry = content[title];
      return {
        title,
        slug: slugify(title),
        summary: entry?.summary || PLACEHOLDER_SUMMARY,
        body: paragraphsToHtml(entry?.body ?? []),
        order: titleIndex,
      };
    }),
  })
);
