'use client';

import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
  Compass,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GenerationFilter } from '../components/GenerationFilter';
import { SolutionsBento } from '../components/SolutionsBento';
import { ProductCard } from '../components/ProductCard';
import { HeroStudio3D } from '../components/HeroStudio3D';
import { StickyBuyBar } from '../components/StickyBuyBar';
import { playSubtleClick } from '../utils/audioHaptics';

export const Home = ({ onNavigate, onOpenDetail, onOpen3DModal }) => {
  const { stores, setActiveStore, filteredProducts, generationFilter, setGenerationFilter, products } = useStore();

  const flagshipProduct = products.find((p) => p.id === 'prod-iphone-16-pro-max') || products[0];

  return (
    <div className="space-y-0 pb-0 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          1. EDITORIAL LUXURY TICKER (Discreet & High-End)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0b0b0e] border-b border-[rgba(243,239,230,0.06)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#8b8680]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
              <span className="text-[#f3efe6] font-medium tracking-wide">
                Atelier CelStore 2026
              </span>
              <span className="hidden sm:inline text-[#555]">•</span>
              <span className="hidden sm:inline">Colección Flagship con Grabado Láser Personalizado</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#c9a227]" />
                Envío prioritario con seguro total
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c9a227]" />
                Garantía oficial 24 meses
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#c9a227]" />
                30 días de satisfacción atelier
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. SPECTACULAR 3D STUDIO HERO & LIVE CONFIGURATOR
          ═══════════════════════════════════════════════════════════════════ */}
      <HeroStudio3D
        onNavigate={onNavigate}
        onOpenDetail={onOpenDetail}
      />

      {/* Sticky Buy Bar for smooth one-touch buy when scrolling */}
      {flagshipProduct && (
        <StickyBuyBar
          product={flagshipProduct}
          selectedColor={{ name: 'Titanio Desierto' }}
          selectedStorage="256 GB"
          onBuy={() => {
            const cat = document.getElementById('catalog-section');
            if (cat) cat.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpen3D={() => onOpen3DModal(flagshipProduct)}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          3. BOUTIQUES & ATELIERS MULTI-TENANT
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 border-t border-[rgba(243,239,230,0.06)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.2)] mb-3">
              <Compass className="w-3.5 h-3.5 text-[#c9a227]" />
              <span className="text-[10px] font-semibold text-[#c9a227] tracking-[0.2em] uppercase">
                Casas & Boutiques
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f3efe6] tracking-tight">
              Boutiques Curadas CelStore
            </h2>
            <p className="text-sm text-[#8b8680] mt-1 max-w-lg">
              Cada boutique opera como un atelier independiente con su propia curaduría, inventario en tiempo real y asesor personal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              onNavigate('store_selector');
            }}
            className="group px-5 py-2.5 rounded-xl border border-[rgba(243,239,230,0.15)] hover:border-[#c9a227] text-xs font-semibold text-[#f3efe6] hover:text-[#c9a227] flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Explorar todas las Boutiques</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => {
                playSubtleClick();
                setActiveStore(store);
                onNavigate('store_catalog', { storeId: store.id });
              }}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#131317] to-[#0c0c0f] border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227]/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-[#f3efe6] group-hover:text-[#c9a227] transition-colors">
                    {store.name}
                  </span>
                  <span className="text-xs text-[#c9a227] font-mono px-2 py-0.5 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)]">
                    ★ {store.rating}
                  </span>
                </div>
                <p className="text-xs text-[#8b8680] leading-relaxed mb-4">
                  {store.tagLine}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8b8680] pt-4 border-t border-[rgba(243,239,230,0.06)]">
                <span className="text-[#a5a098] font-medium">{store.specialty}</span>
                <span className="text-[#c9a227] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ingresar →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SOLUCIONES Y BENTO DE INGENIERÍA
          ═══════════════════════════════════════════════════════════════════ */}
      <SolutionsBento />

      {/* ═══════════════════════════════════════════════════════════════════
          5. CATÁLOGO CURADO POR GENERACIÓN
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[rgba(243,239,230,0.08)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.2)] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a227]" />
              <span className="text-[10px] font-semibold text-[#c9a227] tracking-[0.2em] uppercase">
                Colección Completa
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f3efe6] tracking-tight">
              {generationFilter === 'last_2_years'
                ? 'Últimos Lanzamientos (2024–2026)'
                : generationFilter === 'vintage_classic'
                ? 'Clásicos de Colección Legendarios'
                : 'Todas las Obras Disponibles'}
            </h2>
          </div>
          <div className="w-full md:w-auto">
            <GenerationFilter showTitle={false} />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-[#0f0f12] border border-[rgba(243,239,230,0.06)]">
            <Phone className="w-10 h-10 text-[#8b8680] mx-auto mb-4" />
            <h3 className="text-base font-semibold text-[#f3efe6] mb-1">Sin ejemplares en esta categoría</h3>
            <p className="text-xs text-[#8b8680] mb-5">El inventario se sincroniza en tiempo real con las boutiques.</p>
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setGenerationFilter('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#d4b03a] text-[#0a0a0c] text-xs font-bold cursor-pointer transition-colors"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={(p) => onOpenDetail(p)}
                onOpen3DModal={(p) => onOpen3DModal(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. BANNER DE ACCESORIOS DE ALTA COSTURA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-16 sm:pb-24">
        <div
          onClick={() => {
            playSubtleClick();
            onNavigate('accessories');
          }}
          className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141418] via-[#101014] to-[#0d0d10] border border-[rgba(243,239,230,0.1)] hover:border-[#c9a227]/50 transition-all duration-300 cursor-pointer group shadow-2xl"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.08),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a227] font-semibold">
                Accesorios de Atelier
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f3efe6] group-hover:text-[#c9a227] transition-colors leading-tight">
                Fundas de Fibra de Aramida, GaN 120W y MagSafe Mecanizado
              </h3>
              <p className="text-xs sm:text-sm text-[#8b8680]">
                Materiales de calidad aeroespacial diseñados para complementar a la perfección tu smartphone.
              </p>
            </div>

            <div className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#c9a227] hover:bg-[#d4b03a] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider transition-all shadow-lg shrink-0 group-hover:shadow-[0_8px_30px_rgba(201,162,39,0.4)]">
              <span>Explorar Accesorios</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. CONCIERGE VIP & ASESOR PERSONAL
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[rgba(243,239,230,0.06)] bg-[#0b0b0e]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a227] font-semibold">
              Servicio Privado
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#f3efe6]">
              ¿Deseas una configuración especial o búsqueda a medida?
            </h3>
            <p className="text-xs sm:text-sm text-[#8b8680] leading-relaxed">
              Nuestro equipo de conserjería técnica atiende directamente por WhatsApp para pedidos especiales, ediciones de coleccionista o importaciones directas.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/5491145239900?text=Hola%20CelStore%2C%20quisiera%20asesoramiento%20personalizado%20para%20un%20smartphone%20flagship"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_25px_rgba(37,211,102,0.3)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Hablar con Concierge VIP</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
