import React, { useState } from 'react';
import { ShoppingBag, Eye, Scale, Check, Zap, History, Sparkles, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export const ProductCard = ({ product, onOpenDetail, onOpen3DModal }) => {
  const { addToCart } = useCart();
  const { comparedProducts, toggleCompare, stores } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

  const isCompared = comparedProducts.some(p => p.id === product.id);
  const storeInfo = stores.find(s => s.id === product.storeId);

  // Badge helpers
  const getGenerationBadge = () => {
    if (product.generationCategory === 'last_2_years') {
      return (
        <span className="badge-last-2-years px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Zap className="w-3 h-3 text-blue-400" />
          Últimos 2 Años • {product.modelYear}
        </span>
      );
    }
    if (product.generationCategory === 'vintage_classic') {
      return (
        <span className="badge-vintage px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <History className="w-3 h-3 text-amber-400" />
          Vintage Legend • {product.modelYear}
        </span>
      );
    }
    return (
      <span className="badge-recent px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        Generación {product.modelYear}
      </span>
    );
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickWhatsApp = (e) => {
    e.stopPropagation();
    const phone = storeInfo?.phoneWhatsApp || '+5491145239900';
    const text = encodeURIComponent(
      `¡Hola! Estoy interesado en comprar el *${product.name}* (Color: ${selectedColor?.name || 'Estándar'}, Precio: $${product.price} USD) en la tienda *${storeInfo?.name || 'CelStore'}*. ¿Tienen stock disponible?`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(product)}
      className="group relative rounded-3xl glass-panel glass-panel-hover p-5 flex flex-col justify-between cursor-pointer border border-white/10 overflow-hidden"
    >
      {/* Top Header: Badge & Compare */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.type === 'phone' ? getGenerationBadge() : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Accesorio
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              -{discountPercent}%
            </span>
          )}
        </div>

        {product.type === 'phone' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`p-1.5 rounded-full border transition-all text-xs flex items-center gap-1 ${
              isCompared
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            title="Comparar modelo"
          >
            {isCompared ? <Check className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Product Image Stage */}
      <div className="relative w-full h-48 sm:h-52 flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-neutral-900/40 p-4">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* 3D Model Quick Trigger overlay on image */}
        {product.type === 'phone' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen3DModal && onOpen3DModal(product, selectedColor);
            }}
            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-blue-600 border border-white/15 text-[11px] font-semibold text-white backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md hover:shadow-blue-500/30 group-hover:opacity-100 opacity-90"
          >
            <Eye className="w-3 h-3 text-blue-300 group-hover:text-white" />
            <span>Ver en 3D</span>
          </button>
        )}
      </div>

      {/* Middle Content */}
      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Store Origin & Brand */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium mb-1">
            <span>{product.brand}</span>
            <span className="text-blue-400/90 truncate max-w-[140px]" title={storeInfo?.name}>
              {storeInfo?.name || 'CelStore'}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.name}
          </h4>

          {/* Solution Highlight Chip (Apple Philosophy) */}
          {product.solutions?.[0] && (
            <div className="my-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                <strong className="text-white">{product.solutions[0].badge}:</strong> {product.solutions[0].title}
              </p>
            </div>
          )}
        </div>

        {/* Color Palette Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 my-2">
            {product.colors.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(col);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor?.name === col.name
                    ? 'border-blue-400 scale-125 ring-1 ring-white/50'
                    : 'border-white/20 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            <span className="text-[10px] text-neutral-400 ml-1 truncate max-w-[100px]">
              {selectedColor?.name}
            </span>
          </div>
        )}

        {/* Bottom: Price & Quick Action Buttons */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white tracking-tight">
                ${product.price}
              </span>
              <span className="text-xs text-neutral-400">USD</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* WhatsApp Quick Buy */}
            <button
              onClick={handleQuickWhatsApp}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all hover:scale-105"
              title="Comprar rápido por WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, { color: selectedColor?.name });
              }}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 hover:scale-105"
              title="Añadir al Carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
