/**
 * App Store + Google Play download badges. Pure markup (safe in both server and
 * client components). Renders nothing when neither link is configured.
 *
 * Defaults to a vertical stack of full-width badges; pass `className` to override
 * (e.g. `sm:flex-row` for a side-by-side row).
 */
export function StoreBadges({
  appStoreLink,
  playStoreLink,
  className = "",
}: {
  appStoreLink?: string;
  playStoreLink?: string;
  className?: string;
}) {
  if (!appStoreLink && !playStoreLink) return null;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {appStoreLink ? (
        <a
          href={appStoreLink}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 w-full px-4 bg-black text-white rounded-lg inline-flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="flex flex-col leading-tight text-left">
            <span className="text-[9px]">Download on the</span>
            <span className="font-semibold text-[13px]">App Store</span>
          </span>
        </a>
      ) : null}
      {playStoreLink ? (
        <a
          href={playStoreLink}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 w-full px-4 bg-black text-white rounded-lg inline-flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3l16.5 9L3 21V3z" fill="#EA4335" />
            <path d="M3 3l13 8.5L3 20V3z" fill="#FBBC04" />
            <path d="M3 3l11.5 9L3 21V3z" fill="#4285F4" />
            <path d="M3 3l9.5 9L3 21V3z" fill="#34A853" />
          </svg>
          <span className="flex flex-col leading-tight text-left">
            <span className="text-[9px]">GET IT ON</span>
            <span className="font-semibold text-[13px]">Google Play</span>
          </span>
        </a>
      ) : null}
    </div>
  );
}
