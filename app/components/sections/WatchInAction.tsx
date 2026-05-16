"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "../ui/Icons";

export function WatchInAction({
  sectionLabel,
  title,
  subtitle,
  videoUrl,
  posterImage
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  posterImage?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (!ref.current) return;
    ref.current.play();
    setPlaying(true);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container-page text-center">
        {sectionLabel && <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">+ {sectionLabel}</div>}
        {title && <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>}
        {subtitle && <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}

        <div className="mt-10 relative rounded-2xl overflow-hidden bg-slate-900 max-w-4xl mx-auto aspect-video">
          {videoUrl ? (
            <video
              ref={ref}
              src={videoUrl}
              poster={posterImage || undefined}
              controls={playing}
              className="w-full h-full object-cover"
            />
          ) : (
            posterImage && <Image src={posterImage} alt={title || ""} fill className="object-cover" sizes="800px" unoptimized />
          )}
          {!playing && (
            <button
              type="button"
              onClick={play}
              aria-label="Play video"
              className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-white/95 text-[#0e7490] inline-flex items-center justify-center hover:scale-105 transition-transform shadow-2xl"
            >
              <PlayIcon size={32} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
