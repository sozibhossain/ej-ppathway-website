"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TextArea, TextField } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api, ApiError } from "../lib/api";

type OnboardingDetails = {
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    timezone?: string;
  };
  professionalTitle?: string;
  bio?: string;
  detailedDescription?: string;
  yearsOfExperience?: string;
  expertise?: string[];
  styles?: string[];
  languages?: string[];
  pricing?: {
    chatPerMin?: number;
    callPerMin?: number;
    videoPerMin?: number;
  };
};

const OPTIONS_EXPERTISE = ["Love & Relationships", "Career", "Family", "Finances", "Dream Interpretation", "Deliverance", "Marriage"];
const OPTIONS_STYLES = ["Compassionate", "Expressive", "Direct", "Thoughtful", "Inspirational", "Straightforward", "Correction"];

export default function AdvisorOnboardingPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    timezone: "",
    password: "",
    professionalTitle: "",
    yearsOfExperience: "",
    languages: "",
    chatPerMin: "",
    callPerMin: "",
    videoPerMin: "",
    bio: "",
    detailedDescription: "",
  });
  const [expertise, setExpertise] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);

  useEffect(() => {
    const nextToken = new URLSearchParams(window.location.search).get("token") || "";
    setToken(nextToken);
    if (!nextToken) {
      setError("Invalid or missing onboarding link.");
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await api.get<OnboardingDetails>("/contracts/advisor-onboarding", { token: nextToken }, { skipAuth: true });
        if (!active) return;
        const data = res.data || {};
        setForm({
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          country: data.user?.country || "",
          state: data.user?.state || "",
          city: data.user?.city || "",
          timezone: data.user?.timezone || "UTC",
          password: "",
          professionalTitle: data.professionalTitle || "",
          yearsOfExperience: data.yearsOfExperience || "",
          languages: (data.languages || ["English"]).join(", "),
          chatPerMin: String(data.pricing?.chatPerMin ?? ""),
          callPerMin: String(data.pricing?.callPerMin ?? ""),
          videoPerMin: String(data.pricing?.videoPerMin ?? ""),
          bio: data.bio || "",
          detailedDescription: data.detailedDescription || "",
        });
        setExpertise(data.expertise || []);
        setStyles(data.styles || []);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "This onboarding link is invalid or expired.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const submit = async () => {
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.password.trim() || !form.professionalTitle.trim()) {
      setError("Name, phone, password, and professional title are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(
        "/contracts/advisor-onboarding",
        {
          token,
          ...form,
          languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean),
          expertise,
          styles,
          chatPerMin: Number(form.chatPerMin || 0),
          callPerMin: Number(form.callPerMin || 0),
          videoPerMin: Number(form.videoPerMin || 0),
        },
        { skipAuth: true }
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to complete onboarding.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eaf6f9] py-8 px-4">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-xl shadow-slate-300/30">
        <Image src="/logo.svg" alt="Prophetic Pathway" width={170} height={44} className="h-10 w-auto" unoptimized />
        {loading ? (
          <p className="mt-8 text-slate-600">Loading onboarding form...</p>
        ) : success ? (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            Your onboarding form has been submitted for admin review.
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Advisor Onboarding</h1>
            <p className="mt-1 text-sm text-slate-600">Create your advisor account and complete your public profile details.</p>
            {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              <TextField label="Email" value={form.email} disabled />
              <TextField label="Phone Number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              <TextField label="Create Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
              <TextField label="Country" value={form.country} onChange={(e) => update("country", e.target.value)} />
              <TextField label="State / Region" value={form.state} onChange={(e) => update("state", e.target.value)} />
              <TextField label="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
              <TextField label="Time Zone" value={form.timezone} onChange={(e) => update("timezone", e.target.value)} />
              <TextField label="Professional Title" value={form.professionalTitle} onChange={(e) => update("professionalTitle", e.target.value)} />
              <TextField label="Years of Experience" value={form.yearsOfExperience} onChange={(e) => update("yearsOfExperience", e.target.value)} />
              <TextField label="Languages" value={form.languages} onChange={(e) => update("languages", e.target.value)} />
              <div className="grid grid-cols-3 gap-3">
                <TextField label="Chat" type="number" value={form.chatPerMin} onChange={(e) => update("chatPerMin", e.target.value)} />
                <TextField label="Call" type="number" value={form.callPerMin} onChange={(e) => update("callPerMin", e.target.value)} />
                <TextField label="Video" type="number" value={form.videoPerMin} onChange={(e) => update("videoPerMin", e.target.value)} />
              </div>
            </div>
            <ChoiceGroup title="Expertise Areas" options={OPTIONS_EXPERTISE} values={expertise} onToggle={(v) => toggle(v, expertise, setExpertise)} />
            <ChoiceGroup title="Styles" options={OPTIONS_STYLES} values={styles} onToggle={(v) => toggle(v, styles, setStyles)} />
            <div className="mt-4 grid grid-cols-1 gap-4">
              <TextArea label="Bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
              <TextArea label="Detailed Description" value={form.detailedDescription} onChange={(e) => update("detailedDescription", e.target.value)} />
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Complete Onboarding"}</Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function ChoiceGroup({ title, options, values, onToggle }: { title: string; options: string[]; values: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="mt-5">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <input type="checkbox" checked={values.includes(option)} onChange={() => onToggle(option)} className="accent-[#0e7490]" />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
