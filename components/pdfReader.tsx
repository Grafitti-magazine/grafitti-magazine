"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import HTMLFlipBook from "react-pageflip";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PDFReaderProps {
  /** URL or base64 data URI of the PDF */
  fileUrl: string;
}

// ─── Forward Ref Page Wrapper ──────────────────────────────────────────────────
const PageContainer = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div
      className="bg-white overflow-hidden flex justify-center relative"
      ref={ref}
    >
      {props.children}
    </div>
  );
});
PageContainer.displayName = "PageContainer";

// ─── Component ───────────────────────────────────────────────────────────────
export default function PDFReader({ fileUrl }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [pageHeight, setPageHeight] = useState<number>(848); // default A4 ratio
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipBookRef = useRef<any>(null); // reference to HTMLFlipBook

  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [animating, setAnimating] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Responsive width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const mobile = w < 768;
        setIsMobile(mobile);

        // Keep the page fully visible on short laptop viewports.
        // Standard A4 aspect ratio is ~ 1:1.414
        const availableWidth = mobile ? w - 32 : (w - 64) / 2;
        const navbarHeight = 72; // matches h-18
        const controlsReserve = mobile ? 108 : 104;
        const verticalPadding = mobile ? 48 : 52;
        const availableHeight = Math.max(
          window.innerHeight - navbarHeight - controlsReserve - verticalPadding,
          360,
        );
        const widthFromHeight = availableHeight / 1.414;
        const wCapped = Math.max(
          260,
          Math.min(availableWidth, 600, widthFromHeight),
        );

        setPageWidth(wCapped);
        setPageHeight(wCapped * 1.414);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Auto-hide controls on mobile after inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  // Jump to URL param ?page on initial load
  const pageInitializedInfo = useRef(false);
  useEffect(() => {
    if (!pageInitializedInfo.current && numPages > 0) {
      pageInitializedInfo.current = true;
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page");
      if (pageParam) {
        const target = parseInt(pageParam, 10);
        if (!isNaN(target) && target >= 1 && target <= numPages) {
          // Wait a brief moment to ensure HTMLFlipBook fully initializes
          setTimeout(() => {
            if (flipBookRef.current) {
              flipBookRef.current.pageFlip().turnToPage(target - 1);
              setCurrentPage(target);
            }
          }, 400); // 400ms delay helps reliably bypass pageFlip undefined issues
        }
      }
    }
  }, [numPages]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [resetControlsTimer]);

  const goToPage = useCallback(
    (target: number) => {
      if (target < 1 || target > numPages || !flipBookRef.current) return;
      flipBookRef.current.pageFlip().turnToPage(target - 1);
      setCurrentPage(target);
      resetControlsTimer();
    },
    [numPages, resetControlsTimer],
  );

  const prevPage = () => {
    if (!flipBookRef.current) return;
    flipBookRef.current.pageFlip().flipPrev();
    resetControlsTimer();
  };

  const nextPage = () => {
    if (!flipBookRef.current) return;
    flipBookRef.current.pageFlip().flipNext();
    resetControlsTimer();
  };

  const flipAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      flipAudioRef.current = new Audio("/page-flip.mp3");
      flipAudioRef.current.volume = 0.4;
    }
  }, []);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data + 1); // e.data is the 0-indexed page index
  }, []);

  const onChangeState = useCallback(
    (e: any) => {
      const isFlipping = e.data === "flipping";
      setAnimating(isFlipping);

      if (isFlipping && flipAudioRef.current && !isMuted) {
        // Reset sound to start and play
        flipAudioRef.current.currentTime = 0;
        flipAudioRef.current.play().catch((err) => {
          // Ignore autoplay errors if user hasn't interacted yet
          console.debug("Autoplay prevented:", err);
        });
      }
    },
    [isMuted],
  );

  // Swipe support
  const touchStartX = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    resetControlsTimer();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? nextPage() : prevPage();
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextPage();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevPage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const isReading = currentPage > 1;
  const readScale = isMobile ? 1.02 : pageWidth < 520 ? 1.06 : 1.09;

  return (
    <>
      <div
        className="relative isolate z-0 flex w-full flex-col bg-transparent font-serif text-gray-900"
        ref={containerRef}
        onMouseMove={resetControlsTimer}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Document ── */}
        <div className="relative flex-1 overflow-visible touch-pan-y">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setIsLoading(false);
            }}
            onLoadError={() => setIsLoading(false)}
            loading={
              <div className="p-8">
                <div className="mx-auto aspect-[0.707] w-full max-w-150 animate-pulse rounded-md bg-gray-200" />
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center gap-3 p-12 text-gray-500 italic">
                <span className="text-4xl opacity-40">📄</span>
                <span>Could not load this document.</span>
              </div>
            }
          >
            {!isLoading && numPages > 0 && (
              <div
                className="relative z-0 flex origin-center justify-center p-4 perspective-[2500px] transition-transform duration-700 ease-in-out lg:p-8"
                key={pageWidth}
                style={{
                  transform: `translateX(${
                    !isMobile && !isReading ? -(pageWidth / 2) : 0
                  }px) scale(${isReading ? readScale : 1})`,
                }}
              >
                {/* @ts-ignore - react-pageflip typings are incomplete */}
                <HTMLFlipBook
                  width={pageWidth}
                  height={pageHeight}
                  size="fixed"
                  minWidth={300}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1500}
                  maxShadowOpacity={0.15}
                  flippingTime={600}
                  showCover={true}
                  mobileScrollSupport={true}
                  onFlip={onFlip}
                  onChangeState={onChangeState}
                  className="mx-auto"
                  style={{ margin: "0 auto" }}
                  ref={flipBookRef}
                  usePortrait={isMobile}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <PageContainer key={index}>
                      <Page
                        pageNumber={index + 1}
                        width={pageWidth}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </PageContainer>
                  ))}
                </HTMLFlipBook>
              </div>
            )}
          </Document>
        </div>

        {/* ── Controls ── */}
        {numPages > 0 && currentPage > 1 && (
          <nav
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-60 flex flex-row items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${
              !showControls || isScrolled
                ? "pointer-events-none translate-y-4 opacity-0"
                : ""
            }`}
          >
            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const url = new URL(window.location.href);
                url.searchParams.set("page", currentPage.toString());
                navigator.clipboard.writeText(url.toString());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-black transition-all hover:scale-105 hover:bg-white/40 hover:text-black active:scale-95 drop-shadow-md"
              aria-label="Share"
            >
              {copied ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className=""
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  <path d="m12 15 2 2 4-4" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              )}
            </button>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-black transition-all hover:scale-105 hover:bg-white/40 hover:text-black active:scale-95 disabled:pointer-events-none disabled:opacity-30 drop-shadow-md"
              onClick={prevPage}
              disabled={currentPage <= 1 || animating}
              aria-label="Previous page"
            >
              ←
            </button>

            <div className="flex shrink-0 items-center justify-center gap-1.5 px-3 h-10 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] drop-shadow-md">
              <div className="group relative flex items-center">
                <input
                  className="h-7 w-14 rounded-full border border-white/40 bg-white/30 backdrop-blur-sm text-center font-mono text-xs outline-none transition-colors focus:bg-white/80 focus:border-white/60 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none shadow-inner text-black"
                  type="number"
                  min={1}
                  max={numPages}
                  value={currentPage}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) goToPage(v);
                  }}
                  disabled={animating}
                  aria-label="Jump to page"
                />

                {/* Tooltip for clicking pages */}
                <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 w-max rounded-md bg-black/80 backdrop-blur-md px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-white/10">
                  ფურცლებზე დაჭერითაც შეგიძლიათ გადაფურცვლა
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-black/80"></div>
                </div>
              </div>

              <span className="font-mono text-xs font-semibold text-black/80">
                / {numPages}
              </span>
            </div>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-black transition-all hover:scale-105 hover:bg-white/40 hover:text-black active:scale-95 disabled:pointer-events-none disabled:opacity-30 drop-shadow-md"
              onClick={nextPage}
              disabled={currentPage >= numPages || animating}
              aria-label="Next page"
            >
              →
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-black transition-all hover:scale-105 hover:bg-white/40 hover:text-black active:scale-95 drop-shadow-md"
              aria-label={
                isMuted ? "Unmute page flip sound" : "Mute page flip sound"
              }
            >
              {isMuted ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
