import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FashionItem } from "../types";

const Group = "group" as any;
const Mesh = "mesh" as any;
const PlaneGeometry = "planeGeometry" as any;
const Primitive = "primitive" as any;

// Shader for rounded corners
const roundedCornerShader = {
  uniforms: {
    uTexture: { value: null },
    uRadius: { value: 0.15 }, // Border radius (0-0.5)
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uRadius;
    varying vec2 vUv;
    
    float roundedBoxSDF(vec2 centerPos, vec2 size, float radius) {
      return length(max(abs(centerPos) - size + radius, 0.0)) - radius;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 size = vec2(0.5, 0.5);
      vec2 centerPos = uv - 0.5;
      
      float distance = roundedBoxSDF(centerPos, size, uRadius);
      float alpha = 1.0 - smoothstep(-0.01, 0.01, distance);
      
      vec4 texColor = texture2D(uTexture, uv);
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
    }
  `,
};

interface SphericalItemProps {
  item: FashionItem;
  position: [number, number, number];
  onClick: (item: FashionItem) => void;
  onHoverChange: (hovered: boolean) => void;
}

const SphericalItem: React.FC<SphericalItemProps> = ({
  item,
  position,
  onClick,
  onHoverChange,
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(item.imageUrl);

  // Create material with rounded corners
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uRadius: { value: 0.05 }, // Border radius (0-0.5)
      },
      vertexShader: roundedCornerShader.vertexShader,
      fragmentShader: roundedCornerShader.fragmentShader,
      transparent: true,
    });
    return mat;
  }, [texture]);

  // Ensure the item always faces directly away from the center of the sphere
  // This uses useLayoutEffect to ensure the rotation is applied before the first render
  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(0, 0, 0);
      // lookAt points the +Z axis towards the target.
      // To make the image face OUTWARD, we rotate the group 180 degrees around Y.
      groupRef.current.rotateY(Math.PI);
    }
  }, [position]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle scale for hover
      const targetScale = hovered ? 1.15 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHoverChange(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHoverChange(false);
  };

  return (
    <Group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(item);
      }}
    >
      {/* 
        The Image component displays the fashion item with rounded corners.
        Using a custom shader material to create border radius effect.
      */}
      <Group scale={[2.2, 2.8, 1]}>
        <Mesh>
          <PlaneGeometry args={[1, 1]} />
          <Primitive object={material} attach="material" />
        </Mesh>
      </Group>

      {hovered && (
        <Html
          position={[0, -1.8, 0]}
          center
          distanceFactor={12}
          className="pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/20 whitespace-nowrap animate-in fade-in zoom-in duration-200">
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
              {item.title}
            </span>
          </div>
        </Html>
      )}
    </Group>
  );
};

export default SphericalItem;
