'use client';

import React, { useState } from 'react';
import {
  Store,
  MapPin,
  MessageSquare,
  Star,
  CheckCircle,
  Zap,
  History,
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const StoreCatalog = ({ storeId, onOpenDetail, onOpen3DModal, onNavigate }) => {
  const { stores, products } = useStore();
  const [storeGenFilter, setStoreGenFilter] = useState('all');
  const [storeSearch, setStoreSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const currentStore = stores.find(s => s.id === storeId) || stores[0];
  const storeProducts = products.filter(p => p.storeId === currentStore?.id);

  // Filter products by generation, brand and search
  const filtered = storeProducts.filter(p => {
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

  const availableBrands = Array.from(new Set(storeProducts.map(p => p.brand).filter(Boolean)));

  const handleWhatsAppContact = () => {
    const phone = currentStore?.phoneWhatsApp || '+5491145239900';
    const text = encodeURIComponent(
      `¡Hola *${currentStore?.name}*! Estoy navegando por su catálogo web y quisiera consultar por asesoramiento para una compra.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Back to all stores */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Hub Principal de Tiendas</span>
      </button>

      {/* Store Banner & Profile Header */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden relative shadow-2xl">
        {/* Banner Background */}
        <div className="h-56 sm:h-72 w-full relative overflow-hidden">
          <img
            src={currentStore?.banner || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200'}
            alt={currentStore?.name}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </div>

        {/* Profile Info Overlay */}
        <div className="p-6 sm:p-8 relative -mt-20 z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentStore?.logo || 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=150'}
              alt={currentStore?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl bg-neutral-900 shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {currentStore?.specialty}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {currentStore?.rating} ({currentStore?.reviews} ventas)
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{currentStore?.name}</h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                {currentStore?.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentStore?.address}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppContact}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hablar por WhatsApp con el Dueño</span>
          </button>
        </div>
      </div>

      {/* Catalog Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
        {/* Generational Pills for this store */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setStoreGenFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              storeGenFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            Todos ({storeProducts.length})
          </button>
          <button
            onClick={() => setStoreGenFilter('last_2_years')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              storeGenFilter === 'last_2_years'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Últimos 2 Años</span>
          </button>
          <button
            onClick={() => setStoreGenFilter('vintage_classic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              storeGenFilter === 'vintage_classic'
                ? 'bg-amber-600 text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Vintage Legends</span>
          </button>
        </div>

        {/* Search & Brand Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {availableBrands.length > 1 && (
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todas las Marcas</option>
              {availableBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en esta tienda..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Store Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/10">
          <Layers className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-neutral-300 mb-1">Sin productos en este filtro</h4>
          <p className="text-xs text-neutral-500">Prueba cambiando el filtro de generación o búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
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
