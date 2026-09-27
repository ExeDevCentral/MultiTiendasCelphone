'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, MessageSquare, Terminal, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, total, subtotal, shippingCost, clearCart } = useCart();
  const { stores } = useStore();

  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Lautaro Martínez',
    phone: '+54 9 11 9876-5432',
    address: 'Av. Libertador 1450, Piso 10',
    city: 'Buenos Aires',
    notes: 'Entregar en horario laboral. Timbre 10B.',
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
          email: 'test@celstore.com',
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}`,
        },
        items: items.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          color: item.color,
          storage: item.storage,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        paymentMethod: 'Coordinación por WhatsApp (Modo Prueba)',
      };

      const result = await api.createOrder(orderPayload);
      setOrderResult(result);
      setStep('success');

      // Electric Blue Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0066FF', '#0052cc', '#F5F5F7', '#71717A'],
      });

      clearCart();
    } catch (err) {
      console.warn('Checkout fallback simulation:', err);
      const fallbackCode = `ORD-${Date.now().toString(36).toUpperCase()}`;
      setOrderResult({ id: fallbackCode, total });
      setStep('success');
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    playSubtleClick();
    setIsCheckoutOpen(false);
    setStep('form');
  };

  const handleWhatsAppSend = () => {
    const storeInfo = stores.find((s) => s.id === items[0]?.storeId) || stores[0];
    const phone = storeInfo?.phoneWhatsApp || '5491145239900';
    const orderId = orderResult?.id || 'ORD-TEST';

    let message = `📦 *ORDEN GENERADA // ${orderId}*\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📱 *WhatsApp:* ${formData.phone}\n`;
    message += `📍 *Dirección:* ${formData.address}, ${formData.city}\n`;
    message += `---------------------------------\n`;
    message += `💰 *Total a Coordinar:* $${total || orderResult?.total} USD\n`;
    if (formData.notes) message += `📝 *Nota:* ${formData.notes}\n`;
    message += `---------------------------------\n`;
    message += `Hola, acabo de registrar esta orden en la web en modo prueba. ¿Me confirman recepción?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-mono">
      <div
        onClick={handleClose}
        className="fixed inset-0"
      />

      <div className="relative w-full max-w-lg bg-[#0E0E10] border border-[#0066FF] shadow-2xl z-10 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#1A1A1D] flex items-center justify-between bg-[#0A0A0C]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs font-bold text-[#F5F5F7] uppercase tracking-wider">
              {step === 'form' ? '// DATOS DE ENVÍO & COORDINACIÓN' : '// ORDEN GENERADA CON ÉXITO'}
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

        {/* Content */}
        {step === 'form' ? (
          <form onSubmit={handleCompleteOrder} className="p-5 space-y-4">
            <div className="p-2.5 bg-[#141416] border border-[#1A1A1D] text-[11px] text-[#71717A] flex items-center justify-between">
              <span>● MODO PRUEBA LOCAL (CERO COSTO)</span>
              <span className="text-[#0066FF] font-bold">TOTAL: ${total.toLocaleString()} USD</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#71717A] uppercase block mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717A] uppercase block mb-1">WhatsApp de Contacto</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#71717A] uppercase block mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#71717A] uppercase block mb-1">Ciudad / Provincia</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#71717A] uppercase block mb-1">Notas de Entrega (Opcional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:translate-y-[1px]"
              >
                <span>{loading ? 'PROCESANDO ORDEN...' : 'CONFIRMAR PEDIDO (MODO PRUEBA)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-[#0066FF]/10 border border-[#0066FF] text-[#0066FF] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] text-[#0066FF] font-bold uppercase tracking-wider block">
                ● ORDEN REGISTRADA EXITOSAMENTE
              </span>
              <h3 className="text-xl font-bold text-[#F5F5F7] mt-1 font-mono">
                {orderResult?.id || 'ORD-9482-TX'}
              </h3>
              <p className="text-xs text-[#71717A] mt-2 max-w-sm mx-auto font-sans leading-relaxed">
                Tu solicitud quedó almacenada localmente. Podés enviar el resumen por WhatsApp a la boutique para coordinar la entrega.
              </p>
            </div>

            <div className="p-3 bg-[#141416] border border-[#1A1A1D] text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-[#71717A]">
                <span>DESTINATARIO:</span>
                <span className="text-[#F5F5F7]">{formData.name}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>WHATSAPP:</span>
                <span className="text-[#F5F5F7]">{formData.phone}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>DIRECCIÓN:</span>
                <span className="text-[#F5F5F7] truncate max-w-[200px]">{formData.address}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Enviar Orden por WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] text-[#71717A] hover:text-[#F5F5F7] text-xs uppercase cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
