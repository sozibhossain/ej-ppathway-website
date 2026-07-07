"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, SparkleIcon } from "../ui/Icons";
import { LinkButton } from "../ui/Button";
import { UserMenu, UserMenuMobile, useAuthUser } from "./UserMenu";
import type { GlobalSections } from "../../lib/types";

export function Header({ global }: { global: GlobalSections }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, ready } = useAuthUser();

  const isAdvisor = user?.role === "advisor";
  const nav = (global.nav || []).filter((item) => {
    if (!isAdvisor) return true;
    const href = item.href.replace(/\/+$/, "");
    return href !== "/join-as-advisor";
  });
  const loginLabel = global.auth?.loginLabel || "Log in";
  const signupLabel = global.auth?.signupLabel || "Get Started";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="container-page flex items-center justify-between h-16 md:h-20 gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0">
          {global.logo ? (
            <Image src={global.logo} alt={global.siteName || "Prophetic Pathway"} width={210} height={54} className="h-9 sm:h-11 md:h-13 w-auto" unoptimized />
          ) : (
            <span className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
              <SparkleIcon size={24} className="text-[#0e7490] shrink-0" />
              <span className="truncate">{global.siteName || "Prophetic Pathway"}</span>
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href + n.label}
                href={n.href}
                className={`text-[15px] xl:text-base font-medium transition-colors whitespace-nowrap ${active ? "text-[#0e7490]" : "text-slate-700 hover:text-[#0e7490]"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Avoid SSR/CSR flash: render auth controls only after the cookie is read */}
          {!ready ? (
            <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" aria-hidden="true" />
          ) : user ? (
            <UserMenu
              user={user}
              appStoreLink={global.footer?.appStoreLink}
              playStoreLink={global.footer?.playStoreLink}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="h-10 xl:h-11 inline-flex items-center px-5 rounded-xl border border-[#0e7490] text-[#0e7490] font-semibold text-sm hover:bg-[#e6f4f8] transition-colors"
              >
                {loginLabel}
              </Link>
              <LinkButton href="/signup" size="md">
                {signupLabel}
              </LinkButton>
            </>
          )}
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
          <nav className="container-page py-4 flex flex-col gap-1">
            {nav.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
              return (
                <Link
                  key={n.href + n.label}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${active ? "bg-[#e6f4f8] text-[#0e7490]" : "text-slate-800 hover:bg-slate-100"}`}
                >
                  {n.label}
                </Link>
              );
            })}
            {ready && user ? (
              <UserMenuMobile
                user={user}
                appStoreLink={global.footer?.appStoreLink}
                playStoreLink={global.footer?.playStoreLink}
              />
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="h-11 inline-flex items-center justify-center rounded-full border border-[#0e7490] text-[#0e7490] font-semibold text-sm"
                >
                  {loginLabel}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="h-11 inline-flex items-center justify-center rounded-full bg-[#0e7490] text-white font-semibold text-sm hover:bg-[#085a72]"
                >
                  {signupLabel}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
