import Link from "next/link";
import { Plus } from "lucide-react";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models";
import { ServiceIcon } from "@/components/shared/ServiceIcon";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await dbConnect();
  const services = await Service.find().sort({ order: 1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">Services</h1>
          <p className="mt-2 text-sm text-ink-400">{services.length} total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          New service
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-paper/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper/[0.04] text-xs uppercase tracking-[0.16em] text-ink-400">
            <tr>
              <th className="px-6 py-4 font-normal">Service</th>
              <th className="hidden px-6 py-4 font-normal lg:table-cell">Slug</th>
              <th className="px-6 py-4 font-normal">Order</th>
              <th className="px-6 py-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper/[0.07]">
            {services.map((service) => (
              <tr key={String(service._id)} className="bg-paper/[0.015] transition-colors hover:bg-paper/[0.04]">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/services/${service._id}`}
                    className="flex items-center gap-3 text-paper hover:text-brand-300"
                  >
                    <span className="text-brand-300">
                      <ServiceIcon name={service.iconName} className="h-4 w-4" />
                    </span>
                    {service.title}
                  </Link>
                </td>
                <td className="hidden px-6 py-4 font-mono text-xs text-ink-400 lg:table-cell">
                  {service.slug}
                </td>
                <td className="px-6 py-4 text-ink-300">{service.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      service.isActive
                        ? "rounded-full bg-brand-700/30 px-3 py-1 text-xs text-brand-200"
                        : "rounded-full border border-paper/15 px-3 py-1 text-xs text-ink-400"
                    }
                  >
                    {service.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
