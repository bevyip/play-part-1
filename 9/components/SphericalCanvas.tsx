import React, { useMemo, useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import SphericalItem from "./SphericalItem";
import { FashionItem } from "../types";
import { INITIAL_ITEMS } from "../constants";

const AmbientLight = "ambientLight" as any;
const PointLight = "pointLight" as any;
const Group = "group" as any;

const OrbitControlsComponent = OrbitControls as any;

interface SphericalCanvasProps {
  onItemClick: (item: FashionItem) => void;
  isModalOpen: boolean;
}

const SceneContent: React.FC<
  SphericalCanvasProps & {
    isHoveringAny: boolean;
    setIsHoveringAny: (v: boolean) => void;
  }
> = ({ onItemClick, isModalOpen, isHoveringAny, setIsHoveringAny }) => {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 22;
  const totalItemsCount = 220;

  // Detect mobile and adjust camera/zoom accordingly
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const cameraZ = isMobile ? 70 : 55; // Further away on mobile
  const minDistance = isMobile ? 30 : 30; // Allow closer zoom on mobile
  const maxDistance = isMobile ? 90 : 70; // Adjusted max zoom for mobile

  const itemPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < totalItemsCount; i++) {
      const y = 1 - (i / (totalItemsCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      positions.push([x * radius, y * radius, z * radius]);
    }
    return positions;
  }, [radius, totalItemsCount]);

  const [items, setItems] = useState<FashionItem[]>([]);

  useEffect(() => {
    const generatedItems: FashionItem[] = [];
    for (let i = 0; i < totalItemsCount; i++) {
      const originalItem = INITIAL_ITEMS[i % INITIAL_ITEMS.length];
      // Cycle through local images (1-9)
      const imageIndex = (i % 9) + 1;
      generatedItems.push({
        ...originalItem,
        id: `sph-${i}`,
        imageUrl: `/img/${imageIndex}.jpg`,
      });
    }
    setItems(generatedItems);
  }, [totalItemsCount]);

  useEffect(() => {
    if (isHoveringAny && !isModalOpen) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isHoveringAny, isModalOpen]);

  useFrame((state, delta) => {
    if (groupRef.current && !isModalOpen && !isHoveringAny) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <>
      <AmbientLight intensity={0.4} />
      <PointLight position={[40, 40, 40]} intensity={2.5} color="#ffffff" />
      <PointLight position={[-40, -40, -40]} intensity={1.5} color="#c0d8ff" />

      <Environment preset="night" />

      {/* 
        Nesting Stars inside the PerspectiveCamera ensures they remain fixed 
        relative to the viewer even when rotating the camera with OrbitControls.
      */}
      <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={60}>
        <Stars
          radius={100}
          depth={50}
          count={6000}
          factor={4}
          saturation={0}
          fade
          speed={0}
        />
      </PerspectiveCamera>

      <Suspense fallback={null}>
        <Group ref={groupRef}>
          {items.map((item, idx) => (
            <SphericalItem
              key={item.id}
              item={item}
              position={itemPositions[idx]}
              onClick={onItemClick}
              onHoverChange={setIsHoveringAny}
            />
          ))}
        </Group>
      </Suspense>

      <OrbitControlsComponent
        enableZoom={true}
        enablePan={false}
        minDistance={minDistance}
        maxDistance={maxDistance}
        rotateSpeed={0.5}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

const SphericalCanvas: React.FC<SphericalCanvasProps> = (props) => {
  const [isHoveringAny, setIsHoveringAny] = useState(false);

  return (
    <div className="w-full h-full bg-transparent">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <SceneContent
          {...props}
          isHoveringAny={isHoveringAny}
          setIsHoveringAny={setIsHoveringAny}
        />
      </Canvas>
    </div>
  );
};

export default SphericalCanvas;
