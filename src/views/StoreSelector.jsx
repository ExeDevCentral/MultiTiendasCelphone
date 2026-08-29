'use client';

import React from 'react';
import { Store, MapPin, Phone, Star, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const StoreSelector = ({ onNavigate }) => {
  const { stores, setActiveStore } = useStore();

  const handleSelectStore = (store) => {
    setActiveStore(store);
    onNavigate('store_catalog', { storeId: store.id });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Store className="w-3.5 h-3.5" />
          Directorio Oficial Multi-Tiendas
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Nuestras Sucursales Especializadas
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Cada tienda cuenta con su propia identidad, inventario exclusivo, asesoramiento especializado y canal directo de WhatsApp.
        </p>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => handleSelectStore(store)}
            className="rounded-3xl glass-panel glass-panel-hover border border-white/10 overflow-hidden flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Store Banner */}
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  src={store.banner}
                  alt={store.name}
                  className="w-full h-full object-cover brightness-60 group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/20">
                  {store.specialty}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/40 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {store.rating} ({store.reviews})
                </span>
              </div>

              {/* Store Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-neutral-900"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-[11px] text-blue-400 font-medium">Sucursal Verificada</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {store.description}
                </p>

                <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{store.phoneWhatsApp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enter Button */}
            <div className="p-6 pt-0">
              <button className="w-full py-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all group-hover:shadow-lg group-hover:shadow-blue-600/30">
                <span>Entrar a {store.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
