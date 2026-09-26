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

  const valueProps = [
    {
      icon: ShieldCheck,
      title: 'Garantía Certificada',
      text: '12 meses en piezas de titanio y 6 meses en modelos de colección restaurados.',
    },
    {
      icon: Truck,
      title: 'Despacho Blindado Express',
      text: 'Entrega prioritaria asegurada en packaging hermético de alta resistencia.',
    },
    {
      icon: Sparkles,
      title: 'Visor Espacial 3D',
      text: 'Inspección volumétrica por mapa de profundidad con respuesta a giroscopio.',
    },
    {
      icon: MessageSquare,
      title: 'Concierge 1-a-1',
      text: 'Atención directa con los directores de cada boutique asociada.',
    },
  ];

  return (
    <footer className="w-full mt-10 bg-[#060608] border-t border-[rgba(243,239,230,0.06)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-14 sm:pt-16">

        {/* Value Proposition Highlights de Lujo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 sm:pb-14 border-b border-[rgba(243,239,230,0.06)]">
          {valueProps.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[rgba(201,162,39,0.06)] text-[#c9a227] border border-[rgba(201,162,39,0.15)] shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-base font-light text-[#f3efe6] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#8b8680]/80 font-light leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 py-12 sm:py-14">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <span className="font-serif italic text-lg font-light text-[#f3efe6] tracking-[0.02em] block">
              CelStore <span className="text-[#e4c972] text-xs font-sans not-italic tracking-widest uppercase">Atelier</span>
            </span>
            <p className="text-xs text-[#8b8680]/80 font-light leading-relaxed max-w-xs">
              Plataforma generacional de alta costura móvil que fusiona ingeniería contemporánea de titanio con leyendas históricas de diseño.
            </p>
          </div>

          {/* Col 2: Generaciones */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-medium text-[#c9a227] uppercase tracking-[0.3em]">Colecciones</h5>
            <ul className="space-y-2.5 text-xs font-light text-[#8b8680]">
              <li>
                <button
                  onClick={() => handleGenClick('last_2_years')}
                  className="hover:text-[#f3efe6] transition-colors cursor-pointer"
                >
                  Flagships (2024 - 2026)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('recent_gen')}
                  className="hover:text-[#f3efe6] transition-colors cursor-pointer"
                >
                  Series 2020 - 2023
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('vintage_classic')}
                  className="hover:text-[#f3efe6] transition-colors cursor-pointer"
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
                  className="hover:text-[#f3efe6] transition-colors cursor-pointer"
                >
                  Complementos & MagSafe
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sucursales Afiliadas */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-medium text-[#c9a227] uppercase tracking-[0.3em]">Boutiques</h5>
            <ul className="space-y-2.5 text-xs font-light text-[#8b8680]">
              {stores.map((store) => (
                <li key={store.id}>
                  <button
                    onClick={() => handleStoreClick(store)}
                    className="hover:text-[#f3efe6] transition-colors text-left cursor-pointer"
                  >
                    {store.name}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('store_selector');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#e4c972] hover:text-[#f3efe6] transition-colors text-[11px] tracking-wider uppercase cursor-pointer"
                >
                  Ver red de tiendas →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portal */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-medium text-[#c9a227] uppercase tracking-[0.3em]">Comerciantes</h5>
            <ul className="space-y-2.5 text-xs font-light text-[#8b8680]">
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('admin_login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#e4c972] hover:text-[#f3efe6] font-light tracking-wider uppercase text-[11px] transition-colors cursor-pointer"
                >
                  Portal de Gestión de Tienda
                </button>
              </li>
              <li>
                <span className="text-[#8b8680]/70 text-[11px] font-light leading-relaxed block">
                  Administración de catálogo, control de stock atómico y activación de fotos 3D con IA.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-8 border-t border-[rgba(243,239,230,0.08)]">
          <p className="text-xs text-[#8b8680]">© 2026 CelStore — Atelier Generacional</p>
          <p className="text-[11px] text-[#8b8680] flex items-center gap-1.5">
            Crafted with precision by{' '}
            <a
              href="https://exepaginasweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#e4c972] hover:text-[#f3efe6] transition-colors"
            >
              Exepaginasweb.com
            </a>
            <span className="text-[#c9a227]" aria-hidden="true">✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
};