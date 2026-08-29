'use client';

import React, { useState } from 'react';
import { ShoppingBag, Scale, Check, History, Sparkles, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playCartSuccess, playSpatialOpen } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const ProductCard = ({ product, onOpenDetail, onOpen3DModal, onPrefetch3D }) => {
  const { addToCart } = useCart();
  const { comparedProducts, toggleCompare, stores } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

  const isCompared = comparedProducts.some((p) => p.id === product.id);
  const storeInfo = stores.find((s) => s.id === product.storeId);

  // 60-30-10 Badges Editoriales
  const getGenerationBadge = () => {
    if (product.generationCategory === 'last_2_years') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-medium bg-[rgba(201,162,39,0.10)] border border-[rgba(243,239,230,0.16)] text-[#f3efe6] flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
          Flagship • {product.modelYear}
        </span>
      );
    }
    if (product.generationCategory === 'vintage_classic') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-medium bg-[rgba(201,162,39,0.15)] border border-[#c9a227] text-[#e4c972] flex items-center gap-1.5 shadow-sm">
          <History className="w-3 h-3 text-[#c9a227]" />
          Vintage Archive • {product.modelYear}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-medium bg-[rgba(243,239,230,0.04)] border border-[rgba(243,239,230,0.08)] text-[#8b8680] flex items-center gap-1.5 shadow-sm">
        <Sparkles className="w-3 h-3 text-[#8b8680]" />
        Series {product.modelYear}
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
      `¡Hola! Me interesa adquirir el *${product.name}* (${selectedColor?.name || 'Estándar'}) en *${storeInfo?.name || 'CelStore'}*. ¿Cuentan con disponibilidad?`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, { color: selectedColor?.name });
    showLuxuryNotification(
      'Pieza Añadida a la Bolsa',
      `${product.name} (${selectedColor?.name || 'Estándar'}) • $${product.price} USD`
    );
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    playSubtleClick();
    toggleCompare(product);
    showLuxuryNotification(
      isCompared ? 'Removido del Comparador' : 'Añadido al Comparador',
      product.name
    );
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(product)}
      onMouseEnter={() => onPrefetch3D && onPrefetch3D(product)}
      onTouchStart={() => onPrefetch3D && onPrefetch3D(product)}
      className="group relative rounded-[20px] p-5 flex flex-col justify-between cursor-pointer border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227] overflow-hidden transition-all duration-350 bg-[#131316] hover:bg-[#1b1b1f] shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
    >
      {/* Top Header: 60-30-10 Badge & Compare */}
      <div className="flex items-center justify-between gap-2 mb-2 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.type === 'phone' ? (
            getGenerationBadge()
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.1em] bg-[rgba(243,239,230,0.04)] text-[#8b8680] border border-[rgba(243,239,230,0.08)]">
              Accessory
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(201,162,39,0.15)] text-[#e4c972] border border-[#c9a227]/40">
              -{discountPercent}%
            </span>
          )}
        </div>

        {product.type === 'phone' && (
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`p-1.5 rounded-full border transition-all text-xs flex items-center justify-center cursor-pointer ${
              isCompared
                ? 'bg-[#c9a227] border-[#c9a227] text-[#0a0a0c]'
                : 'bg-[#0a0a0c]/60 border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
            }`}
            title="Comparar modelo"
          >
            {isCompared ? <Check className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Product Image Stage (30% Secondary Container) */}
      <div className="relative w-full h-48 sm:h-52 flex items-center justify-center my-3 overflow-hidden rounded-[16px] bg-[#1b1b1f] p-4 border border-[rgba(243,239,230,0.06)]">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* 3D Model Quick Trigger */}
        {product.type === 'phone' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playSpatialOpen();
              onOpen3DModal && onOpen3DModal(product, selectedColor);
            }}
            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-[#0a0a0c]/85 hover:bg-[#1b1b1f] border border-[rgba(243,239,230,0.16)] text-[11px] tracking-wide text-[#f3efe6] hover:text-[#e4c972] hover:border-[#c9a227] backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
            <span>3D View</span>
          </button>
        )}
      </div>

      {/* Middle Content */}
      <div className="mt-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] tracking-wide uppercase text-[#8b8680] font-medium mb-1">
            <span>{product.brand}</span>
            <span className="text-[#8b8680] truncate max-w-[130px]" title={storeInfo?.name}>
              {storeInfo?.name || 'CelStore'}
            </span>
          </div>

          <h4 className="text-[17px] font-semibold text-[#f3efe6] group-hover:text-[#e4c972] transition-colors line-clamp-1">
            {product.name}
          </h4>

          {product.solutions?.[0] && (
            <div className="my-2 p-2 rounded-xl bg-[rgba(243,239,230,0.02)] border border-[rgba(243,239,230,0.06)] flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-1.5 shrink-0" />
              <p className="text-[11px] text-[#8b8680] line-clamp-2 leading-relaxed">
                <strong className="text-[#f3efe6] font-medium">{product.solutions[0].badge}:</strong> {product.solutions[0].title}
              </p>
            </div>
          )}
        </div>

        {/* Color Palette Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 my-2">
            {product.colors.map((col) => (
              <button
                type="button"
                key={col.name}
                onClick={(e) => {
                  e.stopPropagation();
                  playSubtleClick();
                  setSelectedColor(col);
                }}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  selectedColor?.name === col.name
                    ? 'border-[#c9a227] scale-125 shadow-md ring-1 ring-white/30'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            <span className="text-[10px] tracking-wide text-[#8b8680] ml-1.5 truncate max-w-[90px]">
              {selectedColor?.name}
            </span>
          </div>
        )}

        {/* Bottom Price & Actions (10% Accent Gold) */}
        <div className="pt-3 border-t border-[rgba(243,239,230,0.08)] flex items-center justify-between gap-2 mt-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#f3efe6] font-mono tracking-tight">
                ${product.price}
              </span>
              <span className="text-[11px] text-[#8b8680] uppercase">USD</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[#8b8680]/60 line-through font-mono">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickWhatsApp}
              className="p-2.5 rounded-xl bg-[rgba(243,239,230,0.04)] hover:bg-[#1b1b1f] border border-[rgba(243,239,230,0.10)] hover:border-[#c9a227] text-[#8b8680] hover:text-[#f3efe6] transition-colors cursor-pointer"
              title="Consultar por WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-xl bg-[#c9a227] hover:bg-[#e4c972] text-[#0a0a0c] font-bold text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:-translate-y-0.5"
              title="Añadir a la Bolsa"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
