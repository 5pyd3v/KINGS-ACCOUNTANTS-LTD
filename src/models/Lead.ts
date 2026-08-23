import { Schema, model, models, type Document, type Model } from "mongoose";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/constants";

export { LEAD_STATUSES, type LeadStatus };

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone?: string;
  serviceOfInterest?: string;
  message: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    serviceOfInterest: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: LEAD_STATUSES, default: "Pending" },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, createdAt: -1 });

export const Lead: Model<ILead> = models.Lead ?? model<ILead>("Lead", LeadSchema);
