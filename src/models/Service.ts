import { Schema, model, models, type Document, type Model } from "mongoose";
import { slugify } from "@/lib/slugify";

export interface IService extends Document {
  title: string;
  slug: string;
  brief: string;
  detailedContent?: string;
  iconName: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brief: { type: String, required: true, trim: true },
    detailedContent: { type: String, default: "" },
    iconName: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

export const Service: Model<IService> = models.Service ?? model<IService>("Service", ServiceSchema);
