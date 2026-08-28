import React from 'react';
import { Sparkles, Zap, History, Layers, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const GenerationFilter = ({ showTitle = true }) => {
  const { generationFilter, setGenerationFilter, products, activeStore } = useStore();

  // Calculate counts for active store or all
  const relevantPhones = products.filter(
    p => p.type === 'phone' && (!activeStore || p.storeId === activeStore.id)
  );

  const countAll = relevantPhones.length;
  const countLast2Years = relevantPhones.filter(p => p.generationCategory === 'last_2_years').length;
  const countRecent = relevantPhones.filter(p => p.generationCategory === 'recent_gen').length;
  const countVintage = relevantPhones.filter(p => p.generationCategory === 'vintage_classic').length;

  const categories = [
    {
      id: 'all',
      label: 'Todos los Celulares',
      icon: Layers,
      count: countAll,
      badgeColor: 'bg-neutral-800 text-neutral-300'
    },
    {
      id: 'last_2_years',
      label: 'Últimos 2 Años (2024 - 2026)',
      icon: Zap,
      count: countLast2Years,
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'recent_gen',
      label: 'Recientes (2020 - 2023)',
      icon: ShieldCheck,
      count: countRecent,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'vintage_classic',
      label: 'Clásicos & Vintage Legends',
      icon: History,
      count: countVintage,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    }
  ];

  return (
    <div className="w-full py-4">
      {showTitle && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Segmentación Generacional de Dispositivos
            </h3>
            <p className="text-xs text-neutral-500">
              Filtra entre los buques insignia de vanguardia y las leyendas de colección
            </p>
          </div>
        </div>
      )}

      {/* Tabs Container */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = generationFilter === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setGenerationFilter(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/50 scale-[1.02]'
                  : 'glass-panel text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : cat.badgeColor}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
