import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { BouncingBall } from './BouncingBall';

interface SceneProps {
  onExpand?: () => void;
}

export const Scene: React.FC<SceneProps> = ({ onExpand }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      {/* Camera Setup */}
      <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={50} />

      {/* Lighting - Softened for cartoon look on white background */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
      />
      <spotLight position={[-10, 15, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

      {/* The Star of the Show */}
      <BouncingBall onExpand={onExpand} />

      {/* Floor Visuals */}
      <ContactShadows 
        opacity={0.4} 
        scale={20} 
        blur={2.5} 
        far={4} 
        resolution={256} 
        color="#000000" 
      />
      
      {/* Studio environment for soft reflections */}
      <Environment preset="studio" />
    </Canvas>
  );
};