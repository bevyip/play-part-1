import React, { useEffect, useState, useRef } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverText, setIsOverText] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const lastTextCheck = useRef<number>(0);
  const touchPosition = useRef({ x: 0, y: 0 });
  const isTouchMode = useRef(false);
  const isOverTextRef = useRef(false);

  useEffect(() => {
    const checkIfOverText = (x: number, y: number): boolean => {
      if (typeof document === "undefined") return false;
      const element = document.elementFromPoint(x, y);
      if (!element) return false;

      let current: Element | null = element;
      while (current) {
        if (
          current.tagName === "H1" ||
          current.classList.contains("text-container")
        ) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };

    const updateCursorDOM = (
      x: number,
      y: number,
      scale: number,
      visible: boolean
    ) => {
      if (!cursorRef.current) return;

      const cursorSize = 48;
      const isBottom =
        y > (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

      // Update class for cursor color
      cursorRef.current.className = `custom-cursor ${
        isBottom ? "custom-cursor-bottom" : "custom-cursor-top"
      }`;

      // Update transform directly
      cursorRef.current.style.transform = `translate(${
        x - (cursorSize * scale) / 2
      }px, ${y - (cursorSize * scale) / 2}px) scale(${visible ? scale : 0})`;
      cursorRef.current.style.opacity = visible ? "1" : "0";
    };

    const handleMouseMove = (e: MouseEvent) => {
      isTouchMode.current = false;
      const now = Date.now();
      const shouldCheckText = now - lastTextCheck.current > 50;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });

        if (shouldCheckText) {
          const overText = checkIfOverText(e.clientX, e.clientY);
          setIsOverText(overText);
          isOverTextRef.current = overText;
          lastTextCheck.current = now;
        }

        if (!isVisible) setIsVisible(true);
      });
    };

    let touchTextCheckRaf: number | null = null;
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isTouchMode.current = true;
        const touch = e.touches[0];
        touchPosition.current = { x: touch.clientX, y: touch.clientY };

        // Update DOM directly for immediate response (no React re-render lag)
        // Use ref for current isOverText value (avoids stale closure)
        const scale = isOverTextRef.current ? 1.5 : 1;
        updateCursorDOM(touch.clientX, touch.clientY, scale, true);

        // Throttle text checking for touch (check every 100ms)
        const now = Date.now();
        if (now - lastTextCheck.current > 100) {
          if (touchTextCheckRaf) {
            cancelAnimationFrame(touchTextCheckRaf);
          }
          touchTextCheckRaf = requestAnimationFrame(() => {
            const overText = checkIfOverText(touch.clientX, touch.clientY);
            setIsOverText(overText);
            isOverTextRef.current = overText;
            lastTextCheck.current = now;
            // Update scale if it changed
            const newScale = overText ? 1.5 : 1;
            updateCursorDOM(touch.clientX, touch.clientY, newScale, true);
          });
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchMode.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        touchPosition.current = { x: touch.clientX, y: touch.clientY };
        const overText = checkIfOverText(touch.clientX, touch.clientY);
        setIsOverText(overText);
        isOverTextRef.current = overText;
        const scale = overText ? 1.5 : 1;
        updateCursorDOM(touch.clientX, touch.clientY, scale, true);
        setIsVisible(true);
      }
    };

    const handleTouchEnd = () => {
      isTouchMode.current = false;
      updateCursorDOM(
        touchPosition.current.x,
        touchPosition.current.y,
        1,
        false
      );
      setIsVisible(false);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (touchTextCheckRaf) {
        cancelAnimationFrame(touchTextCheckRaf);
      }
    };
  }, [isVisible]);

  const cursorSize = 48;
  const scale = isOverText ? 1.5 : 1;
  const isBottom =
    typeof window !== "undefined"
      ? (isTouchMode.current ? touchPosition.current.y : position.y) >
        window.innerHeight / 2
      : position.y > 0;

  // For mouse, use React state; for touch, DOM is updated directly
  const mouseStyle = isTouchMode.current
    ? {}
    : {
        transform: `translate(${position.x - (cursorSize * scale) / 2}px, ${
          position.y - (cursorSize * scale) / 2
        }px) scale(${isVisible ? scale : 0})`,
        opacity: isVisible ? 1 : 0,
      };

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${
        isBottom ? "custom-cursor-bottom" : "custom-cursor-top"
      }`}
      style={mouseStyle}
    />
  );
};

export default CustomCursor;
