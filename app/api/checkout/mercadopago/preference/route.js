import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { STORES_FILE, PRODUCTS_FILE, readData } from '@/src/lib/dataStore';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
});

export async function POST(request) {
  try {
    const { storeId, items = [], customer } = await request.json();
    const stores = readData(STORES_FILE);
    const products = readData(PRODUCTS_FILE);
    const store = stores.find((s) => s.id === storeId);

    if (!items.length) {
      return NextResponse.json({ error: 'No se enviaron productos para checkout' }, { status: 400 });
    }

    const preferenceItems = items.map((item) => {
      const prod = products.find((p) => p.id === (item.productId || item.id));
      const verifiedPrice = prod ? Number(prod.price) : Number(item.price || 0);
      const itemName = prod ? prod.name : (item.name || 'Producto CelStore');
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      return {
        id: prod ? prod.id : (item.productId || item.id),
        title: `${itemName} - ${store?.name || 'CelStore Atelier'}`,
        unit_price: verifiedPrice,
        quantity,
        currency_id: 'USD'
      };
    });

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
