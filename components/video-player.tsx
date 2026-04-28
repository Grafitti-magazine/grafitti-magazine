"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type VideoPlayerProps = {
  src?: string;
  poster?: string;
  title: string;
};

const SPEEDS = [0.5, 1, 1.5, 2];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setHasStarted(true);
    }
  }, [isPlaying]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSeekPreview(parseFloat(e.target.value));
  };

  const handleSeekCommit = () => {
    setIsSeeking(false);
    if (videoRef.current) videoRef.current.currentTime = seekPreview;
  };

  const setVolumeLevel = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setVolumeLevel(volume === 0 ? 1 : volume);
      setIsMuted(false);
      if (videoRef.current) videoRef.current.muted = false;
    } else {
      setIsMuted(true);
      if (videoRef.current) videoRef.current.muted = true;
    }
  };

  const handleVolumeScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVolumeLevel(volume + (e.deltaY < 0 ? 0.05 : -0.05));
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolumeLevel(ratio);
  };

  const selectSpeed = (index: number) => {
    setSpeedIndex(index);
    if (videoRef.current) videoRef.current.playbackRate = SPEEDS[index];
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Sync state from video element on mount (handles cached/pre-loaded video after refresh)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      if (video.readyState >= 1) {
        setDuration(video.duration || 0);
        setCurrentTime(video.currentTime || 0);
        setVolume(video.muted ? 0 : video.volume);
        setIsMuted(video.muted);
        setIsPlaying(!video.paused);
        if (video.currentTime > 0 || !video.paused) setHasStarted(true);
      }
    };

    sync();
    video.addEventListener("loadedmetadata", sync);
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      video.removeEventListener("loadedmetadata", sync);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayTime = isSeeking ? seekPreview : currentTime;
  const progress = duration ? (displayTime / duration) * 100 : 0;
  const controlsVisible = !isPlaying || !hasStarted;

  // Volume icon based on mute state / level
  const VolumeIcon = () => {
    const effectiveVolume = isMuted ? 0 : volume;
    if (effectiveVolume === 0) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="white" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
    if (effectiveVolume < 0.5) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="white" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="white" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    );
  };

  const volPct = `${(isMuted ? 0 : volume) * 100}%`;
  const seekPct = `${progress}%`;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "2324 / 1395" }}
      onClick={togglePlay}
    >
      <style>{`
        .vol-slider, .seek-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .vol-slider {
          background: linear-gradient(to right, white ${volPct}, rgba(255,255,255,0.35) ${volPct});
        }
        .seek-slider {
          width: 100%;
          background: linear-gradient(to right, white ${seekPct}, rgba(255,255,255,0.35) ${seekPct});
        }
        .vol-slider::-webkit-slider-thumb,
        .seek-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .vol-slider::-moz-range-thumb,
        .seek-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
      `}</style>
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => { setIsPlaying(false); setHasStarted(false); }}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          playsInline
        />
      ) : (
        poster && <img src={poster} alt={title} className="w-full h-full object-cover opacity-90" />
      )}

      {/* Centre play overlay — only when not playing */}
      {!hasStarted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/20" />
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="relative z-10 drop-shadow-lg">
            <circle cx="60" cy="60" r="52" stroke="#F2F2F2" strokeWidth="5" fill="none" />
            <path d="M48 36 C42 40,40 50,40 60 C40 70,42 80,48 84 C52 87,58 85,64 81 L79 69 C86 63,86 57,79 51 L64 39 C58 35,52 33,48 36Z"
              stroke="#F2F2F2" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Bottom controls */}
      {src && (
        <div
          className={`absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 flex flex-col gap-3
            bg-gradient-to-t from-black/40 to-transparent
            transition-opacity duration-300
            ${controlsVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Timeline */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.01}
            value={isSeeking ? seekPreview : currentTime}
            onMouseDown={() => { setIsSeeking(true); setSeekPreview(currentTime); }}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            onClick={(e) => e.stopPropagation()}
            className="seek-slider w-full"
          />

          {/* Buttons row */}
          <div className="flex items-center gap-2">

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-11 h-11 bg-black/70 rounded-full hover:bg-black transition-colors"
            >
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Volume — icon click = mute, scroll = fine adjust, hover reveals slider */}
            <div
            
              className="group/vol flex items-center h-10 bg-black/70 rounded-full overflow-hidden"
              onWheel={handleVolumeScroll}
            >
              {/* Icon — click toggles mute */}
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-10 h-full shrink-0 hover:bg-white/10 rounded-full transition-colors"
              >
                <VolumeIcon />
              </button>

              {/* Slider — appears on hover */}
              <div className="w-0 group-hover/vol:w-[96px] transition-all duration-200 overflow-hidden flex items-center pr-0 group-hover/vol:pr-4">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { e.stopPropagation(); setVolumeLevel(parseFloat(e.target.value)); }}
                  onClick={(e) => e.stopPropagation()}
                  className="vol-slider w-[72px] cursor-pointer"
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-center px-4 h-11 bg-black/70 rounded-full">
              <span className="font-alk-tall text-white text-[17px] tabular-nums leading-none" style={{ transform: "translateY(2px)", letterSpacing: "0.2em" }}>
                {formatTime(displayTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Speed + Fullscreen grouped in one pill */}
            <div
              className="relative flex items-center bg-black/70 rounded-full h-10"
              ref={speedMenuRef}
            >
              {/* Speed button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowSpeedMenu((v) => !v); }}
                className="flex items-center gap-1.5 px-3 h-full hover:bg-white/10 rounded-l-full transition-colors"
                title="Playback speed"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "translateY(2px)" }}>
                  <path d="M3 12a9 9 0 1 1 18 0" />
                  <line x1="12" y1="3" x2="12" y2="5" />
                  <line x1="5.5" y1="5.5" x2="6.9" y2="6.9" />
                  <line x1="18.5" y1="5.5" x2="17.1" y2="6.9" />
                  <line x1="12" y1="12" x2="17" y2="7" strokeWidth="2.2" />
                  <circle cx="12" cy="12" r="1.2" fill="white" stroke="none" />
                </svg>
                <span className="font-alk-tall text-white text-[17px]" style={{ transform: "translateY(2px)" }}>{SPEEDS[speedIndex]}×</span>
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-white/30" />

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center px-3 h-full hover:bg-white/10 rounded-r-full transition-colors"
              >
                {isFullscreen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                )}
              </button>

              {/* Speed dropdown menu */}
              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 bg-black/90 rounded-xl overflow-hidden z-50 min-w-[100px]">
                  {SPEEDS.map((speed, i) => (
                    <button
                      key={speed}
                      onClick={(e) => { e.stopPropagation(); selectSpeed(i); }}
                      className={`w-full px-4 py-2.5 text-left font-alk-tall text-[17px] transition-colors
                        ${i === speedIndex ? "text-white bg-white/20" : "text-white hover:bg-white/10"}`}
                      style={{ transform: "translateY(2px)" }}
                    >
                      {speed}×
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
