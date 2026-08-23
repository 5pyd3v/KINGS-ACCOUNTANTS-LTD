import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/models";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const testimonial = await Testimonial.findById(id).lean().catch(() => null);
  if (!testimonial) notFound();

  return (
    <TestimonialForm
      initial={{
        _id: String(testimonial._id),
        clientName: testimonial.clientName,
        role: testimonial.role ?? "",
        company: testimonial.company ?? "",
        quote: testimonial.quote,
        rating: testimonial.rating,
        featured: testimonial.featured,
        isActive: testimonial.isActive,
      }}
    />
  );
}
