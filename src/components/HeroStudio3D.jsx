'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  RefreshCw,
  Sparkles,
  Layers,
  Camera,
  Cpu,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ArrowRight,
  Sliders,
  Type,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playSpatialOpen, playCartSuccess } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const HeroStudio3D = ({ onNavigate, onOpenDetail }) => {
  const mountRef = useRef(null);
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { products } = useStore();

  // Find flagship product from store or fallback
  const flagshipProduct = useMemo(() => {
    return (
      products.find((p) => p.id === 'prod-iphone-16-pro-max') ||
      products[0] || {
        id: 'prod-iphone-16-pro-max',
        name: 'iPhone 16 Pro Max Atelier Edition',
        brand: 'Apple',
        price: 1399,
        originalPrice: 1499,
        storeId: 'store-celstore-premium',
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80']
      }
    );
  }, [products]);

  // Studio Finishes (Titanium & Atelier metals)
  const titaniumFinishes = [
    {
      id: 'desert',
      name: 'Titanio Desierto',
      colorName: 'Desert Titanium',
      hex: '#c5a880',
      threeHex: 0xbfa37c,
      roughness: 0.22,
      metalness: 0.92,
      desc: 'Tono dorado cálido aeroespacial con acabado satinado suave.'
    },
    {
      id: 'natural',
      name: 'Titanio Natural',
      colorName: 'Natural Titanium',
      hex: '#9e9689',
      threeHex: 0x8f877c,
      roughness: 0.25,
      metalness: 0.95,
      desc: 'El color puro del titanio Grado 5 forjado a alta presión.'
    },
    {
      id: 'black',
      name: 'Titanio Negro Espacial',
      colorName: 'Space Black',
      hex: '#232326',
      threeHex: 0x1b1b1d,
      roughness: 0.2,
      metalness: 0.96,
      desc: 'Capa DLC de carbono diamante ultra resistente a rayaduras.'
    },
    {
      id: 'white',
      name: 'Titanio Blanco Nieve',
      colorName: 'White Titanium',
      hex: '#e2e2e7',
      threeHex: 0xd8d8de,
      roughness: 0.18,
      metalness: 0.9,
      desc: 'Cristal mate texturizado con marco de titanio claro pulido.'
    },
    {
      id: 'atelier_gold',
      name: 'Oro Atelier 24K',
      colorName: 'Limited Edition 24K',
      hex: '#d4af37',
      threeHex: 0xc8a227,
      roughness: 0.15,
      metalness: 0.98,
      desc: 'Edición limitada con electroplateado de oro satinado.'
    }
  ];

  const storageOptions = [
    { size: '256 GB', extraPrice: 0, label: 'Base Atelier' },
    { size: '512 GB', extraPrice: 200, label: 'Pro Creator' },
    { size: '1 TB', extraPrice: 450, label: 'Cinema Master' }
  ];

  // State
  const [selectedFinish, setSelectedFinish] = useState(titaniumFinishes[0]);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0]);
  const [engravingText, setEngravingText] = useState('ATELIER • 2026');
  const [isExploded, setIsExploded] = useState(false);
  const [screenMode, setScreenMode] = useState('wallpaper'); // 'wallpaper' | 'camera'
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [is3DReady, setIs3DReady] = useState(false);

  // References for Three.js
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const phoneGroupRef = useRef(null);
  const keyLightRef = useRef(null);

  // Exploded Layers Refs
  const frontLayerRef = useRef(null);
  const chassisLayerRef = useRef(null);
  const logicBoardLayerRef = useRef(null);
  const batteryLayerRef = useRef(null);
  const cameraLayerRef = useRef(null);
  const backPlateMeshRef = useRef(null);
  const screenMeshRef = useRef(null);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const mouseTargetLightRef = useRef({ x: 5, y: 6 });
  const animFrameRef = useRef(null);
  const explodedProgressRef = useRef(0);

  // Calculate pricing
  const basePrice = flagshipProduct?.price || 1399;
  const totalPrice = basePrice + selectedStorage.extraPrice;
  const monthlyInstallment = (totalPrice / 12).toFixed(2);

  // Generate dynamic canvas textures for the phone screen
  const createScreenCanvasTexture = (mode) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (mode === 'camera') {
      // Professional Viewfinder mode
      ctx.fillStyle = '#07070a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold grid
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(170, 0); ctx.lineTo(170, 1024);
      ctx.moveTo(340, 0); ctx.lineTo(340, 1024);
      ctx.moveTo(0, 340); ctx.lineTo(512, 340);
      ctx.moveTo(0, 680); ctx.lineTo(512, 680);
      ctx.stroke();

      // Golden center bracket
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 3;
      ctx.strokeRect(176, 420, 160, 160);

      // HUD indicators
      ctx.fillStyle = '#f3efe6';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('4K PRORES LOG • 120 FPS', 70, 90);
      ctx.font = '20px monospace';
      ctx.fillStyle = '#c9a227';
      ctx.fillText('ISO 100 • 24mm • F/1.78', 120, 130);

      // Shutter circle
      ctx.fillStyle = '#c9a227';
      ctx.beginPath();
      ctx.arc(256, 880, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#07070a';
      ctx.lineWidth = 6;
      ctx.stroke();
    } else {
      // Luxury OLED Wallpaper
      const grad = ctx.createLinearGradient(0, 0, 512, 1024);
      grad.addColorStop(0, '#040406');
      grad.addColorStop(0.35, '#120f0a');
      grad.addColorStop(0.7, '#241a0d');
      grad.addColorStop(1, '#050508');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Warm radial luxury aura
      const radial = ctx.createRadialGradient(256, 420, 10, 256, 420, 260);
      radial.addColorStop(0, 'rgba(201, 162, 39, 0.45)');
      radial.addColorStop(0.6, 'rgba(228, 201, 114, 0.15)');
      radial.addColorStop(1, 'transparent');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 512, 1024);

      // Time & Date
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 96px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('09:41', 256, 260);

      ctx.font = '500 24px sans-serif';
      ctx.fillStyle = '#c5a880';
      ctx.fillText('CELSTORE ATELIER', 256, 160);

      // Dynamic Island
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(176, 32, 160, 42, 21);
      ctx.fill();

      // Home indicator bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.roundRect(160, 980, 192, 8, 4);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Generate dynamic canvas texture for the back plate with live Laser Engraving
  const createBackPlateTexture = (text, finishHex) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base background color matching the chosen titanium
    ctx.fillStyle = finishHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle satin vignette
    const vignette = ctx.createRadialGradient(256, 512, 100, 256, 512, 500);
    vignette.addColorStop(0, 'rgba(255,255,255,0.06)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Minimalist Luxury Emblem / Apple-Atelier Center Logo
    ctx.fillStyle = 'rgba(243, 239, 230, 0.22)';
    ctx.beginPath();
    ctx.arc(256, 440, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = finishHex;
    ctx.beginPath();
    ctx.arc(264, 436, 26, 0, Math.PI * 2);
    ctx.fill();

    // Laser Engraving Text
    if (text && text.trim().length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '600 28px sans-serif';
      ctx.letterSpacing = '6px';

      // Engraved recessed shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillText(text.trim().toUpperCase(), 256, 752);

      // Engraved highlight edge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillText(text.trim().toUpperCase(), 256, 750);
      ctx.restore();
    }

    // Bottom regulatory micro-typography
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DESIGNED IN CALIFORNIA • ASSEMBLED FOR CELSTORE', 256, 940);
    ctx.fillText('TITANIUM GRADE 5 • MODEL A3106 • IP68', 256, 965);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Helper to create Motherboard PCB texture
  const createPCBTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Dark high-tech substrate
    ctx.fillStyle = '#0b0f14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gold bus traces
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      const startX = 60 + (i % 6) * 70;
      const startY = 150 + Math.floor(i / 6) * 160;
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 40, startY + 40);
      ctx.lineTo(startX + 90, startY + 40);
      ctx.stroke();

      // Gold via dots
      ctx.fillStyle = '#e4c972';
      ctx.beginPath();
      ctx.arc(startX + 90, startY + 40, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // A18 Pro Bionic Central Chip
    ctx.fillStyle = '#141416';
    ctx.fillRect(166, 380, 180, 180);
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 4;
    ctx.strokeRect(166, 380, 180, 180);

    ctx.fillStyle = '#e4c972';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('A18 PRO', 256, 460);

    ctx.fillStyle = '#8b8680';
    ctx.font = '18px monospace';
    ctx.fillText('3nm 6-CORE GPU', 256, 495);
    ctx.fillText('NEURAL ENGINE', 256, 520);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Helper to create MagSafe Battery texture
  const createBatteryTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Black battery cell casing
    ctx.fillStyle = '#111215';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // MagSafe circular copper coil
    ctx.strokeStyle = '#b87333'; // Copper color
    ctx.lineWidth = 8;
    for (let r = 80; r <= 150; r += 16) {
      ctx.beginPath();
      ctx.arc(256, 512, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Center magnet ring
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 512, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Specs
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GRAPHENE HIGH DENSITY CELL', 256, 300);
    ctx.font = '18px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('4,685 mAh • 18.06 Wh • Qi2 WIRELESS', 256, 335);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);
    cameraRef.current = camera;

    // 3. Renderer with high PBR capability
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const goldRimLight = new THREE.DirectionalLight(0xc9a227, 2.6);
    goldRimLight.position.set(-6, -3, -5);
    scene.add(goldRimLight);

    const specularFillLight = new THREE.PointLight(0xe4c972, 1.8, 15);
    specularFillLight.position.set(0, -4, 4);
    scene.add(specularFillLight);

    // 5. Contact Shadow & Studio Floor Reflection Plane
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.4;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Master Phone Group
    const phoneGroup = new THREE.Group();
    phoneGroupRef.current = phoneGroup;
    phoneGroup.position.set(0, 0.2, 0);
    phoneGroup.rotation.y = 0.35;
    phoneGroup.rotation.x = 0.12;
    scene.add(phoneGroup);

    // ==============================================================
    // BUILD EXPLODED LAYERS
    // ==============================================================

    // Layer 1: FRONT OLED DISPLAY MODULE (Moves to Z: +2.2 when exploded)
    const frontGroup = new THREE.Group();
    frontLayerRef.current = frontGroup;
    phoneGroup.add(frontGroup);

    const screenGeo = new THREE.PlaneGeometry(2.55, 5.4);
    const screenTex = createScreenCanvasTexture('wallpaper');
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, 0.17);
    screenMeshRef.current = screenMesh;
    frontGroup.add(screenMesh);

    // Front Glass Bezel Ring
    const frontBezelGeo = new THREE.BoxGeometry(2.68, 5.54, 0.05);
    const frontBezelMat = new THREE.MeshStandardMaterial({
      color: 0x050507,
      roughness: 0.1,
      metalness: 0.9
    });
    const frontBezel = new THREE.Mesh(frontBezelGeo, frontBezelMat);
    frontBezel.position.set(0, 0, 0.15);
    frontGroup.add(frontBezel);

    // Layer 2: TITANIUM GRADE 5 CHASSIS FRAME (Stays at Z: 0)
    const chassisGroup = new THREE.Group();
    chassisLayerRef.current = chassisGroup;
    phoneGroup.add(chassisGroup);

    const frameGeo = new THREE.BoxGeometry(2.72, 5.58, 0.28);
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.threeHex),
      roughness: selectedFinish.roughness,
      metalness: selectedFinish.metalness,
      envMapIntensity: 2.0
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.castShadow = true;
    chassisGroup.add(frameMesh);

    // Side Buttons (Power, Volume, Action Button)
    const btnMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.threeHex),
      metalness: 0.95,
      roughness: 0.15
    });

    const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.08), btnMat);
    pwrBtn.position.set(1.38, 0.8, 0);
    chassisGroup.add(pwrBtn);

    const volUpBtn = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.08), btnMat);
    volUpBtn.position.set(-1.38, 1.1, 0);
    chassisGroup.add(volUpBtn);

    const volDownBtn = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.08), btnMat);
    volDownBtn.position.set(-1.38, 0.45, 0);
    chassisGroup.add(volDownBtn);

    // USB-C Bottom Port
    const usbcPort = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.05, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8 })
    );
    usbcPort.position.set(0, -2.8, 0);
    chassisGroup.add(usbcPort);

    // Layer 3: MOTHERBOARD & A18 PRO CHIP (Moves to Z: -1.0 when exploded)
    const logicGroup = new THREE.Group();
    logicBoardLayerRef.current = logicGroup;
    phoneGroup.add(logicGroup);

    const pcbGeo = new THREE.PlaneGeometry(2.4, 5.1);
    const pcbTex = createPCBTexture();
    const pcbMat = new THREE.MeshStandardMaterial({
      map: pcbTex,
      metalness: 0.7,
      roughness: 0.35
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    logicGroup.add(pcbMesh);

    // Layer 4: GRAPHENE BATTERY & MAGSAFE COIL (Moves to Z: -2.0 when exploded)
    const batteryGroup = new THREE.Group();
    batteryLayerRef.current = batteryGroup;
    phoneGroup.add(batteryGroup);

    const batteryGeo = new THREE.PlaneGeometry(2.4, 5.1);
    const batteryTex = createBatteryTexture();
    const batteryMat = new THREE.MeshStandardMaterial({
      map: batteryTex,
      metalness: 0.5,
      roughness: 0.4
    });
    const batteryMesh = new THREE.Mesh(batteryGeo, batteryMat);
    batteryGroup.add(batteryMesh);

    // Layer 5: BACK PLATE & TRIPLE CAMERA MODULE (Moves to Z: -3.0 when exploded)
    const cameraGroup = new THREE.Group();
    cameraLayerRef.current = cameraGroup;
    phoneGroup.add(cameraGroup);

    // Back Plate Mesh with dynamic Laser Engraving
    const backGeo = new THREE.PlaneGeometry(2.65, 5.5);
    const backTex = createBackPlateTexture('ATELIER • 2026', selectedFinish.hex);
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: selectedFinish.roughness,
      metalness: selectedFinish.metalness * 0.8
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, 0, -0.16);
    backMesh.rotation.y = Math.PI; // Face outwards to back
    backPlateMeshRef.current = backMesh;
    cameraGroup.add(backMesh);

    // Camera Island Bump
    const bumpGeo = new THREE.BoxGeometry(1.25, 1.35, 0.14);
    const bumpMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.threeHex),
      metalness: 0.9,
      roughness: 0.25
    });
    const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
    bumpMesh.position.set(-0.58, 1.82, -0.22);
    cameraGroup.add(bumpMesh);

    // Triple Camera Lenses
    const lensPositions = [
      { x: -0.85, y: 2.12 },
      { x: -0.85, y: 1.52 },
      { x: -0.32, y: 1.82 }
    ];

    lensPositions.forEach((pos) => {
      // Metallic Outer Ring
      const ringGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.18, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        metalness: 0.95,
        roughness: 0.1
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(pos.x, pos.y, -0.29);
      cameraGroup.add(ring);

      // Sapphire Glass Core with Transmission
      const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.2, 32);
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x07152b,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.77 // Sapphire refraction index
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(pos.x, pos.y, -0.3);
      cameraGroup.add(lens);
    });

    // Flash & LiDAR
    const flash = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 16),
      new THREE.MeshBasicMaterial({ color: 0xfffae0 })
    );
    flash.position.set(-0.32, 2.22, -0.3);
    flash.rotation.y = Math.PI;
    cameraGroup.add(flash);

    setIs3DReady(true);

    // 7. Animation Loop with Lerp
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Smoothly interpolate exploded progress
      const targetProgress = isExploded ? 1 : 0;
      explodedProgressRef.current = THREE.MathUtils.lerp(
        explodedProgressRef.current,
        targetProgress,
        0.08
      );

      const p = explodedProgressRef.current;

      // Move Layers smoothly along Z axis
      if (frontLayerRef.current) frontLayerRef.current.position.z = p * 2.3;
      if (logicBoardLayerRef.current) logicBoardLayerRef.current.position.z = -p * 1.0;
      if (batteryLayerRef.current) batteryLayerRef.current.position.z = -p * 2.1;
      if (cameraLayerRef.current) cameraLayerRef.current.position.z = -p * 3.2;

      // Adjust camera distance for exploded perspective
      if (cameraRef.current) {
        const targetCamZ = isExploded ? 10.2 : 8.4;
        cameraRef.current.position.z = THREE.MathUtils.lerp(
          cameraRef.current.position.z,
          targetCamZ,
          0.05
        );
      }

      // Smooth key light reaction to cursor
      if (keyLightRef.current) {
        keyLightRef.current.position.x = THREE.MathUtils.lerp(
          keyLightRef.current.position.x,
          mouseTargetLightRef.current.x,
          0.05
        );
        keyLightRef.current.position.y = THREE.MathUtils.lerp(
          keyLightRef.current.position.y,
          mouseTargetLightRef.current.y,
          0.05
        );
      }

      // Auto rotation when not dragging
      if (autoRotate && !isDraggingRef.current && phoneGroupRef.current) {
        phoneGroupRef.current.rotation.y += isExploded ? 0.003 : 0.007;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Interaction Handlers
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      // Update dynamic studio key light target
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetLightRef.current = { x: 5 + normX * 4, y: 7 + normY * 3 };

      if (!isDraggingRef.current || !phoneGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      phoneGroupRef.current.rotation.y += deltaX * 0.009;
      phoneGroupRef.current.rotation.x += deltaY * 0.009;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Mobile touch
    const handleTouchStart = (e) => {
      if (e.touches.length === 0) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || !phoneGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;

      phoneGroupRef.current.rotation.y += deltaX * 0.009;
      phoneGroupRef.current.rotation.x += deltaY * 0.009;

      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Titanium Finish in Three.js
  useEffect(() => {
    if (!chassisLayerRef.current) return;

    // Update chassis frame
    chassisLayerRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color = new THREE.Color(selectedFinish.threeHex);
        child.material.roughness = selectedFinish.roughness;
        child.material.metalness = selectedFinish.metalness;
        child.material.needsUpdate = true;
      }
    });

    // Update backplate
    if (backPlateMeshRef.current) {
      const newTex = createBackPlateTexture(engravingText, selectedFinish.hex);
      backPlateMeshRef.current.material.map = newTex;
      backPlateMeshRef.current.material.needsUpdate = true;
    }
  }, [selectedFinish]);

  // Update Laser Engraving in Real-Time
  useEffect(() => {
    if (backPlateMeshRef.current && selectedFinish) {
      const newTex = createBackPlateTexture(engravingText, selectedFinish.hex);
      backPlateMeshRef.current.material.map = newTex;
      backPlateMeshRef.current.material.needsUpdate = true;
    }
  }, [engravingText]);

  // Update Screen Mode (Wallpaper vs Camera Viewfinder)
  useEffect(() => {
    if (screenMeshRef.current) {
      const newTex = createScreenCanvasTexture(screenMode);
      screenMeshRef.current.material.map = newTex;
      screenMeshRef.current.material.needsUpdate = true;
    }
  }, [screenMode]);

  // Toggle Exploded View
  const handleToggleExploded = () => {
    playSpatialOpen();
    setIsExploded(!isExploded);
    if (!isExploded) {
      // Angle the phone nicely to showcase the separated depth
      if (phoneGroupRef.current) {
        phoneGroupRef.current.rotation.set(0.18, 0.75, 0);
      }
    }
  };

  // Reset 3D View
  const handleResetView = () => {
    playSubtleClick();
    if (phoneGroupRef.current && cameraRef.current) {
      phoneGroupRef.current.rotation.set(0.12, 0.35, 0);
      cameraRef.current.position.set(0, 0, isExploded ? 10.2 : 8.4);
      setAutoRotate(true);
    }
  };

  // Add customized phone to cart
  const handleAddToCartCustom = () => {
    playCartSuccess();
    const success = addToCart(flagshipProduct, {
      color: selectedFinish.name,
      storage: selectedStorage.size,
      quantity: 1,
      engraving: engravingText.trim()
    });

    if (success !== false) {
      showLuxuryNotification(
        'Obra de Alta Costura Añadida a la Bolsa',
        `${flagshipProduct.name} • ${selectedFinish.name} • ${selectedStorage.size} ${
          engravingText.trim() ? `• Grabado: "${engravingText.trim().toUpperCase()}"` : ''
        }`
      );
    }
  };

  // Direct 1-Click Purchase
  const handleDirectBuy = () => {
    handleAddToCartCustom();
    setIsCheckoutOpen(true);
  };

  return (
    <section className="relative w-full pt-6 pb-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.09] blur-[150px]"
          style={{ background: 'radial-gradient(circle, #c9a227 0%, #d4af37 40%, transparent 70%)' }}
        />
        <div
          className="absolute -top-10 -left-20 w-[450px] h-[450px] rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
        />
      </div>

      {/* Header Editorial Tagline */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.22)] shadow-[0_0_25px_rgba(201,162,39,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#e4c972] tracking-[0.2em] uppercase">
            Studio Atelier • Flagship 2026
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f3efe6] tracking-tight leading-[1.08]">
          Esculpido en titanio.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e4c972] via-[#c9a227] to-[#b58b1a]">
            Poder absoluto.
          </span>
        </h1>

        <p className="text-[15px] sm:text-base text-[#8b8680] max-w-xl mx-auto leading-relaxed">
          Diseña tu insignia en vivo. Visor 3D de alta definición, personalización de grabado láser en tiempo real y despiece de arquitectura interna.
        </p>
      </div>

      {/* Master 3D Studio & Configurator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ==============================================================
            LEFT / CENTER: THE 3D INTERACTIVE STAGE (Cols 1-7)
            ============================================================== */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[4/4.2] sm:aspect-[4/3.8] rounded-3xl overflow-hidden bg-gradient-to-b from-[#111115]/95 via-[#0e0e11]/90 to-[#08080a] border border-[rgba(243,239,230,0.1)] shadow-[0_30px_90px_rgba(0,0,0,0.85)] group select-none">
            {/* Top Studio Controls */}
            <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-[#0a0a0c]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[rgba(243,239,230,0.14)] text-xs text-[#f3efe6] font-medium pointer-events-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#c9a227]" />
                <span className="hidden sm:inline">WebGL Studio PBR</span>
                <span className="text-[11px] text-[#c9a227] font-mono">60 FPS</span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleToggleExploded}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                    isExploded
                      ? 'bg-[#c9a227] text-[#0a0a0c] border-[#c9a227] shadow-[0_0_20px_rgba(201,162,39,0.5)]'
                      : 'bg-[#18181c]/80 text-[#8b8680] hover:text-[#f3efe6] border-[rgba(243,239,230,0.12)]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isExploded ? 'Ensamblar 3D' : 'Despiece 3D'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
                    autoRotate
                      ? 'bg-[rgba(201,162,39,0.15)] border-[#c9a227] text-[#e4c972]'
                      : 'bg-[#18181c]/80 border-[rgba(243,239,230,0.12)] text-[#8b8680] hover:text-[#f3efe6]'
                  }`}
                  title="Auto-rotación"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                </button>

                <button
                  type="button"
                  onClick={handleResetView}
                  className="p-2 rounded-full bg-[#18181c]/80 hover:bg-[#222227] border border-[rgba(243,239,230,0.12)] text-[#8b8680] hover:text-[#f3efe6] transition-all cursor-pointer backdrop-blur-md"
                  title="Centrar vista"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Canvas Mount Point */}
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative"
            />

            {!is3DReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0c]/90 backdrop-blur-sm z-30">
                <div className="w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-[#8b8680] font-mono tracking-wider">Cargando motor 3D...</p>
              </div>
            )}

            {/* Interactive Engineering Hotspots (Visible in Exploded Mode) */}
            {isExploded && (
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto w-full pointer-events-auto">
                  <div className="p-3 rounded-xl bg-[#0a0a0c]/85 border border-[#c9a227]/40 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-2 text-[#c9a227] text-xs font-bold mb-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Chip A18 Pro 3nm</span>
                    </div>
                    <p className="text-[11px] text-[#8b8680]">
                      35.000 millones de transistores y GPU con Ray Tracing acelerado por hardware.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0a0c]/85 border border-[#c9a227]/40 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-2 text-[#c9a227] text-xs font-bold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Titanio Grado 5</span>
                    </div>
                    <p className="text-[11px] text-[#8b8680]">
                      Forjado a 1.000°C con la mayor relación resistencia-peso de la industria.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0a0c]/85 border border-[#c9a227]/40 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-2 text-[#c9a227] text-xs font-bold mb-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Tetraprisma 48MP</span>
                    </div>
                    <p className="text-[11px] text-[#8b8680]">
                      Zoom óptico 5x continuo y estabilización 3D por desplazamiento de sensor.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0a0c]/85 border border-[#c9a227]/40 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-2 text-[#c9a227] text-xs font-bold mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Grafeno 4.685 mAh</span>
                    </div>
                    <p className="text-[11px] text-[#8b8680]">
                      Hasta 33h de autonomía con bobina de inducción MagSafe de cobre puro.
                    </p>
                  </div>
                </div>

                <div className="text-center text-[11px] text-[#c9a227] tracking-widest uppercase font-mono">
                  [ Arrastra para inspeccionar la arquitectura interna ]
                </div>
              </div>
            )}

            {/* Bottom Floating Bar inside 3D */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setScreenMode(screenMode === 'camera' ? 'wallpaper' : 'camera');
                }}
                className="pointer-events-auto px-4 py-2 rounded-full bg-[#0a0a0c]/85 hover:bg-[#18181c] border border-[rgba(243,239,230,0.16)] text-xs font-medium text-[#f3efe6] flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:border-[#c9a227]/50"
              >
                <Eye className="w-3.5 h-3.5 text-[#c9a227]" />
                <span>{screenMode === 'camera' ? 'Ver Pantalla OLED' : 'Probar Cámara 4K'}</span>
              </button>

              <div className="text-[11px] text-[#8b8680] font-mono hidden sm:block bg-[#0a0a0c]/70 px-3 py-1 rounded-full border border-[rgba(243,239,230,0.08)]">
                Acabado: <span className="text-[#f3efe6] font-semibold">{selectedFinish.name}</span>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#8b8680] mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
            Arrastra en cualquier dirección para rotar en 360°. Haz clic en "Despiece 3D" para ver su interior.
          </p>
        </div>

        {/* ==============================================================
            RIGHT: THE ATELIER CONFIGURATOR (Cols 8-12)
            ============================================================== */}
        <div className="lg:col-span-5 space-y-6 bg-[#0f0f12]/90 border border-[rgba(243,239,230,0.08)] p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="border-b border-[rgba(243,239,230,0.08)] pb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c9a227] font-semibold">
                Configurador de Atelier
              </span>
              <span className="text-xs font-mono text-[#8b8680] bg-[#1a1a1f] px-2.5 py-0.5 rounded-full border border-[rgba(243,239,230,0.06)]">
                Pieza No. 001
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f3efe6]">
              {flagshipProduct.name}
            </h2>
            <p className="text-xs text-[#8b8680] mt-1">
              Personalizado en titanio con grabado láser de alta precisión.
            </p>
          </div>

          {/* 1. Selector de Titanio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f3efe6] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#c9a227]" />
                1. Acabado de Titanio
              </span>
              <span className="text-xs text-[#c9a227] font-medium">{selectedFinish.name}</span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {titaniumFinishes.map((finish) => {
                const isSelected = selectedFinish.id === finish.id;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedFinish(finish);
                    }}
                    className={`group relative p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[rgba(201,162,39,0.12)] border-[#c9a227] shadow-[0_0_16px_rgba(201,162,39,0.25)] scale-105'
                        : 'bg-[#151519] border-[rgba(243,239,230,0.08)] hover:border-[rgba(243,239,230,0.2)]'
                    }`}
                    title={finish.desc}
                  >
                    <span
                      className="w-7 h-7 rounded-full shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <span className="text-[10px] font-medium text-[#8b8680] truncate w-full text-center group-hover:text-[#f3efe6]">
                      {finish.colorName.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#8b8680] italic">{selectedFinish.desc}</p>
          </div>

          {/* 2. Grabado Láser Personalizado en Vivo */}
          <div className="space-y-3 pt-3 border-t border-[rgba(243,239,230,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f3efe6] uppercase tracking-wider flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-[#c9a227]" />
                2. Grabado Láser Exclusivo
              </span>
              <span className="text-[10px] text-[#8b8680] font-mono">
                {engravingText.length}/18 caracteres
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                maxLength={18}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                placeholder="Ej. EXE • ATELIER"
                className="w-full bg-[#151519] border border-[rgba(243,239,230,0.12)] focus:border-[#c9a227] text-[#f3efe6] px-4 py-2.5 rounded-xl text-sm font-mono tracking-wider outline-none transition-all placeholder:text-[#555]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#c9a227] font-semibold uppercase tracking-wider">
                Láser 3D
              </span>
            </div>
            <p className="text-[11px] text-[#8b8680]">
              Tallado con haz láser en el chasis trasero del modelo 3D. Cambia el texto y gíralo para verlo en vivo.
            </p>
          </div>

          {/* 3. Selector de Almacenamiento */}
          <div className="space-y-3 pt-3 border-t border-[rgba(243,239,230,0.06)]">
            <span className="text-xs font-semibold text-[#f3efe6] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#c9a227]" />
              3. Capacidad de Almacenamiento
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              {storageOptions.map((opt) => {
                const isSelected = selectedStorage.size === opt.size;
                return (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedStorage(opt);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[rgba(201,162,39,0.12)] border-[#c9a227] shadow-[0_0_14px_rgba(201,162,39,0.2)]'
                        : 'bg-[#151519] border-[rgba(243,239,230,0.08)] hover:border-[rgba(243,239,230,0.2)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#f3efe6]">{opt.size}</div>
                    <div className="text-[10px] text-[#c9a227] font-mono mt-0.5">
                      {opt.extraPrice === 0 ? 'Incluido' : `+$${opt.extraPrice}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Checkout CTAs */}
          <div className="pt-4 border-t border-[rgba(243,239,230,0.1)] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8b8680]">
                  Precio de Atelier
                </span>
                <div className="text-3xl font-extrabold text-[#f3efe6] tracking-tight">
                  ${totalPrice}{' '}
                  <span className="text-xs font-normal text-[#8b8680]">USD</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#c9a227] font-medium block">
                  12 cuotas sin interés
                </span>
                <span className="text-xs font-mono text-[#8b8680]">
                  de ${monthlyInstallment} / mes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCartCustom}
                className="w-full py-3.5 px-4 rounded-xl bg-[#c9a227] hover:bg-[#d4b03a] text-[#0a0a0c] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_25px_rgba(201,162,39,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir a la Bolsa</span>
              </button>

              <button
                type="button"
                onClick={handleDirectBuy}
                className="w-full py-3.5 px-4 rounded-xl border border-[rgba(243,239,230,0.2)] hover:border-[#c9a227] hover:text-[#c9a227] text-[#f3efe6] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <span>Comprar en 1 Clic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8b8680] pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c9a227]" /> Garantía oficial 24 meses
              </span>
              <span>Envío express asegurado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
