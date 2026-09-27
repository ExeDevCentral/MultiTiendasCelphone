'use client';

import React from 'react';
import { Camera, Zap, ShieldCheck, History, ArrowRight, Cpu, Terminal, Disc } from 'lucide-react';
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
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#262933] font-mono select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#15171f] border border-[#2b2e3c] text-[#ff4800] text-[10px] font-bold uppercase mb-2">
            <Terminal className="w-3 h-3" />
            ENGINEERING SCHEMATICS & LAB MODULES
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#f0f0eb] tracking-tight uppercase font-sans">
            LABORATORIO DE RENDIMIENTO Y ARQUITECTURA
          </h2>
          <p className="mt-1 text-xs text-zinc-500 max-w-xl font-sans">
            Desglose técnico de componentes: desde sensores de cinematografía profesional hasta chips nanométricos y coleccionismo histórico.
          </p>
        </div>

        <div className="text-[10px] text-zinc-500 hidden sm:block">
          SPEC: TE-ARCH-2026 // LAB TEST VALIDATED
        </div>
      </div>

      {/* Industrial Hardware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[220px]">
        
        {/* Module 01: ProRes Cine */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Apple')}
          className="md:col-span-2 row-span-1 p-5 bg-[#12141a] border-2 border-[#242733] hover:border-[#ff4800] flex flex-col justify-between cursor-pointer group transition-all has-crosshairs"
        >
          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#ff4800]">[MOD-01]</span>
              <span className="text-xs font-bold text-[#f0f0eb]">CINEMATOGRAPHY RIG</span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-[#1a1c24] text-zinc-400 border border-[#2f3342]">
              4K PRORES LOG // 120 FPS
            </span>
          </div>

          <div className="z-10">
            <h3 className="text-base font-black text-[#f0f0eb] group-hover:text-[#ff4800] transition-colors font-sans uppercase">
              Sensor Quad-Pixel & Estabilización Mecánica
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 font-sans leading-relaxed">
              Mapeo de tonos en tiempo real con amplio rango dinámico, soporte ACES de gradación de color y óptica tetraprisma 5x.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-[#1e2029] z-10">
            <span className="text-zinc-400 group-hover:text-[#ff4800] font-bold flex items-center gap-1">
              EXPLORAR DISPOSITIVOS CINE →
            </span>
            <span>COD: CAM-48MP</span>
          </div>
        </div>

        {/* Module 02: Silicon 3nm */}
        <div
          onClick={() => handlePillClick('last_2_years', 'Samsung')}
          className="md:col-span-1 row-span-1 p-5 bg-[#12141a] border-2 border-[#242733] hover:border-[#ccff00] flex flex-col justify-between cursor-pointer group transition-all has-crosshairs"
        >
          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#ccff00]">[MOD-02]</span>
              <span className="text-xs font-bold text-[#f0f0eb]">3NM SILICON</span>
            </div>
            <Cpu className="w-4 h-4 text-[#ccff00]" />
          </div>

          <div className="z-10">
            <h3 className="text-base font-black text-[#f0f0eb] group-hover:text-[#ccff00] transition-colors font-sans uppercase">
              Ray Tracing Acelerado
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 font-sans leading-relaxed">
              GPU de 6 núcleos con trazado de rayos por hardware y cámara de vapor criogénica.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-[#1e2029] z-10">
            <span className="text-zinc-400 group-hover:text-[#ccff00] font-bold">VER CHIPS 3NM →</span>
            <span>FREQ: 4.04 GHZ</span>
          </div>
        </div>

        {/* Module 03: Retro Archive */}
        <div
          onClick={() => handlePillClick('vintage_classic')}
          className="md:col-span-1 row-span-1 p-5 bg-[#12141a] border-2 border-[#242733] hover:border-white flex flex-col justify-between cursor-pointer group transition-all has-crosshairs"
        >
          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white">[MOD-03]</span>
              <span className="text-xs font-bold text-[#f0f0eb]">VINTAGE LAB</span>
            </div>
            <Disc className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="z-10">
            <h3 className="text-base font-black text-[#f0f0eb] group-hover:text-white transition-colors font-sans uppercase">
              Piezas Históricas
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 font-sans leading-relaxed">
              Nokia 3310, Motorola Razr V3 restaurados con celdas de batería nuevas y empaque industrial.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-[#1e2029] z-10">
            <span className="text-zinc-400 group-hover:text-white font-bold">VER ARCHIVO →</span>
            <span>ERA: 1998-2010</span>
          </div>
        </div>

        {/* Module 04: Concurrency & RLS */}
        <div
          onClick={() => handlePillClick('all')}
          className="md:col-span-2 row-span-1 p-5 bg-[#12141a] border-2 border-[#242733] hover:border-[#ff4800] flex flex-col justify-between cursor-pointer group transition-all has-crosshairs"
        >
          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#ff4800]">[MOD-04]</span>
              <span className="text-xs font-bold text-[#f0f0eb]">CONCURRENCY ENGINE</span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-[#1a1c24] text-[#ccff00] border border-[#2f3342]">
              ● RLS ENFORCED
            </span>
          </div>

          <div className="z-10">
            <h3 className="text-base font-black text-[#f0f0eb] group-hover:text-[#ff4800] transition-colors font-sans uppercase">
              Control Transaccional de Stock Atómico
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 font-sans leading-relaxed">
              Protección contra condiciones de carrera mediante bloqueo FOR UPDATE a nivel de base de datos canónica. Aislamiento estricto multi-tenant por boutique.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-[#1e2029] z-10">
            <span className="text-zinc-400 group-hover:text-[#ff4800] font-bold">
              VER PROTOCOLO DE AUDITORÍA →
            </span>
            <span>SEC: ZERO-RACE</span>
          </div>
        </div>

      </div>
    </section>
  );
};
