"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { api, ApiError, getCurrentUser } from "../../../lib/api";
import { useCountries } from "../../../lib/countries";

const APPLY_PATH = "/join-as-advisor/apply";
type AccountInfo = {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  dateOfBirth?: string;
};
type ApplicationInfo = {
  status?: string;
  stage?: string;
  yearsOfExperience?: string;
  availableFiveHoursPerDay?: string;
  baptizedInHolySpirit?: string;
  applicantDetails?: {
    dateOfBirth?: string;
    address?: string;
    state?: string;
    city?: string;
    country?: string;
  };
};

const STEPS = [
  "Application",
  "Pending Review",
  "Live Interview",
  "Under Review",
  "Approved",
  "Not Selected",
];

export default function AdvisorApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const countries = useCountries();
  const [yearsExperience, setYearsExperience] = useState("");
  const [availableFiveHours, setAvailableFiveHours] = useState("");
  const [baptizedInHolySpirit, setBaptizedInHolySpirit] = useState("");
  const [agree, setAgree] = useState(false);
  const [intro, setIntro] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingApplication, setExistingApplication] = useState<ApplicationInfo | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [prefilled, setPrefilled] = useState(false);
  // Account-derived fields are locked here — they can only be changed from the
  // user's account, not the application.
  const [locked, setLocked] = useState({
    name: false,
    email: false,
    phone: false,
    dob: false,
    country: false,
    state: false,
    city: false,
  });

  // Applying as an advisor requires an account. Gate the page: send logged-out
  // visitors to login (returning here after), and pre-fill the form from the
  // signed-in user's account details.
  useEffect(() => {
    const apply = (u: AccountInfo) => {
      if (u.name) setName(u.name);
      if (u.email) setEmail(u.email);
      if (u.phone) setPhone(u.phone);
      if (u.country) setCountryCode(u.country);
      if (u.state) setStateName(u.state);
      if (u.city) setCity(u.city);
      if (u.dateOfBirth) setDob(u.dateOfBirth);
      setLocked({
        name: !!u.name,
        email: !!u.email,
        phone: !!u.phone,
        dob: !!u.dateOfBirth,
        country: !!u.country,
        state: !!u.state,
        city: !!u.city,
      });
      setPrefilled(true);
    };

    const cached = getCurrentUser<AccountInfo>();
    if (!cached) {
      router.replace(`/login?redirect=${encodeURIComponent(APPLY_PATH)}`);
      return;
    }
    apply(cached);
    setChecking(false);

    // Refresh from the server so the latest profile details are used.
    (async () => {
      try {
        const r = await api.get<AccountInfo>("/auth/me");
        if (r.data) apply(r.data);
      } catch {
        /* keep the cached prefill */
      }
      try {
        const r = await api.get<ApplicationInfo>("/auth/advisor-application");
        const app = r.data;
        if (app && !["approved", "rejected"].includes(app.status || "")) {
          setExistingApplication(app);
          if (app.yearsOfExperience) setYearsExperience(app.yearsOfExperience);
          if (app.availableFiveHoursPerDay) setAvailableFiveHours(app.availableFiveHoursPerDay);
          if (app.baptizedInHolySpirit) setBaptizedInHolySpirit(app.baptizedInHolySpirit);
          if (app.applicantDetails?.dateOfBirth) setDob(app.applicantDetails.dateOfBirth);
          if (app.applicantDetails?.address) setAddress(app.applicantDetails.address);
          if (app.applicantDetails?.country) setCountryCode(app.applicantDetails.country);
          if (app.applicantDetails?.state) setStateName(app.applicantDetails.state);
          if (app.applicantDetails?.city) setCity(app.applicantDetails.city);
          setLocked({
            name: true,
            email: true,
            phone: true,
            dob: true,
            country: true,
            state: true,
            city: true,
          });
        }
      } catch {
        /* no application yet */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the status tracker in sync with admin pipeline changes without a manual
  // reload: while an application is in progress, re-poll its status periodically.
  useEffect(() => {
    if (!existingApplication) return;
    const t = setInterval(async () => {
      try {
        const r = await api.get<ApplicationInfo>("/auth/advisor-application");
        const next = r.data;
        if (next?.status) {
          setExistingApplication((prev) =>
            !prev || (prev.status === next.status && prev.stage === next.stage)
              ? prev
              : { ...prev, status: next.status, stage: next.stage },
          );
        }
      } catch {
        /* ignore poll errors */
      }
    }, 20000);
    return () => clearInterval(t);
  }, [existingApplication]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (existingApplication) {
      setError("Your current advisor application is already submitted and locked.");
      return;
    }

    // Every field is mandatory, and the introduction video must be uploaded.
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !address ||
      !countryCode ||
      !stateName ||
      !city ||
      !yearsExperience ||
      !availableFiveHours ||
      !baptizedInHolySpirit
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
      fd.append("state", stateName);
      fd.append("city", city);
      fd.append("country", countryCode);
      fd.append("yearsOfExperience", yearsExperience);
      fd.append("availableFiveHoursPerDay", availableFiveHours);
      fd.append("baptizedInHolySpirit", baptizedInHolySpirit);
      fd.append("introVideo", intro);
      await api.post("/auth/advisor-apply", fd, { isFormData: true });
      setExistingApplication({ status: "pending_review", stage: "application" });
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

  if (checking) {
    return (
      <section className="bg-[#f0f9fb] py-20 min-h-[60vh] flex items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-2 border-[#0e7490]/30 border-t-[#0e7490] animate-spin"
          aria-label="Loading"
        />
      </section>
    );
  }

  return (
    <>
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
            <Stepper currentIdx={statusToStepIdx(existingApplication?.status)} />

            {prefilled && (
              <p className="mt-6 text-center text-xs text-slate-500">
                Your account details are pre-filled and locked below. To change them, update your
                account profile.
              </p>
            )}
            {existingApplication && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Application status: <b>{applicationStatusLabel(existingApplication.status)}</b>. Your submitted application is locked while it is being reviewed.
              </div>
            )}

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
                  disabled={locked.name}
                  required
                />
                <TextField
                  label="Enter Your Email *"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<MailIcon size={18} />}
                  disabled={locked.email}
                  required
                />
                <TextField
                  label="Enter Your Phone Number *"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<PhoneIcon size={18} />}
                  disabled={locked.phone}
                  required
                />
                <TextField
                  label="Date of Birth *"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  leftIcon={<CalendarIcon size={18} />}
                  disabled={locked.dob}
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
                  disabled={!!existingApplication}
                  required
                />
                <label className="block">
                  <span className="block mb-1.5 text-sm font-medium text-slate-700">Country *</span>
                  <Combobox
                    options={countries.map((c) => ({ value: c.iso2, label: c.name }))}
                    value={countryCode}
                    onChange={(v) => setCountryCode(v)}
                    disabled={locked.country}
                    placeholder="Select Country"
                    searchPlaceholder="Search countries…"
                    emptyText="No country found."
                    maxResults={300}
                    triggerClassName="h-12 px-4 bg-white border-slate-200 hover:border-slate-300 focus:border-[#0e7490] focus:outline-none"
                  />
                </label>
                <TextField
                  label="State *"
                  placeholder="Enter your state / province"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  disabled={locked.state}
                  required
                />
                <TextField
                  label="City *"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={locked.city}
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pl-3 border-l-[3px] border-[#0e7490] leading-tight">
                Experience & Availability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Years of Experience *"
                  placeholder="e.g. 5"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  disabled={!!existingApplication}
                  required
                />
                <SelectField
                  label="Are you available to work at least 5 hours per day? *"
                  value={availableFiveHours}
                  onChange={(e) => setAvailableFiveHours(e.target.value)}
                  disabled={!!existingApplication}
                  required
                >
                  <option value="" disabled>
                    Select an answer
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </SelectField>
              </div>
              <div className="mt-4">
                <SelectField
                  label="Have you been baptized with the Holy Spirit with the evidence of speaking in tongues? *"
                  value={baptizedInHolySpirit}
                  onChange={(e) => setBaptizedInHolySpirit(e.target.value)}
                  disabled={!!existingApplication}
                  required
                >
                  <option value="" disabled>
                    Select an answer
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </SelectField>
              </div>
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
              onChange={(v) => !existingApplication && setAgree(v)}
            />

            <p className="text-xs text-slate-500">
              <b>Note:</b> By submitting this application, you consent to the use of your personal
              data for the purpose of evaluating your suitability for employment in our organization.
              Your password, profile photo, and detailed bio are collected later during onboarding.
            </p>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button type="submit" size="lg" className="w-full" disabled={submitting || !!existingApplication}>
              {existingApplication ? "Application Locked" : submitting ? "Submitting…" : "Submit"}
            </Button>
          </form>
          </div>
        </div>
      </div>
    </section>

      {submitted && <ThankYouModal />}
    </>
  );
}

function ThankYouModal() {
  return (
    <div className="fixed inset-0 z-100 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-h-[92vh] overflow-y-auto">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center mb-5">
          <CheckIcon size={30} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Thank You for Applying!</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Your application has been successfully submitted and is now under review by our team. If
          your application matches our current advisor requirements, we&apos;ll contact you regarding
          the next stage of the interview process.
        </p>

        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 p-4 text-left">
          <div className="text-sm font-bold text-slate-900 mb-3">Application Progress</div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className="h-5 w-5 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center shrink-0">
                <CheckIcon size={12} />
              </span>
              Application Submitted
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className="h-5 w-5 rounded-full bg-amber-400 text-white inline-flex items-center justify-center shrink-0">
                <ClockIcon size={11} />
              </span>
              Review in Progress
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 flex items-center gap-2 text-left text-sm text-slate-600">
          <ClockIcon size={15} className="text-[#0e7490] shrink-0" />
          <span>
            Estimated Review Time: <b className="text-slate-800">3-5 business days</b>
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-500 text-left">
          <b>Note:</b> Please monitor your email and dashboard for updates regarding your
          application status.
        </p>

        <div className="mt-5">
          <LinkButton href="/" variant="outline" size="md" className="w-full">
            Back to Home
          </LinkButton>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Questions about your application?{" "}
          <Link href="/contact" className="text-[#0e7490] font-semibold hover:underline">
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  );
}

function statusToStepIdx(status?: string) {
  switch (status) {
    case "pending_review":
      return 1;
    case "live_interview":
    case "scheduled":
      return 2;
    case "under_review":
      return 3;
    case "approved":
      return 4;
    case "rejected":
      return 5;
    default:
      return 0;
  }
}

function applicationStatusLabel(status?: string) {
  if (status === "pending_review") return "Pending Review";
  if (status === "live_interview" || status === "scheduled") return "Live Interview";
  if (status === "under_review") return "Under Review";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Not Selected";
  return "Application";
}

function ClockIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
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
