'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types/database';
import { PrecisionProductCard } from './PrecisionProductCard';
import { playSubtleClick } from '../utils/audioHaptics';

interface PrecisionProductListProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const PrecisionProductList: React.FC<PrecisionProductListProps> = ({
  products = [],
  onSelectProduct,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');

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
        // Brand filter
        if (selectedBrand !== 'all' && p.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
        // Storage filter
        if (selectedStorage !== 'all' && !p.specs?.almacenamiento?.includes(selectedStorage.replace(' ', ''))) {
          return false;
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
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
  }, [safeProducts, selectedBrand, selectedStorage, searchQuery, sortBy]);

  return (
    <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Specs Control Panel Header */}
      <div className="border-b border-[#1A1A1D] pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-mono text-[#0066FF] font-bold tracking-widest uppercase block mb-1">
              // HARDWARE INDEX & SPECS SHEET
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#F5F5F7] tracking-tight uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Catálogo de Precisión
            </h2>
          </div>

          <div className="text-xs font-mono text-[#71717A] tabular-nums">
            REGISTRO: {filteredProducts.length.toString().padStart(2, '0')} / {safeProducts.length.toString().padStart(2, '0')} MODELOS DISPONIBLES
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 bg-[#0E0E10] border border-[#1A1A1D] flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-[#71717A] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por modelo, procesador (A18, Snapdragon), o RAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#F5F5F7] placeholder-[#71717A] text-xs font-mono focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#71717A] hover:text-[#F5F5F7] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
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
                  className={`px-3 py-2 border transition-all cursor-pointer whitespace-nowrap uppercase ${
                    active
                      ? 'bg-[#0066FF] text-[#F5F5F7] border-[#0066FF] font-bold'
                      : 'bg-[#0E0E10] text-[#71717A] border-[#1A1A1D] hover:border-zinc-500 hover:text-[#F5F5F7]'
                  }`}
                >
                  {b === 'all' ? 'TODAS' : b}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0E0E10] border border-[#1A1A1D] text-[#F5F5F7] px-3 py-2 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="featured">ORDEN: DESTACADOS</option>
              <option value="price-asc">PRECIO: MENOR A MAYOR</option>
              <option value="price-desc">PRECIO: MAYOR A MENOR</option>
            </select>
          </div>
        </div>
      </div>

      {/* ASYMMETRIC GRID: Featured item takes 2 cols, others take 1 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 border border-[#1A1A1D] bg-[#0E0E10] p-8 font-mono">
          <p className="text-sm font-bold text-[#F5F5F7] uppercase">SIN COINCIDENCIAS TÉCNICAS</p>
          <p className="text-xs text-[#71717A] mt-1">Ningún hardware cumple los parámetros de búsqueda especificados.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedBrand('all');
              setSearchQuery('');
              setSelectedStorage('all');
            }}
            className="mt-4 px-4 py-2 bg-[#0066FF] text-[#F5F5F7] text-xs font-bold uppercase cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1D] border border-[#1A1A1D]">
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
