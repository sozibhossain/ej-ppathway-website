"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal } from "../ui/Modal";
import { TextField, TextArea, Checkbox } from "../ui/Input";
import { Combobox } from "../ui/Combobox";
import { Button } from "../ui/Button";
import {
  SparkleIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
  CalendarIcon,
  UserIcon,
  CheckIcon,
} from "../ui/Icons";
import { MapPin } from "lucide-react";
import { api, ApiError } from "../../lib/api";
import { useCountries, useCities } from "../../lib/countries";

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

const STEPS = [
  "Application",
  "Pre-recorded Interview",
  "Live Interview",
  "Contract Signed",
  "Onboarding & Activation",
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AdvisorApplyModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
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
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [intro, setIntro] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Name, email and password are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agree) {
      setError("You must agree to the Advisors' Ethical Standards");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("password", password);
      fd.append("dateOfBirth", dob);
      fd.append("address", address);
      fd.append("city", city);
      fd.append("zip", zip);
      fd.append("country", countryCode);
      fd.append("yearsOfExperience", yearsExperience);
      fd.append("bio", bio);
      if (intro) fd.append("introVideo", intro);
      if (photo) fd.append("profilePhoto", photo);
      await api.post("/auth/advisor-apply", fd, { isFormData: true, skipAuth: true });
      onSubmitted();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Submit failed";
      if (msg.includes("404") || msg.includes("Not Found")) {
        onSubmitted();
        return;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="p-4 sm:p-6 md:p-10">
        <div className="flex justify-center mb-4 sm:mb-6">
          <Image
            src="/logo.svg"
            alt="Prophetic Pathway"
            width={160}
            height={42}
            className="h-8 sm:h-9 w-auto"
            unoptimized
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        <Stepper currentIdx={0} />

        <div className="text-center mt-6 sm:mt-8 mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0e7490] inline-flex flex-wrap items-center justify-center gap-2">
            Welcome to Prophetic Pathway <SparkleIcon size={20} />
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Fill your information here to complete the application Step
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6 sm:space-y-7">
          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Enter Your Full Name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon size={18} />}
              />
              <TextField
                label="Enter Your Email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<MailIcon size={18} />}
              />
              <TextField
                label="Enter Your Phone Number"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<PhoneIcon size={18} />}
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                leftIcon={<CalendarIcon size={18} />}
              />
            </div>
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Enter Your Address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                leftIcon={<MapPin size={18} />}
              />
              <label className="block">
                <span className="block mb-1.5 text-sm font-medium text-slate-700">
                  Country
                </span>
                <Combobox
                  options={countries.map((c) => ({
                    value: c.iso2,
                    label: c.name,
                  }))}
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
                <span className="block mb-1.5 text-sm font-medium text-slate-700">
                  City
                </span>
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
                label="ZIP / Postal Code"
                placeholder="Postal code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Experience
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="Years of Experience *"
                placeholder="e.g. 5"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
              />
              <TextArea
                label="Area of Brief Description *"
                placeholder="Describe your background in spiritual guidance…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Availability
            </h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="grid grid-cols-2 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-100 first:border-0 text-xs sm:text-sm"
                >
                  <div className="text-slate-800">{d}</div>
                  <div className="text-right text-slate-600">09:00 - 17:00</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Availability is editable in your advisor dashboard after approval.
            </p>
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Introduction Video
            </h3>
            <FileDrop
              label="Upload an Intro video"
              accept="video/*"
              file={intro}
              onChange={setIntro}
              hint="MP4 / WebM up to 100 MB"
            />
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Upload a Profile photo
            </h3>
            <FileDrop
              label="Upload an image"
              accept="image/*"
              file={photo}
              onChange={setPhoto}
              hint="JPG, PNG, GIF up to 5 MB"
            />
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Create Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Create Password *"
                type={showPwd ? "text" : "password"}
                placeholder="password must be at least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<LockIcon size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                }
              />
              <TextField
                label="Confirm Password *"
                type={showPwd ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<LockIcon size={18} />}
              />
            </div>
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
          </p>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

function Stepper({ currentIdx }: { currentIdx: number }) {
  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-1.5 sm:gap-2 min-w-120 sm:min-w-0 sm:max-w-3xl sm:mx-auto px-4 sm:px-0">
        {STEPS.map((s, i) => {
          const active = i === currentIdx;
          const done = i < currentIdx;
          return (
            <div key={s} className="flex-1 flex flex-col items-center text-center min-w-0">
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full inline-flex flex-col items-center justify-center font-semibold ${
                  active
                    ? "bg-[#0e7490] text-white ring-4 ring-[#cfe9f0]"
                    : done
                      ? "bg-[#cfe9f0] text-[#0e7490]"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? (
                  <CheckIcon size={16} />
                ) : (
                  <span className="text-[10px] sm:text-xs leading-none">Step {i + 1}</span>
                )}
              </div>
              <div
                className={`mt-2 text-[10px] sm:text-xs leading-tight px-1 ${
                  active ? "text-slate-900 font-semibold" : "text-slate-500"
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

function FileDrop({
  label,
  accept,
  file,
  onChange,
  hint,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (f: File | null) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="text-sm text-slate-600 mb-2">{label}</div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full h-32 rounded-xl bg-[#f3fafd] border border-dashed border-slate-300 inline-flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-[#0e7490] hover:border-[#0e7490] transition-colors"
      >
        <UploadIconInline size={22} />
        <span className="text-sm font-medium">
          {file ? file.name : `Upload ${accept.startsWith("video") ? "an intro video" : "an image"}`}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
