"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { StoreBadges } from "../ui/StoreBadges";

/**
 * Booking & messaging on the website are handled exclusively in the Prophetic
 * Pathway mobile app. So instead of an in-page flow, the "Book a session" and
 * "Send message" buttons route the visitor into the app:
 *  - on a phone, we deep-link straight into the app (`ejppathway://`), falling
 *    back to the relevant store if it isn't installed;
 *  - on desktop, we show a "get the app" modal with the store links.
 *
 * (The advisor's own workflow lives in the advisor dashboard and is unaffected.)
 */
const APP_SCHEME = "ejppathway";

export function BookingActions({
  advisorId,
  appStoreLink,
  playStoreLink,
  bookLabel,
  messageLabel,
}: {
  advisorId: string;
  appStoreLink?: string;
  playStoreLink?: string;
  bookLabel: string;
  messageLabel: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const openApp = (action: "book" | "message") => {
    const deepLink = `${APP_SCHEME}://advisor/${advisorId}?action=${action}`;
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);

    if (!isIOS && !isAndroid) {
      // Desktop: no app to open — point them to the stores.
      setModalOpen(true);
      return;
    }

    // Mobile: try to open the app, fall back to the store (or the modal) if it
    // doesn't take focus within a moment.
    const store = isIOS ? appStoreLink : playStoreLink;
    let switched = false;
    const onHide = () => {
      if (document.hidden) switched = true;
    };
    document.addEventListener("visibilitychange", onHide);
    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      if (switched) return; // app opened
      if (store) window.location.href = store;
      else setModalOpen(true);
    }, 1600);

    window.location.href = deepLink;
  };

  return (
    <>
      <div className="mt-5 space-y-2">
        <Button size="md" className="w-full" onClick={() => openApp("book")}>
          {bookLabel}
        </Button>
        <button
          type="button"
          onClick={() => openApp("message")}
          className="w-full h-11 rounded-full bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors"
        >
          {messageLabel}
        </button>
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
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
              onClick={() => setModalOpen(false)}
              className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      ) : null}
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
