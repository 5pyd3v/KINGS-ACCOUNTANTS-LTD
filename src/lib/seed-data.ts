/**
 * Seed payload for the Kings Accountants database.
 *
 * Service and testimonial copy is taken from the firm's live site
 * (kings-accountants.co.uk). This file is the payload `npm run seed` writes
 * into MongoDB — once seeded, the app reads everything from the database and
 * the admin CMS is the place to edit it.
 */

export interface ServiceSeed {
  title: string;
  slug: string;
  brief: string;
  detailedContent: string;
  iconName: string;
  isActive: boolean;
  order: number;
}

export interface CaseStudySeed {
  title: string;
  slug: string;
  clientIndustry: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  takeaway: string;
  metrics: { label: string; value: string }[];
  coverImage: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export interface TestimonialSeed {
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  featured: boolean;
  isActive: boolean;
}

/** Verbatim from kings-accountants.co.uk/service.php */
export const SERVICES: ServiceSeed[] = [
  {
    title: "Preparation of Statutory Accounts",
    slug: "preparation-of-statutory-accounts",
    brief:
      "We look after all of your accounting and compliance needs, taking away those financial tasks allowing you to focus on what you do best for your business.",
    detailedContent:
      "We look after all of your accounting and compliance needs, taking away those financial tasks allowing you to focus on what you do best for your business.\n\nYour statutory accounts are the formal record of your company's financial position, filed at Companies House and relied upon by lenders, investors and HMRC. We prepare and file them in line with UK requirements and make sure every deadline is met.",
    iconName: "FileCheck2",
    isActive: true,
    order: 1,
  },
  {
    title: "Bookkeeping and Management Accounts",
    slug: "bookkeeping-and-management-accounts",
    brief:
      "We assist with day-to-day bookkeeping activities and support you in generating cash flow forecasts and management accounts.",
    detailedContent:
      "We assist with day-to-day bookkeeping activities and support you in generating cash flow forecasts and management accounts.\n\nAnnual accounts tell you what happened last year; management accounts tell you what is happening now. Regular reporting means you can make decisions on current numbers rather than stale ones.",
    iconName: "BookOpen",
    isActive: true,
    order: 2,
  },
  {
    title: "Company Formation and Business Structuring",
    slug: "company-formation-and-business-structuring",
    brief:
      "We will assist you throughout the process of early stages of choosing the best business structure and also assist you with all formation processes.",
    detailedContent:
      "We will assist you throughout the process of early stages of choosing the best business structure and also assist you with all formation processes.\n\nThe structure you choose at the outset shapes your tax position, your liability and how easily you can raise investment later. We advise on the right vehicle for your circumstances and handle the formation end to end.",
    iconName: "Building2",
    isActive: true,
    order: 3,
  },
  {
    title: "Financial Analysis",
    slug: "financial-analysis",
    brief:
      "Illuminating your financial landscape for smart decision-making and fiscal prosperity.",
    detailedContent:
      "Illuminating your financial landscape for smart decision-making and fiscal prosperity.\n\nWe unveil the insights and trends held in your numbers so you can make informed decisions — margin analysis, cash flow forecasting and scenario planning for hiring, investment or expansion.",
    iconName: "LineChart",
    isActive: true,
    order: 4,
  },
  {
    title: "Income, Business and Corporation Tax Advisory and Compliance",
    slug: "tax-advisory-and-compliance",
    brief:
      "Tax legislation is always changing, we are here to make sure that you are always informed about the implications that they could have on you and your business.",
    detailedContent:
      "Tax legislation is always changing, we are here to make sure that you are always informed about the implications that they could have on you and your business.\n\nWe keep abreast of changes in the UK tax system and help align your goals with an effective tax planning strategy, covering income tax, business tax and corporation tax advisory alongside your compliance obligations.",
    iconName: "Landmark",
    isActive: true,
    order: 5,
  },
  {
    title: "Payroll & Auto-Enrolment Services",
    slug: "payroll-and-auto-enrolment-services",
    brief:
      "Our in-house payroll team manages employee wage payments, online payslips, pension contributions and Real Time Information compliance.",
    detailedContent:
      "Our in-house payroll team manages the payment of your employees' wages, provides online payslips, and arranges pension contributions on your behalf.\n\nWe ensure compliance with Real Time Information (RTI) requirements and handle annual pension obligations, keeping you compliant with both HMRC and The Pensions Regulator.",
    iconName: "Users",
    isActive: true,
    order: 6,
  },
];

/**
 * NOTE: The firm's live site does not publish case studies. The three titles
 * below were specified in the project brief; the supporting detail is drafted
 * and must be reviewed and replaced with verified client outcomes through the
 * admin CMS before launch. Nothing here should be published as fact as-is.
 */
export const CASE_STUDIES: CaseStudySeed[] = [
  {
    title: "Securing Growth Capital for Tech Consulting",
    slug: "securing-growth-capital-tech-consulting",
    clientIndustry: "Technology Consulting",
    summary:
      "Helping a growing consultancy present investor-ready financials to secure its next round of funding.",
    challenge:
      "A fast-growing technology consultancy was approaching an investor round with strong revenue but no internal finance function. Reporting was inconsistent month to month and due diligence questions were going unanswered.",
    solution:
      "We rebuilt their management reporting, established a consistent monthly close, and constructed a multi-year forecast grounded in their delivery pipeline — then supported the founders through financial due diligence.",
    result:
      "The business entered investor conversations with a coherent, defensible financial story and cleared financial due diligence without delay.",
    takeaway:
      "Investor-grade reporting is a growth lever, not just a compliance exercise.",
    metrics: [
      { label: "Time to investor-ready accounts", value: "6 weeks" },
      { label: "Forecast horizon modelled", value: "3 years" },
    ],
    coverImage: "/images/case-tech.jpg",
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    title: "Tax Efficiency for Hospitality",
    slug: "tax-efficiency-hospitality",
    clientIndustry: "Hospitality",
    summary:
      "Restructuring a multi-site hospitality group's tax position to protect already thin margins.",
    challenge:
      "A hospitality group that had grown by acquisition was left with a patchwork of entities, an inefficient tax position and duplicated compliance costs eroding tight margins.",
    solution:
      "We mapped the group structure, modelled the tax impact of consolidation, identified reliefs that had not been claimed, and reorganised the entities in phases to avoid disrupting trading.",
    result:
      "The group reduced its effective tax burden and compliance overhead, releasing cash to reinvest in the business.",
    takeaway:
      "Structure reviews surface savings that day-to-day bookkeeping never will.",
    metrics: [
      { label: "Sites covered", value: "4" },
      { label: "Entities consolidated", value: "3" },
    ],
    coverImage: "/images/case-hospitality.jpg",
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    title: "Scaling E-commerce Profitability",
    slug: "scaling-ecommerce-profitability",
    clientIndustry: "E-commerce & Retail",
    summary:
      "Giving a scaling e-commerce brand the margin visibility to grow profitably rather than just quickly.",
    challenge:
      "An e-commerce brand was posting strong top-line growth but could not identify which product lines actually made money once fulfilment and returns were accounted for.",
    solution:
      "We implemented reporting broken down by product line and sales channel with true landed cost allocated properly, alongside a rolling cash flow forecast to support inventory decisions.",
    result:
      "Leadership could see profitability at line level and reallocated marketing spend and inventory budget toward the lines carrying real margin.",
    takeaway:
      "Revenue growth without margin visibility is a risk, not a win.",
    metrics: [
      { label: "Product lines reported", value: "12" },
      { label: "Sales channels unified", value: "4" },
    ],
    coverImage: "/images/case-ecommerce.jpg",
    isFeatured: true,
    isActive: true,
    order: 3,
  },
];

/** Verbatim from kings-accountants.co.uk/testimonial.html */
export const TESTIMONIALS: TestimonialSeed[] = [
  {
    clientName: "Satisfied Client",
    role: "",
    company: "",
    quote:
      "Exceptional innovation! Our expectations were surpassed in every way. Kings Accountants delivers results that speak volumes.",
    rating: 5,
    featured: true,
    isActive: true,
  },
  {
    clientName: "Mickey Athorton",
    role: "Business Man",
    company: "",
    quote:
      "Choosing Kings Accountants was the best decision for our business. Their innovative solutions have redefined our success.",
    rating: 5,
    featured: true,
    isActive: true,
  },
  {
    clientName: "Miss Misha",
    role: "IT Consultant",
    company: "",
    quote:
      "Their innovative solutions have redefined our success. A truly remarkable and forward-thinking partner.",
    rating: 5,
    featured: true,
    isActive: true,
  },
];
