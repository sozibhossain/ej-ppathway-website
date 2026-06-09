"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TextField, Checkbox } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { CheckIcon } from "../../components/ui/Icons";
import { api, ApiError } from "../../lib/api";

type ContractDetails = {
  applicantName: string;
  contractUrl: string;
  signed: boolean;
  signedAt: string | null;
};

type Status = "loading" | "error" | "signed" | "ready" | "success";

const PAGE_BG = "min-h-full bg-linear-to-b from-[#f0f9fb] to-[#eaf6f9] py-8 sm:py-12";
const CARD =
  "mx-auto w-full max-w-3xl bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-300/40";

function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Prophetic Pathway"
      width={170}
      height={44}
      className="h-9 w-auto mx-auto"
      unoptimized
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}

function StatePage({ children }: { children: React.ReactNode }) {
  return (
    <section className={`${PAGE_BG} flex items-center`}>
      <div className="container-page w-full">
        <div className={`${CARD} p-8 text-center`}>{children}</div>
      </div>
    </section>
  );
}

export default function ContractSignPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [details, setDetails] = useState<ContractDetails | null>(null);
  const [loadError, setLoadError] = useState("");

  // Form state
  const [signerName, setSignerName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Read the token from the URL (avoid useSearchParams / Suspense requirement).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    if (!t) {
      setStatus("error");
      setLoadError("Invalid or missing signing link");
    }
  }, []);

  // Fetch contract details once we have a token.
  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await api.get<ContractDetails>("/contracts/details", { token }, { skipAuth: true });
        if (!active) return;
        const data = res.data;
        if (!data) {
          setStatus("error");
          setLoadError("This signing link is invalid or has expired.");
          return;
        }
        setDetails(data);
        setSignerName(data.applicantName || "");
        if (data.signed) {
          setSignedAt(data.signedAt);
          setStatus("signed");
        } else {
          setStatus("ready");
        }
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "This signing link is invalid or has expired."
        );
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  // --- Signature pad -------------------------------------------------------
  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // Scale CSS pixels to the canvas' intrinsic coordinate space.
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = pointFromEvent(e);
    lastPoint.current = p;
    // Draw a dot so a single tap registers.
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#0e7490";
    ctx.fill();
    setHasSignature(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = getCtx();
    const from = lastPoint.current;
    if (!ctx || !from) return;
    const to = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = "#0e7490";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPoint.current = to;
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPoint.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer may already be released */
    }
  };

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    lastPoint.current = null;
  }, []);

  // --- Submit --------------------------------------------------------------
  const canSubmit = !!signerName.trim() && hasSignature && agreed && !submitting;

  const submit = async () => {
    if (!token || !details) return;
    setSubmitError("");
    if (!canSubmit) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureImage = canvas.toDataURL("image/png");
    setSubmitting(true);
    try {
      const res = await api.post<{ signedAt: string; alreadySigned?: boolean }>(
        "/contracts/sign",
        { token, signerName: signerName.trim(), signatureImage, agreed: true },
        { skipAuth: true }
      );
      setSignedAt(res.data?.signedAt ?? new Date().toISOString());
      setStatus("success");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "We couldn't sign the contract. Please try again."
      );
      setSubmitting(false);
    }
  };

  // --- Render --------------------------------------------------------------
  if (status === "loading") {
    return (
      <StatePage>
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-[#0e7490]/30 border-t-[#0e7490] animate-spin" />
        <p className="mt-4 text-slate-600">Loading your contract…</p>
      </StatePage>
    );
  }

  if (status === "error") {
    return (
      <StatePage>
        <Logo />
        <h1 className="mt-5 text-2xl font-bold text-[#0e7490]">Link Not Available</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          {loadError || "Invalid or missing signing link"}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Please use the most recent link from your email, or contact our team for a new one.
        </p>
      </StatePage>
    );
  }

  if (status === "signed") {
    return (
      <StatePage>
        <Logo />
        <div className="mx-auto mt-5 h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">
          <CheckIcon size={30} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-[#0e7490]">Already Signed</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          This advisor contract has already been signed
          {signedAt ? ` on ${formatDate(signedAt)}` : ""}. No further action is needed.
        </p>
        {details?.contractUrl ? (
          <a
            href={details.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-sm font-semibold text-[#0e7490] hover:underline"
          >
            Open contract in a new tab
          </a>
        ) : null}
      </StatePage>
    );
  }

  if (status === "success") {
    return (
      <StatePage>
        <Logo />
        <div className="mx-auto mt-5 h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">
          <CheckIcon size={30} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-[#0e7490]">Contract Signed</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Thank you, {signerName.trim() || details?.applicantName}. Your advisor contract has been
          signed successfully
          {signedAt ? ` on ${formatDate(signedAt)}` : ""}. A copy will be kept on file, and our team
          will follow up with the next steps for your onboarding.
        </p>
        {details?.contractUrl ? (
          <a
            href={details.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-sm font-semibold text-[#0e7490] hover:underline"
          >
            Open contract in a new tab
          </a>
        ) : null}
      </StatePage>
    );
  }

  // status === "ready"
  return (
    <section className={`${PAGE_BG}`}>
      <div className="container-page">
        <div className={`${CARD} p-6 sm:p-8 md:p-10`}>
          <div className="text-center">
            <Logo />
            <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-[#0e7490]">
              Sign Your Advisor Contract
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Please review the agreement below, then add your full legal name and signature to
              complete the signing.
            </p>
          </div>

          {/* Contract PDF */}
          <div className="mt-7">
            <iframe
              src={details?.contractUrl}
              className="w-full h-[55vh] rounded-xl border border-slate-200"
              title="Contract"
            />
            {details?.contractUrl ? (
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  If the contract doesn&apos;t appear above, open it in a new tab.
                </span>
                <a
                  href={details.contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-semibold text-[#0e7490] hover:underline"
                >
                  Open contract in a new tab
                </a>
              </div>
            ) : null}
          </div>

          {/* Sign form */}
          <div className="mt-8 space-y-6">
            <TextField
              label="Full legal name"
              placeholder="Your full legal name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              autoComplete="name"
              maxLength={120}
            />

            <div>
              <span className="block mb-1.5 text-sm font-medium text-slate-700">Signature</span>
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  aria-label="Signature pad — draw your signature here"
                  className="w-full h-44 touch-none cursor-crosshair block"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endStroke}
                  onPointerLeave={endStroke}
                  onPointerCancel={endStroke}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {hasSignature ? "Draw or re-sign above." : "Draw your signature in the box above."}
                </span>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-sm font-medium text-[#0e7490] hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <Checkbox
              label="I have read and agree to the terms of this contract."
              checked={agreed}
              onChange={setAgreed}
            />

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}

            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={submit}
              disabled={!canSubmit}
            >
              {submitting ? "Signing…" : "Sign Contract"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
