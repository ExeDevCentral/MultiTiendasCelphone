import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

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

  // Find accessory recommendations to cross-sell
  const accessoryRecommendations = products
    .filter(p => p.type === 'accessory')
    .slice(0, 3);

  // Group items by store to show store source
  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    
    // Find representative store
    const firstStoreId = items[0].storeId;
    const storeInfo = stores.find(s => s.id === firstStoreId) || stores[0];
    const phone = storeInfo?.phoneWhatsApp || '+5491145239900';

    let message = `🛒 *NUEVO PEDIDO DESDE CELSTORE WEB*\n`;
    message += `🏬 *Tienda:* ${storeInfo?.name || 'CelStore'}\n`;
    message += `---------------------------------\n`;
    items.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (x${item.quantity})\n`;
      if (item.color) message += `   • Color: ${item.color}\n`;
      if (item.storage && item.storage !== 'Base') message += `   • Almacenamiento: ${item.storage}\n`;
      message += `   • Precio: $${item.price * item.quantity} USD\n`;
    });
    message += `---------------------------------\n`;
    message += `💰 *Subtotal:* $${subtotal} USD\n`;
    message += `🚚 *Envío:* ${shippingCost === 0 ? 'GRATIS' : `$${shippingCost} USD`}\n`;
    message += `✨ *TOTAL A PAGAR:* $${total} USD\n\n`;
    message += `¿Me confirman los medios de pago disponibles y tiempo de entrega? ¡Muchas gracias!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950/95 border-l border-white/10 text-white shadow-2xl flex flex-col backdrop-blur-xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Bolsa de Compras</h3>
                <p className="text-xs text-neutral-400">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} seleccionados</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="px-6 py-2.5 bg-blue-950/40 border-b border-blue-500/20 flex items-center gap-2 text-xs text-blue-300">
            <Truck className="w-4 h-4 text-blue-400 shrink-0" />
            {subtotal >= 500 ? (
              <span>🎉 ¡Calificas para <strong>Envío Express Gratis</strong>!</span>
            ) : (
              <span>Añade <strong>${500 - subtotal} USD</strong> más para Envío Gratis.</span>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-neutral-300 mb-1">Tu bolsa está vacía</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6">
                  Explora nuestros modelos de los últimos 2 años o clásicos vintage para comenzar.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 rounded-2xl glass-panel border border-white/10 flex gap-3.5 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-neutral-900 p-2 flex items-center justify-center shrink-0 border border-white/5">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200'}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-white truncate">{item.name}</h5>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      {item.color && <span>{item.color}</span>}
                      {item.storage && item.storage !== 'Base' && <span>• {item.storage}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-extrabold text-white">${item.price * item.quantity} USD</span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="absolute top-3 right-3 text-neutral-500 hover:text-rose-400 transition-colors p-1"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* Accessory Cross-Sell Mini-Box */}
            {items.length > 0 && accessoryRecommendations.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Combos Recomendados para tu Compra:
                </h5>
                <div className="space-y-2">
                  {accessoryRecommendations.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 hover:bg-white/[0.06] transition-all"
                    >
                      <img
                        src={acc.images?.[0]}
                        alt={acc.name}
                        className="w-10 h-10 object-contain rounded-lg bg-neutral-900 p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{acc.name}</p>
                        <span className="text-xs font-bold text-blue-400">${acc.price} USD</span>
                      </div>
                      <button
                        onClick={() => addToCart(acc)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-blue-600 text-[11px] font-semibold text-white transition-colors shrink-0"
                      >
                        + Añadir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action Buttons */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-neutral-900/60 backdrop-blur-lg space-y-3">
              {/* Summary */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal} USD</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Ahorro en Descuentos</span>
                    <span>-${discountTotal} USD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío Estimado</span>
                  <span className="text-white font-medium">
                    {shippingCost === 0 ? 'GRATIS' : `$${shippingCost} USD`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-blue-400">${total} USD</span>
                </div>
              </div>

              {/* Action 1: Instant WhatsApp Order */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Pedir Directo por WhatsApp</span>
              </button>

              {/* Action 2: Standard Checkout Simulation */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                <span>Pagar con Tarjeta / Apple Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
