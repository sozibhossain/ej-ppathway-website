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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#0e7490] to-[#06495d] text-white">
      <div className="container-page grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
        <div>
          {eyebrow && <div className="text-white/70 text-sm font-medium mb-2">+ {eyebrow}</div>}
          {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{title}</h2>}
          {subtitle && <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">{subtitle}</p>}

          <ul className="mt-6 space-y-3">
            {(features || []).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-white/15 inline-flex items-center justify-center shrink-0">
                  <CheckIcon size={12} className="text-white" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {appStoreLink && (
              <a href={appStoreLink} className="h-12 px-4 bg-black text-white rounded-lg inline-flex items-center gap-2 text-xs">
                <span className="text-base">🍎</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px]">Download on the</span>
                  <span className="font-semibold text-sm">App Store</span>
                </span>
              </a>
            )}
            {playStoreLink && (
              <a href={playStoreLink} className="h-12 px-4 bg-black text-white rounded-lg inline-flex items-center gap-2 text-xs">
                <span className="text-base">▶</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px]">GET IT ON</span>
                  <span className="font-semibold text-sm">Google Play</span>
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="relative flex justify-center">
          {shots.length === 0 ? (
            <div className="w-48 h-[360px] sm:w-56 sm:h-[420px] md:w-64 md:h-[500px] rounded-3xl bg-white/10 border border-white/20" />
          ) : (
            <div className="flex gap-2 sm:gap-3 md:gap-4 items-end">
              {shots.slice(0, 3).map((src, i) => (
                <div key={i} className={`relative w-24 sm:w-32 md:w-40 lg:w-44 ${i === 1 ? "h-[280px] sm:h-[360px] md:h-[440px] lg:h-[480px]" : "h-[230px] sm:h-[300px] md:h-[360px] lg:h-[400px]"} rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-2 sm:ring-4 ring-white/20`}>
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
