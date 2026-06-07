"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, UserIcon } from "../ui/Icons";
import { clearAuthCookies, getCurrentUser } from "../../lib/api";
import { disconnectSocket } from "../../lib/socket";

export type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
  profilePhoto?: string;
  role?: string;
};

/** Read the logged-in user from the cookie. Returns null until mounted (avoids SSR/CSR mismatch). */
export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setUser(getCurrentUser<AuthUser>());
    setReady(true);
  }, []);
  return { user, ready };
}

function initials(name?: string, email?: string) {
  const src = (name || email || "").trim();
  if (!src) return "";
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function logout() {
  disconnectSocket();
  clearAuthCookies();
  if (typeof window !== "undefined") window.location.href = "/";
}

function Avatar({ user, size = 40 }: { user: AuthUser; size?: number }) {
  const [broken, setBroken] = useState(false);
  const dim = { width: size, height: size };
  if (user.profilePhoto && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={user.profilePhoto}
        alt={user.name || "Profile"}
        style={dim}
        onError={() => setBroken(true)}
        className="rounded-full object-cover border border-slate-200"
      />
    );
  }
  return (
    <span
      style={dim}
      className="rounded-full bg-[#0e7490] text-white inline-flex items-center justify-center font-semibold text-sm border border-[#0e7490]"
    >
      {initials(user.name, user.email) || <UserIcon size={Math.round(size * 0.55)} />}
    </span>
  );
}

/** Desktop profile avatar with a dropdown (name/email + log out). */
export function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100 transition-colors"
      >
        <Avatar user={user} size={40} />
        <ChevronDownIcon
          size={16}
          className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-100 bg-white shadow-lg py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name || "My account"}</p>
            {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
          </div>
          <button
            type="button"
            onClick={logout}
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
          >
            <LogOutIcon size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

/** Mobile profile block: avatar + name/email + log out, for use inside the mobile menu. */
export function UserMenuMobile({ user }: { user: AuthUser }) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-3 px-1 py-2">
        <Avatar user={user} size={44} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{user.name || "My account"}</p>
          {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={logout}
        className="mt-2 w-full h-11 rounded-full border border-red-200 text-red-600 font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-red-50"
      >
        <LogOutIcon size={16} />
        Log out
      </button>
    </div>
  );
}

function LogOutIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
