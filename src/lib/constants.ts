/**
 * Shared enums used by both Mongoose models and client components.
 * Kept free of any server-only imports so client bundles never pull in mongoose.
 */

export const LEAD_STATUSES = ["Pending", "Contacted", "Converted"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const ADMIN_ROLES = ["admin", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
