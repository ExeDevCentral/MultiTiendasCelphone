'use client';

import React, { useState } from 'react';
import { ShoppingBag, Scale, Check, History, Sparkles, MessageSquare, Box } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playCartSuccess, playSpatialOpen } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const ProductCard = ({ product, onOpenDetail, onOpen3DModal, onPrefetch3D }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { comparedProducts, toggleCompare, stores } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

  const isCompared = comparedProducts.some((p) => p.id === product.id);
  const storeInfo = stores.find((s) => s.id === product.storeId);

  // Technical Generation Badges
  const getGenerationBadge = () => {
    if (product.generationCategory === 'last_2_years') {
      return (
        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#1f222c] border border-[#ff4800] text-[#ff4800] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#ff4800] animate-pulse" />
          FLAGSHIP // {product.modelYear}
        </span>
      );
    }
    if (product.generationCategory === 'vintage_classic') {
      return (
        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#1b2216] border border-[#ccff00] text-[#ccff00] flex items-center gap-1.5">
          <History className="w-3 h-3 text-[#ccff00]" />
          VINTAGE // {product.modelYear}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#1a1c24] border border-[#343847] text-zinc-400 flex items-center gap-1">
        SERIES // {product.modelYear}
      </span>
    );
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleQuickWhatsApp = (e) => {
    e.stopPropagation();
    playSubtleClick();
    const phone = storeInfo?.phoneWhatsApp || '+5491145239900';
    const text = encodeURIComponent(
      `[ORDEN DE CONSULTA] Me interesa adquirir: ${product.name} (${selectedColor?.name || 'Estándar'}) en la boutique ${storeInfo?.name || 'CelStore'}. ¿Confirmar disponibilidad?`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    playCartSuccess();
    addToCart(product, { color: selectedColor?.name });
    showLuxuryNotification(
      'HARDWARE ALLOCATED TO CART',
      `${product.name} // [${selectedColor?.name || 'Estándar'}] — $${product.price} USD`
    );
    setIsCartOpen(true);
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    playSubtleClick();
    toggleCompare(product);
    showLuxuryNotification(
      isCompared ? 'REMOVED FROM COMPARISON' : 'ADDED TO COMPARISON RIG',
      product.name
    );
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(product)}
      onMouseEnter={() => onPrefetch3D && onPrefetch3D(product)}
      onTouchStart={() => onPrefetch3D && onPrefetch3D(product)}
      className="group relative bg-[#13151b] border-2 border-[#242733] hover:border-[#ff4800] p-4 flex flex-col justify-between cursor-pointer transition-all duration-150 select-none font-mono has-crosshairs"
    >
      {/* Module Header */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.type === 'phone' ? (
              getGenerationBadge()
            ) : (
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-[#1a1c24] text-zinc-400 border border-[#343847]">
                ACCESSORY
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#ff4800] text-black">
                -{discountPercent}%
              </span>
            )}
          </div>

          {product.type === 'phone' && (
            <button
              type="button"
              onClick={handleToggleCompare}
              className={`px-1.5 py-0.5 text-[10px] border font-bold transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#ff4800] border-[#ff4800] text-black'
                  : 'bg-[#181a22] border-[#2e3240] text-zinc-400 hover:text-white'
              }`}
              title="Comparar hardware"
            >
              {isCompared ? '[COMPARED]' : '[COMP]'}
            </button>
          )}
        </div>

        {/* Product Image Stage */}
        <div className="relative w-full h-44 flex items-center justify-center my-2 bg-[#0e1015] border border-[#21242e] p-3 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />

          {/* 3D Trigger */}
          {product.type === 'phone' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playSpatialOpen();
                onOpen3DModal && onOpen3DModal(product, selectedColor);
              }}
              className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-[#171a23] hover:bg-[#ff4800] border border-[#303545] hover:border-[#ff4800] text-[9px] font-bold text-zinc-300 hover:text-black flex items-center gap-1 transition-all cursor-pointer"
            >
              <Box className="w-2.5 h-2.5" />
              <span>[3D]</span>
            </button>
          )}
        </div>

        {/* Technical Data Content */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase mb-1">
            <span className="text-[#ff4800]">{product.brand}</span>
            <span className="truncate max-w-[120px]" title={storeInfo?.name}>
              {storeInfo?.name || 'CENTRAL'}
            </span>
          </div>

          <h4 className="text-sm font-black text-[#f0f0eb] group-hover:text-[#ff4800] transition-colors truncate font-sans uppercase">
            {product.name}
          </h4>

          {product.solutions?.[0] && (
            <p className="mt-1 text-[10px] text-zinc-400 line-clamp-1">
              // {product.solutions[0].badge}: {product.solutions[0].title}
            </p>
          )}
        </div>

        {/* Color Switcher Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 my-2.5">
            {product.colors.map((col) => (
              <button
                type="button"
                key={col.name}
                onClick={(e) => {
                  e.stopPropagation();
                  playSubtleClick();
                  setSelectedColor(col);
                }}
                className={`w-3.5 h-3.5 border transition-all cursor-pointer ${
                  selectedColor?.name === col.name
                    ? 'border-[#ff4800] ring-1 ring-[#ff4800] scale-110'
                    : 'border-black opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            <span className="text-[9px] text-zinc-500 ml-1 truncate max-w-[90px]">
              {selectedColor?.name}
            </span>
          </div>
        )}
      </div>

      {/* Module Pricing & Physical Action Bar */}
      <div className="pt-2 border-t border-[#222530] flex items-center justify-between gap-1.5 mt-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#f0f0eb] font-mono tracking-tight">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-[9px] text-zinc-500">USD</span>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[9px] text-zinc-600 line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleQuickWhatsApp}
            className="p-1.5 bg-[#171922] border border-[#2b2f3e] hover:border-[#25D366] text-zinc-400 hover:text-[#25D366] transition-all cursor-pointer"
            title="Consultar por WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-industrial-primary text-[10px] py-1.5 px-3"
            title="Añadir al inventario"
          >
            <span>+ BUY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
