"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { videos } from "@/lib/data";

function VideoCard({
  date,
  title,
  description,
  thumbnail,
  slug,
}: {
  date: string;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
}) {
  return (
    <Link
      href={`/article/${slug}`}
      className="flex-shrink-0 w-[calc((100%-96px)/3)] flex flex-col gap-0"
      style={{ scrollSnapAlign: "start" }}
    >
      <article
        className="w-full flex flex-col gap-0 cursor-pointer"
        style={{ scrollSnapAlign: "start" }}
      >
        {/* Date */}
        <span className="text-right text-[17px] font-cobalt text-black/80 dark:text-white/50">
          {date}
        </span>

        {/* Thumbnail and Play button */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
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
                stroke-width="5.0"
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
                stroke-width="2.5"
                fill="none"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cobalt text-[25px] leading-tight tracking-wide text-black dark:text-white mt-3 mb-1">
          {title}
        </h3>

        {/* Desc. */}
        <p className="font-alk-tall text-[18px] text-black/80 dark:text-white/55 leading-snug mt-2">
          {description}
        </p>
      </article>
    </Link>
  );
}

export function Carousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="w-full px-10">
      {/* Head */}
      <h2 className="font-cobalt text-center text-5xl mb-6 tracking-wide text-black dark:text-white">
        ვიდეო
      </h2>

      <div className="relative">
        {/* LEFT arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-12 z-10
             text-black/85 
             dark:text-white/30 dark:hover:text-white
             transition-all duration-300 ease-out
             hover:scale-120
             focus:outline-none"
        >
          <svg
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* RIGHT arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-12 z-10
             text-black/85
             dark:text-white/30 dark:hover:text-white
             transition-all duration-300 ease-out
             hover:scale-120
             focus:outline-none"
        >
          <svg
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-12 overflow-x-auto pb-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
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
    </section>
  );
}
