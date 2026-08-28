import React, { useState, Suspense, lazy } from 'react';
import {
  Sparkles,
  Zap,
  History,
  ShieldCheck,
  ArrowRight,
  Store,
  Layers,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GenerationFilter } from '../components/GenerationFilter';
import { SolutionsBento } from '../components/SolutionsBento';
import { ProductCard } from '../components/ProductCard';
import { WebGLErrorBoundary } from '../components/WebGLErrorBoundary';

// Lazy load 3D Studio to keep initial page load fast
const PhoneViewer3D = lazy(() =>
  import('../components/PhoneViewer3D').then(m => ({ default: m.PhoneViewer3D }))
);

export const Home = ({ onNavigate, onOpenDetail, onOpen3DModal }) => {
  const { stores, setActiveStore, filteredProducts, generationFilter, setGenerationFilter } = useStore();

  // Hero 3D phone model state
  const [heroColor, setHeroColor] = useState({
    name: 'Titanio Natural',
    hex: '#9e9689',
    threeHex: '#8e867b'
  });
  const [heroModelType, setHeroModelType] = useState('modern_flagship'); // 'modern_flagship' | 'vintage_bar' | 'vintage_flip'

  const heroColors = [
    { name: 'Titanio Natural', hex: '#9e9689', threeHex: '#8e867b' },
    { name: 'Negro Espacial', hex: '#2c2c2e', threeHex: '#1c1c1e' },
    { name: 'Blanco Desierto', hex: '#d6cec2', threeHex: '#c8beaf' },
    { name: 'Azul Profundo', hex: '#2e3a4e', threeHex: '#202c40' }
  ];

  const vintageColors = [
    { name: 'Azul Nokia', hex: '#1b2838', threeHex: '#141e2b' },
    { name: 'Plata Metálico', hex: '#c0c0c0', threeHex: '#a8a8a8' },
    { name: 'Hot Pink Glam', hex: '#e91e63', threeHex: '#c2185b' }
  ];

  // Timeline events for mobile evolution
  const timelineEvents = [
    {
      year: '2000',
      title: 'Nokia 3310',
      tag: 'La Era Indestructible',
      desc: 'Baterías de 2 semanas, Snake II y carcasas intercambiables que resistían todo.',
      icon: History
    },
    {
      year: '2004',
      title: 'Motorola RAZR V3',
      tag: 'El Ícono del Diseño Clamshell',
      desc: 'Aluminio ultrafino, teclado electroluminiscente y el chasquido más placentero.',
      icon: Flame
    },
    {
      year: '2011',
      title: 'BlackBerry Bold 9900',
      tag: 'La Cúspide Ejecutiva QWERTY',
      desc: 'Acero forjado, trackpad óptico y escritura a la velocidad del pensamiento.',
      icon: Clock
    },
    {
      year: '2024 - 2026',
      title: 'iPhone 16 Pro & Galaxy S25 Ultra',
      tag: 'Titanio Grado 5 & Inteligencia Artificial',
      desc: 'Cámaras 4K/8K de cine, chips de 3nm y traducción simultánea sin conexión.',
      icon: Zap
    }
  ];

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      {/* 1. HERO SECTION WITH INTEGRATED 3D STUDIO */}
      <section className="relative pt-6 sm:pt-12 px-4 max-w-7xl mx-auto">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Copy (Apple Style) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-white/15 text-xs font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Multi-Tiendas CelPhone • Ecosistema Generacional</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gradient-apple">
              Elige el teléfono que <br />
              <span className="text-gradient-blue">soluciona tu vida.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Desde los buques insignia de los <strong className="text-white">últimos 2 años</strong> con cámaras de cine en titanio hasta las <strong className="text-white">leyendas vintage</strong> indestructibles para detox digital.
            </p>

            {/* Quick 3D Switcher in Hero */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
              <span className="text-xs text-neutral-400 font-medium mr-1">Probar en 3D:</span>
              <button
                onClick={() => {
                  setHeroModelType('modern_flagship');
                  setHeroColor(heroColors[0]);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  heroModelType === 'modern_flagship'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30'
                    : 'glass-panel text-neutral-300 hover:text-white'
                }`}
              >
                🚀 Flagship 2025 (Titanio)
              </button>

              <button
                onClick={() => {
                  setHeroModelType('vintage_bar');
                  setHeroColor(vintageColors[0]);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  heroModelType === 'vintage_bar'
                    ? 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-500/30'
                    : 'glass-panel text-neutral-300 hover:text-white'
                }`}
              >
                📟 Nokia 3310 Retro
              </button>

              <button
                onClick={() => {
                  setHeroModelType('vintage_flip');
                  setHeroColor(vintageColors[1]);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  heroModelType === 'vintage_flip'
                    ? 'bg-pink-600 border-pink-400 text-white shadow-md shadow-pink-500/30'
                    : 'glass-panel text-neutral-300 hover:text-white'
                }`}
              >
                📱 RAZR V3 Clamshell
              </button>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={() => {
                  setGenerationFilter('last_2_years');
                  const cat = document.getElementById('catalog-section');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Ver Últimos 2 Años (2024-2026)</span>
              </button>

              <button
                onClick={() => {
                  setGenerationFilter('vintage_classic');
                  const cat = document.getElementById('catalog-section');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-neutral-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-white/15"
              >
                <History className="w-4 h-4 text-amber-400" />
                <span>Explorar Vintage Legends</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Phone Studio with WebGL Error Boundary */}
          <div className="lg:col-span-6 relative z-10">
            <WebGLErrorBoundary height="500px">
              <Suspense
                fallback={
                  <div className="h-[500px] w-full rounded-2xl glass-panel flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-neutral-400 font-mono">Iniciando estudio 3D...</p>
                  </div>
                }
              >
                <PhoneViewer3D
                  modelType={heroModelType}
                  selectedColor={heroColor}
                  availableColors={heroModelType === 'modern_flagship' ? heroColors : vintageColors}
                  onColorChange={(c) => setHeroColor(c)}
                  phoneName={heroModelType === 'modern_flagship' ? 'iPhone 16 Pro Max 3D' : heroModelType === 'vintage_bar' ? 'Nokia 3310 3D' : 'RAZR V3 3D'}
                  height="500px"
                />
              </Suspense>
            </WebGLErrorBoundary>
          </div>
        </div>
      </section>

      {/* 2. MULTI-STORE DIRECTORY HUB BAR */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-6 rounded-3xl glass-panel border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Store className="w-3.5 h-3.5" />
                Red de Sucursales Especializadas
              </span>
              <h3 className="text-xl font-bold text-white">Nuestras Tiendas Oficiales</h3>
            </div>
            <button
              onClick={() => onNavigate('store_selector')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start md:self-auto"
            >
              <span>Ver todas las tiendas afiliadas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  setActiveStore(store);
                  onNavigate('store_catalog', { storeId: store.id });
                }}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {store.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      ★ {store.rating}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                    {store.tagLine}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-white/5">
                  <span>{store.specialty}</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform">Entrar →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS BENTO GRID (Apple Philosophy) */}
      <SolutionsBento />

      {/* 4. EVOLUTION TIMELINE SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5 mb-2">
            <History className="w-4 h-4" />
            Línea del Tiempo Móvil
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Un cuarto de siglo de historia en tu mano
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {timelineEvents.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel border border-white/10 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-2xl font-black text-white/90">{evt.year}</span>
                  <div className="p-2 rounded-xl bg-white/5 text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{evt.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/90 block mb-2">
                    {evt.tag}
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MAIN GENERATIONAL CATALOG GRID */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
              Catálogo Seleccionado
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              {generationFilter === 'last_2_years'
                ? 'Modelos de los Últimos 2 Años (2024 - 2026)'
                : generationFilter === 'vintage_classic'
                ? 'Colección Clásicos & Vintage Legends'
                : 'Todos los Teléfonos Disponibles'}
            </h3>
          </div>

          {/* Generational Filter Tabs */}
          <div className="w-full md:w-auto">
            <GenerationFilter showTitle={false} />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 p-8">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-500">
              <Layers className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-neutral-200 mb-1">No se encontraron productos</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5">
              Prueba cambiando el filtro generacional o la búsqueda para encontrar el celular perfecto.
            </p>
            <button
              onClick={() => setGenerationFilter('all')}
              className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold"
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
                onOpen3DModal={(p, color) => onOpen3DModal(p, color)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. ACCESSORIES MINI-STORE HIGHLIGHT */}
      <section id="accessories-section" className="max-w-7xl mx-auto px-4 pt-8">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-neutral-900 to-neutral-950 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-block">
              Mini-Tienda de Accesorios
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Equipa tu celular con los mejores complementos
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Bases MagSafe 3-en-1, cargadores de nitruro de galio (GaN) ultrarrápidos, fundas de fibra de aramida aeroespacial y transformadores originales para tus modelos vintage.
            </p>
            <button
              onClick={() => onNavigate('accessories')}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 hover:scale-105"
            >
              <span>Explorar Mini-Tienda de Accesorios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
