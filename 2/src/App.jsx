import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Configuration for the eyes
    const SPACING = 100; // Grid cell size
    const EYE_RADIUS = 35;
    const IRIS_RADIUS = 18;
    const PUPIL_RADIUS = 9;

    // Lag configuration - lower value = more lag/creepiness (0.05 = very slow, 0.15 = moderate)
    const LAG_FACTOR = 0.05;

    // Store current pupil positions for each eye (for smooth interpolation)
    const eyePositions = new Map();

    // Lighting configuration
    const LIGHT_OFFSET_X = -10;
    const LIGHT_OFFSET_Y = -10;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
      }
    };

    const render = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate grid dimensions
      const cols = Math.ceil(canvas.width / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;

      // Center the grid pattern
      const startX = (canvas.width - (cols - 1) * SPACING) / 2;
      const startY = (canvas.height - (rows - 1) * SPACING) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const eyeCenterX = startX + i * SPACING;
          const eyeCenterY = startY + j * SPACING;

          // Create unique key for this eye
          const eyeKey = `${i}-${j}`;

          // Calculate target position (where the eye wants to look)
          const dx = mouseX - eyeCenterX;
          const dy = mouseY - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.min(
            Math.sqrt(dx * dx + dy * dy),
            EYE_RADIUS - IRIS_RADIUS - 5
          );

          const targetPupilX = eyeCenterX + Math.cos(angle) * distance;
          const targetPupilY = eyeCenterY + Math.sin(angle) * distance;

          // Get or initialize current position
          let currentPos = eyePositions.get(eyeKey);
          if (!currentPos) {
            currentPos = { x: eyeCenterX, y: eyeCenterY };
            eyePositions.set(eyeKey, currentPos);
          }

          // Interpolate current position toward target (creates lag effect)
          currentPos.x += (targetPupilX - currentPos.x) * LAG_FACTOR;
          currentPos.y += (targetPupilY - currentPos.y) * LAG_FACTOR;

          const pupilX = currentPos.x;
          const pupilY = currentPos.y;

          // 1. Draw Sclera (White part) with 3D shading
          const scleraGradient = ctx.createRadialGradient(
            eyeCenterX - 5,
            eyeCenterY - 5,
            EYE_RADIUS * 0.3,
            eyeCenterX,
            eyeCenterY,
            EYE_RADIUS
          );
          scleraGradient.addColorStop(0, "#ffffff");
          scleraGradient.addColorStop(0.9, "#d4d4d4");
          scleraGradient.addColorStop(1, "#a0a0a0");

          ctx.beginPath();
          ctx.arc(eyeCenterX, eyeCenterY, EYE_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = scleraGradient;
          ctx.fill();

          // 2. Draw Iris
          const irisGradient = ctx.createRadialGradient(
            pupilX,
            pupilY,
            PUPIL_RADIUS * 0.5,
            pupilX,
            pupilY,
            IRIS_RADIUS
          );
          irisGradient.addColorStop(0, "#60a5fa"); // Inner Blue
          irisGradient.addColorStop(1, "#1d4ed8"); // Outer Dark Blue

          ctx.beginPath();
          ctx.arc(pupilX, pupilY, IRIS_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = irisGradient;
          ctx.fill();

          // Iris Border
          ctx.strokeStyle = "rgba(0,0,0,0.1)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // 3. Draw Pupil
          ctx.beginPath();
          ctx.arc(pupilX, pupilY, PUPIL_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = "#0f172a";
          ctx.fill();

          // 4. Specular Highlight (Reflection)
          // Fixed position relative to eye center to mimic stationary light source
          ctx.beginPath();
          ctx.arc(
            eyeCenterX + LIGHT_OFFSET_X,
            eyeCenterY + LIGHT_OFFSET_Y,
            5,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Initial boot
    handleResize();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

export default App;
