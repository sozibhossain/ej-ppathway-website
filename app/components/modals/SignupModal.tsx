"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "../ui/Modal";
import { TextField, Checkbox } from "../ui/Input";
import { Button } from "../ui/Button";
import { SparkleIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, PhoneIcon, CalendarIcon } from "../ui/Icons";
import { api, ApiError, setAuthCookies } from "../../lib/api";
import { ModalFooterMeta } from "./LoginModal";

export function SignupModal({
  open,
  onClose,
  onSwitchToLogin
}: {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
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
    if (!email || !password || !phone) {
      setError("Email, phone and password are required");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms and Conditions");
      return;
    }
    setSubmitting(true);
    try {
      const r = await api.post<{ accessToken: string; refreshToken: string; user: unknown }>(
        "/auth/signup",
        { email, phone, password, dateOfBirth: dob, name: email.split("@")[0] },
        { skipAuth: true }
      );
      if (r.data?.accessToken) {
        setAuthCookies(r.data.accessToken, r.data.refreshToken, r.data.user);
      }
      onClose();
      if (typeof window !== "undefined") window.location.reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.svg" alt="Prophetic Pathway" width={160} height={42} className="h-10 w-auto" unoptimized onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>

        <div className="text-center mb-1">
          <h2 className="text-2xl font-bold text-[#0e7490] inline-flex items-center gap-2">
            Welcome To Prophetic Pathway <SparkleIcon size={20} />
          </h2>
        </div>
        <p className="text-center text-slate-600 mb-6">Let&apos;s Create an account</p>

        <form onSubmit={submit} className="space-y-3">
          <TextField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<MailIcon size={18} />} />
          <TextField type="tel" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<PhoneIcon size={18} />} />
          <TextField
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<LockIcon size={18} />}
            rightIcon={<button type="button" onClick={() => setShowPwd((s) => !s)}>{showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}</button>}
          />
          <TextField type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} leftIcon={<CalendarIcon size={18} />} />

          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-[#0e7490] font-medium hover:underline">
                  Terms and Conditions
                </Link>
              </span>
            }
            checked={agree}
            onChange={setAgree}
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create An Account"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-[#0e7490] font-semibold hover:underline">
              Log in
            </button>
          </div>
        </form>

        <ModalFooterMeta />
      </div>
    </Modal>
  );
}
