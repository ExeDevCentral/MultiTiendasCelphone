'use client';

import React, { useState } from 'react';
import {
  Store,
  MapPin,
  MessageSquare,
  Star,
  Search,
  ArrowLeft,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PrecisionProductCard } from '../components/PrecisionProductCard';
import { playSubtleClick } from '../utils/audioHaptics';

export const StoreCatalog = ({ storeId, onOpenDetail, onNavigate }) => {
  const { stores, products } = useStore();
  const [storeGenFilter, setStoreGenFilter] = useState('all');
  const [storeSearch, setStoreSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const currentStore = stores.find((s) => s.id === storeId) || stores[0];
  const storeProducts = products.filter((p) => p.storeId === currentStore?.id);

  // Filter products by generation, brand and search
  const filtered = storeProducts.filter((p) => {
    if (storeGenFilter !== 'all' && p.generationCategory !== storeGenFilter) return false;
    if (brandFilter !== 'all' && p.brand !== brandFilter) return false;
    if (storeSearch.trim() !== '') {
      const q = storeSearch.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchTagline = p.tagline?.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchTagline) return false;
    }
    return true;
  });

  const availableBrands = Array.from(new Set(storeProducts.map((p) => p.brand).filter(Boolean)));

  const handleWhatsAppContact = () => {
    playSubtleClick();
    const phone = currentStore?.phoneWhatsApp || '+5491145239900';
    const text = encodeURIComponent(
      `Hola, me encuentro revisando el inventario de la boutique ${currentStore?.name} y solicito asesoramiento.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      {/* Back to all stores */}
      <button
        type="button"
        onClick={() => {
          playSubtleClick();
          onNavigate('store_selector');
        }}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer font-semibold"
      >
        <ArrowLeft className="w-4 h-4 text-blue-600" />
        <span>Volver al Directorio de Boutiques</span>
      </button>

      {/* Boutique Header */}
      <div className="rounded-3xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 p-8 sm:p-12 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                {currentStore?.specialty || 'Boutique Oficial'}
              </span>
              <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {currentStore?.rating} ({currentStore?.reviews} reseñas)
              </span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white"
              style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
            >
              {currentStore?.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              {currentStore?.description}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-2 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{currentStore?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{currentStore?.phoneWhatsApp}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contactar Asesor de Sucursal</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2">
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setStoreGenFilter('all');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              storeGenFilter === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-[#F5F5F7] dark:bg-[#121214] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Todos ({storeProducts.length})
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setStoreGenFilter('last_2_years');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              storeGenFilter === 'last_2_years'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#F5F5F7] dark:bg-[#121214] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Flagships
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setStoreGenFilter('vintage_classic');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              storeGenFilter === 'vintage_classic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#F5F5F7] dark:bg-[#121214] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Vintage
          </button>
        </div>

        {/* Brand & Search */}
        <div className="flex items-center gap-3">
          {availableBrands.length > 1 && (
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-full px-4 py-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium outline-none cursor-pointer"
            >
              <option value="all">Todas las marcas</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}

          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en esta sucursal..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-black dark:text-white placeholder-zinc-400 outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 p-8 space-y-2">
          <h4 className="text-lg font-bold text-black dark:text-white">Sin smartphones en este filtro</h4>
          <p className="text-sm text-zinc-500">Probá modificando la categoría o el término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product) => (
            <PrecisionProductCard
              key={product.id}
              product={product}
              onSelect={onOpenDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
