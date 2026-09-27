'use client';

import React from 'react';
import { Store, MapPin, Phone, Star, ArrowRight, ShieldCheck, Terminal, MessageSquare } from 'lucide-react';
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
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent('[CELSTORE // SUCURSAL] Hola, deseo consultar stock disponible en esta boutique.')}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 font-mono">
      {/* Precision Hardware Console Header */}
      <div className="bg-[#0E0E10] border border-[#1A1A1D] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-[#0066FF] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
            DIRECTORIO DE BOUTIQUES // HUBS ESPECIALIZADOS
          </span>
          <span className="text-[10px] text-[#71717A] bg-[#141416] px-2 py-0.5 border border-[#1A1A1D] hidden sm:inline-block">
            MODO PRUEBA // 0 CONSUMO SUPABASE
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-[#F5F5F7]">
          Red de Sucursales & Boutiques de Precisión
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-2xl font-mono leading-relaxed">
          Cada boutique opera con su propia terminal de inventario, stock verificado en tiempo real, canales directos de WhatsApp y curaduría técnica específica.
        </p>
      </div>

      {/* Stores Precision Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stores.map((store, idx) => (
          <div
            key={store.id}
            onClick={() => handleSelectStore(store)}
            className="bg-[#0E0E10] border border-[#1A1A1D] hover:border-[#0066FF] p-5 flex flex-col justify-between cursor-pointer transition-colors group relative"
          >
            <div>
              {/* Store Header Telemetry */}
              <div className="flex items-center justify-between border-b border-[#1A1A1D] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0066FF]">
                    [ {String(idx + 1).padStart(2, '0')} ]
                  </span>
                  <span className="text-xs font-bold font-sans text-[#F5F5F7] uppercase tracking-wide">
                    {store.name}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-[#141416] border border-[#1A1A1D] text-[#F5F5F7] font-bold">
                  ★ {store.rating} ({store.reviews})
                </span>
              </div>

              {/* Banner / Store visual in technical frame */}
              <div className="h-44 w-full relative bg-[#141416] border border-[#1A1A1D] overflow-hidden mb-4">
                <img
                  src={store.banner}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
                />
                <div className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0E0E10] border border-[#1A1A1D] text-[#0066FF]">
                  {store.specialty || 'ESPECIALIDAD TÉCNICA'}
                </div>
              </div>

              <p className="text-xs text-[#71717A] leading-relaxed mb-4">
                {store.description}
              </p>

              {/* Telemetry metadata */}
              <div className="space-y-1.5 text-[11px] text-[#71717A] pt-3 border-t border-[#1A1A1D]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                  <span>{store.phoneWhatsApp}</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-4 mt-4 border-t border-[#1A1A1D] flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleDirectWhatsApp(e, store.phoneWhatsApp)}
                className="p-2.5 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#25D366] text-[#25D366] transition-colors cursor-pointer"
                title="Canal WhatsApp Directo"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="flex-1 py-2.5 bg-[#141416] group-hover:bg-[#0066FF] border border-[#1A1A1D] group-hover:border-[#0066FF] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>[ INGRESAR A CATÁLOGO ]</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
