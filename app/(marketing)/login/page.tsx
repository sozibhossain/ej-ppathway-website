"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TextField, Checkbox } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthShell } from "../../components/layout/AuthShell";
import {
  SparkleIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "../../components/ui/Icons";
import { api, ApiError, setAuthCookies } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState("");

  // Carry an optional ?redirect= path (e.g. coming from the gated advisor apply page).
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    if (r && r.startsWith("/") && !r.startsWith("//")) setRedirect(r);
  }, []);

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
      if (typeof window !== "undefined") window.location.href = redirect || "/";
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <AuthShell variant="login">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-300/40 p-6 sm:p-8 lg:p-9">
          <div className="flex flex-col items-center mb-5 sm:mb-6">
            <Image
              src="/logo.svg"
              alt="Prophetic Pathway"
              width={160}
              height={42}
              className="h-8 sm:h-10 w-auto"
              unoptimized
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          <div className="text-center mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0e7490] inline-flex flex-wrap justify-center items-center gap-2">
              Welcome Back <SparkleIcon size={20} />
            </h1>
          </div>
          <p className="text-center text-sm sm:text-base text-slate-600 mb-5 sm:mb-6">
            Sign in to continue your spiritual journey.
          </p>

          <form onSubmit={submit} className="space-y-3">
            <TextField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<MailIcon size={18} />}
              autoComplete="email"
            />
            <TextField
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<LockIcon size={18} />}
              autoComplete="current-password"
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
              <Link
                href={redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup"}
                className="text-[#0e7490] font-semibold hover:underline"
              >
                Create An Account
              </Link>
            </div>
          </form>
        </div>
    </AuthShell>
  );
}
