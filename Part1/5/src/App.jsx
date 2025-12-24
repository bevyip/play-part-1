import { useState } from "react";
import LiquidEther from "./LiquidEther.jsx";

const colorPalettes = [
  ["#5227FF", "#FF9FFC", "#B19EEF"], // Purple/Pink
  ["#FF5227", "#FCFF9F", "#EFB19E"], // Orange/Warm
  ["#00D9FF", "#00FF94", "#9FFFEA"], // Cyan/Green
  ["#FF0080", "#FF8C00", "#FFE500"], // Pink/Orange/Yellow
];

export default function App() {
  const [colorIndex, setColorIndex] = useState(0);

  const handleClick = () => {
    // Get a random index different from current
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * colorPalettes.length);
    } while (newIndex === colorIndex && colorPalettes.length > 1);
    setColorIndex(newIndex);
  };

  return (
    <>
      <LiquidEther
        style={{ width: "100vw", height: "100vh" }}
        colors={colorPalettes[colorIndex]}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        isViscous={true}
        viscous={30}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
        <div
          onClick={handleClick}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "9999px",
            padding: "10px 24px",
            color: "white",
            fontSize: "18px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 500,
            userSelect: "none",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
        >
          touch me
        </div>
      </div>
    </>
  );
}
