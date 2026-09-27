'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const CartDrawer = () => {
  const {
    items,
    itemCount,
    subtotal,
    shippingCost,
    total,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const { stores } = useStore();

  if (!isCartOpen) return null;

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
    showLuxuryNotification('ÍTEM REMOVIDO', name);
  };

  const handleProceedToCheckout = () => {
    playSubtleClick();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    playCartSuccess();

    const firstStoreId = items[0].storeId;
    const storeInfo = stores.find((s) => s.id === firstStoreId) || stores[0];
    const phone = storeInfo?.phoneWhatsApp || '5491145239900';

    let message = `🛒 *SOLICITUD DE PEDIDO // CELSTORE HARDWARE*\n`;
    message += `🏬 *Boutique:* ${storeInfo?.name || 'CelStore'}\n`;
    message += `---------------------------------\n`;
    items.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (x${item.quantity})\n`;
      if (item.color) message += `   • Acabado: ${item.color}\n`;
      if (item.storage && item.storage !== 'Base') message += `   • Almacenamiento: ${item.storage}\n`;
      message += `   • Precio: $${item.price * item.quantity} USD\n`;
    });
    message += `---------------------------------\n`;
    message += `💰 *Subtotal:* $${subtotal} USD\n`;
    message += `📦 *Envío:* ${shippingCost === 0 ? 'BONIFICADO (GRATIS)' : `$${shippingCost} USD`}\n`;
    message += `✨ *TOTAL CANÓNICO:* $${total} USD\n\n`;
    message += `¿Tienen stock disponible para coordinar despacho?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono select-none">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E0E10] border-l border-[#1A1A1D] text-[#F5F5F7] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 border-b border-[#1A1A1D] flex items-center justify-between bg-[#0A0A0C]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0066FF]">[CARRITO DE HARDWARE]</span>
              <span className="text-[10px] text-[#71717A] tabular-nums font-bold">
                ({itemCount.toString().padStart(2, '0')} ÍTEMS)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 text-[#71717A] hover:text-[#F5F5F7] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-[#71717A] mx-auto" />
                <p className="text-xs font-bold text-[#F5F5F7] uppercase">CARRITO VACÍO</p>
                <p className="text-[11px] text-[#71717A]">No hay productos seleccionados en este momento.</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-[#0066FF] text-[#F5F5F7] text-xs font-bold uppercase cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  className="p-3 bg-[#141416] border border-[#1A1A1D] flex items-start gap-3"
                >
                  <div className="w-14 h-14 bg-[#0A0A0C] border border-[#1A1A1D] p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120'}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#F5F5F7] truncate">{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.cartItemId || item.id, item.name)}
                        className="text-[#71717A] hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[10px] text-[#71717A] mt-0.5 truncate">
                      {item.color && <span>{item.color}</span>}
                      {item.storage && <span> • {item.storage}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A1D]">
                      <div className="flex items-center gap-1 border border-[#1A1A1D] bg-[#0A0A0C]">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.cartItemId || item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#71717A] hover:text-[#F5F5F7] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-1 text-[11px] text-[#F5F5F7] tabular-nums font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.cartItemId || item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#71717A] hover:text-[#F5F5F7] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#F5F5F7] tabular-nums">
                        ${(item.price * item.quantity).toLocaleString()} USD
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {items.length > 0 && (
            <div className="p-4 bg-[#0A0A0C] border-t border-[#1A1A1D] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#71717A]">
                  <span>SUBTOTAL:</span>
                  <span className="tabular-nums text-[#F5F5F7]">${subtotal.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-[#71717A]">
                  <span>ENVÍO PRIORITARIO:</span>
                  <span className="text-[#0066FF] font-bold">BONIFICADO</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#1A1A1D]">
                  <span className="text-[#F5F5F7]">TOTAL CANÓNICO:</span>
                  <span className="text-[#0066FF] tabular-nums">${total.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:translate-y-[1px]"
                >
                  <span>Iniciar Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enviar Pedido por WhatsApp</span>
                </button>
              </div>

              <div className="text-[10px] text-center text-[#71717A]">
                ● MODO PRUEBA LOCAL // PEDIDO SIN COSTO
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
