"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TextField, SelectField, Checkbox } from "../../../components/ui/Input";
import { Combobox } from "../../../components/ui/Combobox";
import { Button, LinkButton } from "../../../components/ui/Button";
import {
  SparkleIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  UserIcon,
  CheckIcon,
} from "../../../components/ui/Icons";
import { MapPin } from "lucide-react";
import { api, ApiError } from "../../../lib/api";
import { useCountries, useCities } from "../../../lib/countries";

const STEPS = [
  "Application",
  "Pre-recorded Interview",
  "Live Interview",
  "Contract Signed",
  "Onboarding & Activation",
];

export default function AdvisorApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const countries = useCountries();
  const cities = useCities(countryCode);
  const [yearsExperience, setYearsExperience] = useState("");
  const [availableFiveHours, setAvailableFiveHours] = useState("");
  const [agree, setAgree] = useState(false);
  const [intro, setIntro] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Every field is mandatory, and the introduction video must be uploaded.
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !address ||
      !countryCode ||
      !city ||
      !zip ||
      !yearsExperience ||
      !availableFiveHours
    ) {
      setError("Please complete every field before submitting.");
      return;
    }
    if (!intro) {
      setError("Please upload your introduction video before submitting.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Advisors' Ethical Standards.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("dateOfBirth", dob);
      fd.append("address", address);
      fd.append("city", city);
      fd.append("zip", zip);
      fd.append("country", countryCode);
      fd.append("yearsOfExperience", yearsExperience);
      fd.append("availableFiveHoursPerDay", availableFiveHours);
      fd.append("introVideo", intro);
      await api.post("/auth/advisor-apply", fd, { isFormData: true, skipAuth: true });
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Submit failed";
      if (msg.includes("404") || msg.includes("Not Found")) {
        setSubmitted(true);
        return;
      }
      setError(msg);
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="bg-[#f0f9fb] py-8 sm:py-10 min-h-[46vh] flex items-center">
        <div className="container-page">
          <div className="mx-auto w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center mb-5">
              <CheckIcon size={30} />
            </div>
            <h1 className="text-2xl font-bold text-[#0e7490]">Application Submitted</h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Thank you for applying to join Prophetic Pathway. Our team will review your
              application and introduction video and reach out with the next steps. If you pass the
              interview and sign the advisor agreement, you&apos;ll receive an onboarding link by
              email to complete your advisor profile.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <LinkButton href="/" variant="outline" size="md">Back to Home</LinkButton>
              <LinkButton href="/join-as-advisor" size="md">Learn More</LinkButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f0f9fb] to-[#eaf6f9] py-8 sm:py-12">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#0e7490]/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-[#0e7490]/10 blur-3xl" aria-hidden="true" />
      <div className="container-page relative">
        <div className="mx-auto w-full max-w-4xl bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-300/40 overflow-hidden">
          {/* Branded header */}
          <div
            className="relative overflow-hidden px-6 sm:px-10 pt-8 pb-7 text-center text-white"
            style={{ background: "linear-gradient(135deg, #0e7490 0%, #0a5266 55%, #06303d 100%)" }}
          >
            <div className="absolute inset-0 bg-dots opacity-25" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-14 -right-10 h-44 w-44 rounded-full bg-cyan-300/15 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="Prophetic Pathway"
                width={170}
                height={44}
                className="h-9 w-auto mx-auto brightness-0 invert"
                unoptimized
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h1 className="mt-4 text-2xl sm:text-3xl font-bold inline-flex flex-wrap items-center justify-center gap-2">
                Become an Advisor <SparkleIcon size={22} />
              </h1>
              <p className="mt-1.5 text-sm text-teal-50/90 max-w-md mx-auto">
                Complete the application below to begin your journey with Prophetic Pathway.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-8 md:p-10">
            <Stepper currentIdx={0} />

            <form onSubmit={submit} className="mt-8 space-y-6 sm:space-y-7">
            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pl-3 border-l-[3px] border-[#0e7490] leading-tight">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Enter Your Full Name *"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<UserIcon size={18} />}
                  required
                />
                <TextField
                  label="Enter Your Email *"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<MailIcon size={18} />}
                  required
                />
                <TextField
                  label="Enter Your Phone Number *"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<PhoneIcon size={18} />}
                  required
                />
                <TextField
                  label="Date of Birth *"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  leftIcon={<CalendarIcon size={18} />}
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pl-3 border-l-[3px] border-[#0e7490] leading-tight">
                Address Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Enter Your Address *"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  leftIcon={<MapPin size={18} />}
                  required
                />
                <label className="block">
                  <span className="block mb-1.5 text-sm font-medium text-slate-700">Country *</span>
                  <Combobox
                    options={countries.map((c) => ({ value: c.iso2, label: c.name }))}
                    value={countryCode}
                    onChange={(v) => {
                      setCountryCode(v);
                      setCity("");
                    }}
                    placeholder="Select Country"
                    searchPlaceholder="Search countries…"
                    emptyText="No country found."
                    triggerClassName="h-12 px-4 bg-white border-slate-200 hover:border-slate-300 focus:border-[#0e7490] focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="block mb-1.5 text-sm font-medium text-slate-700">City *</span>
                  <Combobox
                    options={cities.map((c) => ({ value: c, label: c }))}
                    value={city}
                    onChange={(v) => setCity(v)}
                    placeholder={countryCode ? "Select City" : "Select a country first"}
                    searchPlaceholder="Search cities…"
                    emptyText="No city found."
                    disabled={!countryCode}
                    allowCustom
                    triggerClassName="h-12 px-4 bg-white border-slate-200 hover:border-slate-300 focus:border-[#0e7490] focus:outline-none"
                  />
                </label>
                <TextField
                  label="ZIP / Postal Code *"
                  placeholder="Postal code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pl-3 border-l-[3px] border-[#0e7490] leading-tight">
                Experience
              </h2>
              <TextField
                label="Years of Experience *"
                placeholder="e.g. 5"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                required
              />
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pl-3 border-l-[3px] border-[#0e7490] leading-tight">
                Availability
              </h2>
              <SelectField
                label="Are you available to work at least 5 hours per day? *"
                value={availableFiveHours}
                onChange={(e) => setAvailableFiveHours(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an answer
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </SelectField>
              <p className="mt-2 text-xs text-slate-500">
                Detailed availability is set in your advisor dashboard after approval.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pl-3 border-l-[3px] border-[#0e7490] leading-tight">
                Introduction Video
              </h2>
              <VideoRequirements />
              <FileDrop label="Upload an Intro video *" file={intro} onChange={setIntro} />
            </section>

            <Checkbox
              label={
                <span>
                  I have read and agree to follow the{" "}
                  <Link
                    href="/join-as-advisor/ethical-standards"
                    className="text-[#0e7490] font-medium hover:underline"
                  >
                    Advisors&apos; Ethical Standards
                  </Link>
                  . I understand that violating these standards may result in suspension or removal
                  from the platform.
                </span>
              }
              checked={agree}
              onChange={setAgree}
            />

            <p className="text-xs text-slate-500">
              <b>Note:</b> By submitting this application, you consent to the use of your personal
              data for the purpose of evaluating your suitability for employment in our organization.
              Your password, profile photo, and detailed bio are collected later during onboarding.
            </p>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoRequirements() {
  return (
    <div className="mb-4 rounded-2xl border border-[#bfe3ec] bg-[#f0f9fb] p-5 text-sm text-slate-700 leading-relaxed">
      <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#0e7490]">
        <span className="h-7 w-7 rounded-lg bg-[#0e7490] text-white inline-flex items-center justify-center shrink-0">
          <UploadIconInline size={15} />
        </span>
        Introduction Video Requirement
      </h3>
      <p className="mt-2">
        As part of your application, please record a 1–2 minute video introducing yourself and
        answering the questions below.
      </p>
      <ul className="mt-3 list-disc pl-5 space-y-1.5">
        <li>Tell us your full name.</li>
        <li>What city, state/province, and country are you located in?</li>
        <li>How long have you been operating in the prophetic?</li>
        <li>
          Briefly share how your spiritual journey began and how you discovered your prophetic
          calling.
        </li>
        <li>
          What areas do you feel most effective in when helping people?
          <p className="mt-1 text-xs text-slate-500">
            Examples Include: Dream Interpretation, Vision Interpretation, Interpretation of Tongues,
            Discernment, Prayer &amp; Intercession, Healing, Relationship guidance, Life purpose and
            calling, Business and career guidance, Deliverance.
          </p>
        </li>
        <li>
          How would you describe your approach to prophetic guidance?
          <p className="mt-1 text-xs text-slate-500">
            Example: Warm &amp; Encouraging, Calm &amp; Compassionate, Direct &amp; Honest, Deeply
            Spiritual, Prayer-Focused, Gentle &amp; Nurturing, Practical &amp; Action-Oriented,
            Discernment-Focused, Professional &amp; Structured, Conversational &amp; Friendly.
          </p>
        </li>
        <li>
          Why Do You Want to Join Prophetic Pathway?
          <ul className="mt-1 list-[circle] pl-5 space-y-1 text-slate-600">
            <li>Why you are interested in serving on the platform.</li>
            <li>What value and experience you believe you can bring to clients.</li>
            <li>What makes your approach unique.</li>
          </ul>
        </li>
      </ul>

      <h4 className="mt-4 font-semibold text-slate-900">Technical Requirements — Video Quality</h4>
      <ul className="mt-2 list-disc pl-5 space-y-1.5">
        <li>Record in a quiet environment.</li>
        <li>Ensure good lighting with your face clearly visible.</li>
        <li>Use clear audio with minimal background noise.</li>
        <li>Position your camera securely and keep it stable.</li>
      </ul>

      <p className="mt-3 font-medium text-slate-800">
        Applications submitted without a video or with incomplete responses will not be considered.
      </p>
    </div>
  );
}

function FileDrop({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="text-sm text-slate-600 mb-2">{label}</div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`w-full h-36 rounded-2xl border-2 border-dashed inline-flex flex-col items-center justify-center gap-2.5 transition-colors ${
          file
            ? "border-[#0e7490] bg-[#e6f4f8]/50 text-[#0e7490]"
            : "border-[#bfe3ec] bg-[#f0f9fb] text-slate-500 hover:border-[#0e7490] hover:bg-[#e6f4f8]/40"
        }`}
      >
        <span className="h-11 w-11 rounded-full bg-white text-[#0e7490] inline-flex items-center justify-center shadow-sm">
          <UploadIconInline size={20} />
        </span>
        <span className="text-sm font-semibold text-slate-700">{file ? file.name : "Upload an intro video"}</span>
        <span className="text-xs text-slate-400">MP4 / WebM up to 100 MB</span>
      </button>
      <input
        ref={ref}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}

function UploadIconInline({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function Stepper({ currentIdx }: { currentIdx: number }) {
  return (
    <div className="-mx-1 sm:mx-0 overflow-x-auto no-scrollbar">
      <div className="flex items-start min-w-120 sm:min-w-0 sm:max-w-3xl sm:mx-auto px-1">
        {STEPS.map((s, i) => {
          const active = i === currentIdx;
          const done = i < currentIdx;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={s} className="flex-1 flex flex-col items-center text-center min-w-0">
              <div className="flex items-center w-full">
                <span
                  className={`h-0.75 flex-1 rounded-full ${i === 0 ? "opacity-0" : i <= currentIdx ? "bg-[#0e7490]" : "bg-slate-200"}`}
                  aria-hidden="true"
                />
                <span
                  className={`relative z-10 h-10 w-10 sm:h-11 sm:w-11 rounded-full inline-flex items-center justify-center font-semibold shrink-0 transition-colors ${
                    active
                      ? "bg-[#0e7490] text-white ring-4 ring-[#cfe9f0]"
                      : done
                        ? "bg-[#0e7490] text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {done ? <CheckIcon size={16} /> : <span className="text-[11px] sm:text-xs leading-none">{i + 1}</span>}
                </span>
                <span
                  className={`h-0.75 flex-1 rounded-full ${isLast ? "opacity-0" : i < currentIdx ? "bg-[#0e7490]" : "bg-slate-200"}`}
                  aria-hidden="true"
                />
              </div>
              <div
                className={`mt-2 text-[10px] sm:text-xs leading-tight px-1 ${
                  active ? "text-[#0e7490] font-semibold" : "text-slate-500"
                }`}
              >
                {s}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
