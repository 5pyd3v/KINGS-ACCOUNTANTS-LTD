import { Schema, model, models, type Document, type Model } from "mongoose";
import { slugify } from "@/lib/slugify";

export interface IFactsheetCategory extends Document {
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FactsheetCategorySchema = new Schema<IFactsheetCategory>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FactsheetCategorySchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

export const FactsheetCategory: Model<IFactsheetCategory> =
  models.FactsheetCategory ?? model<IFactsheetCategory>("FactsheetCategory", FactsheetCategorySchema);
