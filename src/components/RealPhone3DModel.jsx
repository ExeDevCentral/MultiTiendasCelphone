'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Ultra-Realistic 3D Smartphone
function PhoneChassis({
  colorHex = '#c5a880',
  autoRotate = false,
  isScreenOn = true,
}) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Color variations for titanium frame vs rear panel
  const titaniumColor = useMemo(() => new THREE.Color(colorHex), [colorHex]);
  const frameDarkColor = useMemo(() => new THREE.Color(colorHex).multiplyScalar(0.85), [colorHex]);
  const highlightRingColor = useMemo(() => new THREE.Color(colorHex).multiplyScalar(1.15), [colorHex]);

  // Materials
  const titaniumFrameMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: titaniumColor,
      metalness: 0.95,
      roughness: 0.22,
      envMapIntensity: 2.0,
    });
  }, [titaniumColor]);

  const ceramicBackMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: titaniumColor,
      roughness: 0.38,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      reflectivity: 0.5,
    });
  }, [titaniumColor]);

  const glossyCameraIslandMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: frameDarkColor,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.15,
      thickness: 0.05,
    });
  }, [frameDarkColor]);

  const lensBezelMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: highlightRingColor,
      metalness: 0.98,
      roughness: 0.18,
    });
  }, [highlightRingColor]);

  const sapphireLensMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#03050c'),
      roughness: 0.02,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.98,
    });
  }, []);

  const glassScreenFrontMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#07090e'),
      roughness: 0.02,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.95,
    });
  }, []);

  // Procedural OLED Wallpaper Texture on Canvas
  const screenTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Vibrant Luxury Apple OLED Wallpaper
    const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
    grad.addColorStop(0, '#060B18');
    grad.addColorStop(0.3, '#102244');
    grad.addColorStop(0.65, '#2A1838');
    grad.addColorStop(1, '#080C14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 2048);

    // Glowing vibrant liquid titanium aurora
    ctx.save();
    ctx.filter = 'blur(60px)';
    ctx.fillStyle = colorHex;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(512, 1000, 420, 560, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Vibrant secondary sapphire core glow
    ctx.fillStyle = '#0071E3';
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(450, 1150, 320, 420, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Status bar: Time
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 155px -apple-system, "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('09:41', 512, 390);

    // Date
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.font = '500 48px -apple-system, "Inter", sans-serif';
    ctx.fillText('Martes, 10 de Octubre', 512, 475);

    // Dynamic Island
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(512 - 130, 95, 260, 75, 38);
    ctx.fill();

    // Subtle front camera lens reflection inside Island
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(512 + 65, 132, 16, 0, Math.PI * 2);
    ctx.fill();

    // CelStore Atelier Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px -apple-system, "Space Grotesk", sans-serif';
    ctx.fillText('CELSTORE', 512, 1260);
    ctx.fillStyle = '#93C5FD';
    ctx.font = '700 32px monospace';
    ctx.fillText('PRECISION 3D ATELIER', 512, 1320);

    // Bottom Lock Screen Icons
    // Flashlight & Camera circular pills
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(140, 1860, 56, 0, Math.PI * 2);
    ctx.arc(1024 - 140, 1860, 56, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Home Indicator Bar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(512 - 160, 1970, 320, 16, 8);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [colorHex]);

  return (
    <group ref={groupRef} dispose={null} rotation={[0, 0.42, 0]}>
      {/* 1. UNIBODY TITANIUM CHASSIS FRAME */}
      <RoundedBox args={[1.68, 3.48, 0.17]} radius={0.2} smoothness={10}>
        <primitive object={titaniumFrameMat} attach="material" />
      </RoundedBox>

      {/* 2. REAR MATTE CERAMIC PANEL */}
      <mesh position={[0, 0, -0.088]}>
        <planeGeometry args={[1.64, 3.44]} />
        <primitive object={ceramicBackMat} attach="material" />
      </mesh>

      {/* Back Brand Minimalist Emblem */}
      <mesh position={[0, 0, -0.089]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.13, 32]} />
        <meshStandardMaterial
          color={highlightRingColor}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* 3. FRONT OLED SCREEN (UNOBSTRUCTED, CRISP & LUMINOUS) */}
      <mesh position={[0, 0, 0.088]}>
        <planeGeometry args={[1.62, 3.42]} />
        {screenTexture && isScreenOn ? (
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        ) : (
          <primitive object={glassScreenFrontMat} attach="material" />
        )}
      </mesh>

      {/* 4. REAR CAMERA ISLAND PLATE */}
      <group position={[-0.43, 1.15, -0.098]}>
        {/* Rounded Glass Camera Base Plateau */}
        <RoundedBox args={[0.74, 0.76, 0.04]} radius={0.14} smoothness={8}>
          <primitive object={glossyCameraIslandMat} attach="material" />
        </RoundedBox>

        {/* Triple Camera Lenses */}
        {/* Lens 1 (Top Left) */}
        <group position={[-0.17, 0.18, -0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
            <primitive object={lensBezelMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.015, 32]} />
            <primitive object={sapphireLensMat} attach="material" />
          </mesh>
        </group>

        {/* Lens 2 (Bottom Left) */}
        <group position={[-0.17, -0.18, -0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
            <primitive object={lensBezelMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.015, 32]} />
            <primitive object={sapphireLensMat} attach="material" />
          </mesh>
        </group>

        {/* Lens 3 (Right Center) */}
        <group position={[0.18, 0, -0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
            <primitive object={lensBezelMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.015, 32]} />
            <primitive object={sapphireLensMat} attach="material" />
          </mesh>
        </group>

        {/* True Tone Dual Flash */}
        <mesh position={[0.18, 0.22, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 20]} />
          <meshStandardMaterial color="#fff4de" emissive="#ffe19c" emissiveIntensity={0.8} />
        </mesh>

        {/* LiDAR Scanner Sensor */}
        <mesh position={[0.18, -0.22, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 20]} />
          <meshStandardMaterial color="#111318" roughness={0.9} />
        </mesh>
      </group>

      {/* 5. PHYSICAL TITANIUM HARDWARE BUTTONS */}
      {/* Right Power Button */}
      <mesh position={[0.85, 0.65, 0]}>
        <boxGeometry args={[0.025, 0.4, 0.05]} />
        <primitive object={titaniumFrameMat} attach="material" />
      </mesh>

      {/* Left Action Button */}
      <mesh position={[-0.85, 1.05, 0]}>
        <boxGeometry args={[0.025, 0.15, 0.05]} />
        <primitive object={titaniumFrameMat} attach="material" />
      </mesh>

      {/* Left Volume Up / Down Buttons */}
      <mesh position={[-0.85, 0.72, 0]}>
        <boxGeometry args={[0.025, 0.28, 0.05]} />
        <primitive object={titaniumFrameMat} attach="material" />
      </mesh>
      <mesh position={[-0.85, 0.35, 0]}>
        <boxGeometry args={[0.025, 0.28, 0.05]} />
        <primitive object={titaniumFrameMat} attach="material" />
      </mesh>

      {/* Bottom USB-C Port Cutout */}
      <mesh position={[0, -1.74, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

export function RealPhone3DViewer({
  productName = 'iPhone 16 Pro Max',
  activeColorHex = '#c5a880',
  autoRotate = false,
  onResetView,
}) {
  const controlsRef = useRef();

  return (
    <Canvas
      camera={{ position: [0, 0, 4.3], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
    >
      <ambientLight intensity={1.8} />

      {/* Studio Lighting Rig */}
      <directionalLight position={[4, 6, 5]} intensity={3.2} color="#FFFFFF" />
      <directionalLight position={[-4, 4, 3]} intensity={2.5} color="#F0F4FF" />
      <directionalLight position={[0, -3, 3]} intensity={1.2} color="#FFFFFF" />
      <directionalLight position={[0, 6, -5]} intensity={3.5} color="#FFFFFF" />
      <pointLight position={[3, -2, 2]} intensity={1.2} color="#FFE6CC" />
      <pointLight position={[-3, 2, -2]} intensity={1.5} color="#D6E4FF" />

      {/* Phone Mesh */}
      <PhoneChassis
        colorHex={activeColorHex}
        autoRotate={autoRotate}
      />

      {/* Orbit Controls with full Zoom and Pan */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.8}
        maxDistance={7.5}
        dampingFactor={0.08}
        rotateSpeed={0.8}
        zoomSpeed={1.2}
      />
    </Canvas>
  );
}
