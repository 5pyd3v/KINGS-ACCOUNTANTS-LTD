/**
 * One-off build script: merges the four agent-drafted factsheet content
 * JSON files into a single src/lib/factsheet-content.json, and cross-checks
 * coverage against the authoritative title list in factsheets-seed-data.ts.
 *
 * Run with: node scripts/merge-factsheet-content.js
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const SCRATCH =
  "C:\\Users\\spydev\\AppData\\Local\\Temp\\claude\\D--Projects-Commercial-Accountancy-Firm\\d0e7872b-a8cf-4ce9-a4cf-8e24c221a481\\scratchpad";

const GROUP_FILES = [
  "factsheet-content-group-a.json",
  "factsheet-content-group-b.json",
  "factsheet-content-group-c.json",
  "factsheet-content-group-d.json",
];

// Authoritative title list, copied from factsheets-seed-data.ts RAW_CATEGORIES.
const EXPECTED = {
  "capital-taxes": [
    "Capital gains tax",
    "Capital gains tax and the family home",
    "Inheritance tax - a summary",
    "Inheritance tax avoidance - pre-owned assets",
    "Land and Building Transaction Tax",
    "Land Transaction Tax",
    "Stamp Duty Land Tax",
    "Trusts",
  ],
  "corporate-and-business-tax": [
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
  "employment-and-related-matters": [
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
  "employment-issues-tax": [
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
  "general-business": [
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
  ict: [
    "Bring your own device",
    "Data security - access",
    "Data security - cloud and outsourcing",
    "Data security - backup",
    "Data security - data loss risk reduction",
    "Data Security – Data Protection Regulatory Framework",
    "Data Security – Data Protection Regulation - Ensuring Compliance",
    "Internet and email access policy",
  ],
  pensions: [
    "Occupational pension schemes: trustees' responsibilities",
    "Pensions - automatic enrolment",
    "Pensions - tax reliefs",
    "Pensions - tax treatment on death",
  ],
  "personal-tax": [
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
  "specialist-areas": [
    "Charities in England and Wales: trustees' responsibilities",
    "Charities in Scotland: trustees' responsibilities",
    "Community amateur sports clubs",
    "Insolvency",
    "Limited liability partnerships",
    "Money laundering",
    "Money laundering - high value dealers",
    "Social enterprise entity structures",
  ],
  "starting-up-in-business": [
    "Business plans",
    "Business structures - which should I use?",
    "Considerations when starting a business",
    "Could I really make a go of it?",
    "Credit control",
    "Insuring your business",
    "Raising finance",
    "Sources of finance",
  ],
  vat: [
    "VAT - a summary",
    "VAT - annual accounting scheme",
    "VAT - bad debt relief",
    "VAT - cash accounting",
    "VAT - flat rate scheme",
    "VAT - Making Tax Digital",
    "VAT - seven key points for the smaller business",
  ],
};

const byTitle = {};
let totalLoaded = 0;

for (const file of GROUP_FILES) {
  const full = path.join(SCRATCH, file);
  if (!fs.existsSync(full)) {
    console.error(`MISSING FILE: ${file}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(full, "utf-8"));
  for (const topics of Object.values(data)) {
    if (!Array.isArray(topics)) continue;
    for (const topic of topics) {
      if (!topic || !topic.title) continue;
      byTitle[topic.title] = {
        summary: topic.summary || "",
        body: Array.isArray(topic.body) ? topic.body : [],
      };
      totalLoaded += 1;
    }
  }
}

console.log(`Loaded ${totalLoaded} topics from ${GROUP_FILES.length} files.`);

let missing = [];
let expectedTotal = 0;
for (const [categorySlug, titles] of Object.entries(EXPECTED)) {
  for (const title of titles) {
    expectedTotal += 1;
    if (!byTitle[title]) {
      missing.push(`${categorySlug} :: ${title}`);
    } else if (!byTitle[title].summary || byTitle[title].body.length === 0) {
      missing.push(`${categorySlug} :: ${title} (empty summary/body)`);
    }
  }
}

console.log(`Expected ${expectedTotal} topics total.`);
if (missing.length > 0) {
  console.log(`\nMISSING OR INCOMPLETE (${missing.length}):`);
  missing.forEach((m) => console.log("  - " + m));
} else {
  console.log("\nAll topics present with content. ✓");
}

const outPath = path.join(__dirname, "..", "src", "lib", "factsheet-content.json");
fs.writeFileSync(outPath, JSON.stringify(byTitle, null, 2));
console.log(`\nWrote merged content to ${outPath}`);
