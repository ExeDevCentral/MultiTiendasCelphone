'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, Sparkles, Smartphone, RefreshCw, Palette, Eye } from 'lucide-react';

export const PhoneViewer3D = ({
  modelType = 'modern_flagship', // 'modern_flagship' | 'vintage_bar' | 'vintage_flip'
  selectedColor = { name: 'Titanio Natural', hex: '#9e9689', threeHex: '#8e867b' },
  availableColors = [],
  onColorChange,
  phoneName = 'Smartphone 3D Studio',
  interactive = true,
  height = '480px'
}) => {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [screenMode, setScreenMode] = useState('wallpaper'); // 'wallpaper' | 'camera' | 'retro_snake'
  const [cameraZoomed, setCameraZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  // References to 3D scene objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const phoneGroupRef = useRef(null);
  const bodyMeshRef = useRef(null);
  const screenMeshRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameIdRef = useRef(null);

  // Generate dynamic canvas textures for the phone screen
  const createScreenTexture = (mode, type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (type === 'vintage_bar') {
      // Retro Green/Amber LCD Screen
      ctx.fillStyle = '#8fad78'; // Nokia Green LCD
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22381f';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('NOKIA', 180, 120);

      // Battery & Signal bars
      ctx.fillRect(40, 80, 50, 20);
      ctx.fillRect(420, 80, 50, 20);

      // Snake game graphic on retro screen
      ctx.font = 'bold 44px monospace';
      ctx.fillText('SNAKE II', 160, 340);
      ctx.fillText('Score: 1420', 130, 420);

      // Draw pixelated snake
      ctx.fillRect(150, 520, 40, 40);
      ctx.fillRect(190, 520, 40, 40);
      ctx.fillRect(230, 520, 40, 40);
      ctx.fillRect(230, 560, 40, 40);
      ctx.fillRect(270, 560, 40, 40);
      ctx.fillRect(350, 560, 30, 30); // Food dot

      ctx.font = '28px monospace';
      ctx.fillText('Presiona 5 para jugar', 70, 800);
    } else if (type === 'vintage_flip') {
      // Clamshell screen
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('MOTORAZR', 130, 180);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '32px sans-serif';
      ctx.fillText('12:45 PM', 190, 320);
      ctx.fillText('28 AGOSTO', 170, 380);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 500, 392, 220);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '30px sans-serif';
      ctx.fillText('1 Mensaje Nuevo', 120, 620);
    } else {
      // Modern Flagship OLED Screen
      if (mode === 'camera') {
        // Camera Viewfinder Mode
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(170, 0); ctx.lineTo(170, 1024);
        ctx.moveTo(340, 0); ctx.lineTo(340, 1024);
        ctx.moveTo(0, 340); ctx.lineTo(512, 340);
        ctx.moveTo(0, 680); ctx.lineTo(512, 680);
        ctx.stroke();

        // Focus box
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.strokeRect(180, 400, 150, 150);

        // Header / Footer Camera controls
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('4K • 60 FPS • ProRes Log', 80, 80);

        ctx.fillStyle = '#ff3b30';
        ctx.beginPath();
        ctx.arc(256, 880, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.stroke();
      } else {
        // Luxury Modern Wallpaper with Dynamic Island
        const grad = ctx.createLinearGradient(0, 0, 512, 1024);
        grad.addColorStop(0, '#001a33');
        grad.addColorStop(0.3, '#0f2b48');
        grad.addColorStop(0.7, '#1e1b4b');
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ambient glowing orb
        const radial = ctx.createRadialGradient(256, 400, 10, 256, 400, 220);
        radial.addColorStop(0, 'rgba(41, 151, 255, 0.6)');
        radial.addColorStop(0.6, 'rgba(147, 51, 234, 0.3)');
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, 512, 1024);

        // Clock & Date
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 90px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('09:41', 256, 260);

        ctx.font = '500 28px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Viernes, 28 de Agosto', 256, 160);

        // Dynamic Island at top
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(176, 35, 160, 42, 21);
        ctx.fill();

        // Bottom home bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.roundRect(160, 980, 192, 8, 4);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth > 50 ? mountRef.current.clientWidth : 520;
    const computedHeight = mountRef.current.clientHeight > 50 ? mountRef.current.clientHeight : (parseInt(height, 10) || 520);
    const heightNum = computedHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightNum, 0.1, 1000);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightNum);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const existingCanvas = mountRef.current.querySelector('canvas');
    if (existingCanvas && existingCanvas.parentNode === mountRef.current) {
      mountRef.current.removeChild(existingCanvas);
    }
    mountRef.current.appendChild(renderer.domElement);

    // 4. Studio Lighting de Alta Costura
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainKeyLight.position.set(5, 8, 7);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimChampagneLight = new THREE.DirectionalLight(0xc5a880, 2.5);
    rimChampagneLight.position.set(-6, -4, -5);
    scene.add(rimChampagneLight);

    const bottomFillLight = new THREE.PointLight(0xf5e0c3, 1.2, 20);
    bottomFillLight.position.set(0, -5, 4);
    scene.add(bottomFillLight);

    // 5. Build 3D Model Group
    const phoneGroup = new THREE.Group();
    phoneGroupRef.current = phoneGroup;
    scene.add(phoneGroup);

    // Build Geometry based on modelType
    const colorHex = selectedColor?.threeHex || selectedColor?.hex || '#8e867b';

    if (modelType === 'vintage_bar') {
      // ================= CLASSIC NOKIA / RETRO BAR MODEL =================
      const bodyGeo = new THREE.BoxGeometry(2.4, 5.0, 1.1);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.5,
        metalness: 0.2
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMeshRef.current = bodyMesh;
      phoneGroup.add(bodyMesh);

      // Vintage Screen
      const screenGeo = new THREE.PlaneGeometry(1.8, 1.6);
      const screenTexture = createScreenTexture(screenMode, 'vintage_bar');
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 1.1, 0.56);
      screenMeshRef.current = screenMesh;
      phoneGroup.add(screenMesh);

      // Retro Keypad Buttons
      const keyMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.6 });
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          const keyGeo = new THREE.BoxGeometry(0.45, 0.28, 0.12);
          const keyMesh = new THREE.Mesh(keyGeo, keyMat);
          keyMesh.position.set(-0.6 + c * 0.6, -0.4 - r * 0.45, 0.56);
          phoneGroup.add(keyMesh);
        }
      }

      // Top Antenna Stub
      const antGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.9, 16);
      const antMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
      const antMesh = new THREE.Mesh(antGeo, antMat);
      antMesh.position.set(0.9, 2.8, 0);
      phoneGroup.add(antMesh);

    } else if (modelType === 'vintage_flip') {
      // ================= RAZR FLIP PHONE MODEL =================
      const halfHeight = 2.4;
      const lowerBodyGeo = new THREE.BoxGeometry(2.3, halfHeight, 0.35);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.85,
        roughness: 0.2
      });
      const lowerMesh = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerMesh.position.set(0, -1.2, 0);
      bodyMeshRef.current = lowerMesh;
      phoneGroup.add(lowerMesh);

      // Upper Flip Section (Angled)
      const upperGroup = new THREE.Group();
      upperGroup.position.set(0, 0, 0.15);
      upperGroup.rotation.x = -0.35; // Open angle

      const upperMesh = new THREE.Mesh(lowerBodyGeo, bodyMat);
      upperMesh.position.set(0, 1.2, 0);
      upperGroup.add(upperMesh);

      // Flip screen
      const screenGeo = new THREE.PlaneGeometry(1.7, 1.8);
      const screenTexture = createScreenTexture(screenMode, 'vintage_flip');
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 1.2, 0.19);
      screenMeshRef.current = screenMesh;
      upperGroup.add(screenMesh);

      phoneGroup.add(upperGroup);

    } else {
      // ================= MODERN FLAGSHIP (IPHONE / S25 PRO STYLE) =================
      // Rounded main chassis
      const bodyGeo = new THREE.BoxGeometry(2.65, 5.5, 0.32);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.88,
        roughness: 0.25,
        envMapIntensity: 1.5
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMeshRef.current = bodyMesh;
      phoneGroup.add(bodyMesh);

      // Titanium Bezel Rim
      const rimGeo = new THREE.BoxGeometry(2.7, 5.55, 0.3);
      const rimMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.95,
        roughness: 0.15
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      phoneGroup.add(rimMesh);

      // Front OLED Screen
      const screenGeo = new THREE.PlaneGeometry(2.48, 5.3);
      const screenTexture = createScreenTexture(screenMode, 'modern_flagship');
      const screenMat = new THREE.MeshBasicMaterial({
        map: screenTexture,
        reflectivity: 0.9
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0, 0.165);
      screenMeshRef.current = screenMesh;
      phoneGroup.add(screenMesh);

      // Camera Island Bump (Back Plate)
      const bumpGeo = new THREE.BoxGeometry(1.2, 1.3, 0.12);
      const bumpMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.8,
        roughness: 0.3
      });
      const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
      bumpMesh.position.set(-0.55, 1.85, -0.2);
      phoneGroup.add(bumpMesh);

      // Triple Camera Lenses
      const lensPos = [
        { x: -0.82, y: 2.15 },
        { x: -0.82, y: 1.55 },
        { x: -0.32, y: 1.85 }
      ];

      lensPos.forEach(pos => {
        // Lens Outer Ring
        const ringGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 32);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x1a1a1a,
          metalness: 0.9,
          roughness: 0.1
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(pos.x, pos.y, -0.26);
        phoneGroup.add(ring);

        // Glass Lens Core
        const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 32);
        const lensMat = new THREE.MeshPhysicalMaterial({
          color: 0x051025,
          transmission: 0.9,
          opacity: 1,
          transparent: true,
          roughness: 0.05,
          ior: 1.5
        });
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(pos.x, pos.y, -0.27);
        phoneGroup.add(lens);
      });

      // LiDAR & Flash
      const flashGeo = new THREE.CircleGeometry(0.1, 16);
      const flashMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
      const flash = new THREE.Mesh(flashGeo, flashMat);
      flash.position.set(-0.32, 2.2, -0.27);
      flash.rotation.y = Math.PI;
      phoneGroup.add(flash);

      // Side Action / Power Buttons
      const buttonMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.9 });
      const pwrButton = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.08), buttonMat);
      pwrButton.position.set(1.35, 0.8, 0);
      phoneGroup.add(pwrButton);

      const volUp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.08), buttonMat);
      volUp.position.set(-1.35, 1.1, 0);
      phoneGroup.add(volUp);

      const volDown = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.08), buttonMat);
      volDown.position.set(-1.35, 0.5, 0);
      phoneGroup.add(volDown);
    }

    // Initial slight angle
    phoneGroup.rotation.y = 0.4;
    phoneGroup.rotation.x = 0.1;

    setLoading(false);

    // 6. Animation loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current && phoneGroupRef.current) {
        phoneGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Mouse / Touch Drag Controls
    const handleMouseDown = (e) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !phoneGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      phoneGroupRef.current.rotation.y += deltaX * 0.01;
      phoneGroupRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch events for mobile
    const handleTouchStart = (e) => {
      if (!interactive || e.touches.length === 0) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || !phoneGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      phoneGroupRef.current.rotation.y += deltaX * 0.01;
      phoneGroupRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [modelType]);

  // Update color dynamically when selectedColor changes
  useEffect(() => {
    if (bodyMeshRef.current && selectedColor) {
      const hex = selectedColor.threeHex || selectedColor.hex || '#8e867b';
      bodyMeshRef.current.material.color = new THREE.Color(hex);
    }
  }, [selectedColor]);

  // Update screen texture when screenMode changes
  useEffect(() => {
    if (screenMeshRef.current) {
      const newTex = createScreenTexture(screenMode, modelType);
      screenMeshRef.current.material.map = newTex;
      screenMeshRef.current.material.needsUpdate = true;
    }
  }, [screenMode, modelType]);

  // Handle Zoom Camera Toggle
  const toggleCameraZoom = () => {
    if (!cameraRef.current || !phoneGroupRef.current) return;
    if (cameraZoomed) {
      cameraRef.current.position.set(0, 0, 8.5);
      phoneGroupRef.current.rotation.set(0.1, 0.4, 0);
      setCameraZoomed(false);
    } else {
      // Zoom into camera module on back
      cameraRef.current.position.set(-0.8, 1.8, 4.5);
      phoneGroupRef.current.rotation.set(0.1, Math.PI, 0); // show back
      setCameraZoomed(true);
      setAutoRotate(false);
    }
  };

  const resetView = () => {
    if (cameraRef.current && phoneGroupRef.current) {
      cameraRef.current.position.set(0, 0, 8.5);
      phoneGroupRef.current.rotation.set(0.1, 0.4, 0);
      setCameraZoomed(false);
      setAutoRotate(true);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#131316] border border-[rgba(243,239,230,0.12)] shadow-2xl group select-none">
      {/* Top Floating Info Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0a0a0c]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[rgba(243,239,230,0.16)] text-xs font-medium text-[#f3efe6] pointer-events-auto">
          <Smartphone className="w-3.5 h-3.5 text-[#e4c972]" />
          <span>Visor 3D Interactivo 360°</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full border transition-all text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              autoRotate
                ? 'bg-[rgba(201,162,39,0.20)] border-[#c9a227] text-[#e4c972]'
                : 'bg-[#0a0a0c]/85 border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
            }`}
            title="Auto-rotación"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline">{autoRotate ? 'Girando' : 'Pausado'}</span>
          </button>

          <button
            type="button"
            onClick={resetView}
            className="p-2 rounded-full bg-[#0a0a0c]/85 hover:bg-[#1b1b1f] border border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6] transition-all text-xs cursor-pointer"
            title="Centrar Vista"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing flex items-center justify-center relative"
      />
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0c]/90 backdrop-blur-sm z-20">
          <div className="w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#8b8680] font-mono">Renderizando modelo 3D PBR...</p>
        </div>
      )}

      {/* Interactive Bottom Control Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0c]/90 backdrop-blur-xl p-3 rounded-2xl border border-[rgba(243,239,230,0.12)] shadow-lg">
        {/* Colors Palette */}
        {availableColors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8b8680] uppercase tracking-wider font-semibold flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#8b8680]" />
              Acabado:
            </span>
            <div className="flex items-center gap-1.5">
              {availableColors.map((col, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onColorChange && onColorChange(col)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                    selectedColor?.name === col.name
                      ? 'border-[#c9a227] scale-110 shadow-md ring-2 ring-white/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
            <span className="text-xs text-[#f3efe6] font-medium hidden md:inline ml-1">
              {selectedColor?.name}
            </span>
          </div>
        )}

        {/* Feature Switches */}
        <div className="flex items-center gap-2 ml-auto">
          {modelType === 'modern_flagship' && (
            <>
              <button
                type="button"
                onClick={() => setScreenMode(screenMode === 'camera' ? 'wallpaper' : 'camera')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                  screenMode === 'camera'
                    ? 'bg-[rgba(201,162,39,0.20)] border-[#c9a227] text-[#e4c972]'
                    : 'bg-[#1b1b1f] border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{screenMode === 'camera' ? 'Ver Pantalla' : 'Probar Cámara'}</span>
              </button>

              <button
                type="button"
                onClick={toggleCameraZoom}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraZoomed
                    ? 'bg-[rgba(201,162,39,0.20)] border-[#c9a227] text-[#e4c972]'
                    : 'bg-[#1b1b1f] border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{cameraZoomed ? 'Vista General' : 'Lentes 48MP'}</span>
              </button>
            </>
          )}

          {modelType === 'vintage_bar' && (
            <div className="px-3 py-1 text-xs bg-[rgba(201,162,39,0.10)] border border-[#c9a227]/40 text-[#e4c972] rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Snake II & Pantalla LCD Retro</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
