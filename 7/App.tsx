
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      [key: string]: any;
    }
  }
}

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Base camera values: x: 31.5, y: 47.0, z: 40.5
  // On mobile, we multiply the position to move the camera further away while maintaining the angle.
  const multiplier = isMobile ? 1.4 : 1.0;
  const camPos = { 
    x: 31.5 * multiplier, 
    y: 47.0 * multiplier, 
    z: 40.5 * multiplier 
  };
  const lookAtY = -1.0;

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#000000]">
      {/* 3D Scene Layer */}
      <div className="fixed inset-0 pointer-events-none">
        <Canvas
          shadows
          camera={{ position: [camPos.x, camPos.y, camPos.z], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full"
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <Scene camPos={camPos} lookAtY={lookAtY} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI & Scroll Content Layer */}
      <UIOverlay />
    </div>
  );
};

export default App;
