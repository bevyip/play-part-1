import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TactileButton,
  LongButton,
  ToggleSwitch,
  VerticalSlider,
  SegmentedControl,
  DialKnob,
} from "./components/Controls";
import { THEMES, THEME_DURATION } from "./constants";
import {
  Power,
  Wifi,
  Bluetooth,
  Home,
  Sun,
  Heart,
  Star,
  Bell,
} from "lucide-react";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lightAngle, setLightAngle] = useState(144); // Default: 40% (144°)
  const [brightness, setBrightness] = useState(100); // Default: 100% (slider starts at top)
  const currentTheme = isDarkMode ? THEMES.dark : THEMES.light;

  // Convert slider value (0-100) to CSS brightness filter (0.3 to 1.0)
  // 0% = 0.3 (very dark), 100% = 1.0 (normal brightness)
  const brightnessValue = 0.3 + (brightness / 100) * 0.7;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const panelPerspective = {
    rotateX: 2,
    rotateY: -1,
    perspective: 2000,
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-full flex items-center justify-center p-2 md:p-6 overflow-hidden"
      animate={
        {
          backgroundColor: currentTheme.bg,
          "--bg": currentTheme.bg,
          "--shadow-light": currentTheme.shadowLight,
          "--shadow-dark": currentTheme.shadowDark,
          "--text": currentTheme.text,
          "--label": currentTheme.label,
          "--accent": currentTheme.accent,
        } as any
      }
      transition={{ duration: THEME_DURATION, ease: "easeInOut" }}
      style={{
        perspective: `${panelPerspective.perspective}px`,
        pointerEvents: "auto",
        filter: `brightness(${brightnessValue})`,
        transition: "filter 0.2s ease-out",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: panelPerspective.rotateX,
          rotateY: panelPerspective.rotateY,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full max-w-full md:max-w-[900px] flex flex-col items-center gap-2 md:gap-8 px-2 md:px-0"
      >
        {/* Header Section */}
        <div className="w-full flex flex-col items-center gap-1 md:gap-4">
          <div className="w-full max-w-full md:max-w-2xl px-1 md:px-2">
            <LongButton label="A Very Long Button" lightAngle={lightAngle} />
          </div>
        </div>

        {/* Responsive Grid */}
        <div
          className={`w-full grid ${
            isMobile ? "grid-cols-2 gap-x-2 gap-y-3" : "grid-cols-3 gap-12"
          } items-center justify-items-center overflow-visible`}
          style={{
            position: "relative",
            isolation: "isolate",
            padding: isMobile ? "0.5rem" : "1rem 0",
          }}
        >
          {/* Section 1: Power & connectivity */}
          <div
            className="flex flex-col gap-2 md:gap-8 items-center w-full"
            style={{
              transformStyle: "preserve-3d",
              position: "relative",
              pointerEvents: "auto",
              zIndex: 1,
              width: "100%",
              maxWidth: "100%",
              overflow: "visible",
              padding: "0.5rem",
            }}
          >
            <TactileButton
              shape="circle"
              size={isMobile ? 56 : 100}
              icon={<Power />}
              activeColor="#ef4444"
              label="Power"
              lightAngle={lightAngle}
            />

            <div className="grid grid-cols-2 gap-1.5 md:gap-4 w-full max-w-[140px] md:max-w-none">
              <TactileButton
                icon={<Wifi />}
                label="Wifi"
                activeColor="#3b82f6"
                size={isMobile ? 42 : 68}
                lightAngle={lightAngle}
              />
              <TactileButton
                icon={<Bluetooth />}
                label="BT"
                activeColor="#8b5cf6"
                size={isMobile ? 42 : 68}
                lightAngle={lightAngle}
              />
              <TactileButton
                icon={<Home />}
                label="Home"
                activeColor="#10b981"
                size={isMobile ? 42 : 68}
                lightAngle={lightAngle}
              />
              <TactileButton
                icon={<Sun />}
                label="Auto"
                activeColor="#f59e0b"
                size={isMobile ? 42 : 68}
                lightAngle={lightAngle}
              />
            </div>
          </div>

          {/* Section 2: Environment Controls */}
          <div
            className="flex flex-col gap-2 md:gap-8 items-center w-full"
            style={{
              transformStyle: "preserve-3d",
              position: "relative",
              pointerEvents: "auto",
              zIndex: 1,
              width: "100%",
              maxWidth: "100%",
              overflow: "visible",
              padding: "0.5rem",
            }}
          >
            <div className="flex flex-col gap-1.5 md:gap-6 items-center w-full max-w-[140px] md:max-w-none">
              <ToggleSwitch
                isDark={isDarkMode}
                label="Theme"
                onToggle={(val) => setIsDarkMode(val)}
                lightAngle={lightAngle}
              />
              <SegmentedControl
                options={["Low", "Medium", "High"]}
                lightAngle={lightAngle}
              />
            </div>

            <div
              className="flex flex-col items-center gap-1.5 md:gap-6"
              style={{ transformStyle: "preserve-3d" }}
            >
              <DialKnob
                label="Shadow Controls"
                size={isMobile ? 72 : 140}
                onAngleChange={setLightAngle}
              />
              <div
                className="flex gap-1.5 md:gap-3"
                style={{ transform: "translateZ(10px)" }}
              >
                <TactileButton
                  shape="circle"
                  size={isMobile ? 28 : 42}
                  icon={<Heart />}
                  activeColor="#ec4899"
                  lightAngle={lightAngle}
                />
                <TactileButton
                  shape="circle"
                  size={isMobile ? 28 : 42}
                  icon={<Star />}
                  activeColor="#eab308"
                  lightAngle={lightAngle}
                />
                <TactileButton
                  shape="circle"
                  size={isMobile ? 28 : 42}
                  icon={<Bell />}
                  activeColor="var(--accent)"
                  lightAngle={lightAngle}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Slider */}
          <div
            className={`${
              isMobile ? "col-span-2" : "col-span-1"
            } flex flex-col items-center justify-center`}
            style={{
              pointerEvents: "none",
              position: "relative",
              width: "100%",
              height: "fit-content",
              overflow: "visible",
              zIndex: 1,
              maxWidth: "100%",
              padding: "1rem 0.5rem",
            }}
          >
            <div
              style={{
                pointerEvents: "auto",
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VerticalSlider
                label="Brightness Controls"
                lightAngle={lightAngle}
                onValueChange={setBrightness}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default App;
