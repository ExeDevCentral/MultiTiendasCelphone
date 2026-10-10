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
  Layers
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
    { name: 'Negro Espacial DLC', hex: '#222327', code: 'BK-02' },
    { name: 'Blanco Cerámico', hex: '#e3e4e9', code: 'WH-03' },
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
    const phone = storeInfo?.phoneWhatsApp || '5493416874786';
    const message = encodeURIComponent(
      `¡Hola! Me interesa comprar el *${product.name}*:\n` +
      `• Acabado: ${selectedColor.name}\n` +
      `• Almacenamiento: ${selectedStorage}\n` +
      `• Precio: $${currentPrice} USD\n` +
      `¿Tienen stock disponible para entrega inmediata?`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="w-full bg-white dark:bg-black text-black dark:text-white min-h-screen py-10 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10 mb-10 text-sm">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Volver al Catálogo</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stock Disponible
            </span>
            <span>SKU: {product.model || product.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT 6 COLS: Image Gallery Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full h-[420px] sm:h-[520px] bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-3xl flex items-center justify-center p-8 overflow-hidden shadow-xs">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-2xl transition-all duration-300"
              />

              {/* 3D Trigger Badge */}
              <button
                type="button"
                onClick={() => {
                  playSpatialOpen();
                  onOpen3DModal && onOpen3DModal(product);
                }}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 dark:bg-black/90 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 transition-all cursor-pointer shadow-lg rounded-full backdrop-blur-md"
                title="Explorar celular en 3D interactivo con chasis 360°"
              >
                <Box className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                <span>Ver en 3D (360°)</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 h-18 rounded-2xl bg-[#F5F5F7] dark:bg-[#121214] border p-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-600/30'
                        : 'border-black/5 dark:border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-black dark:text-white">Garantía 24M</div>
                  <div className="text-xs text-zinc-500">Cobertura oficial total</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-black dark:text-white">Despacho Blindado</div>
                  <div className="text-xs text-zinc-500">Seguro de transporte</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: Product Specs & Ordering */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 uppercase mb-1 font-semibold">
                <span className="text-blue-600">{product.brand}</span>
                <span>Boutique Oficial</span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white"
                style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
              >
                {product.name}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* COLOR FINISH SELECTOR */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-zinc-500 dark:text-zinc-400">Color seleccionado:</span>
                <span className="text-black dark:text-white">{selectedColor.name}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedColor(c);
                    }}
                    className={`px-4 py-2 rounded-full border text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                      selectedColor.name === c.name
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                        : 'border-black/10 dark:border-white/15 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STORAGE MODULE SELECTOR */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-zinc-500 dark:text-zinc-400">Capacidad:</span>
                <span className="text-blue-600">{selectedStorage}</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {storageOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setSelectedStorage(st);
                    }}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm text-center border transition-all cursor-pointer font-semibold ${
                      selectedStorage === st
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-black/10 dark:border-white/15 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICING & ACTIONS */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-zinc-500 uppercase block font-medium">Precio Final</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white tabular-nums">
                      ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-zinc-500 font-medium">USD</span>
                  </div>
                </div>

                <div className="text-right text-xs text-zinc-500 font-medium">
                  <span className="text-emerald-600 font-bold block">● Stock Disponible: {product.stock || 12}</span>
                  <span>IVA Incluido</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3.5 px-5 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <span>Iniciar Compra</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300/40 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consultar o Reservar por WhatsApp Business</span>
              </button>
            </div>

            {/* FULL DATASHEET TABLE */}
            <div className="rounded-2xl border border-black/5 dark:border-white/10 divide-y divide-black/5 dark:divide-white/10 text-xs sm:text-sm overflow-hidden bg-[#F5F5F7] dark:bg-[#121214]">
              <div className="p-4 bg-black/5 dark:bg-white/5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Ficha Técnica Oficial
              </div>
              <div className="p-3.5 grid grid-cols-3">
                <span className="text-zinc-500 font-medium">Procesador</span>
                <span className="col-span-2 font-semibold text-black dark:text-white">{specs.procesador || 'Octa-Core Flagship'}</span>
              </div>
              <div className="p-3.5 grid grid-cols-3">
                <span className="text-zinc-500 font-medium">Pantalla</span>
                <span className="col-span-2 font-semibold text-black dark:text-white">{specs.pantalla || 'OLED 120Hz'}</span>
              </div>
              <div className="p-3.5 grid grid-cols-3">
                <span className="text-zinc-500 font-medium">Cámaras</span>
                <span className="col-span-2 font-semibold text-black dark:text-white">{specs.camara || '48 MP'}</span>
              </div>
              <div className="p-3.5 grid grid-cols-3">
                <span className="text-zinc-500 font-medium">Batería</span>
                <span className="col-span-2 font-semibold text-black dark:text-white">{specs.bateria || '5000 mAh'}</span>
              </div>
              <div className="p-3.5 grid grid-cols-3">
                <span className="text-zinc-500 font-medium">Materiales</span>
                <span className="col-span-2 font-semibold text-black dark:text-white">{specs.material || 'Titanio / Cristal'}</span>
              </div>
              <div className="p-3.5 grid grid-cols-3">
                <span className="text-zinc-500 font-medium">Peso</span>
                <span className="col-span-2 font-semibold text-black dark:text-white tabular-nums">{specs.peso || '221 g'}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
