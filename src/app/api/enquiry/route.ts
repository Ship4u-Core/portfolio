import { NextResponse } from "next/server";
import { normalise, validate, type EnquiryPayload } from "@/lib/enquiry";
import { ship } from "@/content/sections";

export const runtime = "nodejs";

/**
 * POST /api/enquiry
 *
 * Accepts JSON (the site's form with JavaScript) or form-encoded bodies
 * (the same form with JavaScript disabled). Validates server-side, logs the
 * payload, returns 200 { ok: true }.
 */
export async function POST(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  const isForm = type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");

  let raw: Record<string, unknown> = {};
  try {
    if (isForm) {
      const fd = await request.formData();
      raw = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
    } else {
      raw = (await request.json()) as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Malformed request body." } }, { status: 400 });
  }

  const payload = normalise(raw);
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    if (isForm) return htmlResponse(errorPage(errors), 400);
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  await deliver(payload);

  if (isForm) return htmlResponse(successPage(), 200);
  return NextResponse.json({ ok: true });
}

async function deliver(payload: EnquiryPayload) {
  console.log("[ship4u] enquiry", JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }));

  // TODO(ship4u): wire a transport. Options, in order of effort:
  //   1. Resend  — `await resend.emails.send({...})`, add RESEND_API_KEY
  //   2. Formspree/Web3Forms — POST-forward, no backend key needed
  //   3. Supabase/Postgres table — if you want a CRM later
  // Until one is wired, enquiries are logged only and WILL BE LOST.
  console.warn(
    "[ship4u] No enquiry transport is wired. This enquiry was logged to the server console only and WILL BE LOST. See src/app/api/enquiry/route.ts.",
  );
}

/* ---- Minimal HTML for the JavaScript-disabled path ---- */

function htmlResponse(body: string, status: number) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function shell(title: string, inner: string) {
  return `<!doctype html>
<html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${escape(title)} — Ship4u</title>
<style>
  html{background:#f5f3ee;color:#111110}
  body{margin:0;min-height:100svh;display:grid;place-items:center;font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}
  main{padding:40px 24px;max-width:56ch;border-top:1px solid #dcd8cf}
  h1{font-size:13px;font-weight:400;margin:0 0 16px}
  p{margin:0 0 12px;color:#4a4843}
  a{color:#111110;text-decoration:none;border-bottom:1px solid #111110}
  li{color:#b22f10;list-style:none}
  ul{padding:0;margin:0 0 16px}
</style></head><body><main>${inner}</main></body></html>`;
}

function successPage() {
  return shell(
    ship.success.title,
    `<h1>${escape(ship.success.title)}</h1><p>${escape(ship.success.body)}</p><p><a href="/#ship">Back to Ship4u</a></p>`,
  );
}

function errorPage(errors: Record<string, string | undefined>) {
  const items = Object.values(errors)
    .filter(Boolean)
    .map((e) => `<li>${escape(e!)}</li>`)
    .join("");
  return shell("Check the form", `<h1>Check the form</h1><ul>${items}</ul><p><a href="/#ship">Back to the form</a></p>`);
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
