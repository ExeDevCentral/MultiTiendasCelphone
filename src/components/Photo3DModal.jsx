'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { RealPhone3DViewer } from './RealPhone3DModel';
import { Photo3DMesh } from './Photo3DMesh';
import { playSpatialOpen, playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { isIOSPermissionRequired, requestGyroscopePermission } from '../utils/gyroscope';
import { Compass, X, RotateCw, ZoomIn, ZoomOut, Box, Image as ImageIcon, Eye } from 'lucide-react';

export function Photo3DModal({ product, isOpen = true, onClose }) {
  const [viewMode, setViewMode] = useState('real_3d'); // 'real_3d' | 'depth_map'
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedFinishHex, setSelectedFinishHex] = useState('#c5a880');
  const [selectedFinishName, setSelectedFinishName] = useState('Titanio Desierto');
  const [needsIOSPermission, setNeedsIOSPermission] = useState(false);

  const finishes = [
    { name: 'Titanio Desierto', hex: '#c5a880' },
    { name: 'Titanio Natural', hex: '#9d968d' },
    { name: 'Negro Espacial', hex: '#222327' },
    { name: 'Blanco Cerámico', hex: '#e3e4e9' },
  ];

  useEffect(() => {
    if (isOpen && product) {
      playSpatialOpen();
      setNeedsIOSPermission(isIOSPermissionRequired());
      if (product.colors && product.colors.length > 0) {
        setSelectedFinishHex(product.colors[0].hex || '#c5a880');
        setSelectedFinishName(product.colors[0].name || 'Titanio Desierto');
      }
    }
  }, [isOpen, product]);

  const handleClose = () => {
    playSubtleClick();
    onClose();
  };

  const photoUrl = product?.photo_url || product?.image || (product?.images && product?.images[0]);
  const depthMapUrl = product?.depth_map_url || product?.depthMapUrl;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl h-[92vh] max-h-[860px] bg-[#0E0F14] text-[#F5F5F7] border border-[#c5a880]/35 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col"
          >
            {/* Top Atelier Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-white/10 bg-[#12141A] z-20">
              <div>
                <span className="text-xs tracking-wider uppercase text-[#c5a880] font-mono font-bold flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-[#c5a880]" />
                  CELULAR 3D INTERACTIVO // MANIPULACIÓN 360°
                </span>
                <h2
                  className="text-white font-bold text-xl sm:text-2xl tracking-tight mt-0.5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {product.name}
                </h2>
              </div>

              {/* View Mode & Close Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-black/50 border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setViewMode('real_3d');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      viewMode === 'real_3d'
                        ? 'bg-[#0066FF] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-4 h-4" />
                    <span>CELULAR 3D REAL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setViewMode('depth_map');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      viewMode === 'depth_map'
                        ? 'bg-[#0066FF] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">RELIEVE FOTO</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer ml-1"
                  title="Cerrar ventana (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interactive Control Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-3 bg-[#0A0B0E] border-b border-white/10 text-xs sm:text-sm text-white z-10">
              {viewMode === 'real_3d' ? (
                <>
                  {/* Finish Selector */}
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white uppercase tracking-wider text-xs">
                      COLOR DEL CHASIS:
                    </span>
                    <span className="font-extrabold text-blue-400 hidden sm:inline">{selectedFinishName}</span>
                    <div className="flex items-center gap-2">
                      {finishes.map((f) => (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => {
                            playSubtleClick();
                            setSelectedFinishHex(f.hex);
                            setSelectedFinishName(f.name);
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer shadow-md ${
                            selectedFinishHex === f.hex
                              ? 'border-[#0066FF] scale-110 ring-2 ring-[#0066FF]/60'
                              : 'border-white/40 hover:scale-105 hover:border-white'
                          }`}
                          style={{ backgroundColor: f.hex }}
                          title={f.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Manipulation Actions: Rotation toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-sm ${
                        autoRotate
                          ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-md'
                          : 'bg-white/10 border-white/25 text-white hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                      <span>{autoRotate ? 'Giro Automático Activado' : 'Girar Automático'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-zinc-200 font-medium">
                  Desplazamiento volumétrico por GPU sobre fotografía de alta fidelidad
                </div>
              )}
            </div>

            {/* 3D Viewport Stage */}
            <div
              className="relative flex-1 w-full h-full overflow-hidden select-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, #202535 0%, #11131A 55%, #08090C 100%)' }}
            >
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                    <div className="w-10 h-10 border-2 border-[#0066FF]/30 border-t-[#0066FF] rounded-full animate-spin" />
                    <span className="text-sm font-mono uppercase tracking-widest text-zinc-300">
                      Cargando Chasis 3D en GPU...
                    </span>
                  </div>
                }
              >
                {viewMode === 'real_3d' ? (
                  <RealPhone3DViewer
                    productName={product.name}
                    activeColorHex={selectedFinishHex}
                    autoRotate={autoRotate}
                  />
                ) : (
                  <Canvas
                    camera={{ position: [0, 0, 3.6], fov: 42 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                  >
                    <color attach="background" args={['#080809']} />
                    <Photo3DMesh
                      photoUrl={photoUrl}
                      depthMapUrl={depthMapUrl}
                    />
                  </Canvas>
                )}
              </Suspense>

              {/* Floating Guidance Badge (Big, clear, accessible instructions with bold contrast) */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10 w-full max-w-lg px-4">
                <div className="px-6 py-2.5 rounded-full bg-[#181B26]/95 backdrop-blur-xl border border-white/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] text-center">
                  <p className="text-xs sm:text-sm text-white font-bold tracking-wide">
                    {viewMode === 'real_3d'
                      ? '● Arrastrá para rotar 360° • Usá la rueda del mouse para Zoom'
                      : '● Movimiento volumétrico con cursor o giroscopio'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info Bar */}
            <div className="px-6 py-3.5 bg-[#0A0B0E] border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-zinc-300 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
                <span className="font-bold text-white">GPU ACCELERATED 3D HARDWARE</span>
              </div>
              <span className="text-[#E2C799] font-bold tracking-wide">
                CELSTORE™ ATELIER 3D STUDIO
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
