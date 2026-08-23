import { Schema, model, models, type Document, type Model } from "mongoose";

export interface ITestimonial extends Document {
  clientName: string;
  role?: string;
  /** Optional — not every published testimonial names a company. */
  company?: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true, default: "" },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatarUrl: { type: String },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial: Model<ITestimonial> =
  models.Testimonial ?? model<ITestimonial>("Testimonial", TestimonialSchema);
