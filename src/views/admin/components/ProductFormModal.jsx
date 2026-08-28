import React, { useState } from 'react';
import { X, Sparkles, Save, Eye, Layers, Palette, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { api } from '../../../services/api';

export const ProductFormModal = ({ isOpen, onClose, onSave, editingProduct, storeId }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'solutions' | 'specs' | 'images'
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => {
    if (editingProduct) {
      return {
        ...editingProduct,
        price: Number(editingProduct.price) || 0,
        originalPrice: Number(editingProduct.originalPrice) || 0,
        stock: Number(editingProduct.stock) || 0,
        status: editingProduct.status || 'published',
        images: editingProduct.images || [],
        solutions: editingProduct.solutions || [],
        colors: editingProduct.colors || [
          { name: 'Titanio Natural', hex: '#9e9689', threeHex: '#8e867b' },
          { name: 'Negro Espacial', hex: '#2c2c2e', threeHex: '#1c1c1e' }
        ],
        storageOptions: editingProduct.storageOptions || ['256 GB', '512 GB'],
        specs: editingProduct.specs || {
          screen: 'Super Retina XDR OLED 120Hz',
          processor: 'Chip de Alto Rendimiento',
          battery: '5000 mAh',
          camera: 'Triple Sensor 48MP Pro',
          os: 'Sistema Actualizado'
        }
      };
    }
    return {
      name: '',
      brand: 'Apple',
      type: 'phone',
      modelYear: 2025,
      generationCategory: 'last_2_years',
      price: 999,
      originalPrice: 1099,
      stock: 10,
      status: 'draft', // Safe initial state
      condition: 'Nuevo Sellado con Garantía 1 Año',
      tagline: '',
      model3dType: 'modern_flagship',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
      colors: [
        { name: 'Titanio Natural', hex: '#9e9689', threeHex: '#8e867b' },
        { name: 'Negro Espacial', hex: '#2c2c2e', threeHex: '#1c1c1e' }
      ],
      storageOptions: ['256 GB', '512 GB'],
      specs: {
        screen: 'Super Retina XDR OLED 120Hz',
        processor: 'Chip de Alto Rendimiento',
        battery: '5000 mAh',
        camera: 'Triple Sensor 48MP Pro',
        os: 'Sistema Actualizado'
      },
      solutions: [],
      storeId
    };
  });

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!formData.brand || formData.brand.trim().length === 0) {
      errs.brand = 'La marca es requerida';
    }
    if (Number(formData.price) <= 0) {
      errs.price = 'El precio debe ser mayor a 0';
    }
    if (Number(formData.stock) < 0) {
      errs.stock = 'El stock no puede ser negativo';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerateSolutions = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateSolutions({
        name: formData.name,
        brand: formData.brand,
        modelYear: formData.modelYear,
        generationCategory: formData.generationCategory,
        type: formData.type
      });

      if (res.solutions && res.solutions.length > 0) {
        setFormData(prev => ({ ...prev, solutions: res.solutions }));
      }
    } catch (err) {
      console.error('Error generating solutions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || 0,
      stock: Number(formData.stock),
      storeId
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-3xl bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white z-10 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editingProduct ? `Editar: ${editingProduct.name}` : 'Cargar Nuevo Producto (Nuevo o Vintage)'}
              </h3>
              <p className="text-xs text-neutral-400">
                Administra los datos de catálogo, estado borrador/publicado y argumentos de solución.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'general' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            1. Datos Generales & Precios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('solutions')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'solutions' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Qué Soluciona (Storytelling)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'specs' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            3. Ficha Técnica & 3D
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'images' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            4. Galería de Fotos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: GENERAL & STATUS */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Draft / Published Toggle */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Estado de Publicación en Tienda</span>
                  <span className="text-[11px] text-neutral-400">
                    {formData.status === 'published'
                      ? '🟢 Publicado: Visible inmediatamente para todos los compradores.'
                      : '🟡 Borrador (Draft): Oculto en el catálogo público hasta que decidas publicarlo.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      formData.status === 'draft' ? 'bg-amber-500 text-black shadow-md' : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Borrador
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'published' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      formData.status === 'published' ? 'bg-emerald-500 text-black shadow-md' : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Publicado
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Nombre del Modelo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. iPhone 16 Pro Max / Nokia 3310"
                  />
                  {errors.name && <span className="text-[10px] text-rose-400 block mt-1">{errors.name}</span>}
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Apple, Samsung, Nokia, Motorola..."
                  />
                  {errors.brand && <span className="text-[10px] text-rose-400 block mt-1">{errors.brand}</span>}
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Año de Lanzamiento</label>
                  <input
                    type="number"
                    value={formData.modelYear}
                    onChange={(e) => setFormData({ ...formData, modelYear: parseInt(e.target.value) || 2025 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Segmentación Generacional</label>
                  <select
                    value={formData.generationCategory}
                    onChange={(e) => setFormData({ ...formData, generationCategory: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="last_2_years">🚀 Últimos 2 Años (2024 - 2026)</option>
                    <option value="recent_gen">⏳ Generaciones Recientes (2020 - 2023)</option>
                    <option value="vintage_classic">📟 Clásicos & Vintage Legends</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Precio ($ USD)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.price && <span className="text-[10px] text-rose-400 block mt-1">{errors.price}</span>}
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Precio Original / Tachado ($ USD)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.stock && <span className="text-[10px] text-rose-400 block mt-1">{errors.stock}</span>}
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Condición</label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Nuevo Sellado / Restaurado Grado A"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOLUTIONS & STORYTELLING */}
          {activeTab === 'solutions' && (
            <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Storytelling: "¿Qué soluciona para ti este celular?"
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Enfocado en soluciones de vida en lugar de números técnicos incomprensibles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateSolutions}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Generando...' : 'Generar con IA'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.solutions && formData.solutions.length > 0 ? (
                  formData.solutions.map((sol, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Etiqueta (Ej. Creadores)"
                          value={sol.badge}
                          onChange={(e) => {
                            const newSol = [...formData.solutions];
                            newSol[sIdx].badge = e.target.value;
                            setFormData({ ...formData, solutions: newSol });
                          }}
                          className="w-1/3 bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-blue-300 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Título de la Solución"
                          value={sol.title}
                          onChange={(e) => {
                            const newSol = [...formData.solutions];
                            newSol[sIdx].title = e.target.value;
                            setFormData({ ...formData, solutions: newSol });
                          }}
                          className="w-2/3 bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-semibold"
                        />
                      </div>
                      <textarea
                        rows="2"
                        placeholder="Descripción de la solución..."
                        value={sol.description}
                        onChange={(e) => {
                          const newSol = [...formData.solutions];
                          newSol[sIdx].description = e.target.value;
                          setFormData({ ...formData, solutions: newSol });
                        }}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-300"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic">
                    Haz clic en "Generar con IA" para redactar automáticamente las propuestas de valor de este modelo.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SPECS & 3D MODEL */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 font-semibold block mb-1">Plantilla de Render 3D</label>
                <select
                  value={formData.model3dType}
                  onChange={(e) => setFormData({ ...formData, model3dType: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="modern_flagship">Smartphone Moderno (Titanio / OLED / Lentes 48MP)</option>
                  <option value="vintage_bar">Nokia Barra Clásico (LCD Retro / Teclado Físico / Snake II)</option>
                  <option value="vintage_flip">Motorola RAZR / Clamshell con Tapa Abatible</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Pantalla</label>
                  <input
                    type="text"
                    value={formData.specs?.screen || ''}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, screen: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Procesador</label>
                  <input
                    type="text"
                    value={formData.specs?.processor || ''}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, processor: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Batería</label>
                  <input
                    type="text"
                    value={formData.specs?.battery || ''}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, battery: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Cámara</label>
                  <input
                    type="text"
                    value={formData.specs?.camera || ''}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, camera: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMAGES */}
          {activeTab === 'images' && (
            <ImageUploader
              images={formData.images || []}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
