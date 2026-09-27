'use client';

import React, { useState } from 'react';
import { Save, Check, RefreshCw } from 'lucide-react';
import { api } from '../../../services/api';
import { playSubtleClick } from '../../../utils/audioHaptics';

export const BulkStockEditor = ({ products = [], onRefresh }) => {
  const [localProducts, setLocalProducts] = useState(() =>
    products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      status: p.status || 'published',
      isDirty: false,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFieldChange = (id, field, value) => {
    setLocalProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const numVal = field === 'price' || field === 'stock' ? Math.max(0, Number(value) || 0) : value;
          return { ...p, [field]: numVal, isDirty: true };
        }
        return p;
      })
    );
    setSavedSuccess(false);
  };

  const handleSaveAll = async () => {
    playSubtleClick();
    const dirtyItems = localProducts.filter((p) => p.isDirty);
    if (dirtyItems.length === 0) return;

    setSaving(true);
    try {
      await Promise.all(
        dirtyItems.map((item) =>
          api.updateProduct(item.id, {
            price: item.price,
            stock: item.stock,
            status: item.status,
          })
        )
      );

      setLocalProducts((prev) => prev.map((p) => ({ ...p, isDirty: false })));
      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Error in bulk update:', err);
    } finally {
      setSaving(false);
    }
  };

  const dirtyCount = localProducts.filter((p) => p.isDirty).length;

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0E0E10] border border-[#1A1A1D]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0066FF]" />
            <span className="font-bold text-[#F5F5F7] uppercase tracking-wider">
              EDITOR RÁPIDO DE INVENTARIO Y PRECIOS
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Ajuste directo de cantidades y valores en tiempo real (Persistencia local en Modo Prueba).
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={dirtyCount === 0 || saving}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            dirtyCount > 0
              ? 'bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] active:translate-y-[1px]'
              : 'bg-[#141416] text-[#71717A] border border-[#1A1A1D] cursor-not-allowed'
          }`}
        >
          {saving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-3.5 h-3.5 text-[#30D158]" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{saving ? '[ GUARDANDO... ]' : `[ APLICAR CAMBIOS (${dirtyCount}) ]`}</span>
        </button>
      </div>

      <div className="bg-[#0E0E10] border border-[#1A1A1D] overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#141416] text-[10px] uppercase tracking-wider text-[#71717A] border-b border-[#1A1A1D] font-bold">
            <tr>
              <th className="p-3">PRODUCTO / MODELO</th>
              <th className="p-3">PRECIO ($ USD)</th>
              <th className="p-3">STOCK (UNIDADES)</th>
              <th className="p-3">ESTADO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1D]">
            {localProducts.map((p) => (
              <tr key={p.id} className={p.isDirty ? 'bg-[#1E1E22]' : 'hover:bg-[#141416]'}>
                <td className="p-3">
                  <span className="font-bold text-[#F5F5F7] block">{p.name}</span>
                  <span className="text-[10px] text-[#71717A] font-mono">{p.id}</span>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handleFieldChange(p.id, 'price', e.target.value)}
                    className="w-28 bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] px-2.5 py-1 text-xs text-[#F5F5F7] font-bold tabular-nums outline-none"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={p.stock}
                    onChange={(e) => handleFieldChange(p.id, 'stock', e.target.value)}
                    className="w-24 bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] px-2.5 py-1 text-xs text-[#F5F5F7] font-bold tabular-nums outline-none"
                  />
                </td>
                <td className="p-3">
                  <select
                    value={p.status}
                    onChange={(e) => handleFieldChange(p.id, 'status', e.target.value)}
                    className="bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] px-2 py-1 text-xs text-[#F5F5F7] outline-none cursor-pointer"
                  >
                    <option value="published">PUBLICADO</option>
                    <option value="draft">BORRADOR</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
