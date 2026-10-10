'use client';

import React from 'react';
import {
  X,
  Truck,
  Mail,
  FileText,
  ShieldCheck,
  MapPin,
  Printer,
  Copy,
  ChevronRight,
  ArrowRight,
  Check
} from 'lucide-react';
import { useTrackingStore } from '../store/useTrackingStore';
import { playSubtleClick, playCartSuccess } from '../utils/audioHaptics';
import { toast } from 'sonner';

export const OrderTrackerModal = () => {
  const {
    isOpen,
    closeTracking,
    orderData,
    activeStep,
    activeTab,
    setTab,
    setStep,
    nextStep
  } = useTrackingStore();

  if (!isOpen || !orderData) return null;

  const steps = [
    {
      num: 1,
      title: 'ORDEN CONFIRMADA',
      desc: 'Pago verificado y stock reservado en bodega central',
      time: '14:20 HS',
      location: 'Hub Central CelStore',
    },
    {
      num: 2,
      title: 'EMBALAJE BLINDADO',
      desc: 'Inspección de hardware, test de pantalla y precinto de titanio',
      time: '15:05 HS',
      location: 'Atelier de Precisión',
    },
    {
      num: 3,
      title: 'DESPACHADO EN TRÁNSITO',
      desc: 'Asignado a transporte prioritario con monitoreo satelital',
      time: '16:30 HS',
      location: 'Autopista Central - Unidad #402',
    },
    {
      num: 4,
      title: 'EN REPARTO A DOMICILIO',
      desc: 'Móvil de entrega en tu localidad. Código de recepción activo',
      time: '17:45 HS',
      location: orderData.city || 'Rosario, Santa Fe',
    },
    {
      num: 5,
      title: 'ENTREGADO CON ÉXITO',
      desc: 'Paquete recibido y verificado por el cliente. Garantía iniciada',
      time: '18:15 HS',
      location: orderData.address || 'Domicilio del Cliente',
    },
  ];

  const handleCopyHash = () => {
    playSubtleClick();
    if (orderData.securityHash) {
      navigator.clipboard.writeText(orderData.securityHash);
      toast.success('Hash SHA-256 copiado al portapapeles');
    }
  };

  const handlePrint = () => {
    playSubtleClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0E0E10] border border-[#1A1A1D] shadow-2xl text-[#F5F5F7] overflow-hidden">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#141416] border-b border-[#1A1A1D]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0066FF] tracking-wider uppercase">
                TERMINAL // SEGUIMIENTO EN VIVO
              </span>
              <span className="text-[10px] text-[#71717A] bg-[#0E0E10] px-2 py-0.5 border border-[#1A1A1D]">
                ORDEN #{orderData.orderId || 'CEL-9842'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              closeTracking();
            }}
            className="p-1 text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22] transition-colors cursor-pointer"
            title="Cerrar terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Stepper Selector */}
        <div className="flex border-b border-[#1A1A1D] bg-[#0E0E10] overflow-x-auto scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setTab('tracking');
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#141416]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>[ 01: RASTREO EN VIVO ]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setTab('email');
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'email'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#141416]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>[ 02: CONFIRMACIÓN EMAIL ]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setTab('invoice');
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'invoice'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#141416]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>[ 03: BOLETA FISCAL ]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              setTab('warranty');
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'warranty'
                ? 'bg-[#0066FF] text-[#F5F5F7]'
                : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#141416]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[ 04: GARANTÍA 24M ]</span>
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: RASTREO EN VIVO */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              {/* Radar Live Status Bar */}
              <div className="bg-[#141416] border border-[#1A1A1D] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#0066FF] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping" />
                    <span>ESTADO EN TIEMPO REAL: ETAPA {activeStep} DE 5</span>
                  </div>
                  <h3 className="text-lg font-bold font-sans text-[#F5F5F7] mt-1">
                    {steps[activeStep - 1].title}
                  </h3>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    {steps[activeStep - 1].desc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playCartSuccess();
                      nextStep();
                    }}
                    disabled={activeStep >= 5}
                    className={`px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeStep >= 5
                        ? 'bg-[#141416] text-[#71717A] border border-[#1A1A1D] cursor-not-allowed'
                        : 'bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7]'
                    }`}
                  >
                    <span>{activeStep >= 5 ? 'ENTREGA COMPLETADA' : 'SIMULAR AVANCE REPARTO'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#71717A] tracking-wider">
                  // RUTA LOGÍSTICA & DESPACHO DIRECTO
                </div>

                <div className="relative border-l-2 border-[#1A1A1D] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
                  {steps.map((st) => {
                    const isCompleted = activeStep > st.num;
                    const isCurrent = activeStep === st.num;

                    return (
                      <div key={st.num} className="relative group">
                        {/* Dot indicator */}
                        <div
                          onClick={() => {
                            playSubtleClick();
                            setStep(st.num);
                          }}
                          className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-[#0066FF] text-[#F5F5F7] ring-4 ring-[#0066FF]/20 animate-pulse'
                              : isCompleted
                              ? 'bg-[#25D366] text-black'
                              : 'bg-[#141416] border border-[#1A1A1D] text-[#71717A]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3 h-3 text-black" strokeWidth={2.5} /> : st.num}
                        </div>

                        {/* Step Card */}
                        <div
                          className={`p-3.5 sm:p-4 border transition-all ${
                            isCurrent
                              ? 'bg-[#141416] border-[#0066FF]'
                              : isCompleted
                              ? 'bg-[#0E0E10] border-[#1A1A1D]'
                              : 'bg-[#0E0E10]/50 border-[#1A1A1D]/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-[#F5F5F7] font-sans">
                              {st.title}
                            </span>
                            <span className="text-[10px] text-[#0066FF] bg-[#0E0E10] px-2 py-0.5 border border-[#1A1A1D]">
                              {st.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#71717A] leading-relaxed">
                            {st.desc}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-[#71717A]">
                            <MapPin className="w-3 h-3 text-[#0066FF]" />
                            <span>{st.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Details Hardware Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#141416] border border-[#1A1A1D] p-4">
                <div className="space-y-1.5">
                  <div className="text-[10px] text-[#71717A] uppercase">// DESTINATARIO</div>
                  <div className="font-bold text-[#F5F5F7]">{orderData.customerName || 'Cliente CelStore'}</div>
                  <div className="text-[#71717A]">{orderData.address || 'Bv. Oroño 1420'}</div>
                  <div className="text-[#71717A]">{orderData.city || 'Rosario, Santa Fe'}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-[#71717A] uppercase">// MÉTODO DE ENVÍO & COURIER</div>
                  <div className="font-bold text-[#0066FF]">LOGÍSTICA BLINDADA CELSTORE EXPRESS</div>
                  <div className="text-[#71717A]">Tiempo estimado: Mismo día (Rosario) / 24-48h Nacional</div>
                  <div className="text-[#25D366]">Precinto de titanio y seguro total bonificado</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONFIRMACIÓN EMAIL */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {/* Mail client mock bar */}
              <div className="bg-[#141416] border border-[#1A1A1D] p-3 text-xs flex items-center justify-between text-[#71717A]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-bold text-[#F5F5F7]">Inbox // Apple Mail Simulator</span>
                </div>
                <span className="text-[10px]">Recibido hace unos momentos</span>
              </div>

              {/* Email Content Container */}
              <div className="bg-[#FFFFFF] text-[#111113] p-6 sm:p-8 border border-[#1A1A1D] font-sans shadow-lg space-y-6">
                {/* Email Header */}
                <div className="flex items-center justify-between border-b pb-4 border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-black text-white font-mono font-bold flex items-center justify-center text-xs">
                      C/
                    </div>
                    <div>
                      <div className="font-bold text-sm text-black">CELSTORE™ ATELIER</div>
                      <div className="text-xs text-gray-500">pedidos@celstore.com</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      PEDIDO #{orderData.orderId || 'CEL-9842'}
                    </span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                    ¡Gracias por tu compra, {orderData.customerName || 'Cliente'}!
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Hemos recibido y verificado tu pedido con éxito. Nuestro atelier ya está preparando tus dispositivos móviles con las máximas normas de seguridad, comprobación de hardware y empaque de grado militar.
                  </p>
                </div>

                {/* Items Summary Table in Email */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 font-mono text-xs">
                  <div className="font-bold uppercase tracking-wider text-gray-500 text-[10px]">
                    RESUMEN DE HARDWARE
                  </div>
                  {(orderData.items || []).map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0">
                      <div>
                        <span className="font-bold text-gray-900">{it.name}</span>
                        <span className="text-gray-500 block text-[11px]">
                          {it.color} • {it.storage} (Cant: {it.qty})
                        </span>
                      </div>
                      <div className="font-bold text-gray-900">
                        ${(it.price * it.qty).toLocaleString()} USD
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>TOTAL PAGADO</span>
                    <span className="text-blue-600">${Number(orderData.total).toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-lg text-xs space-y-1 text-gray-700">
                  <div className="font-bold text-blue-900 uppercase">DIRECCIÓN DE ENTREGA</div>
                  <div>{orderData.address || 'Bv. Oroño 1420'}</div>
                  <div>{orderData.city || 'Rosario, Santa Fe'}</div>
                  <div className="text-blue-700 pt-1 font-mono">
                    Tracking ID: <strong>{orderData.securityHash?.slice(0, 16) || 'TRK-98428391'}</strong>
                  </div>
                </div>

                {/* Email Footer Call to Action */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      setTab('tracking');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>VER RASTREO SATELITAL DEL PAQUETE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOLETA FISCAL & TÉCNICA */}
          {activeTab === 'invoice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#71717A]">// COMPROBANTE FISCAL ELECTRÓNICO</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="px-2.5 py-1 bg-[#141416] border border-[#1A1A1D] hover:border-[#0066FF] text-xs flex items-center gap-1.5 cursor-pointer text-[#71717A] hover:text-[#F5F5F7]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>COPIAR HASH</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-2.5 py-1 bg-[#0066FF] text-[#F5F5F7] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#0052cc]"
                  >
                    <Printer className="w-3 h-3" />
                    <span>IMPRIMIR / PDF</span>
                  </button>
                </div>
              </div>

              {/* Technical Invoice Sheet */}
              <div className="bg-[#141416] border border-[#1A1A1D] p-6 space-y-6 text-xs">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[#1A1A1D]">
                  <div>
                    <h2 className="text-lg font-bold text-[#F5F5F7] font-sans">
                      CELSTORE™ ATELIER & LOGISTICS S.A.
                    </h2>
                    <div className="text-[11px] text-[#71717A] mt-1 space-y-0.5">
                      <div>CUIT: 30-71649281-9 • IVA Responsable Inscripto</div>
                      <div>Domicilio Fiscal: Córdoba 1452, Atelier Piso 12, Rosario</div>
                      <div>Resolución General AFIP RG-4291 // Factura Tipo A/B Electrónica</div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <div className="text-[#0066FF] font-bold text-sm">
                      COMPROBANTE: FACT-0001-{orderData.orderId?.replace(/[^0-9]/g, '') || '00009842'}
                    </div>
                    <div className="text-[#71717A] text-[10px]">
                      FECHA: {orderData.date || '10/10/2026'} | HORA: {orderData.time || '16:45'}
                    </div>
                    <div className="text-[#25D366] text-[10px] font-bold">
                      CAE N°: 74910284729104 // VTO: 20/10/2026
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#1A1A1D]">
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#71717A] uppercase">// DATOS DEL CLIENTE</div>
                    <div className="font-bold text-[#F5F5F7]">{orderData.customerName || 'Consumidor Final'}</div>
                    <div className="text-[#71717A]">{orderData.email}</div>
                    <div className="text-[#71717A]">{orderData.phone}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#71717A] uppercase">// DESTINO & CONDICIÓN DE VENTA</div>
                    <div className="text-[#F5F5F7]">{orderData.address}, {orderData.city}</div>
                    <div className="text-[#71717A]">Forma de pago: {orderData.paymentMethod}</div>
                    <div className="text-[#25D366]">Estado: APROBADO & VERIFICADO</div>
                  </div>
                </div>

                {/* Table of items */}
                <div className="space-y-2">
                  <div className="text-[10px] text-[#71717A] uppercase">// DESGLOSE DE PRODUCTOS & HARDWARE</div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#1A1A1D] text-[10px] text-[#71717A]">
                        <th className="py-2">DESCRIPCIÓN</th>
                        <th className="py-2 text-center">CANT</th>
                        <th className="py-2 text-right">PRECIO UNIT</th>
                        <th className="py-2 text-right">SUBTOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1D]">
                      {(orderData.items || []).map((it, idx) => (
                        <tr key={idx} className="text-xs">
                          <td className="py-2.5">
                            <span className="font-bold text-[#F5F5F7]">{it.name}</span>
                            <span className="text-[10px] text-[#71717A] block">
                              Serial de Fábrica: SN-CEL-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 text-center text-[#71717A]">{it.qty}</td>
                          <td className="py-2.5 text-right text-[#71717A]">${Number(it.price).toLocaleString()} USD</td>
                          <td className="py-2.5 text-right font-bold text-[#F5F5F7]">${(it.price * it.qty).toLocaleString()} USD</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total computation */}
                <div className="border-t border-[#1A1A1D] pt-4 space-y-1 text-right">
                  <div className="flex justify-between sm:justify-end gap-6 text-xs text-[#71717A]">
                    <span>SUBTOTAL NETO GRAVADO:</span>
                    <span className="text-[#F5F5F7] font-bold">${Number(orderData.subtotal || orderData.total).toLocaleString()} USD</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between sm:justify-end gap-6 text-xs text-[#25D366]">
                      <span>DESCUENTO CUPÓN:</span>
                      <span>-${Number(orderData.discount).toLocaleString()} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:justify-end gap-6 text-xs text-[#71717A]">
                    <span>ENVÍO PRIORITARIO BLINDADO:</span>
                    <span className="text-[#25D366] font-bold">BONIFICADO $0 USD</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-6 text-base font-bold text-[#0066FF] pt-2 border-t border-[#1A1A1D]">
                    <span>TOTAL LIQUIDADO:</span>
                    <span className="text-[#F5F5F7]">${Number(orderData.total).toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Cryptographic Hash */}
                <div className="p-3 bg-[#0E0E10] border border-[#1A1A1D] space-y-1">
                  <div className="text-[9px] text-[#0066FF] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>FIRMA DIGITAL & HASH SHA-256 ANTI-MANIPULACIÓN</span>
                  </div>
                  <div className="text-[9px] text-[#71717A] break-all font-mono">
                    {orderData.securityHash || '8f4a9b2c7e1d5a3f019482b6e8d2c4a91b8f3e7a6d5c2e1f4a9b0c2d3e4f5a6b'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GARANTÍA OFICIAL 24M */}
          {activeTab === 'warranty' && (
            <div className="space-y-4">
              <div className="bg-[#141416] border border-[#1A1A1D] p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-[#1A1A1D] pb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 border border-[#0066FF] flex items-center justify-center text-[#0066FF]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-sans text-[#F5F5F7]">
                      CERTIFICADO DE GARANTÍA OFICIAL CELSTORE™
                    </h3>
                    <p className="text-xs text-[#71717A]">
                      Póliza Internacional de Cobertura Integral • 24 Meses
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-[#0E0E10] border border-[#1A1A1D] space-y-1">
                    <div className="text-[#0066FF] font-bold text-[10px]">// HARDWARE & PANTALLA</div>
                    <p className="text-[#71717A] text-[11px] leading-relaxed">
                      Cobertura por defectos de fabricación, paneles OLED y circuitos internos sin cargo.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#0E0E10] border border-[#1A1A1D] space-y-1">
                    <div className="text-[#0066FF] font-bold text-[10px]">// BATERÍA ORIGINAL</div>
                    <p className="text-[#71717A] text-[11px] leading-relaxed">
                      Reemplazo bonificado si la degradación de salud supera el 20% durante el primer año.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#0E0E10] border border-[#1A1A1D] space-y-1">
                    <div className="text-[#0066FF] font-bold text-[10px]">// ATELIER VIP REPAIR</div>
                    <p className="text-[#71717A] text-[11px] leading-relaxed">
                      Dispositivo sustituto inmediato en Rosario mientras se realiza la calibración técnica.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#0E0E10] border border-[#1A1A1D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="text-[#F5F5F7] font-bold">TITULAR DE LA PÓLIZA</div>
                    <div className="text-[#71717A]">{orderData.customerName || 'Cliente CelStore'}</div>
                    <div className="text-[10px] text-[#25D366] mt-0.5">ESTADO: ACTIVA Y VIGENTE HASTA 2028</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-[#71717A]">CÓDIGO DE VALIDACIÓN:</div>
                    <div className="font-mono text-sm font-bold text-[#0066FF]">
                      WAR-24M-{orderData.orderId?.replace(/[^0-9]/g, '') || '9842'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#141416] border-t border-[#1A1A1D] flex items-center justify-between text-xs text-[#71717A]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            <span>TERMINAL EN MODO DEMO OFFLINE // 100% OPERATIVA</span>
          </div>

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              closeTracking();
            }}
            className="px-4 py-1.5 bg-[#0E0E10] hover:bg-[#1E1E22] border border-[#1A1A1D] text-[#F5F5F7] font-bold cursor-pointer transition-colors"
          >
            [ CERRAR ]
          </button>
        </div>

      </div>
    </div>
  );
};
