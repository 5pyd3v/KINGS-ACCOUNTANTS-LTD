/**
 * One-off DB seed. Run with `npm run seed` after setting MONGODB_URI (and
 * SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD) in .env.local.
 *
 * Content comes from src/lib/seed-data.ts, which is also the runtime fallback
 * used before a database is connected — so seeded and unseeded states match.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { dbConnect } from "../src/lib/db";
import {
  Service,
  CaseStudy,
  Testimonial,
  AdminUser,
  SiteSetting,
  SITE_SETTING_KEY,
  FactsheetCategory,
  Factsheet,
} from "../src/models";
import { SERVICES, CASE_STUDIES, TESTIMONIALS } from "../src/lib/seed-data";
import { DEFAULT_SITE_SETTINGS } from "../src/lib/site-config";
import { FACTSHEET_CATEGORIES } from "../src/lib/factsheets-seed-data";

async function seed() {
  await dbConnect();

  for (const service of SERVICES) {
    await Service.updateOne({ slug: service.slug }, { $set: service }, { upsert: true });
  }
  console.log(`Seeded ${SERVICES.length} services.`);

  for (const caseStudy of CASE_STUDIES) {
    await CaseStudy.updateOne({ slug: caseStudy.slug }, { $set: caseStudy }, { upsert: true });
  }
  console.log(`Seeded ${CASE_STUDIES.length} case studies.`);

  for (const testimonial of TESTIMONIALS) {
    await Testimonial.updateOne(
      { clientName: testimonial.clientName, company: testimonial.company },
      { $set: testimonial },
      { upsert: true }
    );
  }
  console.log(`Seeded ${TESTIMONIALS.length} testimonials.`);

  await SiteSetting.updateOne(
    { key: SITE_SETTING_KEY },
    { $set: { key: SITE_SETTING_KEY, ...DEFAULT_SITE_SETTINGS } },
    { upsert: true }
  );
  console.log("Seeded site settings.");

  let factsheetCount = 0;
  for (const category of FACTSHEET_CATEGORIES) {
    await FactsheetCategory.updateOne(
      { slug: category.slug },
      {
        $set: {
          slug: category.slug,
          title: category.title,
          description: category.description,
          order: category.order,
        },
      },
      { upsert: true }
    );

    for (const factsheet of category.factsheets) {
      await Factsheet.updateOne(
        { categorySlug: category.slug, slug: factsheet.slug },
        {
          $set: {
            categorySlug: category.slug,
            title: factsheet.title,
            slug: factsheet.slug,
            summary: factsheet.summary,
            order: factsheet.order,
          },
        },
        { upsert: true }
      );
      factsheetCount += 1;
    }
  }
  console.log(
    `Seeded ${FACTSHEET_CATEGORIES.length} factsheet categories and ${factsheetCount} factsheets.`
  );

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await AdminUser.updateOne(
      { email: adminEmail.toLowerCase() },
      { $set: { email: adminEmail.toLowerCase(), passwordHash, role: "admin" } },
      { upsert: true }
    );
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.log(
      "Skipped admin user seed — set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local to create one."
    );
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
