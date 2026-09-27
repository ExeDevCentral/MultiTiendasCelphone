'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Box } from 'lucide-react';
import { playCartSuccess, playSubtleClick } from '../utils/audioHaptics';

export const StickyBuyBar = ({ product, selectedColor, selectedStorage, onBuy, onOpen3D }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
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
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 bg-[#090a0d] border-b-2 border-[#ff4800] transition-transform duration-200 ease-out font-mono select-none shadow-[0px_4px_12px_rgba(0,0,0,0.8)] ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-[#151720] border border-[#2b2e3c] flex items-center justify-center p-1 shrink-0">
          <img
            src={product.images?.[0]}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-[#f0f0eb] truncate uppercase">
            {product.name}
          </span>
          <span className="text-[10px] text-zinc-500 truncate">
            [{selectedColor?.name || 'RAW TITANIUM'} // {selectedStorage || '256 GB'}]
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <span className="text-sm font-black text-[#f0f0eb]">
            ${product.price.toLocaleString()} <span className="text-[9px] text-[#ff4800]">USD</span>
          </span>
          <span className="text-[9px] text-zinc-500 block">
            ● INVENTORY ALLOCATED
          </span>
        </div>

        {onOpen3D && (
          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              onOpen3D();
            }}
            className="hidden md:flex px-2.5 py-1.5 border border-[#303444] bg-[#14161f] text-zinc-300 hover:text-white hover:border-[#ff4800] text-[10px] font-bold items-center gap-1 transition-colors cursor-pointer"
          >
            <Box className="w-3 h-3 text-[#ff4800]" />
            <span>[3D]</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            playCartSuccess();
            onBuy();
          }}
          className="btn-industrial-primary text-[10px] py-1.5 px-3.5 flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 fill-current" />
          <span>+ BUY</span>
        </button>
      </div>
    </aside>
  );
};
