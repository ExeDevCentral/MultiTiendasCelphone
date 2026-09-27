'use client';

import React from 'react';
import { Layers, Zap, ShieldCheck, History, Terminal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playSubtleClick } from '../utils/audioHaptics';

export const GenerationFilter = ({ showTitle = true }) => {
  const { generationFilter, setGenerationFilter, products, activeStore } = useStore();

  const relevantPhones = products.filter(
    (p) => p.type === 'phone' && (!activeStore || p.storeId === activeStore.id)
  );

  const countAll = relevantPhones.length;
  const countLast2Years = relevantPhones.filter((p) => p.generationCategory === 'last_2_years').length;
  const countRecent = relevantPhones.filter((p) => p.generationCategory === 'recent_gen').length;
  const countVintage = relevantPhones.filter((p) => p.generationCategory === 'vintage_classic').length;

  const categories = [
    {
      id: 'all',
      code: '01',
      label: 'ALL HARDWARE',
      icon: Layers,
      count: countAll,
    },
    {
      id: 'last_2_years',
      code: '02',
      label: 'FLAGSHIP 2024-26',
      icon: Zap,
      count: countLast2Years,
    },
    {
      id: 'recent_gen',
      code: '03',
      label: 'SERIES 2020-23',
      icon: ShieldCheck,
      count: countRecent,
    },
    {
      id: 'vintage_classic',
      code: '04',
      label: 'VINTAGE ARCHIVE',
      icon: History,
      count: countVintage,
    },
  ];

  return (
    <div className="w-full py-2 font-mono">
      {showTitle && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-3">
          <div>
            <span className="text-[10px] font-bold text-[#ff4800] uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              CHRONO-SEGMENTATION FILTER
            </span>
            <p className="text-[11px] text-zinc-500">
              Filter between contemporary titanium architecture and restored historical collector hardware.
            </p>
          </div>
        </div>
      )}

      {/* Industrial Segmented Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = generationFilter === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => {
                playSubtleClick();
                setGenerationFilter(cat.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#ff4800] text-black border-[#ff4800] shadow-[2px_2px_0px_#000000]'
                  : 'bg-[#14161c] text-zinc-400 hover:text-[#f0f0eb] border-[#292d3b] hover:border-zinc-500'
              }`}
            >
              <span className={`text-[10px] ${isActive ? 'text-black' : 'text-zinc-500'}`}>
                [{cat.code}]
              </span>
              <span>{cat.label}</span>
              <span
                className={`px-1 py-0.2 text-[10px] ${
                  isActive ? 'bg-black text-[#ff4800]' : 'bg-[#1e212b] text-zinc-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
