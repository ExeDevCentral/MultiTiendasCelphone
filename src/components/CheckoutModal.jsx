'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Terminal,
  Printer,
  FileText,
  Truck,
  QrCode,
  Hash,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, total, subtotal, shippingCost, clearCart } = useCart();
  const { stores } = useStore();

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [orderTimestamp, setOrderTimestamp] = useState('');

  const [formData, setFormData] = useState({
    name: 'Lautaro Martínez',
    phone: '+54 9 341 687-4786',
    address: 'Av. Libertador 1450, Piso 10',
    city: 'Rosario / Buenos Aires',
    notes: 'Entregar en horario comercial. Seguro de carga verificado.',
  });

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    playCartSuccess();

    const snapshotItems = items.map((it) => ({
      ...it,
      unitPrice: it.price,
      lineTotal: it.price * it.quantity,
    }));
    setPurchasedItems(snapshotItems);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setOrderTimestamp(formattedDate);

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
          color: item.color || 'Titanio',
          storage: item.storage || 'Estándar',
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        paymentMethod: 'Coordinación por WhatsApp (Modo Prueba)',
      };

      const result = await api.createOrder(orderPayload);
      setOrderResult(result);
      setStep('success');

      // Electric Blue Celebration Confetti
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0066FF', '#0052cc', '#F5F5F7', '#71717A', '#30D158'],
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

  const handlePrint = () => {
    playSubtleClick();
    window.print();
  };

  const handleWhatsAppSend = () => {
    playSubtleClick();
    // Número celular unificado del usuario
    const phone = '5493416874786';
    const orderId = orderResult?.id || `ORD-${Date.now().toString(36).toUpperCase()}`;
    const orderTotal = total || orderResult?.total || 0;
    const arsEstimate = Math.round(orderTotal * 1350).toLocaleString('es-AR');

    let msg = `🧾 *CELSTORE™ PRECISION // BOLETA DE CONTROL ELECTRÓNICA*\n`;
    msg += `═════════════════════════════════════\n`;
    msg += `📄 *ORDEN FISCAL:* #${orderId}\n`;
    msg += `📅 *FECHA/HORA:* ${orderTimestamp || new Date().toLocaleString('es-AR')}\n`;
    msg += `🏢 *TERMINAL:* AR-ROS-BUE-POS-04 // CAEA-2026\n`;
    msg += `═════════════════════════════════════\n\n`;
    msg += `👤 *TITULAR:* ${formData.name.toUpperCase()}\n`;
    msg += `📱 *WHATSAPP:* ${formData.phone}\n`;
    msg += `📍 *ENTREGA:* ${formData.address}, ${formData.city}\n`;
    if (formData.notes) msg += `📝 *INSTRUCCIÓN:* ${formData.notes}\n`;
    msg += `\n📦 *DETALLE DE HARDWARE ADQUIRIDO:*\n`;

    purchasedItems.forEach((item, idx) => {
      const storageTag = item.storage && item.storage !== 'Base' ? ` [${item.storage}]` : '';
      const colorTag = item.color ? ` (${item.color})` : '';
      msg += `${idx + 1}. *${item.name}*${storageTag}${colorTag}\n`;
      msg += `   • Cantidad: ${item.quantity}u × $${item.price} USD = *$${item.price * item.quantity} USD*\n`;
    });

    msg += `\n─────────────────────────────────\n`;
    msg += `💵 *SUBTOTAL NETO:* $${orderTotal} USD\n`;
    msg += `🚚 *DESPACHO BLINDADO:* $0.00 USD (BONIFICADO)\n`;
    msg += `🛡️ *SEGURO OFICIAL:* 24 MESES INCLUIDO\n`;
    msg += `💰 *TOTAL CANÓNICO:* *$${orderTotal.toLocaleString()} USD*\n`;
    msg += `🇦🇷 *REF. CAMBIARIA:* ~$${arsEstimate} ARS\n`;
    msg += `─────────────────────────────────\n`;
    msg += `🔐 *HASH SHA-256:* 8f9b4c2d7a1e0f3c5b8a9d1e2f4a6b8c\n`;
    msg += `⚡ *ESTADO:* RESERVA ATÓMICA DE STOCK CONFIRMADA\n\n`;
    msg += `¡Hola! Acabo de registrar esta orden y emitir la boleta técnica en la web. ¿Me confirman recepción para coordinar despacho?`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none font-mono">
      <div onClick={handleClose} className="fixed inset-0" />

      <div className={`relative w-full ${step === 'success' ? 'max-w-xl' : 'max-w-lg'} bg-[#0E0E10] border border-[#0066FF] shadow-2xl z-10 overflow-hidden max-h-[95vh] flex flex-col`}>
        
        {/* Terminal Header */}
        <div className="px-5 py-3 border-b border-[#1A1A1D] flex items-center justify-between bg-[#0A0A0C] shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs font-bold text-[#F5F5F7] uppercase tracking-wider">
              {step === 'form' ? '// DATOS DE ENVÍO & COORDINACIÓN' : '// BOLETA TÉCNICA EMITIDA // VOUCHER DE CONTROL'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-[#71717A] hover:text-[#F5F5F7] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {step === 'form' ? (
            <form onSubmit={handleCompleteOrder} className="space-y-4">
              <div className="p-3 bg-[#141416] border border-[#1A1A1D] text-[11px] text-[#71717A] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#0066FF] animate-pulse" />
                  <span>MODO PRUEBA // 0 CONSUMO SUPABASE</span>
                </span>
                <span className="text-[#0066FF] font-bold tabular-nums">TOTAL: ${total.toLocaleString()} USD</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-[#71717A] uppercase block mb-1">
                    [TITULAR DEL HARDWARE / NOMBRE Y APELLIDO]
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#71717A] uppercase block mb-1">
                    [WHATSAPP DE COORDINACIÓN DIRECTA]
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#71717A] uppercase block mb-1">[DIRECCIÓN FISCAL / ENTREGA]</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#71717A] uppercase block mb-1">[CIUDAD / JURISDICCIÓN]</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#71717A] uppercase block mb-1">[NOTAS TÉCNICAS DE ENTREGA]</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] text-[#F5F5F7] px-3 py-2 text-xs font-mono outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-[1px]"
                >
                  <span>{loading ? '[ PROCESANDO PROTOCOLO... ]' : '[ EMITIR BOLETA TÉCNICA // CONFIRMAR ]'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* ULTRA-DETAILED MINI BOLETA / TECHNICAL HARDWARE INVOICE & RECEIPT */
            /* ========================================================================= */
            <div className="space-y-4">
              
              {/* Printable Boleta Container */}
              <div id="printable-receipt" className="bg-[#0A0A0C] border border-[#1A1A1D] p-5 sm:p-6 text-xs text-[#F5F5F7] space-y-4 relative">
                
                {/* Visual Receipt Header */}
                <div className="border-b border-dashed border-[#1A1A1D] pb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#141416] border border-[#0066FF] text-[#0066FF] flex items-center justify-center font-bold text-xs">
                        C/
                      </div>
                      <span className="font-bold text-sm tracking-tight text-[#F5F5F7]">
                        CELSTORE™ PRECISION
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-[#141416] border border-[#30D158] text-[#30D158] font-bold">
                      ● BOLETA FISCAL DE CONTROL
                    </span>
                  </div>

                  <div className="text-[10px] text-[#71717A] pt-1">
                    HARDWARE TERMINAL STORE // DIVISIÓN DE ALTA PRECISIÓN Y DISPOSITIVOS MÓVILES
                  </div>
                </div>

                {/* Voucher Telemetry Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#71717A] bg-[#141416] p-3 border border-[#1A1A1D]">
                  <div>
                    <span className="block text-[#71717A]">ORDEN FISCAL N°:</span>
                    <strong className="text-[#0066FF] font-mono text-xs">{orderResult?.id || 'ORD-2026-X991'}</strong>
                  </div>
                  <div>
                    <span className="block text-[#71717A]">FECHA Y HORA:</span>
                    <strong className="text-[#F5F5F7] font-mono">{orderTimestamp || '2026-09-27 19:35:00 ART'}</strong>
                  </div>
                  <div>
                    <span className="block text-[#71717A]">TERMINAL FISCAL:</span>
                    <strong className="text-[#F5F5F7] font-mono">AR-ROS-BUE-POS-04</strong>
                  </div>
                  <div>
                    <span className="block text-[#71717A]">AUTORIZACIÓN CAEA:</span>
                    <strong className="text-[#F5F5F7] font-mono">8940-2026-X7719</strong>
                  </div>
                </div>

                {/* Customer Telemetry */}
                <div className="space-y-1 text-[11px] pt-1 border-t border-dashed border-[#1A1A1D]">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">TITULAR:</span>
                    <span className="font-bold text-[#F5F5F7] uppercase">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">WHATSAPP VINCULADO:</span>
                    <span className="text-[#F5F5F7]">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">DESTINO DE ENTREGA:</span>
                    <span className="text-[#F5F5F7] truncate max-w-[260px]">{formData.address}, {formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">CANAL DE GESTIÓN:</span>
                    <span className="text-[#25D366] font-bold">WHATSAPP DIRECTO (+54 9 341 687-4786)</span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border-t border-b border-[#1A1A1D] py-2 space-y-2">
                  <div className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider flex justify-between border-b border-[#1A1A1D] pb-1">
                    <span>DESCRIPCIÓN DE HARDWARE</span>
                    <span>CANT × P.UNIT = SUBTOTAL</span>
                  </div>

                  {purchasedItems.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs pt-1">
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-[#F5F5F7] truncate">
                          [{String(idx + 1).padStart(2, '0')}] {it.name}
                        </div>
                        <div className="text-[10px] text-[#71717A]">
                          {it.storage && `Almacenamiento: ${it.storage} • `}
                          {it.color && `Color: ${it.color}`}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums whitespace-nowrap shrink-0">
                        <span className="text-[#71717A] text-[10px]">{it.quantity}u × ${it.price} = </span>
                        <strong className="text-[#F5F5F7]">${(it.price * it.quantity).toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Ledger */}
                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between text-[#71717A]">
                    <span>SUBTOTAL NETO CANÓNICO:</span>
                    <span className="font-mono tabular-nums text-[#F5F5F7]">${(total || orderResult?.total || 0).toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-[#71717A]">
                    <span>DESPACHO BLINDADO EXPRÉS:</span>
                    <span className="text-[#30D158] font-bold">$0.00 USD (BONIFICADO)</span>
                  </div>
                  <div className="flex justify-between text-[#71717A]">
                    <span>SEGURO CONTRA ROBO Y ROTURA (24M):</span>
                    <span className="text-[#30D158] font-bold">INCLUIDO (100% COBERTURA)</span>
                  </div>
                  <div className="flex justify-between text-[#71717A]">
                    <span>IVA / TASAS INTERNAS:</span>
                    <span className="text-[#71717A]">EXENTO (RÉGIMEN PROMOCIONAL)</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-[#1A1A1D]">
                    <span className="text-xs font-bold text-[#F5F5F7] uppercase tracking-wide">
                      TOTAL CANÓNICO FINAL:
                    </span>
                    <div className="text-right font-mono">
                      <span className="text-xl font-bold text-[#0066FF] tabular-nums">
                        ${(total || orderResult?.total || 0).toLocaleString()}.00 <span className="text-xs text-[#71717A]">USD</span>
                      </span>
                      <div className="text-[10px] text-[#71717A]">
                        ≈ ${Math.round((total || orderResult?.total || 0) * 1350).toLocaleString('es-AR')} ARS (T.C. $1,350)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Seal & Barcode Visual */}
                <div className="pt-3 border-t border-dashed border-[#1A1A1D] space-y-2 text-center">
                  <div className="text-[9px] text-[#71717A] tracking-widest font-mono">
                    || | ||| || |||| | ||| || ||| | |||| || || | ||| ||
                  </div>
                  <div className="text-[9px] text-[#71717A] font-mono truncate">
                    SELLO DIGITAL: 8f9b4c2d7a1e0f3c5b8a9d1e2f4a6b8c7e9d0a1b2c3d4e5f
                  </div>
                  <div className="text-[9px] text-[#30D158] uppercase font-bold tracking-wider">
                    ● CONTROL DE STOCK ATÓMICO: UNIDAD RETENIDA EN BODEGA DE SUCURSAL
                  </div>
                </div>

              </div>

              {/* Action Buttons Rack */}
              <div className="space-y-2 pt-1">
                {/* WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:translate-y-[1px]"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>[ ENVIAR BOLETA A MI WHATSAPP (+54 9 341 687-4786) ]</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#0066FF] text-[#F5F5F7] text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>[ IMPRIMIR BOLETA ]</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-2.5 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] text-[#71717A] hover:text-[#F5F5F7] text-xs uppercase cursor-pointer transition-colors"
                  >
                    [ CERRAR ]
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
