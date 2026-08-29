'use client';

import React from 'react';
import { ShieldCheck, Truck, Sparkles, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playSubtleClick } from '../utils/audioHaptics';

export const Footer = ({ onNavigate }) => {
  const { stores, setActiveStore, setGenerationFilter } = useStore();

  const handleStoreClick = (store) => {
    playSubtleClick();
    setActiveStore(store);
    onNavigate('store_catalog', { storeId: store.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenClick = (category) => {
    playSubtleClick();
    setGenerationFilter(category);
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#060608] border-t border-white/[0.06] text-neutral-400 text-xs pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-6 space-y-14">
        
        {/* Value Proposition Highlights de Lujo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-14 border-b border-white/[0.04]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/[0.03] text-[#c5a880] border border-white/[0.06] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 
                className="text-base font-light text-white mb-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Garantía Certificada
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                12 meses en piezas de titanio y 6 meses en modelos de colección restaurados.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/[0.03] text-[#c5a880] border border-white/[0.06] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 
                className="text-base font-light text-white mb-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Despacho Blindado Express
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Entrega prioritaria asegurada en packaging hermético de alta resistencia.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/[0.03] text-[#c5a880] border border-white/[0.06] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 
                className="text-base font-light text-white mb-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Visor Espacial 3D
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Inspección volumétrica por mapa de profundidad con respuesta a giroscopio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/[0.03] text-[#c5a880] border border-white/[0.06] shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 
                className="text-base font-light text-white mb-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Concierge 1-a-1
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Atención directa con los directores de cada boutique asociada.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <span 
              className="text-lg font-light text-white tracking-widest uppercase block"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              CelStore <span className="text-[#c5a880] text-xs font-sans">Atelier</span>
            </span>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Plataforma generacional de alta costura móvil que fusiona ingeniería contemporánea de titanio con leyendas históricas de diseño.
            </p>
          </div>

          {/* Col 2: Generaciones */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-light text-[#c5a880] uppercase tracking-[0.3em]">Colecciones</h5>
            <ul className="space-y-2 text-xs font-light text-neutral-400">
              <li>
                <button
                  onClick={() => handleGenClick('last_2_years')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Flagships (2024 - 2026)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('recent_gen')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Series 2020 - 2023
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('vintage_classic')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vintage Archive Legends
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('accessories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Complementos & MagSafe
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sucursales Afiliadas */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-light text-[#c5a880] uppercase tracking-[0.3em]">Boutiques</h5>
            <ul className="space-y-2 text-xs font-light text-neutral-400">
              {stores.map((store) => (
                <li key={store.id}>
                  <button
                    onClick={() => handleStoreClick(store)}
                    className="hover:text-[#f5e0c3] transition-colors text-left cursor-pointer"
                  >
                    {store.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('store_selector');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#c5a880] hover:text-white transition-colors text-[11px] tracking-wider uppercase cursor-pointer"
                >
                  Ver red de tiendas →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portal */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-light text-[#c5a880] uppercase tracking-[0.3em]">Comerciantes</h5>
            <ul className="space-y-2 text-xs font-light text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('admin_login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#c5a880] hover:text-white font-light tracking-wider uppercase text-[11px] transition-colors cursor-pointer"
                >
                  Portal de Gestión de Tienda
                </button>
              </li>
              <li>
                <span className="text-neutral-500 text-[11px] font-light leading-relaxed block">
                  Administración de catálogo, control de stock atómico y activación de fotos 3D con IA.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[rgba(243,239,230,0.08)] flex items-center justify-center text-xs text-[#8b8680]">
          <p>© 2026 CelStore — Atelier Generacional</p>
        </div>
      </div>
    </footer>
  );
};
