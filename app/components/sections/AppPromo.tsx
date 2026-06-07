import Image from "next/image";
import { CheckIcon } from "../ui/Icons";

export function AppPromo({
  eyebrow,
  title,
  subtitle,
  features,
  appStoreLink,
  playStoreLink,
  screenshotImages
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  features?: string[];
  appStoreLink?: string;
  playStoreLink?: string;
  screenshotImages?: string[];
}) {
  const shots = (screenshotImages || []).filter(Boolean);
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-linear-to-br from-[#0e7490] to-[#06495d] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="container-page grid lg:grid-cols-2 gap-10 md:gap-12 items-center relative">
        <div>
          {eyebrow && <div className="text-white/70 text-sm font-medium mb-2">+ {eyebrow}</div>}
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}

          <ul className="mt-6 space-y-3">
            {(features || []).map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-white/15 inline-flex items-center justify-center shrink-0">
                  <CheckIcon size={12} className="text-white" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {appStoreLink && (
              <a href={appStoreLink} className="h-12 px-4 bg-black hover:bg-slate-800 transition-colors text-white rounded-lg inline-flex items-center gap-2 text-xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="flex flex-col leading-tight text-left">
                  <span className="text-[10px]">Download on the</span>
                  <span className="font-semibold text-sm">App Store</span>
                </span>
              </a>
            )}
            {playStoreLink && (
              <a href={playStoreLink} className="h-12 px-4 bg-black hover:bg-slate-800 transition-colors text-white rounded-lg inline-flex items-center gap-2 text-xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3l16.5 9L3 21V3z" fill="#EA4335"/>
                  <path d="M3 3l13 8.5L3 20V3z" fill="#FBBC04"/>
                  <path d="M3 3l11.5 9L3 21V3z" fill="#4285F4"/>
                  <path d="M3 3l9.5 9L3 21V3z" fill="#34A853"/>
                </svg>
                <span className="flex flex-col leading-tight text-left">
                  <span className="text-[10px]">GET IT ON</span>
                  <span className="font-semibold text-sm">Google Play</span>
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="relative flex justify-center">
          {shots.length === 0 ? (
            <div className="w-48 h-90 sm:w-56 sm:h-105 md:w-64 md:h-125 rounded-3xl bg-white/10 border border-white/20" />
          ) : (
            <div className="flex gap-2 sm:gap-3 md:gap-4 items-end justify-center">
              {shots.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className={`relative w-24 sm:w-32 md:w-40 lg:w-44 ${
                    i === 1
                      ? "h-70 sm:h-90 md:h-110 lg:h-120"
                      : "h-58 sm:h-75 md:h-90 lg:h-100"
                  } rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-2 sm:ring-4 ring-white/20`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="200px" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
