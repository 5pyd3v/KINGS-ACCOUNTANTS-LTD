/** Diagnostic: prints what is actually stored in the connected database. */
import { config } from "dotenv";
config({ path: ".env.local" });

import { dbConnect } from "../src/lib/db";

async function main() {
  const mongoose = await dbConnect();
  const db = mongoose.connection.db!;
  console.log("Connected to database:", db.databaseName);

  const collections = await db.listCollections().toArray();
  for (const collection of collections) {
    const count = await db.collection(collection.name).countDocuments();
    console.log(`  ${collection.name}: ${count} documents`);
  }

  const services = await db
    .collection("services")
    .find({}, { projection: { title: 1, slug: 1, order: 1, _id: 0 } })
    .sort({ order: 1 })
    .toArray();
  console.log("\nServices stored:");
  services.forEach((service) => console.log(`  ${service.order}. ${service.title}`));

  const testimonials = await db
    .collection("testimonials")
    .find({}, { projection: { clientName: 1, _id: 0 } })
    .toArray();
  console.log("\nTestimonials stored:");
  testimonials.forEach((testimonial) => console.log(`  - ${testimonial.clientName}`));

  const admins = await db
    .collection("adminusers")
    .find({}, { projection: { email: 1, role: 1, _id: 0 } })
    .toArray();
  console.log("\nAdmin users:");
  admins.forEach((admin) => console.log(`  - ${admin.email} (${admin.role})`));

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
