'use client';

import React from 'react';
import { ShoppingBag, MessageSquare, Box, Cpu, Camera, BatteryCharging, HardDrive } from 'lucide-react';
import { Product } from '../types/database';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playCartSuccess, playSubtleClick, playSpatialOpen } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

interface PrecisionProductCardProps {
  product: Product;
  isWide?: boolean;
  onSelect?: (product: Product) => void;
}

export const PrecisionProductCard: React.FC<PrecisionProductCardProps> = ({
  product,
  isWide = false,
  onSelect,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { open3DModal } = useStore();

  const specs = product.specs || {
    ram: '8 GB',
    almacenamiento: '256 GB',
    camara: '48 MP Fusion',
    bateria: '5000 mAh',
    procesador: 'Flagship Core',
    pantalla: 'OLED 120Hz',
    material: 'Titanio Grado 5',
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCartSuccess();
    addToCart(product, {
      color: specs.material || 'Titanio Natural',
      storage: specs.almacenamiento,
      price: product.price,
    });
    showLuxuryNotification(
      'UNIDAD AÑADIDA AL CARRITO',
      `${product.name} [${specs.almacenamiento || '256 GB'}] — $${product.price} USD`
    );
    setIsCartOpen(true);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSubtleClick();
    const phone = '5493416874786';
    const message = encodeURIComponent(
      `¡Hola! Estoy interesado en el *${product.name}* ($${product.price} USD). ¿Tienen stock disponible para entrega inmediata?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleOpen3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSpatialOpen();
    open3DModal(product);
  };

  return (
    <article
      onClick={() => onSelect && onSelect(product)}
      className={`group relative rounded-3xl bg-white dark:bg-[#131418] border border-zinc-200/90 dark:border-white/15 hover:border-blue-600/60 dark:hover:border-blue-400/60 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer select-none ${
        isWide ? 'md:col-span-2 md:flex-row gap-8 items-center' : 'col-span-1'
      }`}
    >
      {/* Image Stage: 100% visible, crisp, generous padding */}
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-50/70 dark:bg-black/30 p-4 ${
          isWide ? 'md:w-1/2 h-72 sm:h-80' : 'w-full h-64 sm:h-72'
        }`}
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=85'}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* 3D Floating Pill Button */}
        <button
          type="button"
          onClick={handleOpen3D}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#1A1C24]/95 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white text-xs font-bold shadow-md backdrop-blur-md transition-all cursor-pointer group/btn"
          title="Ver celular en 3D interactivo 360°"
        >
          <Box className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover/btn:text-white" />
          <span>Ver 3D</span>
        </button>
      </div>

      {/* Info & Purchasing Module */}
      <div className={`flex flex-col justify-between flex-1 ${isWide ? 'md:w-1/2' : 'mt-4'}`}>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              En stock
            </span>
          </div>

          <h3
            className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
          >
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs Badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200/80 dark:border-white/10">
              {specs.almacenamiento || '256 GB'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200/80 dark:border-white/10">
              {specs.ram ? specs.ram.split(' ')[0] + ' RAM' : '8 GB RAM'}
            </span>
            {specs.procesador && (
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 truncate max-w-[150px]">
                {specs.procesador}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Strip & Action Buttons */}
        <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold block">Precio</span>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">
              ${(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="p-3 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-zinc-200/70 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              title="Consultar por WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Añadir al Carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
