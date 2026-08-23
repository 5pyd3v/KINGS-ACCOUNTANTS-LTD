import { Schema, model, models, type Document, type Model } from "mongoose";
import { slugify } from "@/lib/slugify";

export interface IFactsheet extends Document {
  categorySlug: string;
  title: string;
  slug: string;
  summary: string;
  /**
   * Sanitized HTML body, authored via the admin rich-text (WYSIWYG) editor.
   * Blockquotes render as a highlighted callout box — for worked examples or
   * "how we can help" notes. Empty means the factsheet is a placeholder
   * pending real content.
   */
  body: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FactsheetSchema = new Schema<IFactsheet>(
  {
    categorySlug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    summary: { type: String, default: "", trim: true },
    body: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FactsheetSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

FactsheetSchema.index({ categorySlug: 1, slug: 1 }, { unique: true });

export const Factsheet: Model<IFactsheet> =
  models.Factsheet ?? model<IFactsheet>("Factsheet", FactsheetSchema);
