import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, MessageSquare, Truck, Printer, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, total, subtotal, shippingCost, clearCart } = useCart();
  const { stores } = useStore();

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'applepay' | 'crypto'
  const [orderResult, setOrderResult] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Lautaro Martínez',
    email: 'lautaro@example.com',
    phone: '+54 9 11 9876-5432',
    address: 'Av. Libertador 2200, Piso 8B',
    city: 'Buenos Aires',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '08/29',
    cardCvc: '•••'
  });

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        storeId: items[0]?.storeId || 'store-celstore-premium',
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}`
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          color: item.color,
          storage: item.storage,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        paymentMethod: paymentMethod === 'applepay' ? 'Apple Pay' : paymentMethod === 'crypto' ? 'USDT Cripto' : 'Tarjeta de Crédito / Débito'
      };

      const result = await api.createOrder(orderPayload);
      setOrderResult(result);
      setStep('success');

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0071e3', '#2997ff', '#30d158', '#f59e0b', '#ffffff']
      });

      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsCheckoutOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white z-10 overflow-hidden">
        {/* Top Close Button */}
        <button
          onClick={() => {
            setIsCheckoutOpen(false);
            setStep('form');
          }}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Checkout Seguro SSL 256-bit
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Finalizar Compra</h3>
              <p className="text-xs text-neutral-400">
                Completa tus datos para despachar tu dispositivo con seguro y seguimiento en vivo.
              </p>
            </div>

            <form onSubmit={handleCompleteOrder} className="space-y-5">
              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  1. Datos de Contacto y Envío
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Dirección de Entrega</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  2. Método de Pago
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 ring-1 ring-blue-400'
                        : 'bg-neutral-900 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'applepay'
                        ? 'bg-white text-black border-white ring-1 ring-white'
                        : 'bg-neutral-900 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'crypto'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-1 ring-amber-400'
                        : 'bg-neutral-900 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="font-mono text-sm font-bold">₮</span>
                    <span>USDT Cripto</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-3 mt-2">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Número de Tarjeta</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">Vencimiento</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Total & Submit */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Total a Pagar</span>
                  <span className="text-2xl font-extrabold text-white">${total} USD</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirmar y Pagar ${total} USD</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation / Receipt View */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-1">¡Pedido Confirmado con Éxito!</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
              Hemos registrado tu orden <strong className="text-white font-mono">{orderResult?.id}</strong>. Recibirás una notificación por correo y WhatsApp con el número de rastreo.
            </p>

            {/* Receipt Box */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3 mb-6">
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-neutral-400">Número de Orden:</span>
                <span className="font-mono font-bold text-blue-400">{orderResult?.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-neutral-400">Cliente:</span>
                <span className="font-semibold text-white">{orderResult?.customer?.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-neutral-400">Dirección de Despacho:</span>
                <span className="text-neutral-300">{orderResult?.customer?.address}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-neutral-400">Método de Pago:</span>
                <span className="text-emerald-400 font-semibold">{orderResult?.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-white">
                <span>Total Pagado:</span>
                <span className="text-blue-400">${orderResult?.total} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep('form');
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
