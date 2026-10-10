'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types/database';
import { PrecisionProductCard } from './PrecisionProductCard';
import { useStore } from '../context/StoreContext';
import { playSubtleClick } from '../utils/audioHaptics';

interface PrecisionProductListProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const PrecisionProductList: React.FC<PrecisionProductListProps> = ({
  products = [],
  onSelectProduct,
}) => {
  const {
    generationFilter,
    setGenerationFilter,
    searchQuery: globalSearchQuery,
    setSearchQuery: setGlobalSearchQuery,
    activeStore,
  } = useStore();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');

  const currentSearch = globalSearchQuery || localSearchQuery;

  const safeProducts = useMemo(() => {
    return (products || []).map((p) => ({
      ...p,
      specs: p.specs || {
        ram: '',
        almacenamiento: '',
        camara: '',
        bateria: '',
        procesador: '',
        pantalla: '',
      },
    }));
  }, [products]);

  const brands = useMemo(() => {
    const list = Array.from(new Set(safeProducts.map((p) => p.brand).filter(Boolean)));
    return ['all', ...list];
  }, [safeProducts]);

  const filteredProducts = useMemo(() => {
    return safeProducts
      .filter((p) => {
        // Filter by generation category
        if (generationFilter !== 'all' && (p as any).generationCategory !== generationFilter) {
          return false;
        }
        // Filter by brand
        if (selectedBrand !== 'all' && p.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
        // Filter by storage
        if (selectedStorage !== 'all' && !p.specs?.almacenamiento?.includes(selectedStorage.replace(' ', ''))) {
          return false;
        }
        // Filter by search query
        if (currentSearch.trim() !== '') {
          const q = currentSearch.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchModel = p.model?.toLowerCase().includes(q);
          const matchProc = p.specs?.procesador?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchModel && !matchProc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [safeProducts, generationFilter, selectedBrand, selectedStorage, currentSearch, sortBy]);

  const handleSearchChange = (val: string) => {
    setLocalSearchQuery(val);
    setGlobalSearchQuery(val);
  };

  return (
    <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Apple-style Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
            {generationFilter === 'last_2_years'
              ? 'FLAGSHIPS 2024-2026'
              : generationFilter === 'vintage_classic'
              ? 'EDICIONES VINTAGE'
              : activeStore
              ? `BOUTIQUE // ${activeStore.name.toUpperCase()}`
              : 'COLECCIÓN 2026'}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white"
            style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
          >
            {generationFilter === 'last_2_years'
              ? 'Flagships de Gama Alta'
              : generationFilter === 'vintage_classic'
              ? 'Smartphones Vintage Clásicos'
              : activeStore
              ? activeStore.name
              : 'Catálogo de Smartphones'}
          </h2>
          <p className="mt-1 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            {generationFilter === 'last_2_years'
              ? 'Dispositivos de última generación con procesadores A18 Pro y Snapdragon 8 Elite.'
              : generationFilter === 'vintage_classic'
              ? 'Modelos icónicos certificados y restaurados con piezas 100% originales.'
              : 'Encontrá el dispositivo perfecto con garantía oficial y entrega prioritaria.'}
          </p>

          {/* Active Generation Filter Chip */}
          {generationFilter !== 'all' && (
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <span>
                  {generationFilter === 'last_2_years' ? 'Filtro: Flagships' : 'Filtro: Vintage Clásicos'}
                </span>
                <button
                  type="button"
                  onClick={() => setGenerationFilter('all')}
                  className="hover:text-black dark:hover:text-white cursor-pointer ml-1"
                  title="Quitar filtro y ver todos"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
              <button
                type="button"
                onClick={() => setGenerationFilter('all')}
                className="text-xs text-zinc-500 hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Ver todos los dispositivos
              </button>
            </div>
          )}
        </div>

        <div className="text-xs sm:text-sm font-medium text-zinc-500 tabular-nums">
          Mostrando {filteredProducts.length} de {safeProducts.length} dispositivos
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3.5 mb-10">
        {/* Search Input */}
        <div className="relative flex-1 bg-white dark:bg-[#141519] border border-zinc-200 dark:border-white/15 rounded-full flex items-center px-4 py-2.5 shadow-xs">
          <Search className="w-4 h-4 text-zinc-500 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por modelo, procesador o marca..."
            value={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none font-medium"
          />
          {currentSearch && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Brand Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {brands.map((b) => {
            const active = selectedBrand === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setSelectedBrand(b);
                }}
                className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                  active
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#141519] border-zinc-200 dark:border-white/15 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-300'
                }`}
              >
                {b === 'all' ? 'Todas las marcas' : b}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-[#141519] border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-200 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#F5F5F7] dark:bg-[#121214] border border-black/5 dark:border-white/10 p-8 space-y-3">
          <p className="text-lg font-bold text-black dark:text-white">No se encontraron productos</p>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">Probá ajustando el término de búsqueda o seleccionando otra marca.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedBrand('all');
              handleSearchChange('');
              setGenerationFilter('all');
              setSelectedStorage('all');
            }}
            className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold cursor-pointer shadow-sm hover:bg-blue-700"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => {
            const isWide = index === 0 && Boolean(product.featured);
            return (
              <PrecisionProductCard
                key={product.id}
                product={product}
                isWide={isWide}
                onSelect={onSelectProduct}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
