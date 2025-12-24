import React, { useEffect, useState, useRef } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Program,
  Mesh,
  Texture,
} from "ogl";
import { POLAROID_IMAGES } from "./constants";

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uProgress; 
uniform vec3 uRotationAxis;

varying vec2 vUv;

#define PI 3.141592653589793238

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float quinticOut(float t) {
    return 1.0 - pow(1.0 - t, 5.0);
}

void main() {
  vUv = uv;
  
  // Normalized diagonal gradient (0.0 to 1.0)
  // This ensures the top-right corner (uv.x=1, uv.y=1) is the last to "land"
  float offset = (uv.x + uv.y) * 0.5;
  
  // Progress range is expanded so trailing corners always reach 1.0 (fully flat)
  float localProgress = clamp(uProgress * 2.0 - offset, 0.0, 1.0);
  
  // Angle goes from PI (back) to 0.0 (front)
  float angle = (1.0 - quinticOut(localProgress)) * PI;
  
  vec3 newpos = rotate(position, uRotationAxis, angle);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tMap;
uniform float uOpacity;
uniform float uHasTexture;
varying vec2 vUv;

void main() {
  // Classic Polaroid frame ratios
  float borderX = 0.05;
  float borderTop = 0.05;
  float borderBottom = 0.18;

  bool isBorder = vUv.x < borderX || vUv.x > (1.0 - borderX) || 
                  vUv.y < borderBottom || vUv.y > (1.0 - borderTop);
  
  vec3 finalColor;
  
  if (isBorder) {
    finalColor = vec3(0.97, 0.97, 0.98); 
  } else {
    vec2 innerUv = vec2(
      (vUv.x - borderX) / (1.0 - borderX * 2.0),
      (vUv.y - borderBottom) / (1.0 - borderBottom - borderTop)
    );
    vec4 tex = texture2D(tMap, innerUv);
    finalColor = mix(vec3(0.04, 0.04, 0.05), tex.rgb, uHasTexture);
  }
  
  gl_FragColor = vec4(finalColor, uOpacity);
}
`;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const engineRef = useRef<{
    renderer: Renderer;
    scene: Transform;
    camera: Camera;
    meshes: Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    const gl = renderer.gl;
    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 5;
    const scene = new Transform();

    const geometry = new Plane(gl, {
      width: 1,
      height: 1,
      widthSegments: 80,
      heightSegments: 80,
    });

    const sortedImages = [...POLAROID_IMAGES].sort(
      (a, b) => a.zIndex - b.zIndex
    );

    const meshes = sortedImages.map((imgData) => {
      const texture = new Texture(gl, { generateMipmaps: false });
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          tMap: { value: texture },
          uProgress: { value: 0 },
          uOpacity: { value: 0 },
          uHasTexture: { value: 0 },
          uRotationAxis: { value: [0.35, 1, 0.1] },
        },
        transparent: true,
        cullFace: false,
      });

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imgData.url;
      image.onload = () => {
        texture.image = image;
        program.uniforms.uHasTexture.value = 1.0;
      };

      const mesh = new Mesh(gl, { geometry, program });
      mesh.name = imgData.id;
      mesh.setParent(scene);
      return mesh;
    });

    engineRef.current = { renderer, scene, camera, meshes };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    let rafId: number;
    const update = () => {
      rafId = requestAnimationFrame(update);
      renderer.render({ scene, camera });
    };
    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const smoothProgress = (t: number) => t * t * (3 - 2 * t);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? scrollY / totalHeight : 0;
      setScrollProgress(progress);

      if (!engineRef.current) return;
      const { camera, meshes } = engineRef.current;

      const fov = (camera.fov * Math.PI) / 180;
      const vHeight = 2 * Math.tan(fov / 2) * camera.position.z;
      const vWidth = vHeight * camera.aspect;

      // Detect mobile and apply centering factor
      const isMobile = window.innerWidth < 768;
      // On mobile, reduce spread by 50% to bring images closer to center
      // This maintains relative alignment while centering the layout
      const mobileCenteringFactor = isMobile ? 0.5 : 1.0;

      meshes.forEach((mesh) => {
        const img = POLAROID_IMAGES.find((i) => i.id === mesh.name);
        if (!img) return;

        const idx = POLAROID_IMAGES.indexOf(img);
        // We delay the image start to 0.1 to let the "Scroll" text fade out completely first
        // Reduced scroll distance by 20% - images appear faster
        const start = 0.1 + (idx / POLAROID_IMAGES.length) * 0.32; // 0.4 * 0.8 = 0.32
        const end = start + 0.32; // 0.4 * 0.8 = 0.32
        let itemProgress = Math.max(
          0,
          Math.min(1, (progress - start) / (end - start))
        );

        mesh.program.uniforms.uProgress.value = itemProgress;
        mesh.program.uniforms.uOpacity.value = Math.min(1, itemProgress * 10);

        // Use original percentages - they will scale proportionally with viewport
        const leftPercent = parseFloat(img.left);
        const topPercent = parseFloat(img.top);
        const widthPercent = parseFloat(img.width);

        // Calculate positions relative to center (50%) - maintains relative alignment
        // On mobile, reduce spread by applying centering factor
        const centerOffsetX = (leftPercent - 50) * mobileCenteringFactor;
        const centerOffsetY = (topPercent - 50) * mobileCenteringFactor;
        const adjustedLeftPercent = 50 + centerOffsetX;
        const adjustedTopPercent = 50 + centerOffsetY;

        // Calculate positions using adjusted percentages
        const targetX = (adjustedLeftPercent / 100 - 0.5) * vWidth;
        const targetY = (0.5 - adjustedTopPercent / 100) * vHeight;
        const targetRotZ = (parseFloat(img.rotation) * Math.PI) / 180;

        const isLandscape = img.id.startsWith("landscape");
        const aspect = isLandscape ? 1.4 : 0.78;
        // Scale factor - only apply size reduction on mobile
        const imageScaleFactor = isMobile ? 0.5 : 1.0; // 0.5 = 50% on mobile, 1.0 = full size on desktop
        // Scale width proportionally with viewport
        const widthScale = (widthPercent / 100) * vWidth * imageScaleFactor;
        const heightScale = widthScale / aspect;

        const ease = smoothProgress(itemProgress);

        mesh.position.set(targetX * ease, targetY * ease, img.zIndex / 500);
        mesh.rotation.z = targetRotZ * ease;

        const currentW = 0.0001 + (widthScale - 0.0001) * ease;
        const currentH = 0.0001 + (heightScale - 0.0001) * ease;
        mesh.scale.set(currentW, currentH, 1);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#000] overflow-x-hidden">
      <div className="relative w-full h-[800vh] max-w-full">
        <canvas ref={canvasRef} className="max-w-full" />

        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60 uppercase tracking-[1em] text-[12px] pointer-events-none text-center"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 12),
            transform: `translate(-50%, -50%) scale(${
              1 + scrollProgress * 0.5
            })`,
          }}
        >
          Scroll
        </div>
      </div>
    </div>
  );
};

export default App;
