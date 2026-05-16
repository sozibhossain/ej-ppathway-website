"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, SparkleIcon } from "../ui/Icons";
import { Button } from "../ui/Button";
import { useAuthModal } from "./AuthModalProvider";
import type { GlobalSections } from "../../lib/types";

export function Header({ global }: { global: GlobalSections }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const auth = useAuthModal();

  const nav = global.nav || [];
  const loginLabel = global.auth?.loginLabel || "Log in";
  const signupLabel = global.auth?.signupLabel || "Get Started";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2">
          {global.logo ? (
            <Image src={global.logo} alt={global.siteName || "Prophetic Pathway"} width={170} height={42} className="h-8 md:h-10 w-auto" unoptimized />
          ) : (
            <span className="flex items-center gap-1 text-lg md:text-xl font-bold text-slate-900">
              <SparkleIcon size={20} className="text-[#0e7490]" />
              {global.siteName || "Prophetic Pathway"}
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href + n.label}
                href={n.href}
                className={`text-sm font-medium transition-colors ${active ? "text-[#0e7490]" : "text-slate-700 hover:text-[#0e7490]"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => auth.open("login")}
            className="h-11 px-5 rounded-full border border-[#0e7490] text-[#0e7490] font-semibold text-sm hover:bg-[#e6f4f8]"
          >
            {loginLabel}
          </button>
          <Button onClick={() => auth.open("signup")} size="md">
            {signupLabel}
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden h-10 w-10 inline-flex items-center justify-center text-slate-700"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <nav className="container-page py-4 flex flex-col gap-2">
            {nav.map((n) => (
              <Link
                key={n.href + n.label}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
              >
                {n.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => { setMobileOpen(false); auth.open("login"); }} className="h-11 rounded-full border border-[#0e7490] text-[#0e7490] font-semibold text-sm">
                {loginLabel}
              </button>
              <button onClick={() => { setMobileOpen(false); auth.open("signup"); }} className="h-11 rounded-full bg-[#0e7490] text-white font-semibold text-sm">
                {signupLabel}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
