'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  MessageSquare,
  Box,
  ShieldCheck,
  Truck,
  Cpu,
  Camera,
  BatteryCharging,
  HardDrive,
  Layers,
  Scale,
  Maximize2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playCartSuccess, playSpatialOpen } from '../utils/audioHaptics';
import { showLuxuryNotification } from '../components/LuxuryToaster';

export const ProductDetail = ({ product, onBack, onNavigate, onOpen3DModal }) => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { stores, toggleCompare, comparedProducts } = useStore();

  const storeInfo = stores.find((s) => s.id === product.storeId) || stores[0];

  const colors = product.colors || [
    { name: 'Titanio Natural', hex: '#9d968d', code: 'TN-01' },
    { name: 'Negro Espacial DLC', hex: '#1f2024', code: 'BK-02' },
    { name: 'Blanco Cerámico', hex: '#e2e3e8', code: 'WH-03' },
    { name: 'Titanio Desierto', hex: '#c5a880', code: 'DT-04' },
  ];

  const storageOptions = product.storageOptions || ['128 GB', '256 GB', '512 GB', '1 TB'];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(
    storageOptions.includes('512 GB') ? '512 GB' : storageOptions[0]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop&q=90'];

  const specs = product.specs || {
    ram: '8 GB LPDDR5X',
    almacenamiento: selectedStorage,
    camara: '48 MP Fusion + 48 MP Ultra Wide + 12 MP Telephoto',
    bateria: '4685 mAh (33h video)',
    procesador: 'Apple A18 Pro (3nm)',
    pantalla: '6.9" Super Retina XDR OLED 120Hz',
    peso: '227 g',
    material: 'Titanio Grado 5',
  };

  const isCompared = comparedProducts.some((p) => p.id === product.id);

  // Storage price modifier
  const storageModifier = selectedStorage === '1 TB' ? 300 : selectedStorage === '512 GB' ? 150 : 0;
  const currentPrice = Number(product.price) + storageModifier;

  const handleAddToCart = () => {
    playCartSuccess();
    addToCart(product, {
      color: selectedColor.name,
      storage: selectedStorage,
      price: currentPrice,
    });
    showLuxuryNotification(
      'UNIDAD AÑADIDA AL CARRITO',
      `${product.name} [${selectedColor.name} • ${selectedStorage}] — $${currentPrice} USD`
    );
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCheckoutOpen(true);
  };

  const handleWhatsApp = () => {
    playSubtleClick();
    const phone = storeInfo?.phoneWhatsApp || '5491145239900';
    const message = encodeURIComponent(
      `¡Hola! Me interesa comprar el *${product.name}*:\n` +
      `• Acabado: ${selectedColor.name}\n` +
      `• Almacenamiento: ${selectedStorage}\n` +
      `• Precio: $${currentPrice} USD\n` +
      `¿Me confirman disponibilidad de stock y método de despacho?`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="w-full bg-[#0E0E10] text-[#F5F5F7] min-h-screen py-8 select-none font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1A1D] mb-8 text-xs">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-[#71717A] hover:text-[#F5F5F7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#0066FF]" />
            <span>[ VOLVER AL CATÁLOGO ]</span>
          </button>

          <div className="flex items-center gap-4 text-[11px] text-[#71717A]">
            <span className="text-[#0066FF] font-bold">● MODO PRUEBA ACTIVO (LOCAL)</span>
            <span>SKU: {product.model || product.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT 6 COLS: Image Gallery Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full h-[400px] sm:h-[500px] bg-[#0A0A0C] border border-[#1A1A1D] flex items-center justify-center p-8 overflow-hidden">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300"
              />

              {/* 3D Trigger Badge */}
              <button
                type="button"
                onClick={() => {
                  playSpatialOpen();
                  onOpen3DModal && onOpen3DModal(product);
                }}
                className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#141416] hover:bg-[#0066FF] border border-[#1A1A1D] hover:border-[#0066FF] text-xs font-mono text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Box className="w-3.5 h-3.5" />
                <span>INSPECCIÓN 3D</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 bg-[#0A0A0C] border p-1 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#0066FF] ring-1 ring-[#0066FF]'
                        : 'border-[#1A1A1D] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality & Security Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#141416] border border-[#1A1A1D] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#F5F5F7]">GARANTÍA 24M</div>
                  <div className="text-[10px] text-[#71717A]">Cobertura oficial de fábrica</div>
                </div>
              </div>
              <div className="p-3 bg-[#141416] border border-[#1A1A1D] flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#0066FF] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#F5F5F7]">DESPACHO BLINDADO</div>
                  <div className="text-[10px] text-[#71717A]">Seguro de transporte total</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: Product Specs & Ordering */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#71717A] uppercase mb-1">
                <span className="text-[#0066FF] font-bold">[{product.brand}]</span>
                <span>ORIGEN: BOUTIQUE OFICIAL</span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] tracking-tight uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {product.name}
              </h1>
              <p className="mt-2 text-xs text-[#71717A] font-sans leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* COLOR FINISH SELECTOR */}
            <div className="space-y-2 pt-3 border-t border-[#1A1A1D]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717A]">ACABADO:</span>
                <span className="text-[#F5F5F7] font-bold">{selectedColor.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedColor(c);
                    }}
                    className={`px-3 py-1.5 border text-xs transition-all cursor-pointer flex items-center gap-2 ${
                      selectedColor.name === c.name
                        ? 'bg-[#141416] border-[#0066FF] text-[#F5F5F7]'
                        : 'bg-[#0E0E10] border-[#1A1A1D] text-[#71717A] hover:text-[#F5F5F7]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STORAGE MODULE SELECTOR */}
            <div className="space-y-2 pt-3 border-t border-[#1A1A1D]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717A]">CAPACIDAD:</span>
                <span className="text-[#0066FF] font-bold">{selectedStorage}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {storageOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedStorage(st);
                    }}
                    className={`py-2 text-xs text-center border transition-all cursor-pointer ${
                      selectedStorage === st
                        ? 'bg-[#0066FF] text-[#F5F5F7] border-[#0066FF] font-bold'
                        : 'bg-[#0E0E10] border-[#1A1A1D] text-[#71717A] hover:text-[#F5F5F7]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICING & ACTIONS */}
            <div className="p-4 bg-[#141416] border border-[#1A1A1D] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-[#71717A] uppercase block">PRECIO AUTORITATIVO</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-[#F5F5F7] tracking-tight tabular-nums">
                      ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-[#71717A]">USD</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#71717A] tabular-nums">
                  <span className="text-[#0066FF] font-bold block">● STOCK DISPONIBLE: {product.stock || 12}</span>
                  <span>IVA INCLUIDO</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-[#1E1E22] hover:bg-[#2A2A30] border border-[#1A1A1D] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:translate-y-[1px]"
                >
                  <span>Iniciar Compra</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consultar o Reservar por WhatsApp Business</span>
              </button>
            </div>

            {/* FULL DATASHEET TABLE */}
            <div className="border border-[#1A1A1D] divide-y divide-[#1A1A1D] text-xs">
              <div className="p-3 bg-[#0A0A0C] text-[11px] font-bold text-[#0066FF] uppercase">
                // FICHA TÉCNICA COMPLETA (DATASHEET)
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="text-[#71717A]">PROCESADOR</span>
                <span className="col-span-2 text-[#F5F5F7]">{specs.procesador || 'Octa-Core Flagship'}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="text-[#71717A]">PANTALLA</span>
                <span className="col-span-2 text-[#F5F5F7]">{specs.pantalla || 'OLED 120Hz'}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="text-[#71717A]">CÁMARA</span>
                <span className="col-span-2 text-[#F5F5F7]">{specs.camara || '48 MP'}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="text-[#71717A]">BATERÍA</span>
                <span className="col-span-2 text-[#F5F5F7]">{specs.bateria || '5000 mAh'}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="text-[#71717A]">MATERIALES</span>
                <span className="col-span-2 text-[#F5F5F7]">{specs.material || 'Titanio / Cristal'}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="text-[#71717A]">PESO</span>
                <span className="col-span-2 text-[#F5F5F7] tabular-nums">{specs.peso || '221 g'}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
