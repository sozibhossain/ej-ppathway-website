"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { StoreBadges } from "../ui/StoreBadges";

const APP_SCHEME = "ejppathway";
const APP_OPEN_TIMEOUT_MS = 1600;

export function useAdvisorAppLauncher({
  advisorId,
  appStoreLink,
  playStoreLink,
}: {
  advisorId: string;
  appStoreLink?: string;
  playStoreLink?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const openAdvisorInApp = () => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    const isMobile = isIOS || isAndroid || /mobile/i.test(ua);

    if (!isMobile) {
      setModalOpen(true);
      return;
    }

    const deepLink = `${APP_SCHEME}://advisor-detail?advisorId=${encodeURIComponent(advisorId)}`;
    const store = isIOS ? appStoreLink || playStoreLink : playStoreLink || appStoreLink;

    let appOpened = false;
    const markAppOpened = () => {
      if (document.hidden) appOpened = true;
    };

    document.addEventListener("visibilitychange", markAppOpened);
    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", markAppOpened);
      if (appOpened) return;
      if (store) window.location.href = store;
      else setModalOpen(true);
    }, APP_OPEN_TIMEOUT_MS);

    window.location.href = deepLink;
  };

  return { modalOpen, setModalOpen, openAdvisorInApp };
}

export function AppRedirectModal({
  open,
  onClose,
  appStoreLink,
  playStoreLink,
}: {
  open: boolean;
  onClose: () => void;
  appStoreLink?: string;
  playStoreLink?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#e6f4f8] text-[#0e7490] inline-flex items-center justify-center mb-4">
          <PhoneAppIcon size={26} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Continue in the app</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Booking and messaging happen in the Prophetic Pathway app. Download it to
          connect with your advisor.
        </p>

        {appStoreLink || playStoreLink ? (
          <StoreBadges
            appStoreLink={appStoreLink}
            playStoreLink={playStoreLink}
            className="mt-5"
          />
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            The app will be available soon. Please check back shortly.
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export function BookingActions({
  advisorId,
  appStoreLink,
  playStoreLink,
  bookLabel,
  messageLabel,
  showMessage = true,
}: {
  advisorId: string;
  appStoreLink?: string;
  playStoreLink?: string;
  bookLabel: string;
  messageLabel: string;
  showMessage?: boolean;
}) {
  const { modalOpen, setModalOpen, openAdvisorInApp } = useAdvisorAppLauncher({
    advisorId,
    appStoreLink,
    playStoreLink,
  });

  return (
    <>
      <div className="mt-5 space-y-2">
        <Button size="md" className="w-full" onClick={openAdvisorInApp}>
          {bookLabel}
        </Button>
        {showMessage ? (
          <button
            type="button"
            onClick={openAdvisorInApp}
            className="w-full h-11 rounded-full bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors"
          >
            {messageLabel}
          </button>
        ) : null}
      </div>

      <AppRedirectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        appStoreLink={appStoreLink}
        playStoreLink={playStoreLink}
      />
    </>
  );
}

function PhoneAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
