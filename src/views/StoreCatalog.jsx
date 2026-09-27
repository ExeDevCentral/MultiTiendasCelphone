'use client';

import React, { useState } from 'react';
import {
  Store,
  MapPin,
  MessageSquare,
  Star,
  Search,
  ArrowLeft,
  Terminal,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PrecisionProductCard } from '../components/PrecisionProductCard';
import { playSubtleClick } from '../utils/audioHaptics';

export const StoreCatalog = ({ storeId, onOpenDetail, onOpen3DModal, onNavigate }) => {
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
      `[CELSTORE // SUCURSAL ${currentStore?.name}] Hola, me encuentro revisando el inventario de esta boutique y solicito asesoramiento técnico.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      {/* Back to all stores */}
      <button
        type="button"
        onClick={() => {
          playSubtleClick();
          onNavigate('store_selector');
        }}
        className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#F5F5F7] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>[ ← VOLVER AL DIRECTORIO DE BOUTIQUES ]</span>
      </button>

      {/* Precision Boutique Console Header */}
      <div className="bg-[#0E0E10] border border-[#1A1A1D] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1D] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[#0066FF] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
              TERMINAL // INVENTARIO SUCURSAL
            </span>
          </div>
          <span className="text-[10px] text-[#71717A] bg-[#141416] px-2 py-0.5 border border-[#1A1A1D]">
            MODO PRUEBA // 0 QUOTA SUPABASE
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#141416] border border-[#0066FF] text-[#0066FF]">
                {currentStore?.specialty}
              </span>
              <span className="text-xs text-[#71717A]">
                ★ {currentStore?.rating} ({currentStore?.reviews} reseñas)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-[#F5F5F7]">
              {currentStore?.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-xl leading-relaxed">
              {currentStore?.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A] pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>{currentStore?.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#30D158]" />
                <span>{currentStore?.phoneWhatsApp}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="px-4 py-3 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#25D366] text-[#25D366] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>[ CONTACTAR ASESOR DE SUCURSAL ]</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Rack */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0E0E10] border border-[#1A1A1D] p-3">
        {/* Stepped Switch Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setStoreGenFilter('all');
            }}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              storeGenFilter === 'all'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7]'
            }`}
          >
            [ 01: TODOS ({storeProducts.length}) ]
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setStoreGenFilter('last_2_years');
            }}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              storeGenFilter === 'last_2_years'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7]'
            }`}
          >
            [ 02: FLAGSHIPS ]
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setStoreGenFilter('vintage_classic');
            }}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              storeGenFilter === 'vintage_classic'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7]'
            }`}
          >
            [ 03: VINTAGE ]
          </button>
        </div>

        {/* Brand & Search */}
        <div className="flex items-center gap-2">
          {availableBrands.length > 1 && (
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-[#141416] border border-[#1A1A1D] px-2.5 py-1.5 text-xs text-[#F5F5F7] outline-none focus:border-[#0066FF] cursor-pointer"
            >
              <option value="all">TODAS LAS MARCAS</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en esta sucursal..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full bg-[#141416] border border-[#1A1A1D] pl-8 pr-3 py-1.5 text-xs text-[#F5F5F7] placeholder-[#71717A] outline-none focus:border-[#0066FF] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Precision Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0E0E10] border border-[#1A1A1D] p-8">
          <Terminal className="w-8 h-8 text-[#71717A] mx-auto mb-3" />
          <h4 className="text-base font-bold text-[#F5F5F7] mb-1">Sin modelos en este filtro</h4>
          <p className="text-xs text-[#71717A]">Prueba modificando la categoría o término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <PrecisionProductCard
              key={product.id}
              product={product}
              onOpenDetail={(p) => onOpenDetail(p)}
              onOpen3DModal={(p, color) => onOpen3DModal(p, color)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
