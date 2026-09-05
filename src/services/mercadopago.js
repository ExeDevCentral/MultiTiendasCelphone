// MercadoPago Integration Service for CelStore
export const mercadopagoService = {
  async createPreference(orderPayload) {
    const res = await fetch('/api/payments/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al conectar con MercadoPago');
    }

    return await res.json();
  },

  redirectToCheckout(preference) {
    const checkoutUrl = preference.init_point || preference.sandbox_init_point;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }
};
