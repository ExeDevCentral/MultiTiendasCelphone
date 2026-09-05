import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { depthVertexShader, depthFragmentShader } from '../shaders/depthPhotoShader';
import { subscribeToOrientation } from '../utils/gyroscope';

function createFallbackDepthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.7, '#888888');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function Photo3DMesh({
  photoUrl,
  depthMapUrl,
  displacementScale = 0.38,
}) {
  const groupRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });
  const hasGyroscope = useRef(false);

  // Carga reactiva de textura de color
  const colorMap = useLoader(THREE.TextureLoader, photoUrl);
  const fallbackDepth = useMemo(() => createFallbackDepthTexture(), []);

  // Carga o fallback de depth map
  const depthMap = useMemo(() => {
    if (!depthMapUrl) return fallbackDepth;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const tex = loader.load(depthMapUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [depthMapUrl, fallbackDepth]);

  useEffect(() => {
    if (colorMap) {
      colorMap.generateMipmaps = true;
      colorMap.minFilter = THREE.LinearMipmapLinearFilter;
      colorMap.magFilter = THREE.LinearFilter;
      colorMap.wrapS = THREE.ClampToEdgeWrapping;
      colorMap.wrapT = THREE.ClampToEdgeWrapping;
      colorMap.needsUpdate = true;
    }
  }, [colorMap]);

  // Listener de Giroscopio Móvil (Inclinación física en smartphone)
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.beta === null || e.gamma === null) return;
      hasGyroscope.current = true;
      
      // Normalizamos beta (vertical) y gamma (horizontal)
      const pitch = THREE.MathUtils.clamp((e.beta - 45) * 0.008, -0.25, 0.25);
      const roll = THREE.MathUtils.clamp(e.gamma * 0.008, -0.3, 0.3);

      targetRotation.current.x = pitch;
      targetRotation.current.y = roll;
    };

    const unsubscribe = subscribeToOrientation(handleOrientation);
    return () => unsubscribe();
  }, []);

  // Animación suave inercial en cada frame (Damping / LERP)
  useFrame(() => {
    if (hasGyroscope.current && groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.08
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.08
      );
    }
  });

  const { width, height } = useMemo(() => {
    const aspect = colorMap.image ? colorMap.image.width / colorMap.image.height : 1;
    const baseSize = 3.0;
    return {
      width: aspect >= 1 ? baseSize : baseSize * aspect,
      height: aspect >= 1 ? baseSize / aspect : baseSize,
    };
  }, [colorMap]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: colorMap },
      uDepthMap: { value: depthMap },
      uDisplacementScale: { value: displacementScale },
      uEdgeFade: { value: 0.018 },
    }),
    [colorMap, depthMap, displacementScale]
  );

  return (
    <>
      <ambientLight intensity={1.2} color="#faf7f2" />
      <directionalLight position={[2, 3, 4]} intensity={0.7} color="#fceddc" />
      <directionalLight position={[-2, -1, 2]} intensity={0.35} color="#e5e0d8" />

      {/* OrbitControls con rango estrictamente acotado */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.06}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 2 - 0.28}
        maxPolarAngle={Math.PI / 2 + 0.28}
        minAzimuthAngle={-0.35}
        maxAzimuthAngle={0.35}
      />

      <group ref={groupRef}>
        <mesh>
          <planeGeometry args={[width, height, 64, 64]} />
          <shaderMaterial
            vertexShader={depthVertexShader}
            fragmentShader={depthFragmentShader}
            uniforms={uniforms}
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}
