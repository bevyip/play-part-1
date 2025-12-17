import React, { useRef, useEffect, useCallback } from "react";

interface PixelTrailProps {
  accentColor: string;
  cellSize: number;
  fadeSpeed: number;
}

interface ActiveCell {
  x: number;
  y: number;
  opacity: number;
  hoverTime: number;
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  accentColor = "#00f2ff",
  cellSize = 20,
  fadeSpeed = 0.02,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeCellsRef = useRef<Map<string, ActiveCell>>(new Map());
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCellCoords = (mouseX: number, mouseY: number) => {
    return {
      cx: Math.floor(mouseX / cellSize),
      cy: Math.floor(mouseY / cellSize),
    };
  };

  const activateCell = useCallback(
    (
      cx: number,
      cy: number,
      boost: number = 0,
      initialOpacity: number = 0.6
    ) => {
      const key = `${cx}-${cy}`;
      const existing = activeCellsRef.current.get(key);

      activeCellsRef.current.set(key, {
        x: cx,
        y: cy,
        opacity: Math.min(
          1.0,
          (existing?.opacity || 0) + initialOpacity + boost
        ),
        hoverTime: existing ? existing.hoverTime + 1 : 1,
      });
    },
    [cellSize]
  );

  const activateBrush = useCallback(
    (cx: number, cy: number, boost: number = 0) => {
      // 2x2 cluster for a refined trail size
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          activateCell(cx + i, cy + j, boost, 0.5);
        }
      }
    },
    [activateCell]
  );

  const interpolateLine = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let currX = x0;
    let currY = y0;

    // 800 steps for long smooth strokes
    const maxSteps = 800;
    let count = 0;

    while (count < maxSteps) {
      const { cx, cy } = getCellCoords(currX, currY);
      activateBrush(cx, cy);

      if (Math.abs(currX - x1) < 1 && Math.abs(currY - y1) < 1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        currX += sx;
      }
      if (e2 < dx) {
        err += dx;
        currY += sy;
      }
      count++;
    }
  };

  const handlePointerInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (lastPosRef.current) {
      interpolateLine(lastPosRef.current.x, lastPosRef.current.y, x, y);
    } else {
      const { cx, cy } = getCellCoords(x, y);
      activateBrush(cx, cy);
    }

    lastPosRef.current = { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerInteraction(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handlePointerInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      "touches" in e
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { cx, cy } = getCellCoords(x, y);

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        activateCell(cx + i, cy + j, 0.4, 0.4);
      }
    }
  };

  const handleMouseLeave = () => {
    lastPosRef.current = null;
  };

  const hexToRgb = (hex: string) => {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 0.5;

      if (cellSize >= 5) {
        for (let x = 0; x <= canvas.width; x += cellSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += cellSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      const rgb = hexToRgb(accentColor);

      activeCellsRef.current.forEach((cell, key) => {
        cell.opacity -= fadeSpeed;

        if (cell.opacity <= 0) {
          activeCellsRef.current.delete(key);
          return;
        }

        const xPos = cell.x * cellSize;
        const yPos = cell.y * cellSize;

        const glowRadius = cellSize * 2.0;
        const centerX = xPos + cellSize / 2;
        const centerY = yPos + cellSize / 2;

        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowRadius
        );

        gradient.addColorStop(0, `rgba(${rgb}, ${cell.opacity * 0.2})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          centerX - glowRadius,
          centerY - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );

        ctx.fillStyle = `rgba(${rgb}, ${cell.opacity})`;
        const padding = 1;
        ctx.fillRect(
          xPos + padding,
          yPos + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cellSize, accentColor, fadeSpeed]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      style={{ touchAction: "none" }}
      className="block w-full h-full cursor-crosshair bg-[#050505]"
    />
  );
};

export default PixelTrail;
