"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "../ui/Icons";

export function WatchInAction({
  sectionLabel,
  title,
  subtitle,
  videoUrl,
  posterImage,
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  posterImage?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    if (!ref.current) return;
    ref.current.play();
    setStarted(true);
  };

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-white">
      <div className="container-page text-center">
        {sectionLabel && (
          <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">
            + {sectionLabel}
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="mt-6 sm:mt-8 relative rounded-2xl overflow-hidden bg-slate-900 max-w-3xl mx-auto aspect-video shadow-xl">
          {videoUrl ? (
            <video
              ref={ref}
              src={videoUrl}
              poster={posterImage || undefined}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover bg-black"
            />
          ) : posterImage ? (
            <Image
              src={posterImage}
              alt={title || ""}
              fill
              className="object-cover"
              sizes="768px"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-slate-900" />
          )}

          {!started && videoUrl && (
            <button
              type="button"
              onClick={play}
              aria-label="Play video"
              className="absolute inset-0 m-auto h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-white/95 text-slate-900 inline-flex items-center justify-center hover:scale-105 hover:bg-white transition-transform shadow-2xl"
            >
              <PlayIcon size={28} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
