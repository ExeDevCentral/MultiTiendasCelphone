import React, { useState } from 'react';
import { Plus, Edit2, Copy, Trash2, Search, Zap, History, ShieldCheck, Eye, Layers } from 'lucide-react';

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

  const filtered = products.filter(p => {
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
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por modelo o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos los Estados</option>
            <option value="published">🟢 Solo Publicados</option>
            <option value="draft">🟡 Solo Borradores</option>
          </select>

          <select
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-blue-500 hidden sm:inline-block"
          >
            <option value="all">Todas las Épocas</option>
            <option value="last_2_years">🚀 Últimos 2 Años</option>
            <option value="recent_gen">⏳ Recientes</option>
            <option value="vintage_classic">📟 Clásicos Vintage</option>
          </select>
        </div>

        <button
          onClick={onOpenNew}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cargar Nuevo Producto</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10 font-bold">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Generación / Año</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-neutral-500">
                  No se encontraron productos con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-contain bg-neutral-900 p-1 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block truncate max-w-xs">{p.name}</span>
                        <span className="text-[11px] text-neutral-400">{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {p.generationCategory === 'last_2_years' ? (
                      <span className="badge-last-2-years px-2 py-0.5 rounded-full text-[10px] font-bold">
                        🚀 {p.modelYear}
                      </span>
                    ) : p.generationCategory === 'vintage_classic' ? (
                      <span className="badge-vintage px-2 py-0.5 rounded-full text-[10px] font-bold">
                        📟 {p.modelYear}
                      </span>
                    ) : (
                      <span className="badge-recent px-2 py-0.5 rounded-full text-[10px] font-bold">
                        ⏳ {p.modelYear}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {p.status === 'draft' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Borrador (Draft)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Publicado
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-white">${p.price} USD</td>
                  <td className="p-4">
                    <span className={`font-semibold ${p.stock < 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {p.stock} un.
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    {/* Duplicate button */}
                    <button
                      onClick={() => onDuplicate(p.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-600 text-neutral-300 hover:text-white transition-colors"
                      title="Duplicar producto (1-clic)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => onOpenEdit(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
                      title="Editar producto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => onDelete(p.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-neutral-300 hover:text-white transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
