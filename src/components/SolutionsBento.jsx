import React from 'react';
import { Camera, Zap, ShieldCheck, HeartHandshake, Briefcase, Sparkles, ArrowRight, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SolutionsBento = ({ onSelectCategory }) => {
  const { setGenerationFilter, setSearchQuery } = useStore();

  const handlePillClick = (filterType, query = '') => {
    if (filterType) setGenerationFilter(filterType);
    if (query) setSearchQuery(query);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Filosofía Orientada a Soluciones
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient-apple mb-4">
          No compres solo gigabytes. <br />
          <span className="text-gradient-blue">Elige qué soluciona para tu vida.</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Ya sea que busques crear contenido cinematográfico 4K, desconectarte del ruido digital o tener una batería que dure semanas enteras.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[240px]">
        {/* Bento 1: Creadores & Cámara (Spans 2 cols) */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Apple')}
          className="md:col-span-2 row-span-1 rounded-3xl p-7 glass-panel glass-panel-hover relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 group bg-gradient-to-br from-blue-950/40 via-neutral-900/60 to-black/80"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between z-10">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Creadores & Fotografía
            </span>
          </div>

          <div className="z-10 mt-4">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Producción de Cine en tu Bolsillo
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
              Graba video 4K a 120 fps en ProRes Log, sensor de 48MP/200MP y estabilización de nivel gimbal para tus redes sin llevar equipos pesados.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform z-10 pt-2">
            <span>Ver modelos recomendados para creadores</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Bento 2: Batería Extrema */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Xiaomi')}
          className="md:col-span-1 row-span-1 rounded-3xl p-7 glass-panel glass-panel-hover relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 group bg-gradient-to-br from-emerald-950/40 via-neutral-900/60 to-black/80"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Autonomía
            </span>
          </div>

          <div className="z-10 mt-2">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              Cero Ansiedad de Batería
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-2">
              Hasta 33 horas de video continuo y cargas hiperrápidas de 120W (100% en 19 min).
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform z-10">
            <span>Explorar modelos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bento 3: Vintage & Detox Digital */}
        <div
          onClick={() => handlePillClick('vintage_classic')}
          className="md:col-span-1 row-span-1 rounded-3xl p-7 glass-panel glass-panel-hover relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 group bg-gradient-to-br from-amber-950/40 via-neutral-900/60 to-black/80"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Detox & Leyendas
            </span>
          </div>

          <div className="z-10 mt-2">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
              Paz Mental & Nostalgia
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-2">
              Cero notificaciones adictivas, resistencia a caídas y batería de 2 semanas enteras.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform z-10">
            <span>Ver Clásicos Vintage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bento 4: Productividad & Negocios */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Samsung')}
          className="md:col-span-2 row-span-1 rounded-3xl p-7 glass-panel glass-panel-hover relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 group bg-gradient-to-br from-purple-950/40 via-neutral-900/60 to-black/80"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
              Productividad & Negocios
            </span>
          </div>

          <div className="z-10 mt-3">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              Tu Oficina Ejecutiva Móvil
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
              Firma contratos con S-Pen en mano, traduce llamadas al instante en vivo con IA y divide la pantalla para trabajar con dos aplicaciones simultáneas.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform z-10">
            <span>Descubrir buques insignia empresariales</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Bento 5: Ecosistema & Accesorios */}
        <div
          onClick={() => {
            const accTab = document.getElementById('accessories-section');
            if (accTab) accTab.scrollIntoView({ behavior: 'smooth' });
          }}
          className="md:col-span-2 row-span-1 rounded-3xl p-7 glass-panel glass-panel-hover relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 group bg-gradient-to-br from-cyan-950/40 via-neutral-900/60 to-black/80"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Mini-Tienda de Accesorios
            </span>
          </div>

          <div className="z-10 mt-3">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              Protección, Carga GaN y Accesorios Retro
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
              Potencia tu teléfono con bases MagSafe 3-en-1, fundas de aramida aeroespacial y repuestos originales de época.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform z-10">
            <span>Explorar Mini-Tienda de Accesorios</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};
