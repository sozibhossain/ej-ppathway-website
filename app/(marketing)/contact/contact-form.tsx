"use client";

import { useState } from "react";
import { TextField, TextArea, SelectField } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { api, ApiError } from "../../lib/api";

export function ContactForm({
  title,
  subtitle,
  categories,
  successMessage,
  footnote
}: {
  title?: string;
  subtitle?: string;
  categories: string[];
  successMessage?: string;
  footnote?: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(categories[0] || "General Inquiry");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setDone(null);
    if (!firstName || !email || !message) {
      setError("First name, email and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await api.post<{ id?: string }>(
        "/contact",
        { firstName, lastName, email, phone, subject, category, message },
        { skipAuth: true }
      );
      setDone(successMessage || r.message || "Thanks! Your message was sent.");
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8">
      {title && <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{title}</h2>}
      {subtitle && <p className="text-sm text-slate-600 mb-6">{subtitle}</p>}

      {done ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-emerald-700">
          {done}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="First Name" placeholder="Type name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField label="Last Name" placeholder="Type name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <TextField label="Email Address" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Phone Number" type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField label="Subject" placeholder="What is this regarding?" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <SelectField label="Category *" value={category} onChange={(e) => setCategory(e.target.value)}>
          {(categories.length ? categories : ["General Inquiry"]).map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectField>
        <TextArea label="Message" placeholder="Write your message here…" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Send Message"}
        </Button>

        {footnote && <p className="text-xs text-slate-500 text-center">{footnote}</p>}
      </form>
    </section>
  );
}
