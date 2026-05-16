"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal } from "../ui/Modal";
import { TextField, Checkbox } from "../ui/Input";
import { Button } from "../ui/Button";
import { SparkleIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon } from "../ui/Icons";
import { api, ApiError, setAuthCookies } from "../../lib/api";

export function LoginModal({
  open,
  onClose,
  onSwitchToSignup
}: {
  open: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    setSubmitting(true);
    try {
      const r = await api.post<{ accessToken: string; refreshToken: string; user: unknown }>(
        "/auth/login",
        { email, password },
        { skipAuth: true }
      );
      if (r.data) {
        setAuthCookies(r.data.accessToken, r.data.refreshToken, r.data.user);
      }
      onClose();
      if (typeof window !== "undefined") window.location.reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-5 sm:p-6 md:p-8">
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <Image src="/logo.svg" alt="Prophetic Pathway" width={160} height={42} className="h-8 sm:h-10 w-auto" unoptimized onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>

        <div className="text-center mb-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0e7490] inline-flex flex-wrap justify-center items-center gap-2">
            Welcome Back <SparkleIcon size={20} />
          </h2>
        </div>
        <p className="text-center text-sm sm:text-base text-slate-600 mb-5 sm:mb-6">Sign in to continue your spiritual journey.</p>

        <form onSubmit={submit} className="space-y-3">
          <TextField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<MailIcon size={18} />}
          />
          <TextField
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<LockIcon size={18} />}
            rightIcon={
              <button type="button" onClick={() => setShowPwd((s) => !s)}>
                {showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            }
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
            <Link href="/forgot-password" className="text-[#0e7490] font-medium hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Login"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={onSwitchToSignup} className="text-[#0e7490] font-semibold hover:underline">
              Create An Account
            </button>
          </div>
        </form>

        <ModalFooterMeta />
      </div>
    </Modal>
  );
}

export function ModalFooterMeta() {
  return (
    <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-4">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-700">
        <Link href="/about" className="hover:text-[#0e7490]">About Us</Link>
        <Link href="/join-as-advisor" className="hover:text-[#0e7490]">Join as Advisor</Link>
        <Link href="/contact" className="hover:text-[#0e7490]">Contact Us</Link>
        <Link href="/privacy" className="hover:text-[#0e7490]">Privacy policy</Link>
        <Link href="/terms" className="hover:text-[#0e7490]">Terms &amp; service</Link>
      </nav>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((I, i) => (
          <a key={i} href="#" className="h-9 w-9 rounded-full bg-white border border-slate-200 inline-flex items-center justify-center text-[#0e7490] hover:bg-slate-50">
            <I size={16} />
          </a>
        ))}
        <a href="#" className="h-9 px-3 rounded-md bg-black text-white inline-flex items-center gap-2 text-xs">App Store</a>
        <a href="#" className="h-9 px-3 rounded-md bg-black text-white inline-flex items-center gap-2 text-xs">Google Play</a>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        New Customer Offer is available for first-time users who have never purchased a session through Prophetic Pathway. Promotional free minutes and welcome offers may have certain limitations and cannot be exchanged for cash or transferred to another account. Previous trial users may not qualify for introductory offers.
      </p>
      <p className="text-xs text-slate-500">
        ©2026 Prophetic Pathway. All rights reserved. Services are provided for spiritual guidance and entertainment purposes only.<br />
        Must be 18 years or older to use this platform.
      </p>
    </div>
  );
}
