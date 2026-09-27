'use client';

import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, ShieldCheck, Cpu, Camera, BatteryCharging, Sparkles, Layers } from 'lucide-react';
import { Product } from '../types/database';
import { useCart } from '../context/CartContext';
import { playCartSuccess, playSubtleClick } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

interface PrecisionHeroProps {
  flagshipProduct: Product;
  onOpen3D?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const PrecisionHero: React.FC<PrecisionHeroProps> = ({
  flagshipProduct,
  onOpen3D,
  onOpenDetail,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedStorage, setSelectedStorage] = useState<'256GB' | '512GB' | '1TB'>('512GB');
  const [selectedFinish, setSelectedFinish] = useState('Titanio Desierto');

  const finishes = [
    { name: 'Titanio Desierto', hex: '#c5a880', code: 'DT-01' },
    { name: 'Titanio Natural', hex: '#9d968d', code: 'NT-02' },
    { name: 'Titanio Negro', hex: '#232326', code: 'BT-03' },
    { name: 'Titanio Blanco', hex: '#e2e3e8', code: 'WT-04' },
  ];

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
    <section className="relative w-full border-b border-[#1A1A1D] bg-[#0E0E10] text-[#F5F5F7] overflow-hidden select-none">
      {/* Precision Sheet Margin Ticks */}
      <div className="absolute top-2 left-6 text-[10px] font-mono text-[#71717A] tracking-wider hidden sm:block">
        SPEC: DATASHEET // REV. 2026.04 // REF: IPH-16PM
      </div>
      <div className="absolute top-2 right-6 text-[10px] font-mono text-[#0066FF] tracking-wider font-bold">
        ● EN STOCK: ENTREGA INMEDIATA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT 5 COLS: Technical Title & Specs Controls */}
          <div className="lg:col-span-5 space-y-6 z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#141416] border border-[#1A1A1D] text-[10px] font-mono text-[#0066FF] font-bold uppercase tracking-wider">
              <span>// FLAGSHIP OFICIAL</span>
              <span className="text-[#71717A]">•</span>
              <span className="text-zinc-400">CHASIS EN TITANIO G5</span>
            </div>

            <div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F5F7] tracking-tight leading-[1.05]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                iPhone 16 Pro Max
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#71717A] leading-relaxed font-sans">
                El teléfono como objeto de precisión absoluta. Aleación de titanio de Grado 5 forjado a alta presión, procesador A18 Pro a 3nm y sensor fotográfico de 48MP Quad-Pixel con botón háptico dedicado.
              </p>
            </div>

            {/* Finish & Material Switcher */}
            <div className="space-y-2 pt-2 border-t border-[#1A1A1D]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#71717A]">ACABADO MECANIZADO:</span>
                <span className="text-[#F5F5F7] font-bold">{selectedFinish}</span>
              </div>
              <div className="flex items-center gap-2">
                {finishes.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedFinish(f.name);
                    }}
                    className={`px-3 py-1.5 border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                      selectedFinish === f.name
                        ? 'bg-[#141416] border-[#0066FF] text-[#F5F5F7] shadow-sm'
                        : 'bg-[#0E0E10] border-[#1A1A1D] text-[#71717A] hover:text-[#F5F5F7]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.hex }} />
                    <span className="text-[10px]">{f.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Stepped Switch */}
            <div className="space-y-2 pt-2 border-t border-[#1A1A1D]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#71717A]">MÓDULO DE ALMACENAMIENTO:</span>
                <span className="text-[#0066FF] font-bold">{selectedStorage}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['256GB', '512GB', '1TB'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedStorage(s);
                    }}
                    className={`py-2 border transition-all cursor-pointer ${
                      selectedStorage === s
                        ? 'bg-[#0066FF] text-[#F5F5F7] border-[#0066FF] font-bold'
                        : 'bg-[#0E0E10] border-[#1A1A1D] text-[#71717A] hover:text-[#F5F5F7]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Primary Action */}
            <div className="pt-4 border-t border-[#1A1A1D] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">VALOR CANÓNICO</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#F5F5F7] font-mono tracking-tight tabular-nums">
                    ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-mono text-[#71717A]">USD</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBuy}
                  className="px-5 py-3 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDetail && onOpenDetail(flagshipProduct)}
                  className="p-3 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] text-[#F5F5F7] transition-all cursor-pointer"
                  title="Ver Datasheet Completo"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS (60% VIEWPORT FEEL): Big Phone in 3/4 angle with floating specs */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] lg:min-h-[560px] order-1 lg:order-2">
            
            {/* Subtle Technical Radial Backlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.06),transparent_65%)] pointer-events-none" />

            {/* Main Phone Showcase: Inclinado en ángulo 3/4 */}
            <div className="relative z-10 w-full max-w-[480px] flex items-center justify-center">
              <img
                src={flagshipProduct.images[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop&q=90'}
                alt={flagshipProduct.name}
                className="w-4/5 sm:w-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] transform hover:rotate-[-2deg] hover:scale-105 transition-transform duration-500 ease-out"
                style={{
                  transform: 'rotate(-4deg) perspective(1000px) rotateY(-8deg)',
                }}
              />
            </div>

            {/* FLOATING SPECS CALLOUTS (Al lado, no debajo) */}
            
            {/* Callout 1: Top Right (Camera) */}
            <div className="absolute top-4 right-0 sm:right-4 z-20 p-3 bg-[#0E0E10]/95 border border-[#1A1A1D] max-w-[170px] backdrop-blur-md hidden sm:block">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#0066FF] font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>48 MP FUSION</span>
              </div>
              <p className="text-[10px] text-[#71717A] font-mono mt-1 leading-snug">
                Sensor Quad-Pixel de 2ª gen con revestimiento antirreflejo.
              </p>
            </div>

            {/* Callout 2: Left Middle (Processor) */}
            <div className="absolute top-1/3 left-0 sm:left-2 z-20 p-3 bg-[#0E0E10]/95 border border-[#1A1A1D] max-w-[160px] backdrop-blur-md hidden md:block">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#0066FF] font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>APPLE A18 PRO</span>
              </div>
              <p className="text-[10px] text-[#71717A] font-mono mt-1 leading-snug">
                Arquitectura de 3 nanómetros con Ray Tracing por hardware.
              </p>
            </div>

            {/* Callout 3: Bottom Right (Material) */}
            <div className="absolute bottom-6 right-2 sm:right-6 z-20 p-3 bg-[#0E0E10]/95 border border-[#1A1A1D] max-w-[180px] backdrop-blur-md hidden sm:block">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#0066FF] font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span>TITANIO G5</span>
              </div>
              <p className="text-[10px] text-[#71717A] font-mono mt-1 leading-snug">
                Mecanizado unibody con disipación térmica por grafito.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
