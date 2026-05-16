import Link from "next/link";
import Image from "next/image";
import { SocialIcon, SparkleIcon } from "../ui/Icons";
import type { GlobalSections } from "../../lib/types";

export function Footer({ global }: { global: GlobalSections }) {
  const f = global.footer || {};

  return (
    <footer className="bg-[var(--footer-bg)] mt-12">
      <div className="container-page pt-10 md:pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            {global.logo ? (
              <Image src={global.logo} alt={global.siteName || "Prophetic Pathway"} width={180} height={44} className="h-10 w-auto" unoptimized />
            ) : (
              <span className="inline-flex items-center gap-1 text-lg font-bold text-slate-900">
                <SparkleIcon size={18} className="text-[#0e7490]" />
                {global.siteName || "Prophetic Pathway"}
              </span>
            )}
            {f.tagline ? <p className="mt-3 text-sm text-slate-600 max-w-xs leading-relaxed">{f.tagline}</p> : null}
            <div className="mt-4 flex items-center gap-2">
              {(f.socialLinks || []).map((s, i) => (
                <a
                  key={i}
                  href={s.href || "#"}
                  className="h-9 w-9 rounded-full bg-white border border-slate-200 inline-flex items-center justify-center text-[#0e7490] hover:bg-slate-50"
                  aria-label={s.platform}
                >
                  <SocialIcon platform={s.platform} size={16} />
                </a>
              ))}
            </div>
          </div>

          {(f.columns || []).map((col, i) => (
            <div key={i}>
              <div className="text-sm font-bold text-slate-900 mb-3">{col.title}</div>
              <ul className="space-y-2">
                {(col.links || []).map((l, li) => (
                  <li key={li}>
                    <Link href={l.href} className="text-sm text-slate-700 hover:text-[#0e7490]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="text-sm font-bold text-slate-900 mb-3">Contact</div>
            <ul className="space-y-2 text-sm text-slate-700">
              {f.contact?.email && (
                <li className="inline-flex items-start gap-2">
                  <span>✉</span>
                  <a href={`mailto:${f.contact.email}`} className="hover:text-[#0e7490] break-all">{f.contact.email}</a>
                </li>
              )}
              {f.contact?.phone && (
                <li className="inline-flex items-start gap-2"><span>📞</span>{f.contact.phone}</li>
              )}
              {f.contact?.address && (
                <li className="inline-flex items-start gap-2"><span>📍</span>{f.contact.address}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-white/40">
          <div className="text-xs text-slate-600 order-2 sm:order-1">{f.copyright || "© Prophetic Pathway"}</div>
          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2">
            {f.appStoreLink ? (
              <a href={f.appStoreLink} className="h-10 px-3 bg-black text-white text-xs rounded-md inline-flex items-center gap-2">
                <span className="text-base">🍎</span>
                <span className="flex flex-col leading-tight"><span className="text-[9px]">Download on the</span><span className="font-semibold">App Store</span></span>
              </a>
            ) : null}
            {f.playStoreLink ? (
              <a href={f.playStoreLink} className="h-10 px-3 bg-black text-white text-xs rounded-md inline-flex items-center gap-2">
                <span className="text-base">▶</span>
                <span className="flex flex-col leading-tight"><span className="text-[9px]">GET IT ON</span><span className="font-semibold">Google Play</span></span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
