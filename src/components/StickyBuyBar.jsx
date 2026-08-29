'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { playCartSuccess, playSubtleClick } from '../utils/audioHaptics';

export const StickyBuyBar = ({ product, selectedColor, selectedStorage, onBuy, onOpen3D }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) return null;

  return (
    <aside
      aria-label="Barra de compra rápida"
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-12 py-3.5 bg-[#0a0a0c]/92 backdrop-blur-md border-b border-[rgba(243,239,230,0.08)] transition-transform duration-350 ease-out shadow-2xl ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-[#1b1b1f] border border-[rgba(243,239,230,0.08)] flex items-center justify-center p-1 shrink-0">
          <img
            src={product.images?.[0]}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-[#f3efe6] truncate">
            {product.name}
          </span>
          <span className="text-xs text-[#8b8680] truncate">
            {selectedColor?.name || 'Titanio Natural'} • {selectedStorage || '256 GB'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <span className="text-base font-bold text-[#f3efe6] font-mono">
            ${product.price} <span className="text-[10px] text-[#8b8680] font-sans">USD</span>
          </span>
          <span className="text-[11px] text-[#8b8680] block font-light">
            o 12 cuotas sin interés
          </span>
        </div>

        {onOpen3D && (
          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              onOpen3D();
            }}
            className="hidden md:flex px-4 py-2 rounded-xl border border-[rgba(243,239,230,0.16)] text-[#f3efe6] hover:border-[#c9a227] hover:text-[#e4c972] text-xs font-medium transition-colors cursor-pointer"
          >
            Ver en 3D
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            playCartSuccess();
            onBuy();
          }}
          className="px-6 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#e4c972] text-[#0a0a0c] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Comprar</span>
        </button>
      </div>
    </aside>
  );
};
