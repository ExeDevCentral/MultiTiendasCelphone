import React, { useState } from 'react';
import { Save, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';

export const BulkStockEditor = ({ products = [], onRefresh }) => {
  const [localProducts, setLocalProducts] = useState(() =>
    products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      status: p.status || 'published',
      isDirty: false
    }))
  );
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFieldChange = (id, field, value) => {
    setLocalProducts(prev =>
      prev.map(p => {
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
    const dirtyItems = localProducts.filter(p => p.isDirty);
    if (dirtyItems.length === 0) return;

    setSaving(true);
    try {
      await Promise.all(
        dirtyItems.map(item =>
          api.updateProduct(item.id, {
            price: item.price,
            stock: item.stock,
            status: item.status
          })
        )
      );

      setLocalProducts(prev => prev.map(p => ({ ...p, isDirty: false })));
      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Error in bulk update:', err);
    } finally {
      setSaving(false);
    }
  };

  const dirtyCount = localProducts.filter(p => p.isDirty).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <h4 className="text-sm font-bold text-white">Editor Rápido de Stock y Precios</h4>
          <p className="text-xs text-neutral-400">
            Modifica precios y cantidades en masa sin abrir cada producto individualmente.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={dirtyCount === 0 || saving}
          className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
            dirtyCount > 0
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {saving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{saving ? 'Guardando...' : `Guardar Cambios (${dirtyCount})`}</span>
        </button>
      </div>

      <div className="rounded-2xl glass-panel border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10 font-bold">
            <tr>
              <th className="p-3.5">Producto</th>
              <th className="p-3.5">Precio ($ USD)</th>
              <th className="p-3.5">Stock (Unidades)</th>
              <th className="p-3.5">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {localProducts.map((p) => (
              <tr key={p.id} className={`hover:bg-white/[0.02] ${p.isDirty ? 'bg-blue-500/5' : ''}`}>
                <td className="p-3.5 font-bold text-white">{p.name}</td>
                <td className="p-3.5">
                  <input
                    type="number"
                    min="1"
                    value={p.price}
                    onChange={(e) => handleFieldChange(p.id, 'price', e.target.value)}
                    className="w-24 bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                  />
                </td>
                <td className="p-3.5">
                  <input
                    type="number"
                    min="0"
                    value={p.stock}
                    onChange={(e) => handleFieldChange(p.id, 'stock', e.target.value)}
                    className="w-20 bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                  />
                </td>
                <td className="p-3.5">
                  <select
                    value={p.status}
                    onChange={(e) => handleFieldChange(p.id, 'status', e.target.value)}
                    className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-200"
                  >
                    <option value="published">🟢 Publicado</option>
                    <option value="draft">🟡 Borrador</option>
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
