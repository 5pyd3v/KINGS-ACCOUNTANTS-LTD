import { Schema, model, models, type Document, type Model, type Types } from "mongoose";
import { slugify } from "@/lib/slugify";

export interface ICaseStudyMetric {
  label: string;
  value: string;
}

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  clientIndustry: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  takeaway: string;
  metrics: Types.DocumentArray<ICaseStudyMetric & Document>;
  coverImage?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudyMetricSchema = new Schema<ICaseStudyMetric>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    clientIndustry: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    result: { type: String, required: true },
    takeaway: { type: String, required: true },
    metrics: { type: [CaseStudyMetricSchema], default: [] },
    coverImage: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CaseStudySchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

export const CaseStudy: Model<ICaseStudy> =
  models.CaseStudy ?? model<ICaseStudy>("CaseStudy", CaseStudySchema);
