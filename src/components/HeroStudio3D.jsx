'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  RefreshCw,
  Cpu,
  Layers,
  ShoppingBag,
  ArrowRight,
  Check,
  BatteryCharging,
  Maximize2,
  Terminal,
  Camera,
  Crosshair
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const HeroStudio3D = ({ onNavigate, onOpenDetail }) => {
  const mountRef = useRef(null);
  const { addToCart, setIsCartOpen } = useCart();
  const { products } = useStore();

  const flagshipProduct = useMemo(() => {
    return (
      products.find((p) => p.id === 'prod-iphone-16-pro-max') ||
      products[0] || {
        id: 'prod-iphone-16-pro-max',
        name: 'iPhone 16 Pro Max Flagship',
        brand: 'Apple',
        price: 1399,
        originalPrice: 1499,
        storeId: 'store-celstore-premium',
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80']
      }
    );
  }, [products]);

  // Industrial Finishes (Teenage Engineering Hardware Finishes)
  const industrialFinishes = [
    {
      id: 'natural',
      code: '01',
      name: 'RAW TITANIUM',
      hex: '#9d968d',
      threeHex: 0x9d968d,
      roughness: 0.3,
      metalness: 0.95,
      note: 'Grado 5 electropulido sin pintar'
    },
    {
      id: 'black',
      code: '02',
      name: 'MATTE CARBON DLC',
      hex: '#1f2024',
      threeHex: 0x1a1b1e,
      roughness: 0.22,
      metalness: 0.96,
      note: 'Tratamiento diamond-like carbon'
    },
    {
      id: 'white',
      code: '03',
      name: 'CHALK WHITE',
      hex: '#e2e3e8',
      threeHex: 0xe2e3e8,
      roughness: 0.25,
      metalness: 0.85,
      note: 'Cristal cerámico mate de alto contraste'
    },
    {
      id: 'desert',
      code: '04',
      name: 'DESERT SAND',
      hex: '#c5a880',
      threeHex: 0xc5a880,
      roughness: 0.28,
      metalness: 0.92,
      note: 'Anodizado industrial color arena'
    },
    {
      id: 'orange',
      code: '05',
      name: 'SIGNAL ORANGE',
      hex: '#ff4800',
      threeHex: 0xff4800,
      roughness: 0.35,
      metalness: 0.8,
      note: 'Edición técnica de laboratorio TE'
    }
  ];

  const storageOptions = [
    { size: '256 GB', extraPrice: 0, code: 'STD' },
    { size: '512 GB', extraPrice: 200, code: 'EXT' },
    { size: '1 TB', extraPrice: 450, code: 'MAX' }
  ];

  const [selectedFinish, setSelectedFinish] = useState(industrialFinishes[0]);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for Three.js
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const phoneGroupRef = useRef(null);
  const backMeshRef = useRef(null);
  const frameMeshRef = useRef(null);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  const basePrice = flagshipProduct?.price || 1399;
  const totalPrice = basePrice + selectedStorage.extraPrice;

  // Dot Matrix / Minimalist Screen Texture
  const createScreenTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Stark black background with subtle dot grid
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, 512, 1024);

    // Dot Matrix Pattern
    ctx.fillStyle = 'rgba(240, 240, 235, 0.12)';
    for (let x = 20; x < 500; x += 16) {
      for (let y = 100; y < 920; y += 16) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Technical Telemetry Screen Graphic
    ctx.fillStyle = '#ff4800';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('[CELSTORE // HW-01]', 40, 180);

    ctx.fillStyle = '#f0f0eb';
    ctx.font = 'bold 84px monospace';
    ctx.fillText('09:41', 40, 280);

    ctx.fillStyle = '#888890';
    ctx.font = '20px monospace';
    ctx.fillText('SYS.FREQ: 120HZ // PROMOTION', 40, 330);
    ctx.fillText('STATUS: HARDWARE SYNCHRONIZED', 40, 360);

    // Dynamic Island hardware bar
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(176, 28, 160, 40, 20);
    ctx.fill();

    // Home indicator
    ctx.fillStyle = '#f0f0eb';
    ctx.fillRect(176, 980, 160, 6);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Setup Three.js 3D Phone Model
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      rendererRef.current = renderer;
      container.replaceChildren(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init error:', e);
      return;
    }

    // Industrial Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainKeyLight.position.set(5, 7, 6);
    scene.add(mainKeyLight);

    const orangeAccent = new THREE.DirectionalLight(0xff4800, 2.2);
    orangeAccent.position.set(-6, -4, -4);
    scene.add(orangeAccent);

    const fillLight = new THREE.DirectionalLight(0xf0f0eb, 1.5);
    fillLight.position.set(4, -5, 4);
    scene.add(fillLight);

    // Root Group
    const phoneGroup = new THREE.Group();
    phoneGroupRef.current = phoneGroup;
    scene.add(phoneGroup);

    const phoneWidth = 2.4;
    const phoneHeight = 4.9;
    const phoneDepth = 0.22;
    const cornerRadius = 0.32;

    const frameShape = new THREE.Shape();
    const x = -phoneWidth / 2;
    const y = -phoneHeight / 2;
    const w = phoneWidth;
    const h = phoneHeight;
    const r = cornerRadius;

    frameShape.moveTo(x + r, y);
    frameShape.lineTo(x + w - r, y);
    frameShape.quadraticCurveTo(x + w, y, x + w, y + r);
    frameShape.lineTo(x + w, y + h - r);
    frameShape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    frameShape.lineTo(x + r, y + h);
    frameShape.quadraticCurveTo(x, y + h, x, y + h - r);
    frameShape.lineTo(x, y + r);
    frameShape.quadraticCurveTo(x, y, x + r, y);

    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: phoneDepth,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });
    frameGeo.center();

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.threeHex),
      metalness: selectedFinish.metalness,
      roughness: selectedFinish.roughness
    });

    const frameMesh = new THREE.Mesh(frameGeo, titaniumMat);
    frameMeshRef.current = frameMesh;
    phoneGroup.add(frameMesh);

    // Front Screen
    const screenGeo = new THREE.PlaneGeometry(phoneWidth * 0.94, phoneHeight * 0.95);
    const screenTexture = createScreenTexture();
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = phoneDepth / 2 + 0.055;
    phoneGroup.add(screenMesh);

    // Back Plate
    const backGeo = new THREE.PlaneGeometry(phoneWidth * 0.95, phoneHeight * 0.96);
    const backMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.threeHex),
      metalness: selectedFinish.metalness * 0.8,
      roughness: selectedFinish.roughness
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -(phoneDepth / 2 + 0.055);
    backMesh.rotation.y = Math.PI;
    backMeshRef.current = backMesh;
    phoneGroup.add(backMesh);

    // Camera Island on Back
    const cameraIslandShape = new THREE.Shape();
    const ciW = 1.05;
    const ciH = 1.05;
    const ciR = 0.2;
    const cix = -ciW / 2;
    const ciy = -ciH / 2;

    cameraIslandShape.moveTo(cix + ciR, ciy);
    cameraIslandShape.lineTo(cix + ciW - ciR, ciy);
    cameraIslandShape.quadraticCurveTo(cix + ciW, ciy, cix + ciW, ciy + ciR);
    cameraIslandShape.lineTo(cix + ciW, ciy + ciH - ciR);
    cameraIslandShape.quadraticCurveTo(cix + ciW, ciy + ciH, cix + ciW - ciR, ciy + ciH);
    cameraIslandShape.lineTo(cix + ciR, ciy + ciH);
    cameraIslandShape.quadraticCurveTo(cix, ciy + ciH, cix, ciy + ciH - ciR);
    cameraIslandShape.lineTo(cix, ciy + ciR);
    cameraIslandShape.quadraticCurveTo(cix, ciy, cix + ciR, ciy);

    const islandGeo = new THREE.ExtrudeGeometry(cameraIslandShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02
    });
    islandGeo.center();

    const islandMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.threeHex),
      metalness: 0.9,
      roughness: 0.2
    });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(-0.48, 1.6, -(phoneDepth / 2 + 0.09));
    islandMesh.rotation.y = Math.PI;
    phoneGroup.add(islandMesh);

    // Camera Lenses
    const lensPositions = [
      { x: -0.25, y: 0.25 },
      { x: -0.25, y: -0.25 },
      { x: 0.25, y: 0 }
    ];

    lensPositions.forEach((pos) => {
      const ringGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x111216,
        metalness: 0.9,
        roughness: 0.2
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(pos.x, pos.y, 0.05);
      islandMesh.add(ring);

      const glassGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.01, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x222228,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.8,
        transparent: true
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.set(pos.x, pos.y, 0.085);
      islandMesh.add(glass);
    });

    phoneGroup.rotation.y = -0.35;
    phoneGroup.rotation.x = 0.12;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current && phoneGroupRef.current) {
        phoneGroupRef.current.rotation.y += 0.005;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  // Update finish color
  useEffect(() => {
    if (frameMeshRef.current && backMeshRef.current) {
      const color = new THREE.Color(selectedFinish.threeHex);
      frameMeshRef.current.material.color = color;
      frameMeshRef.current.material.metalness = selectedFinish.metalness;
      frameMeshRef.current.material.roughness = selectedFinish.roughness;

      backMeshRef.current.material.color = color;
    }
  }, [selectedFinish]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !phoneGroupRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;

    phoneGroupRef.current.rotation.y += deltaX * 0.01;
    phoneGroupRef.current.rotation.x += deltaY * 0.008;
    phoneGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, phoneGroupRef.current.rotation.x));

    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetRotation = () => {
    playSubtleClick();
    if (phoneGroupRef.current) {
      phoneGroupRef.current.rotation.set(0.12, -0.35, 0);
    }
  };

  const handleAddToCart = () => {
    playCartSuccess();
    addToCart(flagshipProduct, {
      color: selectedFinish.name,
      storage: selectedStorage.size,
      price: totalPrice
    });
    showLuxuryNotification(
      'DISPATCH ORDER REGISTERED',
      `${flagshipProduct.name} // [${selectedFinish.name} • ${selectedStorage.size}] — $${totalPrice} USD`
    );
    setIsCartOpen(true);
  };

  return (
    <section className="relative w-full border-b border-[#262933] bg-[#0c0d10] py-8 lg:py-12 select-none font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hardware Telemetry Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222530] pb-3 mb-8 text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="text-[#ff4800] font-bold">[MODULE 01]</span>
            <span className="text-zinc-300 font-bold">HARDWARE WORKBENCH</span>
            <span>//</span>
            <span>REF: AP-16PM-G5</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>MASS: 227G</span>
            <span>DIM: 163.0 × 77.6 × 8.25 MM</span>
            <span className="text-[#ccff00] font-bold">● TEST PASSED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Industrial Specs & Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & DIN Specification */}
            <div>
              <div className="inline-block px-2 py-0.5 bg-[#171922] border border-[#2e3242] text-[10px] text-[#ff4800] font-bold uppercase mb-3">
                CHASSIS SPEC: FORGED TITANIUM G5
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#f0f0eb] tracking-tighter leading-none font-sans uppercase">
                IPHONE 16 PRO MAX
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Mecanizado en aleación de titanio de Grado 5 forjado a alta presión. Procesador Apple A18 Pro con arquitectura de 3 nanómetros y subsistema fotográfico de 48MP Quad-Pixel.
              </p>
            </div>

            {/* Industrial Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 bg-[#12141a] border border-[#232631]">
                <span className="text-[9px] text-zinc-500 block">CHIP ARCHITECTURE</span>
                <span className="text-xs font-bold text-[#f0f0eb] block mt-0.5">A18 PRO 3NM</span>
                <span className="text-[9px] text-[#ccff00]">6-CORE GPU</span>
              </div>
              <div className="p-2.5 bg-[#12141a] border border-[#232631]">
                <span className="text-[9px] text-zinc-500 block">SENSOR MATRIX</span>
                <span className="text-xs font-bold text-[#f0f0eb] block mt-0.5">48MP PRO-RAW</span>
                <span className="text-[9px] text-zinc-400">4K 120 LOG</span>
              </div>
              <div className="p-2.5 bg-[#12141a] border border-[#232631]">
                <span className="text-[9px] text-zinc-500 block">FRAME MATERIAL</span>
                <span className="text-xs font-bold text-[#f0f0eb] block mt-0.5">TITANIUM G5</span>
                <span className="text-[9px] text-zinc-400">PVD COATED</span>
              </div>
              <div className="p-2.5 bg-[#12141a] border border-[#232631]">
                <span className="text-[9px] text-zinc-500 block">AUTONOMY RATING</span>
                <span className="text-xs font-bold text-[#f0f0eb] block mt-0.5">33 HOURS</span>
                <span className="text-[9px] text-[#ccff00]">FAST CHARGE</span>
              </div>
            </div>

            {/* PHYSICAL FINISH SELECTOR SWITCHES */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-[#f0f0eb]">
                  [01] SELECT SURFACE FINISH:
                </span>
                <span className="text-[11px] text-[#ff4800] font-bold">
                  {selectedFinish.name}
                </span>
              </div>

              {/* Teenage Engineering Style Button Bank */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {industrialFinishes.map((finish) => {
                  const isSelected = selectedFinish.id === finish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => {
                        playSubtleClick();
                        setSelectedFinish(finish);
                      }}
                      className={`p-2.5 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e212b] border-[#ff4800] text-[#f0f0eb] shadow-[2px_2px_0px_#ff4800]'
                          : 'bg-[#12141a] border-[#262934] text-zinc-400 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500">[{finish.code}]</span>
                        <div
                          className="w-3 h-3 border border-black"
                          style={{ backgroundColor: finish.hex }}
                        />
                      </div>
                      <div className="text-[11px] font-bold mt-1 truncate">
                        {finish.name}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 italic">
                // {selectedFinish.note}
              </p>
            </div>

            {/* PHYSICAL STORAGE STEPPED TOGGLES */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-[#f0f0eb]">[02] STORAGE MODULE:</span>
                <span className="text-[11px] text-[#ccff00]">● ALLOCATED</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
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
                      className={`p-2.5 border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e212b] border-[#ccff00] text-[#f0f0eb] shadow-[2px_2px_0px_#ccff00]'
                          : 'bg-[#12141a] border-[#262934] text-zinc-400 hover:text-white hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{opt.size}</span>
                        <span className="text-[9px] text-zinc-500">[{opt.code}]</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {opt.extraPrice === 0 ? 'BASE' : `+$${opt.extraPrice}.00`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BRUTALIST ACTION BAR & EXECUTE TRIGGER */}
            <div className="p-4 bg-[#12141a] border-2 border-[#2b2f3d] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">CANONICAL UNIT TOTAL</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#f0f0eb] tracking-tight">
                      ${totalPrice.toLocaleString()}.00
                    </span>
                    <span className="text-xs text-zinc-500 font-bold">USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#ccff00] font-bold block">● INVENTORY RESERVED</span>
                  <span className="text-[10px] text-zinc-500">RLS PROTECTED DEDUCTION</span>
                </div>
              </div>

              {/* Barcode Strip Graphic */}
              <div className="w-full h-3 barcode-strip opacity-40" />

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 btn-industrial-primary text-xs py-3.5 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 fill-current" />
                  <span>EXECUTE DISPATCH ORDER // ${totalPrice}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDetail && onOpenDetail(flagshipProduct)}
                  className="btn-industrial-secondary text-xs py-3.5 flex items-center justify-center gap-1.5"
                >
                  <span>FULL SPEC SHEET</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D Hardware Blueprint Rig */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative w-full h-[460px] sm:h-[540px] bg-[#111318] border-2 border-[#262a36] overflow-hidden select-none flex items-center justify-center has-crosshairs"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ cursor: 'grab' }}
            >
              {/* Technical Measurement Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#f0f0eb_1px,transparent_1px)] [background-size:20px_20px]" />

              {/* Three.js Canvas Mount */}
              <div ref={mountRef} className="w-full h-full" />

              {/* Top Workbench HUD Header */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-[#0c0d10] border border-[#3b3f50] text-[10px] text-zinc-300 font-bold flex items-center gap-1.5">
                  <Crosshair className="w-3 h-3 text-[#ff4800]" />
                  <span>VIEWPORT 360°</span>
                </div>
                <span className="text-[10px] text-zinc-500 hidden sm:inline">
                  DRAG TO ROTATE
                </span>
              </div>

              {/* Controls (Top Right) */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2 py-1 text-[10px] font-bold border transition-all cursor-pointer ${
                    autoRotate
                      ? 'bg-[#ff4800] text-black border-[#ff4800]'
                      : 'bg-[#181a22] text-zinc-400 border-[#2f3342] hover:text-white'
                  }`}
                  title="Auto-rotación"
                >
                  [ROT: {autoRotate ? 'ON' : 'OFF'}]
                </button>
                <button
                  type="button"
                  onClick={handleResetRotation}
                  className="px-2 py-1 text-[10px] font-bold bg-[#181a22] text-zinc-400 border border-[#2f3342] hover:text-white transition-all cursor-pointer"
                  title="Centrar perspectiva"
                >
                  [RESET]
                </button>
              </div>

              {/* Bottom Hardware Telemetry HUD */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2 bg-[#0c0d10]/90 border border-[#292d3b]">
                <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                  <span className="text-[#ff4800] font-bold">RIG //</span>
                  <span>FINISH: {selectedFinish.name}</span>
                </div>
                <div className="text-[9px] text-zinc-500">
                  GPU ACCELERATED SHADER
                </div>
              </div>
            </div>

            {/* Workbench Footnote */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 px-1">
              <span>● HARDWARE SERIAL: // TE-9482-TX</span>
              <span>CERTIFICATION: ISO-9001 APPROVED</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
