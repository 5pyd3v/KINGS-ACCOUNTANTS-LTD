import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileText,
  MessageSquareQuote,
  Users,
} from "lucide-react";
import { dbConnect } from "@/lib/db";
import { Service, CaseStudy, Testimonial, Lead, Factsheet } from "@/models";

export const dynamic = "force-dynamic";

async function getStats() {
  await dbConnect();
  const [
    services,
    activeServices,
    caseStudies,
    testimonials,
    leads,
    pendingLeads,
    recentLeads,
    factsheets,
    publishedFactsheets,
  ] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({ isActive: true }),
    CaseStudy.countDocuments(),
    Testimonial.countDocuments(),
    Lead.countDocuments(),
    Lead.countDocuments({ status: "Pending" }),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    Factsheet.countDocuments(),
    Factsheet.countDocuments({ "body.0": { $exists: true } }),
  ]);

  return {
    services,
    activeServices,
    caseStudies,
    testimonials,
    leads,
    pendingLeads,
    recentLeads,
    factsheets,
    publishedFactsheets,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total leads",
      value: stats.leads,
      sub: `${stats.pendingLeads} pending`,
      href: "/admin/leads",
      icon: Users,
    },
    {
      label: "Services",
      value: stats.services,
      sub: `${stats.activeServices} active`,
      href: "/admin/services",
      icon: Briefcase,
    },
    {
      label: "Case studies",
      value: stats.caseStudies,
      sub: "published",
      href: "/admin/case-studies",
      icon: BookOpen,
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      sub: "published",
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
    },
    {
      label: "Factsheets",
      value: stats.factsheets,
      sub: `${stats.publishedFactsheets} with content`,
      href: "/admin/factsheets",
      icon: FileText,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">Dashboard</h1>
      <p className="mt-2 text-sm text-ink-400">
        An overview of your content and enquiries.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-paper/10 bg-paper/[0.03] p-6 transition-colors hover:border-brand-500/50"
            >
              <div className="flex items-start justify-between">
                <Icon className="h-5 w-5 text-brand-300" strokeWidth={1.5} />
                <ArrowUpRight className="h-4 w-4 text-ink-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-6 font-display text-4xl text-paper">{card.value}</p>
              <p className="mt-2 text-sm text-ink-300">{card.label}</p>
              <p className="mt-1 text-xs text-ink-500">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-paper">Recent enquiries</h2>
          <Link
            href="/admin/leads"
            className="text-xs uppercase tracking-[0.18em] text-ink-400 transition-colors hover:text-brand-300"
          >
            View all
          </Link>
        </div>

        {stats.recentLeads.length === 0 ? (
          <p className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-8 text-sm text-ink-400">
            No enquiries yet. Submissions from the contact form will appear here.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-paper/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper/[0.04] text-xs uppercase tracking-[0.16em] text-ink-400">
                <tr>
                  <th className="px-6 py-4 font-normal">Name</th>
                  <th className="px-6 py-4 font-normal">Email</th>
                  <th className="hidden px-6 py-4 font-normal md:table-cell">Interest</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/[0.07]">
                {stats.recentLeads.map((lead) => (
                  <tr key={String(lead._id)} className="bg-paper/[0.015]">
                    <td className="px-6 py-4 text-paper">{lead.fullName}</td>
                    <td className="px-6 py-4 text-ink-300">{lead.email}</td>
                    <td className="hidden px-6 py-4 text-ink-400 md:table-cell">
                      {lead.serviceOfInterest || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-paper/15 px-3 py-1 text-xs text-ink-300">
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
