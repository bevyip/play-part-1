import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

interface BouncingBallProps {
  onExpand?: () => void;
  onComplete?: () => void;
}

export const BouncingBall: React.FC<BouncingBallProps> = ({
  onExpand,
  onComplete,
}) => {
  const ballRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const ball = ballRef.current;
      const shadow = shadowRef.current;

      if (!ball || !shadow) return;

      // Configuration
      const BALL_SIZE = 120;
      const BOTTOM_PADDING = 150; // Padding from bottom of screen

      // Calculate positions
      const floorY = window.innerHeight - BALL_SIZE - BOTTOM_PADDING;
      const startY = -200; // Start above screen
      const bounceHeight = 350; // How high it bounces up from the floor
      const centerY = (window.innerHeight - BALL_SIZE) / 2;

      // Initial States
      gsap.set(ball, { xPercent: -50, y: startY });
      gsap.set(shadow, {
        xPercent: -50,
        y: floorY + BALL_SIZE + 10,
        scale: 0,
        opacity: 0,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // 1. Single Drop from Sky (High Energy)
      // Accelerate until hitting the floor
      tl.to(ball, {
        y: floorY,
        duration: 0.8,
        ease: "power2.in", // Accelerating gravity drop
      });

      // Sync shadow for initial drop
      tl.to(
        shadow,
        {
          opacity: 0.5,
          scale: 1,
          duration: 0.8,
          ease: "power2.in",
        },
        "<"
      );

      // 2. Continuous Bouncing Phase
      // Drop -> Hit Floor -> Bounce Up
      tl.to(ball, {
        y: floorY - bounceHeight, // Move up to apex
        duration: 0.4,
        ease: "power1.out", // Decelerate on way up (gravity)
        yoyo: true, // Fall back down (accelerate)
        repeat: 6, // Repeat for a few seconds (Up/Down cycles)
        onUpdate: () => {
          // Sync shadow manually based on current height
          const currentY = gsap.getProperty(ball, "y") as number;
          const height = floorY - currentY;
          // Calculate shadow intensity based on height
          const progress = Math.min(Math.max(height / bounceHeight, 0), 1);

          // Shadow fades and shrinks as ball goes up
          gsap.set(shadow, {
            opacity: 0.5 * (1 - progress),
            scale: 1 - 0.5 * progress,
          });
        },
      });

      // 3. Expansion Finale
      tl.add(() => {
        // Prepare for expansion - fade out shadow
        gsap.to(shadow, { opacity: 0, duration: 0.1 });

        // Trigger background color change at the start of expansion
        if (onExpand) onExpand();

        // Expand ball to fill screen while fading it out
        gsap.to(ball, {
          y: centerY,
          scale: 25,
          opacity: 0, // Fade out the ball so gradient doesn't show
          duration: 0.4,
          ease: "power2.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onExpand, onComplete]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {/* Shadow */}
      <div
        ref={shadowRef}
        className="absolute left-1/2 w-32 h-8 bg-black rounded-[100%] blur-md hardware-accel pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Ball */}
      <div
        ref={ballRef}
        className="absolute left-1/2 top-0 hardware-accel"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          zIndex: 20,
          backgroundColor: "#FBDA0C",
          boxShadow:
            "inset 10px 10px 20px rgba(255, 255, 255, 0.5), inset -10px -10px 30px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};
