'use client';

import React from 'react';
import { MessageSquare, CheckCircle2, Clock, Phone, MapPin } from 'lucide-react';
import { playSubtleClick } from '../../../utils/audioHaptics';

export const OrdersTracker = ({ orders = [] }) => {
  const handleChatCustomer = (phone, orderId) => {
    playSubtleClick();
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `[CELSTORE // TERMINAL LOG] Hola, nos comunicamos respecto a tu Orden #${orderId}. Confirmamos que el pedido está listo para despacho/retiro.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="bg-[#0E0E10] border border-[#1A1A1D] overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#141416] text-[10px] uppercase tracking-wider text-[#71717A] border-b border-[#1A1A1D] font-bold">
            <tr>
              <th className="p-3">ORDEN // ID</th>
              <th className="p-3">DESTINATARIO / DATOS</th>
              <th className="p-3">ITEMS / ESPECIFICACIONES</th>
              <th className="p-3">MÉTODO PAGO</th>
              <th className="p-3">TOTAL</th>
              <th className="p-3">ESTADO</th>
              <th className="p-3 text-right">WHATSAPP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1D]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-[#71717A]">
                  // No hay registros de pedidos en este terminal.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#141416] transition-colors">
                  <td className="p-3 font-bold text-[#0066FF] tabular-nums whitespace-nowrap">
                    {o.id}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#F5F5F7] block">{o.customer?.name}</span>
                    <span className="text-[10px] text-[#71717A] block">{o.customer?.phone || 'Sin teléfono'}</span>
                    <span className="text-[10px] text-[#71717A] block truncate max-w-[180px]">
                      {o.customer?.address || 'Retiro en Boutique'}
                    </span>
                  </td>
                  <td className="p-3 space-y-1">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="text-[#F5F5F7] text-[11px]">
                        <span className="text-[#0066FF] font-bold">{item.quantity}x</span> {item.name}
                        {item.storage && <span className="text-[#71717A] text-[10px]"> [{item.storage}]</span>}
                        {item.color && <span className="text-[#71717A] text-[10px]"> ({item.color})</span>}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-[11px] text-[#71717A]">
                    {o.paymentMethod || 'Coordinación WhatsApp'}
                  </td>
                  <td className="p-3 font-bold text-[#F5F5F7] tabular-nums whitespace-nowrap">
                    ${Number(o.total || 0).toLocaleString()} <span className="text-[10px] text-[#71717A] font-normal">USD</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-[#141416] border border-[#0066FF] text-[#0066FF] whitespace-nowrap">
                      {o.status ? o.status.toUpperCase() : 'PENDIENTE'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleChatCustomer(o.customer?.phone, o.id)}
                      className="px-2.5 py-1 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#25D366] text-[#25D366] text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title="Abrir coordinación directa por WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>[WA]</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
