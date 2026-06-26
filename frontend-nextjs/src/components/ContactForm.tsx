"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { http, extractErrorMessage } from "@/lib/http";
import type { LeadPayload, LeadResponse } from "@/lib/types";

interface FieldErrors {
  [k: string]: string;
}

const SERVICES = [
  "CCTV Camera Installation",
  "Networking & IT Infrastructure",
  "Server Setup & Maintenance",
  "Access Control & Biometrics",
  "Hardware Sales & Support",
  "Maintenance & AMC",
  "Other / Not sure",
];

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [form, setForm] = useState<LeadPayload>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: defaultService || "",
    message: "",
    city: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: async (payload: LeadPayload) => {
      const { data } = await http.post<LeadResponse>("/crm/public/leads/", payload);
      return data;
    },
  });

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim() && !form.phone.trim())
      e.email = "Provide an email or phone so we can reach you.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.message?.trim()) e.message = "Tell us briefly what you need.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    mutation.mutate(form);
  }

  function update<K extends keyof LeadPayload>(key: K, value: LeadPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  if (mutation.isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
        role="status"
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-2xl text-accent">
          ✓
        </div>
        <h3 className="text-xl font-bold text-content">Thank you!</h3>
        <p className="mt-2 text-content-muted">
          {mutation.data?.message || "Our team will contact you shortly."}
        </p>
        <button
          type="button"
          onClick={() => {
            mutation.reset();
            setForm({ name: "", email: "", phone: "", company: "", service_interest: "", message: "", city: "" });
          }}
          className="btn-ghost btn-sm mt-6"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-content placeholder:text-content-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40";

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name} required>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <input
            className={inputCls}
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Company (optional)"
            autoComplete="organization"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            type="tel"
            className={inputCls}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+92 3xx xxxxxxx"
            autoComplete="tel"
          />
        </Field>
        <Field label="City" error={errors.city}>
          <input
            className={inputCls}
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Bahawalpur"
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Service of interest" error={errors.service_interest}>
          <select
            className={inputCls}
            value={form.service_interest}
            onChange={(e) => update("service_interest", e.target.value)}
          >
            <option value="">Select a service…</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" error={errors.message} required>
        <textarea
          className={`${inputCls} min-h-[120px] resize-y`}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your requirements, site size, location…"
        />
      </Field>

      {mutation.isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          {extractErrorMessage(mutation.error)}
        </p>
      )}

      <button type="submit" disabled={mutation.isPending} className="btn-primary w-full disabled:opacity-60">
        {mutation.isPending ? "Sending…" : "Send message"}
      </button>
      <p className="text-center text-xs text-content-muted">
        We typically respond within one business day. Your details are kept private.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-content">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
