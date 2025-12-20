
import React from 'react';
import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { MarbleSlide } from './MarbleSlide';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        [key: string]: any;
      }
    }
  }
}

interface SceneProps {
  camPos: { x: number; y: number; z: number };
  lookAtY: number;
}

export const Scene: React.FC<SceneProps> = ({ camPos, lookAtY }) => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[30, 40, 30]} intensity={800} color="#4361EE" />
      <pointLight position={[-30, 20, -20]} intensity={700} color="#F72585" />
      <Environment preset="night" />
      <MarbleSlide camPos={camPos} lookAtY={lookAtY} />
    </>
  );
};
