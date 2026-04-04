"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { videos } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoCardProps {
  date: string;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
}

// ─── VideoCard ─────────────────────────────────────────────────────────────────

function VideoCard({
  date,
  title,
  description,
  thumbnail,
  slug,
}: VideoCardProps) {
  return (
    <Link
      href={`/article/${slug}`}
      className="flex-none min-w-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col gap-0"
    >
      <article className="w-full flex flex-col gap-0 cursor-pointer group">
        {/* Date */}
        <span className="text-right text-[17px] font-cobalt text-black/80 dark:text-white/50">
          {date}
        </span>

        {/* Thumbnail + Play button */}
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              width="80"
              height="80"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="#F2F2F2"
                strokeWidth="5.0"
                fill="none"
              />
              <path
                d="M48 36
                   C42 40, 40 50, 40 60
                   C40 70, 42 80, 48 84
                   C52 87, 58 85, 64 81
                   L79 69
                   C86 63, 86 57, 79 51
                   L64 39
                   C58 35, 52 33, 48 36Z"
                stroke="#F2F2F2"
                strokeWidth="2.5"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cobalt text-[25px] leading-tight tracking-wide text-black dark:text-white mt-3 mb-1">
          {title}
        </h3>

        {/* Description */}
        <p className="font-alk-tall text-[18px] text-black/80 dark:text-white/55 leading-snug mt-2">
          {description}
        </p>
      </article>
    </Link>
  );
}

// ─── Arrow Button ──────────────────────────────────────────────────────────────

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={[
        "flex items-center justify-center",
        "absolute top-[40%] -translate-y-1/2 z-10",
        direction === "left" ? "-left-1 md:-left-12" : "-right-1 md:-right-12",
        "text-black/85 dark:text-white/80",
        "bg-white/40 dark:bg-black/40 rounded-full p-1 md:bg-transparent md:dark:bg-transparent md:p-0",
        "hover:text-black dark:hover:text-white",
        "disabled:opacity-20 disabled:cursor-not-allowed",
        "transition-all duration-300 ease-out hover:scale-110",
        "focus:outline-none",
      ].join(" ")}
    >
      <svg
        className="w-8 h-8 md:w-[45px] md:h-[45px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

// ─── Carousel ──────────────────────────────────────────────────────────────────

export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      // On small screens scroll 1 at a time, on lg screens scroll 3
      "(min-width: 1024px)": { slidesToScroll: 3 },
      "(min-width: 640px)": { slidesToScroll: 2 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keep arrow disabled states in sync
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect(); // run once on mount
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full px-4 md:px-10">
      {/* Heading */}
      <h2 className="font-cobalt text-center text-5xl mb-6 tracking-wide text-black dark:text-white">
        ვიდეო
      </h2>

      <div className="relative">
        <ArrowButton
          direction="left"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        />
        <ArrowButton
          direction="right"
          onClick={scrollNext}
          disabled={!canScrollNext}
        />

        {/* Embla viewport */}
        <div className="overflow-hidden pb-6" ref={emblaRef}>
          {/* Embla container — gap is handled via padding on slides */}
          <div className="flex gap-6 lg:gap-12">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                date={video.date}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail}
                slug={video.slug}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
