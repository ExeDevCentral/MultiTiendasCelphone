'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Copy, Trash2, Search, ArrowUpRight } from 'lucide-react';
import { playSubtleClick } from '../../../utils/audioHaptics';

export const ProductList = ({
  products = [],
  onOpenNew,
  onOpenEdit,
  onDuplicate,
  onDelete
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genFilter, setGenFilter] = useState('all');

  const filtered = products.filter((p) => {
    if (statusFilter !== 'all' && (p.status || 'published') !== statusFilter) return false;
    if (genFilter !== 'all' && p.generationCategory !== genFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0E0E10] border border-[#1A1A1D] p-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por modelo o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141416] border border-[#1A1A1D] pl-8 pr-3 py-1.5 text-xs text-[#F5F5F7] placeholder-[#71717A] outline-none focus:border-[#0066FF] transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141416] border border-[#1A1A1D] px-2.5 py-1.5 text-xs text-[#F5F5F7] outline-none focus:border-[#0066FF] cursor-pointer"
          >
            <option value="all">TODOS LOS ESTADOS</option>
            <option value="published">● PUBLICADOS</option>
            <option value="draft">○ BORRADORES</option>
          </select>

          <select
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            className="bg-[#141416] border border-[#1A1A1D] px-2.5 py-1.5 text-xs text-[#F5F5F7] outline-none focus:border-[#0066FF] cursor-pointer hidden sm:inline-block"
          >
            <option value="all">TODAS LAS CATEGORÍAS</option>
            <option value="last_2_years">FLAGSHIPS (ÚLTIMOS 2 AÑOS)</option>
            <option value="recent_gen">RECIENTES</option>
            <option value="vintage_classic">VINTAGE CLÁSICOS</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            playSubtleClick();
            onOpenNew();
          }}
          className="px-3.5 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all uppercase tracking-wider shrink-0 active:translate-y-[1px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>[ + NUEVO MODELO ]</span>
        </button>
      </div>

      {/* Precision Datasheet Table */}
      <div className="bg-[#0E0E10] border border-[#1A1A1D] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#141416] text-[10px] uppercase tracking-wider text-[#71717A] border-b border-[#1A1A1D] font-bold">
            <tr>
              <th className="p-3">IDENTIFICADOR / PRODUCTO</th>
              <th className="p-3">AÑO / TIPO</th>
              <th className="p-3">ESTADO</th>
              <th className="p-3">PRECIO</th>
              <th className="p-3">STOCK</th>
              <th className="p-3 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1D]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-[#71717A]">
                  // No se encontraron elementos en el inventario actual.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#141416] transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100'}
                        alt={p.name}
                        className="w-9 h-9 object-contain bg-[#141416] border border-[#1A1A1D] p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-[#F5F5F7] block truncate max-w-xs">{p.name}</span>
                        <span className="text-[10px] text-[#71717A] font-mono uppercase">{p.brand} // {p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] text-[#71717A] px-2 py-0.5 bg-[#141416] border border-[#1A1A1D]">
                      {p.modelYear || 2024} // {p.type === 'accessory' ? 'ACCESORIO' : 'PHONE'}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.status === 'draft' ? (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-[#141416] border border-[#FF9500] text-[#FF9500]">
                        BORRADOR
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-[#141416] border border-[#0066FF] text-[#0066FF]">
                        PUBLICADO
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-[#F5F5F7] tabular-nums">
                    ${Number(p.price).toLocaleString()} <span className="text-[10px] text-[#71717A] font-normal">USD</span>
                  </td>
                  <td className="p-3">
                    <span className={`tabular-nums font-bold ${p.stock < 3 ? 'text-[#FF3B30]' : 'text-[#30D158]'}`}>
                      {p.stock} <span className="text-[10px] text-[#71717A] font-normal">un.</span>
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => onDuplicate(p.id)}
                      className="px-2 py-1 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#0066FF] text-[#71717A] hover:text-[#F5F5F7] text-[10px] transition-colors cursor-pointer"
                      title="Duplicar elemento"
                    >
                      [CLON]
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEdit(p)}
                      className="px-2 py-1 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#0066FF] text-[#0066FF] text-[10px] transition-colors cursor-pointer font-bold"
                      title="Editar ficha"
                    >
                      [EDIT]
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      className="px-2 py-1 bg-[#141416] hover:bg-[#251010] border border-[#1A1A1D] hover:border-[#FF3B30] text-[#FF3B30] text-[10px] transition-colors cursor-pointer"
                      title="Eliminar del catálogo"
                    >
                      [DEL]
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
