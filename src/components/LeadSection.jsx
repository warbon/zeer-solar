import { useId, useMemo, useState } from "react";
import Icon from "./Icon.jsx";
import { contact, leadForm as leadFormConfig } from "../config.js";
import { trackEvent } from "../lib/analytics.js";

const BENEFITS = [
  { icon: "bolt", title: "Bill-focused sizing", text: "Start with your current electricity spend." },
  { icon: "shield", title: "Practical backup advice", text: "Match batteries to essential loads." },
  { icon: "award", title: "Clear proposal path", text: "Move from estimate to site validation." },
  { icon: "mail", title: "Direct contact", text: "Reach the ZEER team without an account." },
];

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  monthlyBill: "8500",
  location: "",
  message: "",
};

function Field({ label, value, onChange, type = "text", required = false, className = "", placeholder = "", min, autoComplete }) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        min={min}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-[44px] w-full rounded-xl border border-slate-200 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, className = "", placeholder = "" }) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-bold text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={5}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

export default function LeadSection({ peso }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("ZEER Solar Free Estimate Request");
    const body = encodeURIComponent(
      [
        `Hello ${contact.personTitle} ${contact.personName},`,
        "",
        "I would like to request a solar estimate.",
        "",
        `Name: ${form.name || "-"}`,
        `Phone: ${form.phone || "-"}`,
        `Email: ${form.email || "-"}`,
        `Monthly electric bill: ${form.monthlyBill ? peso(Number(form.monthlyBill)) : "-"}`,
        `Location: ${form.location || "-"}`,
        "",
        "Message:",
        form.message || "-",
      ].join("\n")
    );

    return `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }, [form, peso]);

  const submit = async (event) => {
    event.preventDefault();

    // Without a configured endpoint the best we can do is hand off to the
    // visitor's mail client. This captures nothing -- see config.js.
    if (!leadFormConfig.endpoint) {
      trackEvent("Lead Submitted", { method: "mailto" });
      window.location.href = mailtoHref;
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(leadFormConfig.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          _subject: "ZEER Solar Free Estimate Request",
        }),
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      setStatus("success");
      setForm(EMPTY_FORM);
      trackEvent("Lead Submitted", { method: "endpoint" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
      trackEvent("Lead Failed", { method: "endpoint" });
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <section id="estimate" className="bg-slate-50 px-6 py-16 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-600">Free Estimate</p>
          <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
            Request a solar assessment.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Share your monthly bill, location, and project notes, and the ZEER team will follow up
            with a proposal sized to your roof and budget.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-md">
                  <Icon name={benefit.icon} />
                </div>
                <div>
                  <p className="font-black text-blue-950">{benefit.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required autoComplete="name" />
            <Field label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} type="tel" required autoComplete="tel" />
            <Field label="Email Address" value={form.email} onChange={(v) => update("email", v)} type="email" autoComplete="email" />
            <Field label="Monthly Electric Bill" value={form.monthlyBill} onChange={(v) => update("monthlyBill", v)} type="number" min="0" />
            <Field label="Location" value={form.location} onChange={(v) => update("location", v)} className="sm:col-span-2" placeholder="City or barangay" autoComplete="address-level2" />
            <TextArea label="Project Notes" value={form.message} onChange={(v) => update("message", v)} className="sm:col-span-2" placeholder="Tell us about your roof, timeline, backup needs, or questions." />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Send Estimate Request"}
            </button>
            <a
              href={mailtoHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-6 py-4 text-base font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              Open Email Draft
            </a>
          </div>

          {/* Announced to screen readers as soon as it appears. */}
          <div aria-live="polite" className="mt-4">
            {status === "success" && (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
                Thank you — your request is in. The ZEER team will reply within one business day.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                Something went wrong sending your request ({errorMessage}). Please use the{" "}
                <a href={mailtoHref} className="underline">
                  email draft
                </a>{" "}
                or call {contact.phone}.
              </p>
            )}
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            We use your details only to prepare and discuss your solar estimate. We never sell or
            share them.
          </p>
        </form>
      </div>
    </section>
  );
}
