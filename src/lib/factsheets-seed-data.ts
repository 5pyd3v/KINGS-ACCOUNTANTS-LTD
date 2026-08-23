import { slugify } from "@/lib/slugify";

/**
 * Factsheets taxonomy and topic titles.
 *
 * The category names and factsheet titles below mirror the real structure
 * published under /factsheets/ on kings-accountants.co.uk (11 categories,
 * ~105 named topics — mostly references to actual UK tax/legal instruments
 * such as "Stamp Duty Land Tax" or "Bribery Act 2010", which are factual
 * labels rather than creative content).
 *
 * The category descriptions and factsheet summaries are original text
 * written for this project, NOT copied from the live site. That site's
 * /factsheets/ subdirectory turned out to be an unedited mirror of a
 * different, unrelated accountancy firm's website (confirmed via HTTrack
 * mirror comments, mismatched branding, and the fact every individual
 * factsheet detail page 404s) — so republishing its descriptive text under
 * Kings Accountants' name would mean passing off another real business's
 * copyrighted copy. The `body` field is deliberately left empty for every
 * factsheet: it's real infrastructure ready for the firm (or a licensed
 * factsheet content provider) to fill in via the admin CMS.
 */

export interface FactsheetSeedItem {
  title: string;
  slug: string;
  summary: string;
  body: string[];
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
    factsheets: category.titles.map((title, titleIndex) => ({
      title,
      slug: slugify(title),
      summary: PLACEHOLDER_SUMMARY,
      body: [],
      order: titleIndex,
    })),
  })
);
