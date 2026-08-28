import React from 'react';
import { X, Scale, Trash2, ShoppingBag, Zap, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export const ComparisonModal = () => {
  const { comparedProducts, removeCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useStore();
  const { addToCart } = useCart();

  if (!isCompareOpen || comparedProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsCompareOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-5xl bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Comparativa Cara a Cara de Modelos</h3>
              <p className="text-xs text-neutral-400">
                Analiza las especificaciones técnicas y lo que cada dispositivo soluciona para tu día a día
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-neutral-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {comparedProducts.map((phone) => (
            <div key={phone.id} className="pt-6 md:pt-0 md:px-4 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                {/* Header Card */}
                <div className="relative h-44 rounded-2xl bg-neutral-900/60 p-4 flex items-center justify-center mb-4 border border-white/5">
                  <img
                    src={phone.images?.[0]}
                    alt={phone.name}
                    className="max-h-full object-contain filter drop-shadow-xl"
                  />
                  <button
                    onClick={() => removeCompare(phone.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                    {phone.brand} • {phone.modelYear}
                  </span>
                  <h4 className="text-base font-bold text-white mb-1">{phone.name}</h4>
                  <div className="text-xl font-extrabold text-blue-400">${phone.price} USD</div>
                </div>

                {/* Solution Summary */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 mb-5">
                  <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    ¿Qué soluciona principalmente?
                  </h5>
                  <p className="text-xs text-neutral-300">
                    {phone.solutions?.[0]?.description || phone.tagline}
                  </p>
                </div>

                {/* Specs Table */}
                <div className="space-y-2.5 text-xs">
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase">Pantalla</span>
                    <span className="text-neutral-200 font-medium">{phone.specs?.screen || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase">Procesador</span>
                    <span className="text-neutral-200 font-medium">{phone.specs?.processor || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase">Batería</span>
                    <span className="text-neutral-200 font-medium">{phone.specs?.battery || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase">Cámara</span>
                    <span className="text-neutral-200 font-medium">{phone.specs?.camera || 'N/D'}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase">Sistema Operativo</span>
                    <span className="text-neutral-200 font-medium">{phone.specs?.os || 'N/D'}</span>
                  </div>
                </div>
              </div>

              {/* Buy Action */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    addToCart(phone);
                    setIsCompareOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar por ${phone.price} USD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
