'use client';

import React from 'react';
import { Sparkles, Zap, History, Layers, ShieldCheck } from 'lucide-react';
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
      label: 'Colección Completa',
      icon: Layers,
      count: countAll,
    },
    {
      id: 'last_2_years',
      label: 'Flagships (2024 - 2026)',
      icon: Zap,
      count: countLast2Years,
    },
    {
      id: 'recent_gen',
      label: 'Series 2020 - 2023',
      icon: ShieldCheck,
      count: countRecent,
    },
    {
      id: 'vintage_classic',
      label: 'Vintage Archive Legends',
      icon: History,
      count: countVintage,
    },
  ];

  return (
    <div className="w-full py-2">
      {showTitle && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-4">
          <div>
            <p className="eyebrow !mb-1 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e4c972]" />
              Segmentación Cronológica
            </p>
            <p className="text-xs text-[#8b8680]">
              Filtra entre ingeniería contemporánea de titanio y leyendas de colección
            </p>
          </div>
        </div>
      )}

      {/* Tabs Container de Alta Costura 60-30-10 */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = generationFilter === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => {
                playSubtleClick();
                setGenerationFilter(cat.id);
              }}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[rgba(201,162,39,0.10)] text-[#f3efe6] border border-[#c9a227] shadow-sm'
                  : 'bg-[#131316] text-[#8b8680] hover:text-[#f3efe6] border border-[rgba(243,239,230,0.16)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#e4c972]' : 'text-[#8b8680]'}`} />
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-[rgba(201,162,39,0.20)] text-[#e4c972]' : 'bg-[rgba(243,239,230,0.06)] text-[#8b8680]'
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
