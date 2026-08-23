import { dbConnect } from "@/lib/db";
import { Lead } from "@/models";
import { LeadsManager, type LeadView } from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await dbConnect();
  const docs = await Lead.find().sort({ createdAt: -1 }).lean();

  const leads: LeadView[] = docs.map((doc) => ({
    _id: String(doc._id),
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    serviceOfInterest: doc.serviceOfInterest,
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">Leads</h1>
      <p className="mt-2 text-sm text-ink-400">
        Enquiries submitted through the contact form.
      </p>

      <div className="mt-10">
        <LeadsManager leads={leads} />
      </div>
    </div>
  );
}
