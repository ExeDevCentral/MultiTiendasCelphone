'use client';

import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Filter, ShieldCheck, Zap, Layers, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export const AccessoriesShop = ({ onNavigate }) => {
  const { products, stores } = useStore();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const accessories = products.filter(p => p.type === 'accessory');

  const categories = [
    { id: 'all', label: 'Todos los Accesorios' },
    { id: 'Cargadores & Energía', label: '⚡ Cargadores & GaN' },
    { id: 'Fundas & Protección', label: '🛡️ Fundas & Cristales' },
    { id: 'Audio & Auriculares', label: '🎧 Audio & Auriculares' },
    { id: 'Cargadores & Vintage', label: '📟 Accesorios Vintage' }
  ];

  const filtered = selectedCategory === 'all'
    ? accessories
    : accessories.filter(a => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-block">
          Mini-Tienda Oficial
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Accesorios Premium & Repuestos
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Complementos de alta durabilidad para tus smartphones modernos y repuestos originales de época.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'glass-panel text-neutral-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((acc) => {
          const storeInfo = stores.find(s => s.id === acc.storeId);
          return (
            <div
              key={acc.id}
              className="p-5 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 rounded-2xl bg-neutral-900/60 p-4 flex items-center justify-center mb-3 border border-white/5">
                  <img
                    src={acc.images?.[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'}
                    alt={acc.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {acc.category || 'Accesorio'}
                  </span>
                </div>

                <span className="text-[10px] text-neutral-500 block mb-1">
                  Por {storeInfo?.name || 'CelStore'}
                </span>

                <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{acc.name}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{acc.description}</p>
                {acc.compatibility && (
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-neutral-400 mb-3">
                    <strong className="text-neutral-300">Compatibilidad:</strong> {acc.compatibility}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-white">${acc.price} USD</span>
                  {acc.originalPrice && (
                    <span className="text-xs text-neutral-500 line-through block">
                      ${acc.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(acc)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
