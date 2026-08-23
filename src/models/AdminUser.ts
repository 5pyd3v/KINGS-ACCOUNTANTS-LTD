import { Schema, model, models, type Document, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { ADMIN_ROLES, type AdminRole } from "@/lib/constants";

export { ADMIN_ROLES, type AdminRole };

export interface IAdminUser extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  role: AdminRole;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, default: "admin" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

AdminUserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const AdminUser: Model<IAdminUser> =
  models.AdminUser ?? model<IAdminUser>("AdminUser", AdminUserSchema);
