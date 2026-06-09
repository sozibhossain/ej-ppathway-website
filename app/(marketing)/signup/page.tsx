"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextField, Checkbox } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Combobox } from "../../components/ui/Combobox";
import { AuthShell } from "../../components/layout/AuthShell";
import {
  SparkleIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
  CalendarIcon,
  UserIcon,
} from "../../components/ui/Icons";
import { api, ApiError } from "../../lib/api";
import { useCountries } from "../../lib/countries";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const countries = useCountries();
  const [agree, setAgree] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    if (r && r.startsWith("/") && !r.startsWith("//")) setRedirect(r);
  }, []);

  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !phone) {
      setError("All fields are required");
      return;
    }
    if (!countryCode) {
      setError("Please select your country");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms and Conditions");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(
        "/auth/signup",
        {
          name,
          email,
          phone,
          phoneNumber: phone,
          password,
          dateOfBirth: dob,
          country: countryCode,
          city,
          state: stateName,
        },
        { skipAuth: true }
      );
      // Don't auto-login on signup — send the user to the login page to sign in
      // (carrying any ?redirect= so they land on the page they came from).
      router.push(loginHref);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed");
      setSubmitting(false);
    }
  };

  return (
    <AuthShell variant="signup">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-300/40 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.svg"
                alt="Prophetic Pathway"
                width={160}
                height={42}
                className="h-9 w-auto"
                unoptimized
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <h1 className="text-2xl font-bold text-[#0e7490] inline-flex flex-wrap justify-center items-center gap-2">
              Create your account <SparkleIcon size={20} />
            </h1>
            <p className="text-sm text-slate-600 mt-1">Join Prophetic Pathway in a few quick steps.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Full Name
                </label>
                <TextField
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<UserIcon size={17} />}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Email Address
                </label>
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<MailIcon size={17} />}
                  autoComplete="email"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <TextField
                    type="tel"
                    placeholder="+1 (000) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<PhoneIcon size={17} />}
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Date of Birth
                  </label>
                  <TextField
                    type="date"
                    placeholder="MM/DD/YYYY"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    leftIcon={<CalendarIcon size={17} />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Country
                  </label>
                  <Combobox
                    options={countries.map((c) => ({ value: c.iso2, label: c.name }))}
                    value={countryCode}
                    onChange={(v) => setCountryCode(v)}
                    placeholder="Select Country"
                    searchPlaceholder="Search countries…"
                    emptyText="No country found."
                    maxResults={300}
                    triggerClassName="h-12 px-4 bg-white border-slate-200 hover:border-slate-300 focus:border-[#0e7490] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    City
                  </label>
                  <TextField
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    State
                  </label>
                  <TextField
                    type="text"
                    placeholder="Enter your state / province"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Password
                </label>
                <TextField
                  type={showPwd ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<LockIcon size={17} />}
                  autoComplete="new-password"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      className="text-slate-400 hover:text-[#0e7490] transition-colors"
                    >
                      {showPwd ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                    </button>
                  }
                />
              </div>

              <Checkbox
                label={
                  <span className="text-slate-600 text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#0e7490] font-semibold hover:underline">
                      Terms and Conditions
                    </Link>
                  </span>
                }
                checked={agree}
                onChange={setAgree}
              />

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl text-base font-bold shadow-lg shadow-[#0e7490]/20 hover:shadow-xl hover:shadow-[#0e7490]/25 transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create An Account"
                )}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href={loginHref} className="text-[#0e7490] font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
        </div>
    </AuthShell>
  );
}
