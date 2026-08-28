import React, { useState, useEffect } from 'react';
import { Save, Store, Check, RefreshCw, Phone, Image, MapPin } from 'lucide-react';
import { api } from '../../../services/api';

export const StoreSettingsForm = ({ store, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: store?.name || '',
    tagLine: store?.tagLine || '',
    description: store?.description || '',
    phoneWhatsApp: store?.phoneWhatsApp || '',
    banner: store?.banner || '',
    address: store?.address || ''
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        tagLine: store.tagLine || '',
        description: store.description || '',
        phoneWhatsApp: store.phoneWhatsApp || '',
        banner: store.banner || '',
        address: store.address || ''
      });
    }
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.updateStore(store.id, formData);
      setSuccess(true);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error('Error updating store:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5 max-w-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Store className="w-4 h-4 text-blue-400" />
          <span>Personalizar Perfil de Sucursal</span>
        </h4>
        {success && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>Guardado exitoso</span>
          </span>
        )}
      </div>

      <div>
        <label className="text-xs text-neutral-400 font-semibold block mb-1">Nombre Comercial de la Tienda</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 font-semibold block mb-1">Lema o Frase Destacada</label>
        <input
          type="text"
          value={formData.tagLine}
          onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 font-semibold block mb-1">Descripción de Especialidad</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-400 font-semibold block mb-1">Teléfono / WhatsApp de Ventas</label>
          <input
            type="text"
            value={formData.phoneWhatsApp}
            onChange={(e) => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="+5491145239900"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 font-semibold block mb-1">Dirección / Ubicación Física</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Av. Principal 123"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-400 font-semibold block mb-1">URL de Imagen de Portada / Banner</label>
        <input
          type="text"
          value={formData.banner}
          onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
      >
        {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        <span>{saving ? 'Guardando...' : 'Guardar Datos de Sucursal'}</span>
      </button>
    </form>
  );
};
