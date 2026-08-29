'use client';

import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { showLuxuryNotification } from './LuxuryToaster';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, total, subtotal, shippingCost, clearCart } = useCart();
  const { stores } = useStore();

  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderResult, setOrderResult] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Lautaro Martínez',
    email: 'lautaro@example.com',
    phone: '+54 9 11 9876-5432',
    address: 'Av. Alvear 1890, Piso 10',
    city: 'Buenos Aires',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '08/29',
    cardCvc: '•••',
  });

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    playCartSuccess();

    try {
      const orderPayload = {
        storeId: items[0]?.storeId || 'store-celstore-premium',
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}`,
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          color: item.color,
          storage: item.storage,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        paymentMethod:
          paymentMethod === 'applepay'
            ? 'Apple Pay'
            : paymentMethod === 'crypto'
            ? 'USDT Cripto'
            : 'Tarjeta de Crédito / Débito',
      };

      const result = await api.createOrder(orderPayload);
      setOrderResult(result);
      setStep('success');

      // Celebration confetti de lujo en tonos Champagne Gold
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c5a880', '#d4af37', '#ffffff', '#f5e0c3', '#8a6f47'],
      });

      showLuxuryNotification(
        'Orden Confirmada con Éxito',
        `Pedido #${result?.id || 'ORD-9900'} registrado en el Atelier.`
      );

      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    playSubtleClick();
    setIsCheckoutOpen(false);
    setStep('form');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-[#0c0c0e] border border-[#c5a880]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white z-10 overflow-hidden">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <form onSubmit={handleCompleteOrder} className="space-y-6">
            <div>
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#c5a880] font-light block mb-1">
                Transacción Blindada
              </span>
              <h3 
                className="text-2xl sm:text-3xl font-light text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Finalizar Pedido Atelier
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Ingresa los datos para coordinar el despacho asegurado de tus piezas.
              </p>
            </div>

            {/* Selector de Método de Pago */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Tarjeta Bancaria', icon: CreditCard },
                { id: 'applepay', label: 'Apple Pay', icon: Sparkles },
                { id: 'crypto', label: 'Cripto (USDT)', icon: ShieldCheck },
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => {
                      playSubtleClick();
                      setPaymentMethod(m.id);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#c5a880]/15 border-[#c5a880] text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#c5a880]' : 'text-neutral-400'}`} />
                    <span className="text-[10px] tracking-wider uppercase font-light">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inputs de Cliente */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-light text-neutral-400 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.08] focus:border-[#c5a880] text-xs text-white focus:outline-none font-light"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-light text-neutral-400 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.08] focus:border-[#c5a880] text-xs text-white focus:outline-none font-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-light text-neutral-400 mb-1">
                    WhatsApp de Contacto
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.08] focus:border-[#c5a880] text-xs text-white focus:outline-none font-light"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-light text-neutral-400 mb-1">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/[0.08] focus:border-[#c5a880] text-xs text-white focus:outline-none font-light"
                  />
                </div>
              </div>
            </div>

            {/* Resumen Final de Importe */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-light block">
                  Total a Confirmar
                </span>
                <span className="text-2xl font-light text-[#c5a880] font-mono">
                  ${total} <span className="text-xs text-neutral-400">USD</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#c5a880] hover:bg-[#d4af37] text-black text-xs tracking-[0.25em] uppercase font-medium transition-all shadow-lg cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>Confirmar Orden</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Pantalla de Éxito de Lujo */
          <div className="py-8 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/40 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] font-light block mb-1">
                Atelier Exclusive Confirmation
              </span>
              <h3 
                className="text-3xl font-light text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Orden Registrada con Éxito
              </h3>
              <p className="text-xs text-neutral-400 font-light max-w-md mx-auto mt-2">
                Hemos enviado los detalles a <strong className="text-white">{formData.email}</strong> y un concierge se contactará al {formData.phone}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-white/[0.06] max-w-md mx-auto text-left text-xs font-light space-y-1 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Identificador:</span>
                <span className="text-white">{orderResult?.id || 'ORD-8821'}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Titular:</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Total Abonado:</span>
                <span className="text-[#c5a880]">${total} USD</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 rounded-full bg-[#c5a880] hover:bg-[#d4af37] text-black text-xs tracking-widest uppercase font-medium transition-all shadow-md cursor-pointer"
            >
              Regresar a la Colección
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
