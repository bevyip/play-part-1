import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, ThreeElements } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        [key: string]: any;
      }
    }
  }
}

gsap.registerPlugin(ScrollTrigger);

interface MarbleSlideProps {
  camPos: { x: number; y: number; z: number };
  lookAtY: number;
}

export const MarbleSlide: React.FC<MarbleSlideProps> = ({
  camPos,
  lookAtY,
}) => {
  const marbleRef = useRef<THREE.Mesh>(null);
  const scrollProgress = useRef({ value: 0, lastValue: 0 });

  // Slide Geometry Constants
  const slideInnerRadius = 1.25;
  const slideThickness = 0.15;
  const slideHeight = 40;
  const slideRadius = 8.5;
  const slideTurns = 4.125;

  // Increased marble size from 0.6 to 1.1 for a more prominent look
  const marbleRadius = 1.1;

  // Spiral curve logic
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 200;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * slideTurns;
      const x = Math.cos(angle) * slideRadius;
      const z = Math.sin(angle) * slideRadius;
      const y = slideHeight / 2 - t * slideHeight;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [slideHeight, slideRadius, slideTurns]);

  const slideGeometry = useMemo(() => {
    const segments = 300;
    const radialSegments = 32;
    const vertices: number[] = [];
    const indices: number[] = [];
    const normals: number[] = [];

    const getFrame = (t: number) => {
      const tangent = curve.getTangentAt(t).normalize();
      const worldUp = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3()
        .crossVectors(tangent, worldUp)
        .normalize();
      const up = new THREE.Vector3().crossVectors(right, tangent).normalize();
      return { right, up };
    };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = curve.getPointAt(t);
      const { right, up } = getFrame(t);
      for (let j = 0; j <= radialSegments; j++) {
        // Create the bottom semi-circle for the slide
        const theta = Math.PI + (j / radialSegments) * Math.PI;
        const iv = p
          .clone()
          .add(right.clone().multiplyScalar(Math.cos(theta) * slideInnerRadius))
          .add(up.clone().multiplyScalar(Math.sin(theta) * slideInnerRadius));
        const ov = p
          .clone()
          .add(
            right
              .clone()
              .multiplyScalar(
                Math.cos(theta) * (slideInnerRadius + slideThickness)
              )
          )
          .add(
            up
              .clone()
              .multiplyScalar(
                Math.sin(theta) * (slideInnerRadius + slideThickness)
              )
          );
        vertices.push(iv.x, iv.y, iv.z, ov.x, ov.y, ov.z);
        const n = iv.clone().sub(p).normalize();
        normals.push(n.x, n.y, n.z, n.x, n.y, n.z);
      }
    }

    const stride = (radialSegments + 1) * 2;
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const i0 = i * stride + j * 2;
        const i1 = i0 + 2;
        const i2 = (i + 1) * stride + j * 2;
        const i3 = i2 + 2;
        indices.push(
          i0,
          i2,
          i1,
          i1,
          i2,
          i3,
          i0 + 1,
          i1 + 1,
          i2 + 1,
          i1 + 1,
          i3 + 1,
          i2 + 1
        );
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geo.setIndex(indices);
    return geo;
  }, [curve, slideInnerRadius]);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        gsap.to(scrollProgress.current, {
          value: self.progress,
          duration: 0.1,
          overwrite: "auto",
        });
      },
    });
    return () => trigger.kill();
  }, []);

  useFrame((state) => {
    state.camera.position.set(camPos.x, camPos.y, camPos.z);
    state.camera.lookAt(0, lookAtY, 0);

    if (!marbleRef.current) return;

    const currentP = scrollProgress.current.value;
    const delta = currentP - scrollProgress.current.lastValue;
    scrollProgress.current.lastValue = currentP;

    const point = curve.getPointAt(currentP);
    const tangent = curve.getTangentAt(currentP).normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3()
      .crossVectors(tangent, worldUp)
      .normalize();
    const up = new THREE.Vector3().crossVectors(right, tangent).normalize();

    // Position the marble so it touches the bottom of the slide
    const marbleOffset = -slideInnerRadius + marbleRadius;
    const marblePos = point
      .clone()
      .add(up.clone().multiplyScalar(marbleOffset));
    marbleRef.current.position.copy(marblePos);

    // Add some rotation based on movement for a "rolling" effect
    const rollSpeed = 20;
    marbleRef.current.rotation.x += delta * rollSpeed;
    marbleRef.current.rotation.z += delta * rollSpeed * 0.5;
  });

  return (
    <group>
      {/* Futuristic Glass Slide */}
      <mesh geometry={slideGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#1a0033"
          transparent={true}
          opacity={0.65}
          roughness={0.01}
          metalness={0.2}
          transmission={1.0}
          ior={1.6}
          thickness={3.0}
          attenuationColor="#ff00ff"
          attenuationDistance={1.5}
          clearcoat={1.0}
          envMapIntensity={4.0}
          emissive="#4b0082"
          emissiveIntensity={2.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bright Saturated Glowing Marble */}
      <mesh ref={marbleRef} castShadow>
        <sphereGeometry args={[marbleRadius, 48, 48]} />
        <meshPhysicalMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={2.5}
          roughness={0.02}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          envMapIntensity={5}
        />
        {/* Intensified point light to make the marble feel "lit up" */}
        <pointLight
          intensity={80}
          distance={20}
          color="#00FFFF"
          position={[0, 0, 0]}
        />
      </mesh>
    </group>
  );
};
