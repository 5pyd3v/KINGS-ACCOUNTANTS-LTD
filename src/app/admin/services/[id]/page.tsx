import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const service = await Service.findById(id).lean().catch(() => null);
  if (!service) notFound();

  return (
    <ServiceForm
      initial={{
        _id: String(service._id),
        title: service.title,
        slug: service.slug,
        brief: service.brief,
        detailedContent: service.detailedContent ?? "",
        iconName: service.iconName,
        isActive: service.isActive,
        order: service.order,
      }}
    />
  );
}
