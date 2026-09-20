"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { ship } from "@/content/sections";
import { FourMark, Tick } from "@/components/ui/Icons";
import { gsap } from "@/lib/gsap";
import {
  CLIP_FULL,
  CLIP_HIDDEN_BOTTOM,
  CLIP_HIDDEN_TOP,
  drawIn,
  EASE_IN_OUT,
  EASE_OUT,
  isReducedMotion,
  prepareDraw,
} from "@/lib/motion";
import {
  ENQUIRY_FIELDS,
  normalise,
  validate,
  validateField,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";

type Status = "idle" | "sending" | "sent";

/**
 * The enquiry form. Rule-only fields, mono labels, inline mono validation in
 * signal-deep beneath each field, never alert(). On success the form
 * clip-wipes out and a mono confirmation with a drawn tick takes its place.
 * Without JavaScript the same markup posts to /api/enquiry directly.
 */
export function EnquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const setFieldError = useCallback((field: EnquiryField, message?: string) => {
    setErrors((prev) => {
      if (prev[field] === message) return prev;
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }, []);

  const onBlur = (field: EnquiryField) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFieldError(field, validateField(field, e.currentTarget.value));
  };
  const onChange = (field: EnquiryField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Clear an error as soon as the field becomes valid; do not nag while typing.
    if (errors[field] && !validateField(field, e.currentTarget.value)) setFieldError(field, undefined);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = normalise(Object.fromEntries(new FormData(form).entries()));
    const found = validate(payload);
    setErrors(found);
    setFormError(null);
    const firstInvalid = ENQUIRY_FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: EnquiryErrors };
      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.errors && Object.keys(data.errors).length ? null : ship.errors.network);
        setStatus("idle");
        return;
      }
      showSuccess();
    } catch {
      setFormError(ship.errors.network);
      setStatus("idle");
    }
  };

  const showSuccess = () => {
    const form = formRef.current;
    const success = successRef.current;
    setStatus("sent");
    if (!form || !success) return;
    const tickPaths = prepareDraw(success);
    if (isReducedMotion()) {
      gsap.set(form, { clipPath: CLIP_HIDDEN_TOP });
      gsap.set(success, { clipPath: CLIP_FULL, yPercent: 0 });
      tickPaths.forEach((p) => (p.style.strokeDashoffset = "0"));
      success.focus();
      return;
    }
    const tl = gsap.timeline({ onComplete: () => success.focus() });
    tl.to(form, { clipPath: CLIP_HIDDEN_TOP, duration: 0.45, ease: EASE_IN_OUT })
      .fromTo(
        success,
        { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 12 },
        { clipPath: CLIP_FULL, yPercent: 0, duration: 0.8, ease: EASE_OUT },
        "-=0.1",
      )
      .add(drawIn(tickPaths, { duration: 0.5 }), "-=0.5");
  };

  const sent = status === "sent";

  return (
    <div className="relative" data-enquiry>
      <form
        ref={formRef}
        action="/api/enquiry"
        method="post"
        noValidate
        onSubmit={onSubmit}
        className={clsx("grid gap-9", sent && "pointer-events-none")}
        aria-hidden={sent ? "true" : undefined}
        inert={sent || undefined}
        data-enquiry-form
      >
        <Field id="enquiry-name" label={ship.fields.name} error={errors.name}>
          <input
            id="enquiry-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="field-input"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "enquiry-name-error" : undefined}
            onBlur={onBlur("name")}
            onChange={onChange("name")}
          />
        </Field>

        <Field id="enquiry-email" label={ship.fields.email} error={errors.email}>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            className="field-input"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "enquiry-email-error" : undefined}
            onBlur={onBlur("email")}
            onChange={onChange("email")}
          />
        </Field>

        <Field id="enquiry-brief" label={ship.fields.brief} error={errors.brief}>
          <textarea
            id="enquiry-brief"
            name="brief"
            rows={3}
            required
            placeholder={ship.fields.briefPlaceholder}
            className="field-input resize-y"
            aria-invalid={errors.brief ? "true" : undefined}
            aria-describedby={errors.brief ? "enquiry-brief-error" : undefined}
            onBlur={onBlur("brief")}
            onChange={onChange("brief")}
          />
        </Field>

        <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
          <Field id="enquiry-budget" label={ship.fields.budget} error={errors.budget}>
            <select
              id="enquiry-budget"
              name="budget"
              required
              className="field-input"
              defaultValue=""
              aria-invalid={errors.budget ? "true" : undefined}
              aria-describedby={errors.budget ? "enquiry-budget-error" : undefined}
              onBlur={onBlur("budget")}
              onChange={onChange("budget")}
            >
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
          <Field id="enquiry-timeline" label={ship.fields.timeline} error={errors.timeline}>
            <select
              id="enquiry-timeline"
              name="timeline"
              required
              className="field-input"
              defaultValue=""
              aria-invalid={errors.timeline ? "true" : undefined}
              aria-describedby={errors.timeline ? "enquiry-timeline-error" : undefined}
              onBlur={onBlur("timeline")}
              onChange={onChange("timeline")}
            >
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

        <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="mono radius-doc inline-flex h-12 items-center gap-3 bg-ink px-6 text-paper transition-colors duration-200 hover:bg-ink-soft disabled:opacity-60"
            data-cursor="SEND"
          >
            <FourMark className="text-signal" />
            {status === "sending" ? "SENDING" : ship.fields.submit}
          </button>
          <p
            className={clsx("mono text-signal-deep", !formError && "hidden")}
            role="alert"
            data-form-error
          >
            {formError}
          </p>
        </div>
      </form>

      {/* Success, in place: mono confirmation and a drawn tick */}
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={clsx(
          "absolute inset-x-0 top-0 outline-none",
          !sent && "pointer-events-none invisible",
        )}
        style={sent ? undefined : { clipPath: CLIP_HIDDEN_BOTTOM }}
        data-enquiry-success
      >
        <div className="hairline-t hairline-b flex items-start gap-5 py-8">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-ink">
            <Tick size={14} className="text-signal" />
          </span>
          <div>
            <p className="mono text-ink">{ship.success.title}</p>
            <p className="mono mt-3 leading-relaxed">{ship.success.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id} className="mono block pb-2">
        {label}
      </label>
      {children}
      <p
        id={`${id}-error`}
        className={clsx("mono mt-2 text-signal-deep", !error && "hidden")}
        data-error-for={id}
      >
        {error}
      </p>
    </div>
  );
}
