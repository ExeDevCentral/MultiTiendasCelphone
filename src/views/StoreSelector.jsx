'use client';

import React from 'react';
import { Store, MapPin, Phone, Star, ArrowRight, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playSubtleClick } from '../utils/audioHaptics';

export const StoreSelector = ({ onNavigate }) => {
  const { stores, setActiveStore } = useStore();

  const handleSelectStore = (store) => {
    playSubtleClick();
    setActiveStore(store);
    onNavigate('store_catalog', { storeId: store.id });
  };

  const handleDirectWhatsApp = (e, phone) => {
    e.stopPropagation();
    playSubtleClick();
    const cleanPhone = (phone || '5491100000000').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola, deseo consultar stock disponible en esta boutique.')}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 select-none">
      {/* Apple Header */}
      <div className="rounded-3xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 p-8 sm:p-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <span>BOUTIQUES OFICIALES</span>
          <span className="text-zinc-400">•</span>
          <span>ENTREGA LOCAL INMEDIATA</span>
        </div>
        <h1
          className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white"
          style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
        >
          Nuestras Boutiques Especializadas
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Cada sucursal cuenta con inventario exclusivo, stock verificado en vivo, asesoría personalizada y entrega con seguro de carga prioritario.
        </p>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => handleSelectStore(store)}
            className="rounded-3xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 hover:border-blue-500/40 hover:shadow-xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 group"
          >
            <div>
              {/* Store Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/5 dark:border-white/10">
                <span className="text-lg font-bold text-black dark:text-white">
                  {store.name}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {store.rating}
                </span>
              </div>

              {/* Banner visual */}
              <div className="h-48 w-full relative rounded-2xl overflow-hidden mb-5">
                <img
                  src={store.banner}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-black/75 text-white backdrop-blur-md">
                  {store.specialty || 'Flagships'}
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                {store.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 pt-4 border-t border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{store.phoneWhatsApp}</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-5 mt-5 border-t border-black/5 dark:border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => handleDirectWhatsApp(e, store.phoneWhatsApp)}
                className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Consultar por WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="flex-1 py-3 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
