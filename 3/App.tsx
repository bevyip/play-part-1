import React, { useState, useCallback } from "react";
import { BouncingBall } from "./components/BouncingBall";

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<"IDLE" | "PLAYING" | "FINISHED">(
    "IDLE"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // Triggered when the ball covers the screen
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  // Triggered when the animation timeline finishes completely
  const handleComplete = useCallback(() => {
    setGameStatus("FINISHED");
  }, []);

  // Start the animation
  const handleStart = () => {
    setGameStatus("PLAYING");
    setIsExpanded(false);
    // Increment key to force complete re-mount/reset of the component
    setGameKey((prev) => prev + 1);
  };

  // Reset to Start scene
  const handleReset = useCallback(() => {
    setGameStatus("IDLE");
    setIsExpanded(false);
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex items-center justify-center font-sans"
      style={{
        backgroundColor: isExpanded ? "#FBDA0C" : "#ffffff",
        transition: "background-color 0.4s ease-out",
      }}
    >
      {/* Start Button */}
      {gameStatus === "IDLE" && (
        <button
          onClick={handleStart}
          style={{
            fontFamily:
              '"Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
          className="z-50 px-8 py-3 bg-[#FBDA0C] text-[#0057AD] text-xl rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          START
        </button>
      )}

      {/* The Animation */}
      {gameStatus !== "IDLE" && (
        <BouncingBall
          key={gameKey}
          onExpand={handleExpand}
          onComplete={handleComplete}
        />
      )}

      {/* End Screen Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
        <h1
          style={{
            fontFamily:
              '"Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
          className={`text-3xl text-[#0057AD] mb-4 transition-all ease-out ${
            gameStatus === "FINISHED"
              ? "opacity-100 delay-[1500ms] duration-1000"
              : "opacity-0 duration-0"
          }`}
        >
          no, this isn't ikea-related.
        </h1>

        {/* Auto-Restart Progress Bar */}
        <div
          className={`mt-4 w-36 h-1.5 bg-black/10 rounded-full overflow-hidden transition-opacity ease-out ${
            gameStatus === "FINISHED"
              ? "opacity-100 delay-[3000ms] duration-1500"
              : "opacity-0 duration-0"
          }`}
        >
          <div
            className="h-full bg-[#0057AD] origin-left"
            style={{
              width: "100%",
              transform: gameStatus === "FINISHED" ? "scaleX(1)" : "scaleX(0)",
              transitionProperty: "transform",
              transitionDuration: "3000ms",
              transitionTimingFunction: "linear",
              transitionDelay: gameStatus === "FINISHED" ? "2000ms" : "0ms",
            }}
            onTransitionEnd={(e) => {
              // Ensure we only trigger on the specific property and state
              if (e.propertyName === "transform" && gameStatus === "FINISHED") {
                setTimeout(() => {
                  handleReset();
                }, 800);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
