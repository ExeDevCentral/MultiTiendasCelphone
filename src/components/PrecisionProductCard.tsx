'use client';

import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, ArrowUpRight, Cpu, Camera, BatteryCharging, HardDrive } from 'lucide-react';
import { Product } from '../types/database';
import { useCart } from '../context/CartContext';
import { playCartSuccess, playSubtleClick } from '../utils/audioHaptics';
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
  const [isHovered, setIsHovered] = useState(false);

  const specs = product.specs || {
    ram: '8 GB',
    almacenamiento: '256 GB',
    camara: '48 MP',
    bateria: '5000 mAh',
    procesador: 'Flagship Core',
    pantalla: 'OLED 120Hz',
    material: 'Titanio / Cristal',
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCartSuccess();
    addToCart(product, {
      color: specs.material || 'Standard Titanium',
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
    const phone = '5491145239900';
    const message = encodeURIComponent(
      `¡Hola! Estoy interesado en el *${product.name}* (Ref: ${product.model || product.name}, $${product.price} USD). ¿Tienen disponibilidad inmediata para despacho?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <article
      onClick={() => onSelect && onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group bg-[#0E0E10] border border-[#1A1A1D] hover:border-[#0066FF] transition-colors duration-200 select-none flex flex-col justify-between ${
        isWide ? 'md:col-span-2 md:flex-row' : 'col-span-1'
      }`}
      style={{
        boxShadow: isHovered ? '0 0 0 1px #0066FF' : 'none',
      }}
    >
      {/* Precision Sheet Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 border-b border-[#1A1A1D] bg-[#0E0E10]/90 backdrop-blur-sm text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <span className="text-[#0066FF] font-bold">[{product.brand ? product.brand.toUpperCase() : 'DEVICE'}]</span>
          <span className="text-[#F5F5F7] font-medium tracking-tight truncate max-w-[130px] sm:max-w-[180px]">
            {product.model || product.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#71717A] text-[10px] hidden sm:inline tabular-nums">
            STK: {(product.stock || 5).toString().padStart(2, '0')}
          </span>
          {product.featured && (
            <span className="px-1.5 py-0.5 bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/30 text-[9px] font-bold uppercase">
              FEATURED
            </span>
          )}
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className={`relative flex items-center justify-center p-6 pt-12 overflow-hidden bg-[#0A0A0C] border-b md:border-b-0 md:border-r border-[#1A1A1D] ${
          isWide ? 'md:w-1/2 h-64 md:h-auto min-h-[300px]' : 'h-64'
        }`}
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=85'}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Hover Datasheet Overlay */}
        <div
          className={`absolute inset-0 bg-[#0E0E10]/95 p-5 pt-12 flex flex-col justify-between text-xs font-mono transition-opacity duration-200 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="space-y-2">
            <span className="text-[10px] text-[#0066FF] font-bold uppercase tracking-wider block border-b border-[#1A1A1D] pb-1">
              // DATASHEET SPECIFICATION
            </span>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {specs.procesador && (
                <div className="flex items-start gap-2 text-zinc-300">
                  <Cpu className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                  <span className="truncate text-[11px]">{specs.procesador}</span>
                </div>
              )}
              {specs.ram && (
                <div className="flex items-start gap-2 text-zinc-300">
                  <HardDrive className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                  <span className="text-[11px]">{specs.ram} • {specs.almacenamiento}</span>
                </div>
              )}
              {specs.camara && (
                <div className="flex items-start gap-2 text-zinc-300">
                  <Camera className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                  <span className="text-[11px] line-clamp-2">{specs.camara}</span>
                </div>
              )}
              {specs.bateria && (
                <div className="flex items-start gap-2 text-zinc-300">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                  <span className="text-[11px]">{specs.bateria}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1A1A1D] text-[10px] text-[#71717A] flex items-center justify-between">
            <span>DETALLE TÉCNICO</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0066FF]" />
          </div>
        </div>
      </div>

      {/* Specification & Purchasing Module */}
      <div className={`flex flex-col justify-between p-5 pt-4 ${isWide ? 'md:w-1/2' : 'flex-1'}`}>
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-[10px] font-mono text-[#0066FF] uppercase">
              {specs.material ? specs.material.split('+')[0] : 'TITANIUM'}
            </span>
          </div>

          <h3
            className="text-lg font-bold text-[#F5F5F7] tracking-tight group-hover:text-[#0066FF] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs text-[#71717A] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Technical Badges */}
          <div className="mt-3 pt-3 border-t border-[#1A1A1D] flex flex-wrap gap-1.5 font-mono text-[10px] text-[#71717A]">
            <span className="px-2 py-0.5 bg-[#141416] border border-[#1A1A1D] text-zinc-300">
              {specs.almacenamiento || '256 GB'}
            </span>
            <span className="px-2 py-0.5 bg-[#141416] border border-[#1A1A1D] text-zinc-300">
              {specs.ram ? specs.ram.split(' ')[0] + ' ' + (specs.ram.split(' ')[1] || 'RAM') : '8 GB RAM'}
            </span>
            {specs.pantalla && (
              <span className="px-2 py-0.5 bg-[#141416] border border-[#1A1A1D] text-zinc-300">
                {specs.pantalla.split(',')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Strip & Action Triggers */}
        <div className="mt-5 pt-3 border-t border-[#1A1A1D] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-[#71717A] uppercase block">PRECIO CANÓNICO</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F5F5F7] font-mono tracking-tight tabular-nums">
                ${(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">USD</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="p-2.5 bg-[#141416] hover:bg-[#25D366]/10 border border-[#1A1A1D] hover:border-[#25D366]/40 text-[#71717A] hover:text-[#25D366] transition-colors cursor-pointer"
              title="Consultar por WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] active:translate-y-[1px] text-[#F5F5F7] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Añadir al Carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
