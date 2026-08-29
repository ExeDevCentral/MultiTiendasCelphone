'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo3DMesh } from './Photo3DMesh';
import { playSpatialOpen, playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { isIOSPermissionRequired, requestGyroscopePermission } from '../utils/gyroscope';
import { Sparkles, Compass } from 'lucide-react';

export function Photo3DModal({ product, isOpen, onClose }) {
  const [gyroRequested, setGyroRequested] = useState(false);
  const [needsIOSPermission, setNeedsIOSPermission] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      playSpatialOpen();
      setNeedsIOSPermission(isIOSPermissionRequired());
    }
  }, [isOpen, product]);

  const handleClose = () => {
    playSubtleClick();
    onClose();
  };

  const handleEnableGyro = async (e) => {
    e.stopPropagation();
    const granted = await requestGyroscopePermission();
    if (granted) {
      playCartSuccess();
      setGyroRequested(true);
      setNeedsIOSPermission(false);
    }
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
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#070708]/92 backdrop-blur-2xl p-4 md:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Contenedor Flotante de Lujo con Física de Resorte Framer Motion */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl h-[85vh] max-h-[760px] bg-[#0c0c0e] border border-[#c5a880]/25 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col"
          >
            {/* Header Editorial Minimalista */}
            <div className="flex items-center justify-between px-7 py-4.5 border-b border-white/[0.06] bg-[#0c0c0e]/80 backdrop-blur-md z-10">
              <div className="flex flex-col">
                <span className="text-[9px] tracking-[0.35em] uppercase text-[#c5a880] font-light">
                  Spatial Depth • Atelier 3D
                </span>
                <h2
                  className="text-white font-light text-lg md:text-xl tracking-tight mt-0.5"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {product.name}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Botón de Activación de Giroscopio en iOS Safari */}
                {needsIOSPermission && (
                  <button
                    type="button"
                    onClick={handleEnableGyro}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c5a880]/15 hover:bg-[#c5a880]/25 border border-[#c5a880]/40 text-[#c5a880] text-[10px] tracking-wider uppercase font-light transition-all cursor-pointer shadow-sm animate-pulse"
                    title="Permitir inclinación por giroscopio"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Activar Sensor 3D</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#c5a880]/40 transition-all duration-300 cursor-pointer"
                  title="Cerrar (Esc)"
                >
                  <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 group-hover:text-white font-light">
                    Close
                  </span>
                  <span className="text-neutral-500 group-hover:text-neutral-300 text-xs leading-none">✕</span>
                </button>
              </div>
            </div>

            {/* Viewport 3D */}
            <div className="relative flex-1 w-full h-full bg-gradient-to-b from-[#0e0e11] via-[#09090a] to-[#060607] cursor-grab active:cursor-grabbing select-none">
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-neutral-400">
                    <div className="w-6 h-6 border-[1.5px] border-[#c5a880]/20 border-t-[#c5a880] rounded-full animate-spin" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880]/80 font-light">
                      Componiendo relieve espacial...
                    </span>
                  </div>
                }
              >
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
              </Suspense>

              {/* Micro-píldora de interacción en el canvas */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-4 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/[0.08] shadow-lg">
                  <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-light">
                    Mueve el cursor o inclina tu dispositivo para explorar el volumen
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Editorial */}
            <div className="px-7 py-3 bg-[#09090b] border-t border-white/[0.04] flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-light">
              <span>Neural Depth Synthesis</span>
              <span className="text-[#c5a880]/70">Atelier Studio Edition</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
