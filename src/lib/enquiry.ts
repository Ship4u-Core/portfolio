import { ship } from "@/content/sections";

/** Shared between the form (inline validation) and the API route (server). */

export const ENQUIRY_FIELDS = ["name", "email", "brief", "budget", "timeline"] as const;
export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];
export type EnquiryPayload = Record<EnquiryField, string>;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const budgetValues = new Set(ship.budgetOptions.map((o) => o.value));
const timelineValues = new Set(ship.timelineOptions.map((o) => o.value));

export function normalise(input: Record<string, unknown>): EnquiryPayload {
  const pick = (k: EnquiryField) => (typeof input[k] === "string" ? (input[k] as string).trim() : "");
  return {
    name: pick("name").slice(0, 200),
    email: pick("email").slice(0, 320),
    brief: pick("brief").slice(0, 5000),
    budget: pick("budget"),
    timeline: pick("timeline"),
  };
}

export function validate(p: EnquiryPayload): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!p.name) errors.name = ship.errors.name;
  if (!p.email || !EMAIL.test(p.email)) errors.email = ship.errors.email;
  if (!p.brief || p.brief.length < 3) errors.brief = ship.errors.brief;
  if (!budgetValues.has(p.budget)) errors.budget = ship.errors.budget;
  if (!timelineValues.has(p.timeline)) errors.timeline = ship.errors.timeline;
  return errors;
}

export function validateField(field: EnquiryField, value: string): string | undefined {
  const blank: EnquiryPayload = { name: "", email: "", brief: "", budget: "", timeline: "" };
  return validate({ ...blank, [field]: value })[field];
}
