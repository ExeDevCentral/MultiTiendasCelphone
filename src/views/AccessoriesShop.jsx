'use client';

import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, Zap, Shield, Headphones, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useCartStore } from '../store/useCartStore';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';

export const AccessoriesShop = ({ onNavigate }) => {
  const { products, stores } = useStore();
  const { addToCart } = useCart();
  const cartStore = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const accessories = products.filter((p) => p.type === 'accessory');

  const categories = [
    { id: 'all', label: '[ 01: TODOS ]' },
    { id: 'Cargadores & Energía', label: '[ 02: ENERGÍA & GaN ]' },
    { id: 'Fundas & Protección', label: '[ 03: BLINDAJE & TITANIO ]' },
    { id: 'Audio & Auriculares', label: '[ 04: AUDIO ESTUDIO ]' },
    { id: 'Cargadores & Vintage', label: '[ 05: VINTAGE REPRO ]' },
  ];

  const filtered = selectedCategory === 'all'
    ? accessories
    : accessories.filter((a) => a.category === selectedCategory);

  const handleAddToCart = (acc) => {
    playCartSuccess();
    addToCart(acc);
    cartStore.addItem({
      id: acc.id,
      name: acc.name,
      price: Number(acc.price),
      image: acc.images?.[0] || '',
      color: 'Estándar',
      storage: 'N/A',
      maxStock: acc.stock || 99,
      storeId: acc.storeId || 'store-celstore-premium',
    });
  };

  const handleWhatsAppInquiry = (acc) => {
    playSubtleClick();
    const storeInfo = stores.find((s) => s.id === acc.storeId) || stores[0];
    const phone = (storeInfo?.phoneWhatsApp || '5493416874786').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `[CELSTORE // TERMINAL INQUIRY] Hola, deseo consultar disponibilidad y especificaciones del accesorio *${acc.name}* ($${acc.price} USD).`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 font-mono">
      {/* Precision Hardware Console Header */}
      <div className="bg-[#0E0E10] border border-[#1A1A1D] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-[#0066FF] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
            TERMINAL // ACCESORIOS & MÓDULOS DE PRECISIÓN
          </span>
          <span className="text-[10px] text-[#71717A] bg-[#141416] px-2 py-0.5 border border-[#1A1A1D] hidden sm:inline-block">
            MODO PRUEBA // 0 CONSUMO SUPABASE
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-[#F5F5F7]">
          Periféricos de Alto Rendimiento & Protección
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-2xl font-mono leading-relaxed">
          Carga ultrarrápida GaN III, blindaje aeroespacial con fibra de aramida, audio espacial de alta fidelidad y adaptadores clásicos de época.
        </p>
      </div>

      {/* Category Pills Stepped Switch */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => {
              playSubtleClick();
              setSelectedCategory(cat.id);
            }}
            className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22] border border-[#1A1A1D]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accessories Precision Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((acc) => {
          const storeInfo = stores.find((s) => s.id === acc.storeId);
          return (
            <div
              key={acc.id}
              className="bg-[#0E0E10] border border-[#1A1A1D] hover:border-[#0066FF] p-4 flex flex-col justify-between transition-colors group relative"
            >
              {/* Product Frame with Crosshair Indicators */}
              <div>
                <div className="relative h-44 bg-[#141416] border border-[#1A1A1D] p-4 flex items-center justify-center mb-3">
                  <img
                    src={acc.images?.[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'}
                    alt={acc.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0E0E10] border border-[#1A1A1D] text-[#0066FF]">
                    {acc.category || 'ACCESORIO'}
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#71717A] font-mono">
                    STOCK: {acc.stock || 20} U
                  </div>
                </div>

                <div className="text-[10px] text-[#71717A] font-mono uppercase tracking-wider mb-1">
                  // {storeInfo?.name || 'Boutique CelStore'}
                </div>

                <h3 className="text-sm font-bold font-sans text-[#F5F5F7] mb-1.5 line-clamp-2">
                  {acc.name}
                </h3>
                <p className="text-xs text-[#71717A] line-clamp-2 mb-3 leading-relaxed">
                  {acc.description}
                </p>

                {acc.compatibility && (
                  <div className="p-2 bg-[#141416] border border-[#1A1A1D] text-[10px] text-[#71717A] mb-3">
                    <strong className="text-[#F5F5F7]">// COMPATIBILIDAD:</strong> {acc.compatibility}
                  </div>
                )}
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t border-[#1A1A1D] flex items-center justify-between gap-2">
                <div>
                  <div className="text-base font-bold font-mono text-[#F5F5F7] tabular-nums">
                    ${Number(acc.price).toLocaleString()} <span className="text-[10px] text-[#71717A] font-normal">USD</span>
                  </div>
                  {acc.originalPrice && (
                    <span className="text-[10px] text-[#71717A] line-through block font-mono">
                      ${acc.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppInquiry(acc)}
                    className="p-2 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#25D366] text-[#25D366] cursor-pointer transition-colors"
                    title="Consultar por WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(acc)}
                    className="px-3 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all active:translate-y-[1px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>[ + AÑADIR ]</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
