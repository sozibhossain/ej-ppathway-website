import Link from "next/link";
import Image from "next/image";
import { SocialIcon, SparkleIcon, MailIcon, PhoneIcon } from "../ui/Icons";
import { MapPin } from "lucide-react";
import type { GlobalSections } from "../../lib/types";

export function Footer({ global }: { global: GlobalSections }) {
  const f = global.footer || {};

  return (
    <footer style={{ background: "linear-gradient(90deg, #DDF8FF 0%, #E6FAFF 100%)" }}>
      <div className="container-page pt-10 md:pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          <div className="lg:col-span-1">
            {global.logo ? (
              <Image src={global.logo} alt={global.siteName || "Prophetic Pathway"} width={180} height={44} className="h-10 w-auto" unoptimized />
            ) : (
              <span className="inline-flex items-center gap-1 text-lg font-bold text-slate-900">
                <SparkleIcon size={18} className="text-[#0e7490]" />
                {global.siteName || "Prophetic Pathway"}
              </span>
            )}
            {f.tagline ? <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-65 leading-relaxed">{f.tagline}</p> : null}
            <div className="mt-4 flex items-center gap-2">
              {(f.socialLinks || []).map((s, i) => (
                <a
                  key={i}
                  href={s.href || "#"}
                  className="h-8 w-8 rounded-full bg-white border border-slate-200 inline-flex items-center justify-center text-[#0e7490] hover:bg-slate-50 transition-colors"
                  aria-label={s.platform}
                >
                  <SocialIcon platform={s.platform} size={14} />
                </a>
              ))}
            </div>
          </div>

          {(f.columns || []).map((col, i) => (
            <div key={i}>
              <div className="text-sm sm:text-base font-semibold text-slate-900 mb-3 sm:mb-4">{col.title}</div>
              <ul className="space-y-2 sm:space-y-2.5">
                {(col.links || []).map((l, li) => (
                  <li key={li}>
                    <Link href={l.href} className="text-xs sm:text-sm text-slate-700 hover:text-[#0e7490] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="text-sm sm:text-base font-semibold text-slate-900 mb-3 sm:mb-4">Contact</div>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-700">
              {f.contact?.email && (
                <li className="inline-flex items-start gap-2">
                  <MailIcon size={14} className="mt-0.5 shrink-0" />
                  <a href={`mailto:${f.contact.email}`} className="hover:text-[#0e7490] break-all">{f.contact.email}</a>
                </li>
              )}
              {f.contact?.phone && (
                <li className="inline-flex items-start gap-2">
                  <PhoneIcon size={14} className="mt-0.5 shrink-0" />
                  <span>{f.contact.phone}</span>
                </li>
              )}
              {f.contact?.address && (
                <li className="inline-flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>{f.contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/50">
          <div className="text-xs text-slate-600 order-2 sm:order-1">{f.copyright || "© Prophetic Pathway"}</div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 order-1 sm:order-2">
            {f.appStoreLink ? (
              <a href={f.appStoreLink} className="h-10 sm:h-11 px-3 sm:px-4 bg-black text-white text-xs rounded-md inline-flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="flex flex-col leading-tight text-left"><span className="text-[9px]">Download on the</span><span className="font-semibold text-[12px]">App Store</span></span>
              </a>
            ) : null}
            {f.playStoreLink ? (
              <a href={f.playStoreLink} className="h-10 sm:h-11 px-3 sm:px-4 bg-black text-white text-xs rounded-md inline-flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3l16.5 9L3 21V3z" fill="#EA4335"/>
                  <path d="M3 3l13 8.5L3 20V3z" fill="#FBBC04"/>
                  <path d="M3 3l11.5 9L3 21V3z" fill="#4285F4"/>
                  <path d="M3 3l9.5 9L3 21V3z" fill="#34A853"/>
                </svg>
                <span className="flex flex-col leading-tight text-left"><span className="text-[9px]">GET IT ON</span><span className="font-semibold text-[12px]">Google Play</span></span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
