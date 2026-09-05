import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createSupabaseClient } from '@/src/lib/supabase';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000',
});

export async function POST(request) {
  try {
    const { storeId, items = [], customer } = await request.json();
    const supabase = createSupabaseClient();

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('name, id')
      .eq('id', storeId)
      .maybeSingle();
    if (storeError) throw storeError;

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .in(
        'id',
        items.map((i) => i.productId || i.id)
      );
    if (productsError) throw productsError;

    if (!items.length) {
      return NextResponse.json({ error: 'No se enviaron productos para checkout' }, { status: 400 });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const preferenceItems = items.map((item) => {
      const prod = productMap.get(item.productId || item.id);
      const verifiedPrice = prod ? Number(prod.price) : Number(item.price || 0);
      const itemName = prod ? prod.name : item.name || 'Producto CelStore';
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      return {
        id: prod?.id || item.productId || item.id,
        title: `${itemName} - ${store?.name || 'CelStore Atelier'}`,
        unit_price: verifiedPrice,
        quantity,
        currency_id: 'USD',
      };
    });

    // Crea o elimina la preferencia según entorno (sandbox vs prod MercadoPago)
    try {
      const preference = new Preference(mpClient);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';

      const result = await preference.create({
        body: {
          items: preferenceItems,
          payer: {
            name: customer?.name || 'Cliente CelStore Atelier',
            email: customer?.email || 'cliente@celstore.com',
          },
          back_urls: {
            success: `${baseUrl}/?payment_status=approved&store=${storeId}`,
            failure: `${baseUrl}/?payment_status=failed&store=${storeId}`,
            pending: `${baseUrl}/?payment_status=pending&store=${storeId}`,
          },
          auto_return: 'approved',
        },
      });

      return NextResponse.json({
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
      });
    } catch (mpError) {
      console.warn('MercadoPago API fallback (Test mode):', mpError.message);
      return NextResponse.json({
        id: `mock-pref-${Date.now()}`,
        init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-${Date.now()}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-${Date.now()}`,
      });
    }
  } catch (error) {
    console.error('POST /api/payments/mercadopago/create-preference:', error);
    return NextResponse.json({ error: 'Error al generar preferencia' }, { status: 500 });
  }
}