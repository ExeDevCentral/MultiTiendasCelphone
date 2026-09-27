import { NextResponse } from 'next/server';
import { createSupabaseClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { toOrderRow, toOrderJS } from '@/src/lib/supabaseMappers';
import { mockStore } from '@/src/lib/mockStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (storeId) {
          query = query.eq('store_id', storeId);
        }
        const { data, error } = await query;
        if (!error && data) {
          return NextResponse.json(data.map(toOrderJS));
        }
      } catch (dbErr) {
        console.warn('GET /api/orders (Supabase bypass to mockStore):', dbErr.message);
      }
    }

    // Zero-Cost Mock Store
    const orders = mockStore.getOrders(storeId);
    return NextResponse.json(orders);
  } catch (error) {
    console.warn('GET /api/orders error:', error.message);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { storeId, items, customer, paymentMethod } = body;

    if (!items || !items.length || !customer?.name) {
      return NextResponse.json({ error: 'Datos de pedido incompletos' }, { status: 400 });
    }

    // Try Supabase only if configured and not in test mode
    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        const sanitizedItems = [];
        let computedTotal = 0;

        for (const item of items) {
          const productId = item.productId || item.id;
          const { data: prod, error: prodError } = await supabase
            .from('products')
            .select('id, store_id, name, price, stock, colors, storage_options, type')
            .eq('id', productId)
            .maybeSingle();

          if (prodError || !prod) continue;
          const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
          const verifiedPrice = Number(prod.price);
          computedTotal += verifiedPrice * quantity;

          sanitizedItems.push({
            productId: prod.id,
            name: prod.name,
            color: item.color || 'Estándar',
            storage: item.storage || 'Estándar',
            price: verifiedPrice,
            quantity,
          });
        }

        const orderRow = toOrderRow({
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          storeId: storeId || 'store-celstore-premium',
          customer: {
            name: String(customer.name).trim(),
            email: String(customer.email || 'cliente@celstore.com').trim(),
            phone: customer.phone ? String(customer.phone).trim() : '',
            address: customer.address ? String(customer.address).trim() : '',
          },
          items: sanitizedItems.length ? sanitizedItems : items,
          total: computedTotal || body.total || 0,
          status: 'pending',
          paymentMethod: paymentMethod || 'coordinacion_whatsapp',
        });

        const { data, error } = await supabase.from('orders').insert(orderRow).select().single();
        if (!error && data) {
          return NextResponse.json(toOrderJS(data), { status: 201 });
        }
      } catch (dbErr) {
        console.warn('Supabase bypass to Test Mode order generation:', dbErr.message);
      }
    }

    // TEST MODE: Create simulated order using mockStore (0 Supabase Cost)
    const mockOrder = mockStore.createOrder({
      storeId: storeId || 'store-celstore-premium',
      customer: {
        name: String(customer.name || 'Cliente').trim(),
        email: String(customer.email || 'cliente@celstore.com').trim(),
        phone: customer.phone ? String(customer.phone).trim() : '',
        address: customer.address ? String(customer.address).trim() : '',
      },
      items: items.map((it) => ({
        productId: it.productId || it.id || 'prod-custom',
        name: it.name || 'Dispositivo',
        color: it.color || 'Titanio',
        storage: it.storage || '256 GB',
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 1),
      })),
      total: Number(body.total || items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 1)), 0)),
      status: 'pending',
      paymentMethod: paymentMethod || 'Coordinación por WhatsApp',
    });

    return NextResponse.json(mockOrder, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Error al procesar pedido' }, { status: 500 });
  }
}