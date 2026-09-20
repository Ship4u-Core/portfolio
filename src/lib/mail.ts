import { Resend } from "resend";
import { ship } from "@/content/sections";
import { site } from "@/content/site";
import type { EnquiryPayload } from "@/lib/enquiry";

/**
 * Resend client. The key lives in `RESEND_API_KEY` (see `.env.example`).
 * Never instantiate this in a Client Component — the key is a secret.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? "Ship4u <onboarding@resend.dev>";
/** Inbox for form submissions. Defaults to the studio address in `site.ts`. */
function enquiryTo() {
  return process.env.ENQUIRY_TO ?? site.email;
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function label(options: { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

function enquiryHtml(p: EnquiryPayload) {
  const brief = escape(p.brief).replace(/\r\n|\r|\n/g, "<br>");
  return `<p>New enquiry from the Ship4u site.</p>
<p><strong>Name:</strong> ${escape(p.name)}<br>
<strong>Email:</strong> ${escape(p.email)}<br>
<strong>Budget:</strong> ${escape(label(ship.budgetOptions, p.budget))}<br>
<strong>Timeline:</strong> ${escape(label(ship.timelineOptions, p.timeline))}</p>
<p><strong>What they are building:</strong><br>${brief}</p>`;
}

function enquiryText(p: EnquiryPayload) {
  return [
    "New enquiry from the Ship4u site.",
    "",
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Budget: ${label(ship.budgetOptions, p.budget)}`,
    `Timeline: ${label(ship.timelineOptions, p.timeline)}`,
    "",
    "What they are building:",
    p.brief,
  ].join("\n");
}

export async function sendEnquiry(payload: EnquiryPayload) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set. Copy .env.example to .env and replace re_xxxxxxxxx with your Resend API key.");
  }

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: enquiryTo(),
    replyTo: payload.email,
    subject: `Enquiry from ${payload.name}`,
    html: enquiryHtml(payload),
    text: enquiryText(payload),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
