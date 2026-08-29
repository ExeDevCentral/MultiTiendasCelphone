'use client';

import React from 'react';
import { X, Scale, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const ComparisonModal = () => {
  const { comparedProducts, removeCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useStore();
  const { addToCart } = useCart();

  if (!isCompareOpen || comparedProducts.length === 0) return null;

  const handleClose = () => {
    playSubtleClick();
    setIsCompareOpen(false);
  };

  const handleClear = () => {
    playSubtleClick();
    clearCompare();
    showLuxuryNotification('Comparador Vaciado', 'Se han removido los modelos de la comparativa.');
  };

  const handleRemoveOne = (id, name) => {
    playSubtleClick();
    removeCompare(id);
    showLuxuryNotification('Modelo Removido', name);
  };

  const handleAddToCart = (phone) => {
    playCartSuccess();
    addToCart(phone);
    showLuxuryNotification('Añadido a la Bolsa', `${phone.name} • $${phone.price} USD`);
    setIsCompareOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in"
      />

      <div className="relative w-full max-w-5xl bg-[#0c0c0e] border border-[#c5a880]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white z-10 max-h-[90vh] overflow-y-auto">
        {/* Header Editorial */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/[0.03] text-[#c5a880] border border-[#c5a880]/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#c5a880] font-light block">
                Análisis Comparativo Atelier
              </span>
              <h3 
                className="text-2xl font-light text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Comparativa Cara a Cara
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] tracking-wider uppercase font-light text-neutral-400 hover:text-[#c5a880] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid Comparativo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {comparedProducts.map((phone) => (
            <div key={phone.id} className="pt-6 md:pt-0 md:px-4 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                {/* Header Card */}
                <div className="relative h-44 rounded-2xl bg-black/60 p-4 flex items-center justify-center mb-4 border border-white/[0.04]">
                  <img
                    src={phone.images?.[0]}
                    alt={phone.name}
                    className="max-h-full object-contain filter drop-shadow-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOne(phone.id, phone.name)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-[#c5a880] text-neutral-400 hover:text-black transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center mb-4">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[#c5a880] block mb-1 font-light">
                    {phone.brand} • {phone.modelYear}
                  </span>
                  <h4 
                    className="text-lg font-light text-white mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {phone.name}
                  </h4>
                  <div className="text-lg font-mono font-light text-[#f5e0c3]">${phone.price} USD</div>
                </div>

                {/* Solution Summary */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-5">
                  <h5 className="text-[9px] font-light text-[#c5a880] uppercase tracking-[0.25em] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#c5a880]" />
                    Propósito Principal
                  </h5>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {phone.solutions?.[0]?.description || phone.tagline}
                  </p>
                </div>

                {/* Specs Table */}
                <div className="space-y-2 text-xs font-light">
                  <div className="border-b border-white/[0.04] pb-1.5 flex justify-between">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Pantalla</span>
                    <span className="text-neutral-200">{phone.specs?.screen || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/[0.04] pb-1.5 flex justify-between">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Procesador</span>
                    <span className="text-neutral-200">{phone.specs?.processor || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/[0.04] pb-1.5 flex justify-between">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Batería</span>
                    <span className="text-neutral-200">{phone.specs?.battery || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/[0.04] pb-1.5 flex justify-between">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Cámara</span>
                    <span className="text-neutral-200">{phone.specs?.camera || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/[0.04] pb-1.5 flex justify-between">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Sistema</span>
                    <span className="text-neutral-200">{phone.specs?.os || 'N/D'}</span>
                  </div>
                </div>
              </div>

              {/* Botón de Compra */}
              <div className="pt-6 mt-6 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleAddToCart(phone)}
                  className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-[#c5a880] text-white hover:text-black border border-white/10 hover:border-[#c5a880] text-[10px] tracking-[0.25em] uppercase font-light flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Añadir por ${phone.price} USD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
