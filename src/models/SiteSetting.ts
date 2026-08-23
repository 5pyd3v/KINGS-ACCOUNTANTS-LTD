import { Schema, model, models, type Document, type Model, type Types } from "mongoose";

/** Singleton key — there is only ever one settings document. */
export const SITE_SETTING_KEY = "site";

export interface IPillar {
  title: string;
  body: string;
  iconName: string;
}

export interface ITrustMetric {
  value: number | null;
  display: string;
  suffix: string;
  label: string;
}

export interface ISiteSetting extends Document {
  key: string;
  tagline: string;
  subTagline: string;
  welcomeHeadline: string;
  intro: string;
  approach: string;
  clientBase: string;
  valueProposition: string;
  addressLines: string[];
  phone: string;
  phoneHref: string;
  email: string;
  whyChooseUs: Types.DocumentArray<IPillar & Document>;
  trustMetrics: Types.DocumentArray<ITrustMetric & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const PillarSchema = new Schema<IPillar>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    iconName: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TrustMetricSchema = new Schema<ITrustMetric>(
  {
    // `value` null means the tile shows `display` text instead of counting up.
    value: { type: Number, default: null },
    display: { type: String, default: "" },
    suffix: { type: String, default: "" },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true, default: SITE_SETTING_KEY },
    tagline: { type: String, default: "" },
    subTagline: { type: String, default: "" },
    welcomeHeadline: { type: String, default: "" },
    intro: { type: String, default: "" },
    approach: { type: String, default: "" },
    clientBase: { type: String, default: "" },
    valueProposition: { type: String, default: "" },
    addressLines: { type: [String], default: [] },
    phone: { type: String, default: "" },
    phoneHref: { type: String, default: "" },
    email: { type: String, default: "" },
    whyChooseUs: { type: [PillarSchema], default: [] },
    trustMetrics: { type: [TrustMetricSchema], default: [] },
  },
  { timestamps: true }
);

export const SiteSetting: Model<ISiteSetting> =
  models.SiteSetting ?? model<ISiteSetting>("SiteSetting", SiteSettingSchema);
