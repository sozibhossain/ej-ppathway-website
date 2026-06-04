"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "../ui/Modal";
import { TextField, Checkbox } from "../ui/Input";
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
} from "../ui/Icons";
import { api, ApiError } from "../../lib/api";

export function SignupModal({
  open,
  onClose,
  onSwitchToLogin,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !phone) {
      setError("All fields are required");
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
        { name, email, phone, password, dateOfBirth: dob },
        { skipAuth: true }
      );
      // Don't auto-login on signup — take the user to the login screen so they
      // sign in, after which the header shows their profile image.
      onSwitchToLogin();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      {/* Teal header */}
      <div className="bg-linear-to-br from-[#0e7490] to-[#064e63] px-8 pt-8 pb-7 rounded-t-2xl text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-xl px-5 py-2">
            <Image
              src="/logo.svg"
              alt="Prophetic Pathway"
              width={150}
              height={40}
              className="h-8 w-auto brightness-0 invert"
              unoptimized
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white inline-flex flex-wrap justify-center items-center gap-2">
          Welcome To Prophetic Pathway <SparkleIcon size={18} />
        </h2>
        <p className="text-teal-100 text-sm mt-1">Let&apos;s create your account</p>
      </div>

      {/* Form */}
      <div className="px-6 sm:px-8 py-7">
        <form onSubmit={submit} className="space-y-4">

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Phone + DOB */}
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

          {/* Password */}
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

          {/* Terms */}
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

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
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

          {/* Login link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#0e7490] font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </form>

        {/* Footer links */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <Link href="/about" className="hover:text-[#0e7490] transition-colors">About Us</Link>
          <Link href="/join-as-advisor" className="hover:text-[#0e7490] transition-colors">Join as Advisor</Link>
          <Link href="/privacy" className="hover:text-[#0e7490] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#0e7490] transition-colors">Terms & Service</Link>
        </div>
      </div>
    </Modal>
  );
}
