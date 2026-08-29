'use client';

import React from 'react';
import { Camera, Zap, HeartHandshake, Briefcase, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playSubtleClick } from '../utils/audioHaptics';

export const SolutionsBento = ({ onSelectCategory }) => {
  const { setGenerationFilter, setSearchQuery } = useStore();

  const handlePillClick = (filterType, query = '') => {
    playSubtleClick();
    if (filterType) setGenerationFilter(filterType);
    if (query) setSearchQuery(query);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-16 px-6 sm:px-12 max-w-[1180px] mx-auto">
      {/* Section Header Editorial */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="eyebrow !mb-2">
          Curaduría Funcional · Propósito y Forma
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f3efe6] mb-3">
          No compres solo gigabytes. <br />
          <span className="text-[#e4c972]">Elige la solución para tu estilo de vida.</span>
        </h2>
        <p className="text-[#8b8680] text-sm leading-relaxed max-w-xl mx-auto">
          Desde producción cinematográfica en titanio hasta la serenidad analógica del detox digital de colección.
        </p>
      </div>

      {/* Bento Grid de Lujo 60-30-10 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        
        {/* Bento 1: Creación & Cine */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Apple')}
          className="md:col-span-2 row-span-1 rounded-[22px] p-7 bg-[#131316] border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227] relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-300 shadow-lg"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-2.5 rounded-xl bg-[#1b1b1f] text-[#c9a227] border border-[rgba(243,239,230,0.08)]">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[11px] tracking-wide uppercase font-medium px-3 py-1 rounded-full bg-[rgba(243,239,230,0.04)] text-[#e4c972] border border-[rgba(243,239,230,0.12)]">
              Cinematografía & ProRes
            </span>
          </div>

          <div className="z-10 mt-2">
            <h3 className="text-xl font-bold text-[#f3efe6] mb-1.5 group-hover:text-[#e4c972] transition-colors">
              Estudio de Cine en Titanio
            </h3>
            <p className="text-xs text-[#8b8680] line-clamp-2 leading-relaxed">
              Grabación en 4K a 120 fps ProRes Log con rango dinámico cinematográfico para creación sin equipo pesado.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#c9a227] group-hover:translate-x-1 transition-transform z-10">
            <span>Ver selección de creadores</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bento 2: Autonomía Extrema */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Xiaomi')}
          className="md:col-span-1 row-span-1 rounded-[22px] p-7 bg-[#131316] border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227] relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-300 shadow-lg"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-2.5 rounded-xl bg-[#1b1b1f] text-[#f3efe6] border border-[rgba(243,239,230,0.08)]">
              <Zap className="w-5 h-5 text-[#e4c972]" />
            </div>
            <span className="text-[10px] tracking-wide uppercase font-medium px-2.5 py-1 rounded-full bg-[rgba(243,239,230,0.04)] text-[#8b8680] border border-[rgba(243,239,230,0.08)]">
              Autonomía
            </span>
          </div>

          <div className="z-10 mt-1">
            <h3 className="text-lg font-bold text-[#f3efe6] mb-1">
              Cero Ansiedad Energética
            </h3>
            <p className="text-xs text-[#8b8680] line-clamp-2">
              Hasta 33 horas continuas y carga de 120W para días intensivos de viaje.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8b8680] group-hover:text-[#f3efe6] transition-colors z-10">
            <span>Explorar</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Bento 3: Vintage Archive */}
        <div
          onClick={() => handlePillClick('vintage_classic')}
          className="md:col-span-1 row-span-1 rounded-[22px] p-7 bg-[#131316] border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227] relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-300 shadow-lg"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-2.5 rounded-xl bg-[#1b1b1f] text-[#c9a227] border border-[rgba(243,239,230,0.08)]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-wide uppercase font-medium px-2.5 py-1 rounded-full bg-[rgba(201,162,39,0.10)] text-[#e4c972] border border-[#c9a227]/30">
              Vintage Legends
            </span>
          </div>

          <div className="z-10 mt-1">
            <h3 className="text-lg font-bold text-[#f3efe6] mb-1">
              Detox Digital & Serenidad
            </h3>
            <p className="text-xs text-[#8b8680] line-clamp-2">
              Cero notificaciones intrusivas, durabilidad legendaria y 2 semanas de batería.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#c9a227] group-hover:translate-x-1 transition-transform z-10">
            <span>Ver Archive</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Bento 4: Productividad Ejecutiva */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Samsung')}
          className="md:col-span-2 row-span-1 rounded-[22px] p-7 bg-[#131316] border border-[rgba(243,239,230,0.08)] hover:border-[#c9a227] relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-300 shadow-lg"
        >
          <div className="flex items-start justify-between z-10">
            <div className="p-2.5 rounded-xl bg-[#1b1b1f] text-[#8b8680] border border-[rgba(243,239,230,0.08)]">
              <Briefcase className="w-5 h-5 text-[#f3efe6]" />
            </div>
            <span className="text-[11px] tracking-wide uppercase font-medium px-3 py-1 rounded-full bg-[rgba(243,239,230,0.04)] text-[#8b8680] border border-[rgba(243,239,230,0.12)]">
              Productividad & Negocios
            </span>
          </div>

          <div className="z-10 mt-2">
            <h3 className="text-xl font-bold text-[#f3efe6] mb-1 group-hover:text-[#e4c972] transition-colors">
              Oficina Ejecutiva Multitarea
            </h3>
            <p className="text-xs text-[#8b8680] line-clamp-2 leading-relaxed">
              Traducción simultánea por IA, firma de documentos con stylus y pantalla dividida en formato libro.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#c9a227] group-hover:translate-x-1 transition-transform z-10">
            <span>Descubrir buques ejecutivos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </section>
  );
};
