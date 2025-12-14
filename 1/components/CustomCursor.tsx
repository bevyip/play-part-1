import React, { useEffect, useState } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateCursorPosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  const cursorSize = 48;

  // Determine if cursor is in the bottom half of the screen
  const isBottom =
    typeof window !== "undefined" && position.y > window.innerHeight / 2;

  return (
    <div
      className={`custom-cursor ${
        isBottom ? "custom-cursor-bottom" : "custom-cursor-top"
      }`}
      style={{
        transform: `translate(${position.x - cursorSize / 2}px, ${
          position.y - cursorSize / 2
        }px) scale(${isVisible ? 1 : 0})`,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};

export default CustomCursor;
