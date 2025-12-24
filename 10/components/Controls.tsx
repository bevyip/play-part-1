import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { getShadows, SPRING } from "../constants";

interface ControlProps {
  label?: string;
  icon?: React.ReactElement;
  activeColor?: string;
  isDark?: boolean;
  lightAngle?: number;
  onValueChange?: (value: number) => void;
}

const fastTransition = { duration: 0.15, ease: "easeOut" } as const;

// 1. Long Rectangular Button (Toggle State)
export const LongButton: React.FC<ControlProps> = ({
  label,
  lightAngle = 225,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const shadows = getShadows(lightAngle);

  // Change text based on pressed state
  const displayText = isPressed
    ? "still a very long button"
    : label || "A Very Long Button";

  return (
    <div
      className="w-full flex flex-col items-center gap-1 md:gap-2"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.button
        onClick={() => setIsPressed(!isPressed)}
        animate={{
          boxShadow: isPressed ? shadows.inset : shadows.raised,
          z: isPressed ? 2 : 25,
          scale: isPressed ? 0.985 : 1,
        }}
        transition={{
          boxShadow: { duration: 0.15 },
          z: SPRING,
          scale: SPRING,
        }}
        style={{
          transformStyle: "preserve-3d",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
        className="w-full py-2.5 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[8px] md:text-[11px] cursor-pointer outline-none border-none select-none relative z-10 touch-none"
      >
        <motion.span
          key={displayText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ display: "inline-block" }}
        >
          {displayText}
        </motion.span>
      </motion.button>
    </div>
  );
};

// 2. Standard Square/Circle Button
export const TactileButton: React.FC<
  ControlProps & { shape?: "square" | "circle"; size?: number }
> = ({
  icon,
  label,
  activeColor,
  shape = "square",
  size = 80,
  lightAngle = 225,
}) => {
  const [isActive, setIsActive] = useState(false);
  const shadows = getShadows(lightAngle);

  return (
    <div
      className="flex flex-col items-center gap-1 md:gap-1.5"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.button
        onPointerDown={() => setIsActive(!isActive)}
        animate={{
          boxShadow: isActive ? shadows.inset : shadows.raised,
          z: isActive ? 2 : 30,
          scale: isActive ? 0.94 : 1,
        }}
        transition={{
          boxShadow: { duration: 0.1 },
          z: SPRING,
          scale: SPRING,
        }}
        style={{
          width: size,
          height: size,
          borderRadius: shape === "circle" ? "50%" : "1rem",
          transformStyle: "preserve-3d",
          backgroundColor: "var(--bg)",
          color: isActive && activeColor ? activeColor : "var(--text)",
        }}
        className="flex items-center justify-center relative overflow-visible cursor-pointer outline-none border-none select-none z-10 touch-none pointer-events-auto"
      >
        <motion.div
          animate={{ z: isActive ? 8 : 12 }}
          transition={SPRING}
          className="flex items-center justify-center pointer-events-none"
        >
          {icon &&
            React.cloneElement(icon as React.ReactElement<any>, {
              size: size * 0.4,
            })}
        </motion.div>
      </motion.button>
      {label && (
        <motion.span
          style={{ color: "var(--label)" }}
          className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest opacity-80"
        >
          {label}
        </motion.span>
      )}
    </div>
  );
};

// 3. Toggle Switch
export const ToggleSwitch: React.FC<
  ControlProps & { onToggle?: (val: boolean) => void }
> = ({ label, isDark = false, onToggle, lightAngle = 225 }) => {
  const [isOn, setIsOn] = useState(isDark);
  const shadows = getShadows(lightAngle);

  const toggle = () => {
    const newVal = !isOn;
    setIsOn(newVal);
    onToggle?.(newVal);
  };

  return (
    <div
      className="flex flex-col items-center gap-1 md:gap-2"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        animate={{ boxShadow: shadows.inset }}
        transition={{ duration: 0 }}
        style={{ backgroundColor: "var(--bg)" }}
        className="w-12 h-6 md:w-16 md:h-8 rounded-full flex items-center p-1 cursor-pointer outline-none z-10 touch-none"
        onClick={toggle}
      >
        <motion.div
          animate={{
            x: isOn ? (window.innerWidth < 768 ? 24 : 32) : 0,
            boxShadow: shadows.raised,
            z: 15,
          }}
          transition={{
            x: SPRING,
            z: SPRING,
            boxShadow: { duration: 0 },
          }}
          style={{ backgroundColor: "var(--bg)" }}
          className="w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center"
        >
          <div
            className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${
              isOn
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "bg-gray-400"
            } transition-all duration-300`}
          />
        </motion.div>
      </motion.div>
      <motion.span
        style={{ color: "var(--label)" }}
        className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest"
      >
        {label}
      </motion.span>
    </div>
  );
};

// 4. Vertical Slider
export const VerticalSlider: React.FC<ControlProps> = ({
  label,
  lightAngle = 225,
  onValueChange,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const shadows = getShadows(lightAngle);
  const trackHeight = isMobile ? 120 : 200;
  const handleHeight = 44;
  const padding = 4;
  const dragRange = trackHeight - handleHeight - padding * 2;

  const y = useMotionValue(0); // Initial position at top (100%)
  const percentage = useTransform(y, [0, dragRange], [100, 0]);
  const [displayValue, setDisplayValue] = useState(100);

  // Sync state with motion value for numerical display and call callback
  useEffect(() => {
    const unsubscribe = percentage.on("change", (latest) => {
      const rounded = Math.round(latest);
      setDisplayValue(rounded);
      onValueChange?.(rounded);
    });
    return () => unsubscribe();
  }, [percentage, onValueChange]);

  // Initialize with default value (100%)
  useEffect(() => {
    onValueChange?.(100);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-2 md:gap-3"
      style={{
        transformStyle: "preserve-3d",
        pointerEvents: "auto",
        position: "relative",
        width: "fit-content",
        height: "fit-content",
        isolation: "isolate",
        padding: "0.5rem",
        minWidth: "fit-content",
      }}
    >
      <motion.div
        animate={{ boxShadow: shadows.inset }}
        transition={{ duration: 0 }}
        style={{
          height: trackHeight,
          position: "relative",
          minWidth: isMobile ? "36px" : "48px",
          maxWidth: isMobile ? "36px" : "48px",
          margin: "0 auto",
          backgroundColor: "var(--bg)",
        }}
        className="w-9 md:w-12 rounded-2xl relative z-0 touch-none pointer-events-auto"
      >
        {/* Track visualization lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-8 px-3 opacity-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-0.5 bg-current w-full" />
          ))}
        </div>

        {/* The draggable handle */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: dragRange }}
          dragElastic={0}
          dragMomentum={false}
          style={{
            y,
            z: 50,
            backgroundColor: "var(--bg)",
          }}
          animate={{ boxShadow: shadows.raised }}
          transition={{
            boxShadow: { duration: 0 },
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ cursor: "grabbing", scale: 0.98, z: 40 }}
          className="w-7 md:w-10 h-11 rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center absolute left-1 top-1 z-50 touch-none pointer-events-auto shadow-lg"
        >
          <div className="w-4 md:w-5 h-0.5 bg-gray-400/50 rounded-full my-0.5" />
          <div className="w-4 md:w-5 h-0.5 bg-gray-400/50 rounded-full my-0.5" />
          <div className="w-4 md:w-5 h-0.5 bg-gray-400/50 rounded-full my-0.5" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-center pointer-events-none">
        <span
          className="text-[9px] md:text-[11px] font-mono font-bold"
          style={{ color: "var(--text)" }}
        >
          {displayValue}%
        </span>
        <span
          style={{ color: "var(--label)" }}
          className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest opacity-60"
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// 5. Segmented Control
export const SegmentedControl: React.FC<{
  options: string[];
  lightAngle?: number;
}> = ({ options, lightAngle = 225 }) => {
  const [selected, setSelected] = useState(1);
  const shadows = getShadows(lightAngle);

  // Define colors for each option (Low, Medium, High)
  const optionColors: { [key: string]: string } = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  return (
    <motion.div
      animate={{ boxShadow: shadows.raisedSmall }}
      transition={{ duration: 0 }}
      style={{ backgroundColor: "var(--bg)" }}
      className="flex p-0.5 md:p-1 rounded-xl md:rounded-2xl z-0 w-full max-w-full"
    >
      {options.map((opt, i) => {
        const isSelected = selected === i;
        const optionColor = optionColors[opt] || "var(--accent)";

        return (
          <motion.button
            key={opt}
            onClick={() => setSelected(i)}
            animate={{
              boxShadow: isSelected ? shadows.insetSmall : "none",
              scale: isSelected ? 0.98 : 1,
              z: isSelected ? 2 : 5,
            }}
            transition={{
              boxShadow: fastTransition,
              z: fastTransition,
              scale: fastTransition,
            }}
            style={{
              color: isSelected ? optionColor : "var(--text)",
              backgroundColor: isSelected ? "var(--bg)" : "transparent",
            }}
            className="relative px-1.5 md:px-4 py-0.5 md:py-1.5 text-[6px] md:text-[9px] font-bold uppercase tracking-wider md:tracking-widest cursor-pointer outline-none border-none z-10 flex-1 rounded-lg md:rounded-xl touch-none pointer-events-auto"
          >
            {opt}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// 6. Dial/Knob
export const DialKnob: React.FC<
  ControlProps & { size?: number; onAngleChange?: (angle: number) => void }
> = ({ label, size = 100, onAngleChange }) => {
  // Start at 40% = 144 degrees
  const initialRotation = 144;
  const [rotation, setRotation] = useState(initialRotation);
  const knobRef = useRef<HTMLDivElement>(null);
  const shadows = getShadows(rotation);

  // Initialize with 40% on mount
  useEffect(() => {
    onAngleChange?.(initialRotation);
  }, []);

  const handleDrag = (event: any, info: any) => {
    if (!knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle =
      Math.atan2(info.point.y - centerY, info.point.x - centerX) *
      (180 / Math.PI);
    const newRotation = angle + 90;
    setRotation(newRotation);
    // Normalize angle to 0-360 and call callback
    const normalizedAngle = ((newRotation % 360) + 360) % 360;
    onAngleChange?.(normalizedAngle);
  };

  return (
    <div
      className="flex flex-col items-center gap-1.5 md:gap-3"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        ref={knobRef}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
        animate={{
          rotate: rotation,
          z: 35,
          boxShadow: shadows.raised,
        }}
        transition={{
          rotate: { type: "tween", ease: "linear", duration: 0 },
          boxShadow: { duration: 0 },
          z: SPRING,
        }}
        style={{
          backgroundColor: "var(--bg)",
          width: size,
          height: size,
        }}
        className="rounded-full flex items-center justify-center relative cursor-pointer active:cursor-grabbing outline-none border-none z-10 touch-none pointer-events-auto"
      >
        <div className="absolute inset-0 flex flex-col items-center pointer-events-none">
          <div
            className="mt-1.5 md:mt-2 w-1 md:w-1.5 bg-blue-500 rounded-full shadow-inner"
            style={{ height: size * 0.15 }}
          />
        </div>

        <motion.div
          style={{
            color: "var(--text)",
            position: "absolute",
          }}
          animate={{ rotate: -rotation }}
          transition={{
            rotate: { type: "tween", ease: "linear", duration: 0 },
          }}
          className="text-[7px] md:text-[10px] font-mono font-bold select-none pointer-events-none"
        >
          {Math.round(((rotation % 360) + 360) % 360)}°
        </motion.div>
      </motion.div>
      <motion.span
        style={{ color: "var(--label)" }}
        className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest opacity-60"
      >
        {label}
      </motion.span>
    </div>
  );
};
