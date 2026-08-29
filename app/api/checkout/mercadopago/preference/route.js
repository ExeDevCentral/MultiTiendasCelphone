import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { STORES_FILE, readData } from '@/src/lib/dataStore';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
});

export async function POST(request) {
  try {
    const { storeId, items, customer } = await request.json();
    const stores = readData(STORES_FILE);
    const store = stores.find((s) => s.id === storeId);

    const preferenceItems = items.map((item) => ({
      id: item.productId || item.id,
      title: `${item.name} - ${store?.name || 'CelStore Atelier'}`,
      unit_price: Number(item.price),
      quantity: Number(item.quantity || 1),
      currency_id: 'USD'
    }));

    try {
      const preference = new Preference(mpClient);
      const result = await preference.create({
        body: {
          items: preferenceItems,
          payer: {
            name: customer?.name || 'Cliente CelStore Atelier',
            email: customer?.email || 'cliente@celstore.com'
          },
          back_urls: {
            success: `http://localhost:3000/?status=success&storeId=${storeId}`,
            failure: `http://localhost:3000/?status=failure&storeId=${storeId}`,
            pending: `http://localhost:3000/?status=pending&storeId=${storeId}`
          },
          auto_return: 'approved'
        }
      });

      return NextResponse.json({
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point
      });
    } catch (mpError) {
      // Mocked preference id for development/sandbox without live token
      return NextResponse.json({
        id: `mock-pref-${Date.now()}`,
        init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-${Date.now()}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-${Date.now()}`
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar preferencia' }, { status: 500 });
  }
}
