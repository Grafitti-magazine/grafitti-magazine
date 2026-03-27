"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);
  const [colorOffset, setColorOffset] = useState(0);
  const sidebarWidth = 220;

  useEffect(() => {
    // Randomize the rainbow starting point on the client after mount
    // to prevent React hydration mismatch and keep it dynamic
    setColorOffset(Math.floor(Math.random() * 17));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "/about", label: "ჩვენს შესახებ" },
    { href: "/gallery", label: "გალერეა" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-250 bg-black/40 transition-opacity duration-400 ease-[ease] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full bg-black/85 md:bg-black z-300 flex flex-col justify-between pt-22 pb-9 px-7 transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: sidebarWidth }}
        aria-hidden={!isOpen}
      >
        {" "}
        {/* Matches the top navbar border but in white */}
        <div className="absolute top-0 left-0 w-full h-18 border-b border-white pointer-events-none z-10" />
        <div className="absolute top-0 right-0 h-18 pr-7 flex items-center pointer-events-none md:hidden z-10">
          <span className="font-cobalt text-2xl leading-none text-white mt-1">
            გრაფიტი
          </span>
        </div>
        <div className="flex flex-col">
          {/* Nav list */}
          <ul className="list-none flex flex-col items-center gap-0 m-0 p-0">
            {navLinks.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 text-[20px] font-semibold text-white tracking-[0.02em] transition-all duration-200 hover:text-white/55 ${
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${80 + i * 50}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Footer */}
        <div
          className={`flex flex-col gap-2.5 transition-all duration-300 ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
          }`}
          style={{ transitionDelay: isOpen ? "340ms" : "0ms" }}
        >
          <div className="w-full h-px bg-[#BAB1B1]" />
          <p className="text-lg text-white font-semibold text-center">
            +995 555 12 34 56
            <br />
            GRAFFITI@GMAIL.COM
          </p>
          <div className="flex justify-center gap-3.5 mt-1">
            <Link
              href="https://www.instagram.com/thegrafittimagazine/"
              className="text-[20px] text-white/60 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link
              href="#"
              className="text-[20px] text-white/60 hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Top Navbar */}
      <header className="w-full h-18 bg-white border-b border-black flex items-center justify-center sticky top-0 z-200">
        <style jsx>{`
          .rainbow-letter {
            display: inline-block;
            position: relative;
            color: black;
            transition:
              color 0s 1s,
              transform 0.3s cubic-bezier(0.6, 0.4, 0, 1);
          }
          .rainbow-letter:hover,
          .rainbow-letter.hovered-state {
            color: transparent;
            transition:
              color 0s,
              transform 0.3s cubic-bezier(0.6, 0.4, 0, 1);
            transform: rotate(-10deg) translateY(-4px) scale(1.15);
          }
          .rainbow-bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>
        <Link
          href="/"
          onMouseEnter={() => setColorOffset(Math.floor(Math.random() * 4))}
          className={`font-cobalt md:text-[44px] text-2xl leading-none mt-1 transition-opacity duration-200 flex space-x-0 ${
            isOpen
              ? "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
              : "opacity-100"
          }`}
        >
          {"გრაფიტი".split("").map((char, i) => {
            const colors = ["#237375", "#9D2C2F", "#2B4A66", "#E6B92B"];
            // Solid color block using background color, clipping to text
            const currentColor = colors[(i + colorOffset) % colors.length];
            return (
              <span
                key={i}
                className="rainbow-letter"
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.classList.add("hovered-state");
                  // Clear the custom class after the intended logical hover duration
                  // leaving it natural if they are actively holding hover via css :hover
                  setTimeout(() => {
                    target.classList.remove("hovered-state");
                  }, 800);
                }}
              >
                <span
                  className="rainbow-bg"
                  style={{
                    backgroundColor: currentColor,
                    backgroundImage: "none",
                  }}
                  aria-hidden="true"
                >
                  {char}
                </span>
                {char}
              </span>
            );
          })}
        </Link>
      </header>

      {/* Spray Button (Top-level so it stays visible over drawer) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          // Trigger spray animation
          setIsSpraying(true);
          setTimeout(() => setIsSpraying(false), 500);
        }}
        className={`fixed left-0 top-0 h-18 px-4 bg-transparent border-none cursor-pointer flex items-center gap-2 transition-colors duration-400 focus:outline-none z-510 ${
          isOpen ? "text-white" : "text-black hover:opacity-75"
        }`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <style jsx>{`
          @keyframes spray-action {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            30% {
              transform: translate(6px, -10px) scale(1.3);
              opacity: 0;
            }
            40% {
              transform: translate(-4px, 6px) scale(0);
              opacity: 0;
            }
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
          }
          .spray-particles.active path {
            transform-origin: center;
            animation: spray-action 0.5s ease-out forwards;
          }
          .spray-particles.active path:nth-child(1) {
            animation-delay: 0s;
          }
          .spray-particles.active path:nth-child(2) {
            animation-delay: 0.1s;
          }
          .spray-particles.active path:nth-child(3) {
            animation-delay: 0.05s;
          }
          .spray-particles.active path:nth-child(4) {
            animation-delay: 0.15s;
          }
          .spray-particles.active path:nth-child(5) {
            animation-delay: 0.02s;
          }
          .spray-particles.active path:nth-child(6) {
            animation-delay: 0.12s;
          }
        `}</style>

        <svg
          width="38"
          height="38"
          viewBox="0 0 73 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 size-7 md:size-9.5"
        >
          {/* Main Can */}
          <path
            d="M26.0062 22.7374H25.5499V20.1874H26.3483C27.7171 20.1874 28.9718 19.1249 28.9718 17.7437C28.9718 16.3624 27.8312 15.2999 26.3483 15.2999H19.5046C18.1358 15.2999 16.8812 16.3624 16.8812 17.7437C16.8812 19.1249 18.0218 20.1874 19.5046 20.1874H20.303V22.7374H19.8468C11.8624 22.7374 5.36084 28.7937 5.36084 36.2312V62.0499C5.36084 64.2812 7.2999 66.0874 9.69522 66.0874H36.0437C38.439 66.0874 40.378 64.2812 40.378 62.0499V36.3374C40.4921 28.7937 33.9905 22.7374 26.0062 22.7374ZM19.9608 27.5187H26.0062C31.139 27.5187 35.2452 31.3437 35.3593 36.0187H10.6077C10.6077 31.3437 14.828 27.5187 19.9608 27.5187ZM10.4937 61.4124V40.9062H35.3593V61.4124H10.4937Z"
            fill="currentColor"
          />

          {/* Particles Group */}
          <g className={`spray-particles ${isSpraying ? "active" : ""}`}>
            <path
              d="M55.6625 20.1875C54.2937 20.1875 53.0391 21.25 53.0391 22.6312V22.8438C53.0391 24.1188 54.1797 25.2875 55.6625 25.2875C57.1453 25.2875 58.2859 24.225 58.2859 22.8438V22.6312C58.1719 21.25 57.0312 20.1875 55.6625 20.1875Z"
              fill="currentColor"
            />
            <path
              d="M55.6625 9.13745C54.2937 9.13745 53.0391 10.2 53.0391 11.5812V11.6875C53.0391 12.9625 54.1797 14.1312 55.6625 14.1312C57.1453 14.1312 58.2859 13.0687 58.2859 11.6875V11.475C58.1719 10.2 57.0312 9.13745 55.6625 9.13745Z"
              fill="currentColor"
            />
            <path
              d="M65.0155 27.0938C63.6468 27.0938 62.3921 28.1562 62.3921 29.5375V29.75C62.3921 31.025 63.5327 32.1937 65.0155 32.1937C66.4983 32.1937 67.639 31.1312 67.639 29.75V29.5375C67.639 28.1562 66.3843 27.0938 65.0155 27.0938Z"
              fill="currentColor"
            />
            <path
              d="M45.6249 14.6625C44.2562 14.6625 43.0015 15.725 43.0015 17.1062V17.3187C43.0015 18.5937 44.1421 19.7625 45.6249 19.7625C47.1077 19.7625 48.2483 18.7 48.2483 17.3187V17C48.2483 15.725 47.1077 14.6625 45.6249 14.6625Z"
              fill="currentColor"
            />
            <path
              d="M65.0155 14.6625C63.6468 14.6625 62.3921 15.725 62.3921 17.1062V17.3187C62.3921 18.5937 63.5327 19.7625 65.0155 19.7625C66.4983 19.7625 67.639 18.7 67.639 17.3187V17C67.639 15.725 66.3843 14.6625 65.0155 14.6625Z"
              fill="currentColor"
            />
            <path
              d="M65.0155 1.91248C63.6468 1.91248 62.3921 2.97498 62.3921 4.35623V4.56873C62.3921 5.84373 63.5327 7.01248 65.0155 7.01248C66.4983 7.01248 67.639 5.94998 67.639 4.56873V4.24998C67.639 2.97498 66.3843 1.91248 65.0155 1.91248Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </button>
    </>
  );
}
