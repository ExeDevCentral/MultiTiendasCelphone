import React, { useState, Suspense, lazy } from 'react';
import {
  Sparkles,
  Zap,
  History,
  ShieldCheck,
  ArrowRight,
  Store,
  Layers,
  Clock,
  Eye
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GenerationFilter } from '../components/GenerationFilter';
import { SolutionsBento } from '../components/SolutionsBento';
import { ProductCard } from '../components/ProductCard';
import { WebGLErrorBoundary } from '../components/WebGLErrorBoundary';
import { playSubtleClick } from '../utils/audioHaptics';

const PhoneViewer3D = lazy(() =>
  import('../components/PhoneViewer3D').then((m) => ({ default: m.PhoneViewer3D }))
);

export const Home = ({ onNavigate, onOpenDetail, onOpen3DModal }) => {
  const { stores, setActiveStore, filteredProducts, generationFilter, setGenerationFilter } = useStore();

  const [heroColor, setHeroColor] = useState({
    name: 'Titanio Natural',
    hex: '#8a8378',
    threeHex: '#8e867b',
  });
  const [heroModelType, setHeroModelType] = useState('modern_flagship');

  const heroColors = [
    { name: 'Titanio Natural', hex: '#8a8378', threeHex: '#8e867b' },
    { name: 'Negro Espacial', hex: '#2a2a2c', threeHex: '#1c1c1e' },
    { name: 'Titanio Azul', hex: '#4b5b63', threeHex: '#3a4a52' },
  ];

  const vintageColors = [
    { name: 'Azul Nokia', hex: '#1b2838', threeHex: '#141e2b' },
    { name: 'Plata Metálico', hex: '#c0c0c0', threeHex: '#a8a8a8' },
    { name: 'Hot Pink Glam', hex: '#e91e63', threeHex: '#c2185b' },
  ];

  const timelineEvents = [
    {
      year: '2000',
      title: 'Nokia 3310 Heritage',
      tag: 'La Era Indestructible',
      desc: 'Baterías de dos semanas y resistencia legendaria que definió el inicio del siglo móvil.',
      icon: History,
    },
    {
      year: '2004',
      title: 'Motorola RAZR V3',
      tag: 'Ícono del Diseño Clamshell',
      desc: 'Aluminio ultrafino aeroespacial, teclado electroluminiscente y estética de alta costura.',
      icon: Sparkles,
    },
    {
      year: '2011',
      title: 'BlackBerry Bold 9900',
      tag: 'Cúspide Ejecutiva QWERTY',
      desc: 'Acero forjado, trackpad óptico y diseño de negocios irrepetible.',
      icon: Clock,
    },
    {
      year: '2024 - 2026',
      title: 'Titanium Pro Series',
      tag: 'Titanio Grado 5 & Fotografía Espacial',
      desc: 'Ópticas cinematográficas en 4K/8K, chips de 3nm e inteligencia de profundidad espacial.',
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION DE ALTA COSTURA (Centrado perfecto en PC 60-30-10) */}
      <section className="relative pt-8 sm:pt-14 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Columna Izquierda: Copy Editorial (6 columnas) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <p className="eyebrow">
              Atelier Generacional · Edición 3D
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#f3efe6] tracking-tight leading-[1.08]">
              Ingeniería móvil <br />
              <span className="text-[#e4c972]">elevada a pieza de arte.</span>
            </h1>

            <p className="text-[16px] text-[#8b8680] max-w-xl mx-auto lg:mx-0 leading-[1.6]">
              Desde buques insignia contemporáneos en <strong className="text-[#f3efe6] font-medium">Titanio Grado 5</strong> hasta las <strong className="text-[#e4c972] font-medium">leyendas vintage</strong> restauradas para el detox digital definitivo.
            </p>

            {/* Selector de Estudio 3D en Hero */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
              <span className="text-[12px] uppercase text-[#8b8680] font-medium mr-1">Probar 3D:</span>
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setHeroModelType('modern_flagship');
                  setHeroColor(heroColors[0]);
                }}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  heroModelType === 'modern_flagship'
                    ? 'border border-[#c9a227] text-[#f3efe6] bg-[rgba(201,162,39,0.10)] font-medium'
                    : 'border border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
                }`}
              >
                Flagship Titanium
              </button>

              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setHeroModelType('vintage_bar');
                  setHeroColor(vintageColors[0]);
                }}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  heroModelType === 'vintage_bar'
                    ? 'border border-[#c9a227] text-[#f3efe6] bg-[rgba(201,162,39,0.10)] font-medium'
                    : 'border border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
                }`}
              >
                Nokia Heritage 3310
              </button>

              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setHeroModelType('vintage_flip');
                  setHeroColor(vintageColors[1]);
                }}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  heroModelType === 'vintage_flip'
                    ? 'border border-[#c9a227] text-[#f3efe6] bg-[rgba(201,162,39,0.10)] font-medium'
                    : 'border border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
                }`}
              >
                Archive RAZR V3
              </button>
            </div>

            {/* Botones de Acción Primaria */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setGenerationFilter('last_2_years');
                  const cat = document.getElementById('catalog-section');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#c9a227] hover:bg-[#e4c972] text-[#0a0a0c] text-sm font-bold transition-all shadow-lg cursor-pointer hover:-translate-y-0.5"
              >
                Explorar Flagships (2024-2026)
              </button>

              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setGenerationFilter('vintage_classic');
                  const cat = document.getElementById('catalog-section');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[rgba(243,239,230,0.16)] hover:border-[#c9a227] text-[#f3efe6] hover:text-[#e4c972] text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4 text-[#c9a227]" />
                <span>Vintage Archive</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Estudio 3D Integrado (6 columnas) */}
          <div className="lg:col-span-6 w-full relative z-10 flex justify-center">
            <div className="w-full max-w-[560px] product-stage min-h-[480px] h-[520px] rounded-[28px] overflow-hidden p-3 shadow-2xl">
              <WebGLErrorBoundary height="500px">
                <Suspense
                  fallback={
                    <div className="h-full w-full flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-[#8b8680]">Iniciando estudio 3D...</p>
                    </div>
                  }
                >
                  <PhoneViewer3D
                    modelType={heroModelType}
                    selectedColor={heroColor}
                    availableColors={heroModelType === 'modern_flagship' ? heroColors : vintageColors}
                    onColorChange={(c) => {
                      playSubtleClick();
                      setHeroColor(c);
                    }}
                    phoneName={heroModelType === 'modern_flagship' ? 'iPhone 16 Pro Max 3D' : heroModelType === 'vintage_bar' ? 'Nokia 3310 3D' : 'RAZR V3 3D'}
                    height="500px"
                  />
                </Suspense>
              </WebGLErrorBoundary>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIRECTORIO DE BOUTIQUES EXCLUSIVAS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="p-8 rounded-[24px] bg-[#131316] border border-[rgba(243,239,230,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow mb-1!">
                Red Oficial de Boutiques
              </p>
              <h3 className="text-2xl font-bold text-[#f3efe6]">
                Sucursales Afiliadas
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                onNavigate('store_selector');
              }}
              className="text-xs text-[#e4c972] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver todas las boutiques</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  playSubtleClick();
                  setActiveStore(store);
                  onNavigate('store_catalog', { storeId: store.id });
                }}
                className="p-6 rounded-2xl bg-[#1b1b1f] hover:bg-[#222227] border border-[rgba(243,239,230,0.06)] hover:border-[#c9a227] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-base font-semibold text-[#f3efe6] group-hover:text-[#e4c972] transition-colors">
                      {store.name}
                    </span>
                    <span className="text-xs text-[#c9a227] font-mono">
                      ★ {store.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b8680] leading-relaxed mb-3">
                    {store.tagLine}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-[#8b8680] pt-3 border-t border-[rgba(243,239,230,0.06)]">
                  <span>{store.specialty}</span>
                  <span className="text-[#e4c972] group-hover:translate-x-1 transition-transform">Visitar →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BENTO DE SOLUCIONES Y CURADURÍA */}
      <SolutionsBento />

      {/* 4. LÍNEA DEL TIEMPO: ARQUEOLOGÍA MÓVIL */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-2!">
            Cronología de Diseño
          </p>
          <h3 className="text-3xl font-bold text-[#f3efe6]">
            Un cuarto de siglo en tu mano
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {timelineEvents.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-[22px] bg-[#131316] border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#f3efe6] font-mono">{evt.year}</span>
                  <div className="p-2 rounded-xl bg-[#1b1b1f] text-[#c9a227] border border-[rgba(243,239,230,0.08)]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#f3efe6] mb-1">
                    {evt.title}
                  </h4>
                  <span className="text-xs text-[#e4c972] block mb-2 font-medium">
                    {evt.tag}
                  </span>
                  <p className="text-xs text-[#8b8680] leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CATÁLOGO PRINCIPAL CON VISOR 3D */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[rgba(243,239,230,0.08)] pb-8">
          <div>
            <p className="eyebrow mb-1!">
              Archivo Seleccionado
            </p>
            <h3 className="text-3xl font-bold text-[#f3efe6]">
              {generationFilter === 'last_2_years'
                ? 'Flagships Contemporáneos (2024 - 2026)'
                : generationFilter === 'vintage_classic'
                ? 'Colección Vintage Legends'
                : 'Catálogo General Disponible'}
            </h3>
          </div>

          <div className="w-full md:w-auto">
            <GenerationFilter showTitle={false} />
          </div>
        </div>

        {/* Grid de Productos (60-30-10 Proporcional) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-[24px] bg-[#131316] border border-[rgba(243,239,230,0.08)] p-8">
            <div className="w-16 h-16 rounded-full bg-[#1b1b1f] border border-[rgba(243,239,230,0.08)] flex items-center justify-center mx-auto mb-4 text-[#8b8680]">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-[#f3efe6] mb-1">No se encontraron piezas en este filtro</h4>
            <p className="text-xs text-[#8b8680] max-w-sm mx-auto mb-5">
              Ajusta los criterios de búsqueda para explorar otras generaciones.
            </p>
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setGenerationFilter('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#e4c972] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider cursor-pointer"
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

      {/* 6. BANNER DE ACCESORIOS */}
      <section id="accessories-section" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-4">
        <div className="p-10 sm:p-12 rounded-[28px] bg-gradient-to-br from-[#1b1b1f] via-[#131316] to-[#0a0a0c] border border-[rgba(243,239,230,0.12)] relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-[rgba(201,162,39,0.15)] text-[#e4c972] border border-[#c9a227]/30 inline-block">
              Atelier Complementos
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#f3efe6] leading-tight">
              Protección en aramida aeroespacial y carga de ultra-precisión
            </h3>
            <p className="text-sm text-[#8b8680] leading-relaxed">
              Bases MagSafe 3-en-1 en aluminio mecanizado, cargadores GaN de 65W/120W y adaptadores originales de época.
            </p>
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                onNavigate('accessories');
              }}
              className="px-7 py-3.5 rounded-xl bg-[#c9a227] hover:bg-[#e4c972] text-[#0a0a0c] font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explorar Accesorios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
