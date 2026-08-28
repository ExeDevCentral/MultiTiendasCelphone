import React from 'react';
import { ShoppingBag, MessageSquare, CheckCircle, Clock, Truck } from 'lucide-react';

export const OrdersTracker = ({ orders = [] }) => {
  const handleChatCustomer = (phone, orderId) => {
    if (!phone) return;
    const text = encodeURIComponent(
      `¡Hola! Me comunico desde CelStore respecto a tu orden *${orderId}*. Tu pedido ya se encuentra confirmado y en preparación.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl glass-panel border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10 font-bold">
            <tr>
              <th className="p-4">Orden ID</th>
              <th className="p-4">Cliente & Contacto</th>
              <th className="p-4">Artículos Comprados</th>
              <th className="p-4">Medio de Pago</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Contacto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-neutral-500">
                  Aún no se han recibido órdenes para esta tienda.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-400">{o.id}</td>
                  <td className="p-4">
                    <span className="font-semibold text-white block">{o.customer?.name}</span>
                    <span className="text-[11px] text-neutral-400">{o.customer?.phone}</span>
                    <span className="text-[10px] text-neutral-500 block truncate max-w-[180px]">{o.customer?.address}</span>
                  </td>
                  <td className="p-4 space-y-1">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="text-neutral-200">
                        {item.quantity}x <strong className="text-white">{item.name}</strong>
                        {item.color && <span className="text-neutral-400 text-[10px]"> ({item.color})</span>}
                      </div>
                    ))}
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-medium">{o.paymentMethod || 'Tarjeta'}</span>
                  </td>
                  <td className="p-4 font-extrabold text-white">${o.total} USD</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {o.status || 'Confirmado'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleChatCustomer(o.customer?.phone, o.id)}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
                      title="Contactar al cliente por WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
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
