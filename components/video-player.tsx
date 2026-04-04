"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  src?: string;
  poster?: string;
  title: string;
};

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  const handleVideoClick = () => {
    handlePlay();
  };

  return (
    <div
      className="relative w-full bg-black overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "2324 / 1395" }}
      onClick={handleVideoClick}
    >
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setHasStarted(false);
          }}
          playsInline
        />
      ) : (
        /* No video uploaded yet — show poster/thumbnail */
        poster && (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover opacity-90"
          />
        )
      )}

      {/* Play/Pause button */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying && hasStarted ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        {/* Pause + Gray-background */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/20" />
        )}

        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-lg transition-transform duration-200 group-hover:scale-110"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke="#F2F2F2"
            strokeWidth="5.0"
            fill="none"
          />
          {isPlaying ? (
            /* Pause icon */
            <>
              <rect x="44" y="38" width="11" height="44" rx="2" fill="#F2F2F2" />
              <rect x="65" y="38" width="11" height="44" rx="2" fill="#F2F2F2" />
            </>
          ) : (
            /* Play icon */
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
          )}
        </svg>
      </div>
    </div>
  );
}
