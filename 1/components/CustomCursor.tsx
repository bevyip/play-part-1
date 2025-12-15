import React, { useEffect, useState } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverText, setIsOverText] = useState(false);

  useEffect(() => {
    const checkIfOverText = (x: number, y: number): boolean => {
      if (typeof document === "undefined") return false;
      const element = document.elementFromPoint(x, y);
      if (!element) return false;

      // Check if the element or its parents are h1 or text-container
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

    const updateCursorPosition = (x: number, y: number) => {
      setPosition({ x, y });
      const overText = checkIfOverText(x, y);
      setIsOverText(overText);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCursorPosition(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCursorPosition(touch.clientX, touch.clientY);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleTouchEnd = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isVisible]);

  const cursorSize = 48;
  const scale = isOverText ? 1.5 : 1;

  // Determine if cursor is in the bottom half of the screen
  const isBottom =
    typeof window !== "undefined" && position.y > window.innerHeight / 2;

  return (
    <div
      className={`custom-cursor ${
        isBottom ? "custom-cursor-bottom" : "custom-cursor-top"
      }`}
      style={{
        transform: `translate(${position.x - (cursorSize * scale) / 2}px, ${
          position.y - (cursorSize * scale) / 2
        }px) scale(${isVisible ? scale : 0})`,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};

export default CustomCursor;
