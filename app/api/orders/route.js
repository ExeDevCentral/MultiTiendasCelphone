import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toOrderRow, toOrderJS } from '@/src/lib/supabaseMappers';
import defaultOrders from '@/data/orders.json';

// In-memory store for test/mock orders when Supabase is not configured
let localOrders = [...(defaultOrders || [])];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    const supabase = createSupabaseClient();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (storeId) {
      query = query.eq('store_id', storeId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data.map(toOrderJS));
  } catch (error) {
    console.warn('GET /api/orders (Test Mode Fallback):', error.message);
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    let orders = localOrders;
    if (storeId) {
      orders = orders.filter((o) => o.storeId === storeId);
    }
    return NextResponse.json(orders);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { storeId, items, customer, paymentMethod } = body;

    if (!items || !items.length || !customer?.name) {
      return NextResponse.json({ error: 'Datos de pedido incompletos' }, { status: 400 });
    }

    // Try Supabase first
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
      console.warn('Supabase not active, using Test Mode order generation:', dbErr.message);
    }

    // TEST MODE FALLBACK: Create order without touching Supabase quota
    const trackingCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const mockOrder = {
      id: trackingCode,
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
        price: it.price || 0,
        quantity: it.quantity || 1,
      })),
      total: body.total || items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0),
      status: 'pending',
      paymentMethod: paymentMethod || 'Coordinación por WhatsApp',
      createdAt: new Date().toISOString(),
      isTestMode: true,
    };

    localOrders.unshift(mockOrder);
    return NextResponse.json(mockOrder, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Error al procesar pedido' }, { status: 500 });
  }
}