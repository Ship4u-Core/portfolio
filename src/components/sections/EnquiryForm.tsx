"use client";

import { ship } from "@/content/sections";
import { FourMark } from "@/components/ui/Icons";

/**
 * The enquiry form. Rule-only fields, mono labels. Validation, submission and
 * the in-place success state are wired in Phase 4; the markup posts to the
 * API route without JavaScript.
 */
export function EnquiryForm() {
  return (
    <form
      action="/api/enquiry"
      method="post"
      noValidate
      className="grid gap-9"
      data-enquiry-form
    >
      <Field id="enquiry-name" label={ship.fields.name}>
        <input
          id="enquiry-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="field-input"
        />
      </Field>

      <Field id="enquiry-email" label={ship.fields.email}>
        <input
          id="enquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          className="field-input"
        />
      </Field>

      <Field id="enquiry-brief" label={ship.fields.brief}>
        <textarea
          id="enquiry-brief"
          name="brief"
          rows={3}
          required
          placeholder={ship.fields.briefPlaceholder}
          className="field-input resize-y"
        />
      </Field>

      <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
        <Field id="enquiry-budget" label={ship.fields.budget}>
          <select id="enquiry-budget" name="budget" required className="field-input" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {ship.budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="enquiry-timeline" label={ship.fields.timeline}>
          <select id="enquiry-timeline" name="timeline" required className="field-input" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {ship.timelineOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-between gap-6 pt-2">
        <button
          type="submit"
          className="mono radius-doc inline-flex h-12 items-center gap-3 bg-ink px-6 text-paper transition-colors duration-200 hover:bg-ink-soft"
          data-cursor="SEND"
        >
          <FourMark className="text-signal" />
          {ship.fields.submit}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id} className="mono block pb-2">
        {label}
      </label>
      {children}
      <p className="mono mt-2 hidden text-signal-deep" data-error-for={id} aria-live="polite" />
    </div>
  );
}
