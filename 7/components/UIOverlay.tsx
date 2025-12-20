import React, { useState, useEffect, useCallback, useRef } from "react";

const SpacerSection: React.FC = () => (
  <div className="h-screen w-full flex items-center justify-center pointer-events-none" />
);

export const UIOverlay: React.FC = () => {
  const [isUpActive, setIsUpActive] = useState(false);
  const [isDownActive, setIsDownActive] = useState(false);
  const scrollIntervalRef = useRef<number | null>(null);

  const startScrolling = useCallback((direction: "up" | "down") => {
    if (scrollIntervalRef.current) return;
    const scrollAmount = direction === "up" ? -15 : 15;
    scrollIntervalRef.current = window.setInterval(() => {
      window.scrollBy({ top: scrollAmount, behavior: "auto" });
    }, 16);
  }, []);

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setIsUpActive(true);
        startScrolling("up");
      } else if (e.key === "ArrowDown") {
        setIsDownActive(true);
        startScrolling("down");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setIsUpActive(false);
        stopScrolling();
      } else if (e.key === "ArrowDown") {
        setIsDownActive(false);
        stopScrolling();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopScrolling();
    };
  }, [startScrolling, stopScrolling]);

  return (
    <div className="relative z-10 select-none">
      <header className="fixed top-0 left-0 w-full p-10 flex justify-between items-start z-20 pointer-events-none">
        <div />
        <div className="text-white text-[12px] font-semibold uppercase tracking-[0.3em] opacity-70">
          scroll or use ↑↓ keys
        </div>
      </header>

      {/* Control Indicators */}
      <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 flex flex-col gap-3 md:gap-4 z-30 pointer-events-auto">
        <button
          onMouseDown={() => {
            setIsUpActive(true);
            startScrolling("up");
          }}
          onMouseUp={() => {
            setIsUpActive(false);
            stopScrolling();
          }}
          onMouseLeave={() => {
            setIsUpActive(false);
            stopScrolling();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setIsUpActive(true);
            startScrolling("up");
          }}
          onTouchEnd={() => {
            setIsUpActive(false);
            stopScrolling();
          }}
          className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl border-2 border-white/30 text-white transition-all duration-150 ${
            isUpActive
              ? "bg-white/40 border-white/60 scale-95"
              : "bg-white/5 hover:bg-white/10"
          }`}
          aria-label="Scroll Up"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>

        <button
          onMouseDown={() => {
            setIsDownActive(true);
            startScrolling("down");
          }}
          onMouseUp={() => {
            setIsDownActive(false);
            stopScrolling();
          }}
          onMouseLeave={() => {
            setIsDownActive(false);
            stopScrolling();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setIsDownActive(true);
            startScrolling("down");
          }}
          onTouchEnd={() => {
            setIsDownActive(false);
            stopScrolling();
          }}
          className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl border-2 border-white/30 text-white transition-all duration-150 ${
            isDownActive
              ? "bg-white/40 border-white/60 scale-95"
              : "bg-white/5 hover:bg-white/10"
          }`}
          aria-label="Scroll Down"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Empty sections to maintain page length for ScrollTrigger */}
      <SpacerSection />
      <SpacerSection />
      <SpacerSection />
      <SpacerSection />
      <SpacerSection />

      <footer className="h-64 pointer-events-none" />
    </div>
  );
};
