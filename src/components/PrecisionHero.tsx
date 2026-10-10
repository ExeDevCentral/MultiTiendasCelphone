'use client';

import React, { useState, Suspense } from 'react';
import { ArrowRight, ShoppingBag, Box, Cpu, Camera, Layers, RotateCw, ZoomIn, ZoomOut, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types/database';
import { useCart } from '../context/CartContext';
import { playCartSuccess, playSubtleClick, playSpatialOpen } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';
import { RealPhone3DViewer } from './RealPhone3DModel';

interface PrecisionHeroProps {
  flagshipProduct: Product;
  onOpen3D?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const PrecisionHero: React.FC<PrecisionHeroProps> = ({
  flagshipProduct,
  onOpenDetail,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedStorage, setSelectedStorage] = useState<'256GB' | '512GB' | '1TB'>('512GB');
  const [selectedFinish, setSelectedFinish] = useState('Titanio Desierto');
  const [heroViewMode, setHeroViewMode] = useState<'3d' | 'photo'>('3d');
  const [autoRotate, setAutoRotate] = useState(true);

  const finishes = [
    { name: 'Titanio Desierto', hex: '#c5a880' },
    { name: 'Titanio Natural', hex: '#9d968d' },
    { name: 'Negro Espacial', hex: '#222327' },
    { name: 'Blanco Cerámico', hex: '#e3e4e9' },
  ];

  const currentFinishObj = finishes.find((f) => f.name === selectedFinish) || finishes[0];

  const priceMap = {
    '256GB': 1199,
    '512GB': 1399,
    '1TB': 1599,
  };

  const currentPrice = priceMap[selectedStorage];

  const handleBuy = () => {
    playCartSuccess();
    addToCart(flagshipProduct, {
      color: selectedFinish,
      storage: selectedStorage,
      price: currentPrice,
    });
    showLuxuryNotification(
      'ORDEN REGISTRADA EN CARRITO',
      `${flagshipProduct.name} [${selectedFinish} • ${selectedStorage}] — $${currentPrice} USD`
    );
    setIsCartOpen(true);
  };

  return (
    <section className="relative w-full bg-white dark:bg-[#000000] text-zinc-900 dark:text-[#F5F5F7] border-b border-black/5 dark:border-white/10 transition-colors select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT 5 COLS: Technical Title & Specs Controls */}
          <div className="lg:col-span-5 space-y-6 z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>NUEVO FLAGSHIP</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600 dark:text-zinc-300">TITANIO GRADO 5</span>
            </div>

            <div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.08]"
                style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
              >
                iPhone 16 Pro Max
              </h1>
              <p className="mt-3.5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Diseñado en aleación de titanio aeroespacial. Chip A18 Pro con Ray Tracing por hardware y cámara Fusion de 48 MP con botón de control de cámara háptico.
              </p>
            </div>

            {/* Finish & Material Switcher */}
            <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Acabado exterior:</span>
                <span className="font-semibold text-black dark:text-white">{selectedFinish}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {finishes.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedFinish(f.name);
                    }}
                    className={`px-3.5 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      selectedFinish === f.name
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                        : 'border-black/10 dark:border-white/15 hover:border-black/25 dark:hover:border-white/30 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: f.hex }} />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Stepped Switch */}
            <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Capacidad de almacenamiento:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedStorage}</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-sm">
                {(['256GB', '512GB', '1TB'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedStorage(s);
                    }}
                    className={`py-2.5 rounded-xl border transition-all cursor-pointer font-semibold ${
                      selectedStorage === s
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-black/10 dark:border-white/15 hover:border-black/20 dark:hover:border-white/30 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Primary Action Strip */}
            <div className="pt-5 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-500 uppercase block font-medium">Precio Oficial</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white tabular-nums">
                    ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-zinc-500 font-medium">USD</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBuy}
                  className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar ahora</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDetail && onOpenDetail(flagshipProduct)}
                  className="p-3.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 transition-all cursor-pointer"
                  title="Ver Ficha Técnica Completa"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: Direct 3D Manipulable Stage / Clean Photo Switcher */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2">
            
            {/* View Mode Pill Switcher */}
            <div className="flex items-center p-1 bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-full mb-4 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setHeroViewMode('3d');
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroViewMode === '3d'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Celular 3D Interactivo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setHeroViewMode('photo');
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroViewMode === 'photo'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Fotografía Oficial</span>
              </button>
            </div>

            {/* Showcase Stage */}
            <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl bg-[#F8F9FA] dark:bg-[#121316] border border-zinc-200/90 dark:border-white/15 flex items-center justify-center overflow-hidden shadow-sm">
              
              {heroViewMode === '3d' ? (
                <>
                  <Suspense
                    fallback={
                      <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-semibold">Cargando Celular 3D...</span>
                      </div>
                    }
                  >
                    <RealPhone3DViewer
                      productName={flagshipProduct.name}
                      activeColorHex={currentFinishObj.hex}
                      autoRotate={autoRotate}
                    />
                  </Suspense>

                  {/* 3D Manipulation Instructions Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 px-4">
                    <div className="px-5 py-2.5 rounded-full bg-white/95 dark:bg-[#181B26]/95 backdrop-blur-xl border border-zinc-200 dark:border-white/20 shadow-xl text-center">
                      <p className="text-xs text-zinc-900 dark:text-white font-bold tracking-wide">
                        ● Arrastrá para rotar 360° • Usá la rueda para hacer zoom
                      </p>
                    </div>
                  </div>

                  {/* Quick Auto-Rotate Action Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      type="button"
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`p-2.5 rounded-full backdrop-blur-xl border transition-all cursor-pointer shadow-md ${
                        autoRotate
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/90 dark:bg-[#181B26]/90 border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white hover:scale-105'
                      }`}
                      title={autoRotate ? 'Pausar rotación automática' : 'Iniciar rotación automática'}
                    >
                      <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </>
              ) : (
                /* Pure Photographic Showcase with clean button directly below */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                  <img
                    src={flagshipProduct.images[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop&q=90'}
                    alt={flagshipProduct.name}
                    className="max-h-[380px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                  />

                  {/* Clean button directly below the photo */}
                  <button
                    type="button"
                    onClick={() => {
                      playSpatialOpen();
                      setHeroViewMode('3d');
                    }}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Box className="w-4 h-4" />
                    <span>Ver tu celular en 3D (360° con zoom)</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
