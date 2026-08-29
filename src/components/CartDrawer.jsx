'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const CartDrawer = () => {
  const {
    items,
    itemCount,
    subtotal,
    discountTotal,
    shippingCost,
    total,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    addToCart
  } = useCart();

  const { products, stores } = useStore();

  if (!isCartOpen) return null;

  const accessoryRecommendations = products
    .filter((p) => p.type === 'accessory')
    .slice(0, 3);

  const handleClose = () => {
    playSubtleClick();
    setIsCartOpen(false);
  };

  const handleUpdateQty = (cartItemId, delta) => {
    playSubtleClick();
    updateQuantity(cartItemId, delta);
  };

  const handleRemove = (cartItemId, name) => {
    playSubtleClick();
    removeFromCart(cartItemId);
    showLuxuryNotification('Pieza Removida', name);
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    playCartSuccess();

    const firstStoreId = items[0].storeId;
    const storeInfo = stores.find((s) => s.id === firstStoreId) || stores[0];
    const phone = storeInfo?.phoneWhatsApp || '+5491145239900';

    let message = `🛍️ *ORDEN EXCLUSIVA DESDE CELSTORE ATELIER*\n`;
    message += `🏬 *Boutique:* ${storeInfo?.name || 'CelStore'}\n`;
    message += `---------------------------------\n`;
    items.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (x${item.quantity})\n`;
      if (item.color) message += `   • Color: ${item.color}\n`;
      if (item.storage && item.storage !== 'Base') message += `   • Almacenamiento: ${item.storage}\n`;
      message += `   • Importe: $${item.price * item.quantity} USD\n`;
    });
    message += `---------------------------------\n`;
    message += `💰 *Subtotal:* $${subtotal} USD\n`;
    message += `🚚 *Despacho:* ${shippingCost === 0 ? 'BONIFICADO (GRATIS)' : `$${shippingCost} USD`}\n`;
    message += `✨ *TOTAL:* $${total} USD\n\n`;
    message += `¿Me confirman disponibilidad inmediata y coordinación de entrega prioritaria? Gracias.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0c0c0e]/95 border-l border-[#c5a880]/25 text-white shadow-2xl flex flex-col backdrop-blur-2xl">
          
          {/* Header Editorial */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/[0.03] text-[#c5a880] border border-[#c5a880]/30">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#c5a880] font-light block">
                  Atelier Bag
                </span>
                <h3 
                  className="text-xl font-light text-white leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Bolsa de Compras
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner de Envío de Lujo */}
          <div className="px-6 py-2.5 bg-[#121216] border-b border-white/[0.04] flex items-center gap-2 text-[10px] tracking-wider uppercase font-light text-neutral-300">
            <Truck className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
            {subtotal >= 500 ? (
              <span>✦ Calificas para <strong className="text-[#c5a880] font-medium">Despacho Blindado Gratis</strong></span>
            ) : (
              <span>Añade <strong className="text-[#c5a880] font-medium">${500 - subtotal} USD</strong> para Envío Prioritario Gratis.</span>
            )}
          </div>

          {/* Lista de Artículos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto text-neutral-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 
                    className="text-lg font-light text-neutral-200"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Tu bolsa está vacía
                  </h4>
                  <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto mt-1">
                    Explora nuestros buques insignia contemporáneos o el archivo histórico de colección.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-[#c5a880] text-black text-[10px] tracking-widest uppercase font-light cursor-pointer shadow-md hover:bg-[#d4af37] transition-all"
                >
                  Explorar Archivo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 rounded-2xl bg-[#09090b] border border-white/[0.06] hover:border-[#c5a880]/30 flex gap-3.5 relative group transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-black p-2 flex items-center justify-center shrink-0 border border-white/[0.04]">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200'}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Detalle */}
                  <div className="flex-1 min-w-0">
                    <h5 
                      className="text-sm font-light text-white truncate"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-light mt-0.5">
                      {item.color && <span>{item.color}</span>}
                      {item.storage && item.storage !== 'Base' && <span>• {item.storage}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-light text-white font-mono">
                        ${item.price * item.quantity} <span className="text-[9px] text-neutral-400">USD</span>
                      </span>

                      {/* Control de Cantidad */}
                      <div className="flex items-center gap-1.5 bg-black border border-white/[0.08] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.cartItemId, -1)}
                          className="p-1 rounded hover:bg-white/[0.1] text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono px-1.5 text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.cartItemId, 1)}
                          className="p-1 rounded hover:bg-white/[0.1] text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Eliminar */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.cartItemId, item.name)}
                    className="absolute top-3 right-3 text-neutral-500 hover:text-[#c5a880] transition-colors p-1 cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}

            {/* Accesorios Cruzados Recomendados */}
            {items.length > 0 && accessoryRecommendations.length > 0 && (
              <div className="pt-4 border-t border-white/[0.06]">
                <h5 className="text-[10px] font-light text-[#c5a880] uppercase tracking-[0.25em] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#c5a880]" />
                  Complementos Recomendados
                </h5>
                <div className="space-y-2">
                  {accessoryRecommendations.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-3 hover:border-white/[0.1] transition-all"
                    >
                      <img
                        src={acc.images?.[0]}
                        alt={acc.name}
                        className="w-9 h-9 object-contain rounded-lg bg-black p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-light text-white truncate">{acc.name}</p>
                        <span className="text-[10px] font-mono text-[#c5a880]">${acc.price} USD</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(acc);
                          showLuxuryNotification('Accesorio Añadido', acc.name);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-[#c5a880] text-[10px] tracking-wider uppercase font-light text-neutral-300 hover:text-black transition-all cursor-pointer shrink-0"
                      >
                        + Añadir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer del Carrito & Acciones */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/[0.06] bg-[#09090b]/90 backdrop-blur-xl space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-400 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${subtotal} USD</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-[#c5a880]">
                    <span>Cortesía Atelier</span>
                    <span>-${discountTotal} USD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Despacho</span>
                  <span className="text-white font-mono">
                    {shippingCost === 0 ? 'BONIFICADO' : `$${shippingCost} USD`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-light text-white pt-2 border-t border-white/[0.06]">
                  <span>Total</span>
                  <span className="text-[#c5a880] font-mono font-normal">${total} USD</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-white/[0.06] hover:bg-[#142a22] border border-white/10 hover:border-emerald-500/40 text-neutral-200 hover:text-emerald-400 text-xs tracking-[0.2em] uppercase font-light flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Atelier Concierge (WhatsApp)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playCartSuccess();
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#c5a880] hover:bg-[#d4af37] text-black text-xs tracking-[0.25em] uppercase font-medium flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <span>Finalizar Pedido Blindado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
