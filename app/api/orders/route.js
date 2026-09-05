import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toOrderRow, toOrderJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken } from '@/src/lib/authGuard';

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
    console.error('GET /api/orders:', error);
    return NextResponse.json({ error: 'Error al consultar pedidos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { storeId, items, customer, paymentMethod } = body;

    if (!storeId || !items || !items.length || !customer?.name || !customer?.email) {
      return NextResponse.json({ error: 'Datos de pedido incompletos' }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const sanitizedItems = [];
    let computedTotal = 0;

    // 1. Validación y sanitización con precios autoritativos del servidor
    for (const item of items) {
      const productId = item.productId || item.id;
      const { data: prod, error: prodError } = await supabase
        .from('products')
        .select('id, store_id, name, price, stock, colors, storage_options, type')
        .eq('id', productId)
        .maybeSingle();
      if (prodError) throw prodError;
      if (!prod) {
        return NextResponse.json({ error: `Producto con ID ${productId} no encontrado` }, { status: 404 });
      }
      if (prod.store_id !== storeId && prod.type !== 'accessory') {
        return NextResponse.json(
          { error: `El producto ${prod.name} no pertenece a esta boutique` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (prod.stock < quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${prod.name}. Disponible: ${prod.stock}` },
          { status: 409 }
        );
      }

      const verifiedPrice = Number(prod.price);
      computedTotal += verifiedPrice * quantity;

      sanitizedItems.push({
        productId: prod.id,
        name: prod.name,
        color: item.color || prod.colors?.[0]?.name || 'Estándar',
        storage: item.storage || prod.storage_options?.[0] || 'Estándar',
        price: verifiedPrice,
        quantity,
      });
    }

    // 2. Descuento atómico de stock por producto
    for (const sItem of sanitizedItems) {
      const { data: result, error: rpcError } = await supabase.rpc('decrease_stock_atomic', {
        p_product_id: sItem.productId,
        p_quantity: sItem.quantity,
      });
      if (rpcError) throw rpcError;
      if (!result?.success) {
        return NextResponse.json(
          { error: result?.error || 'Stock insuficiente para completar la orden' },
          { status: 409 }
        );
      }
    }

    // 3. Registro seguro de la orden
    const order = toOrderRow({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      storeId,
      customer: {
        name: String(customer.name).trim(),
        email: String(customer.email).trim(),
        phone: customer.phone ? String(customer.phone).trim() : '',
        address: customer.address ? String(customer.address).trim() : '',
      },
      items: sanitizedItems,
      total: computedTotal,
      status: 'Confirmado',
      paymentMethod: paymentMethod || 'mercadopago',
    });

    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw error;

    return NextResponse.json(toOrderJS(data), { status: 201 });
  } catch (error) {
    console.error('POST /api/orders:', error);
    return NextResponse.json({ error: 'Error al procesar la orden' }, { status: 500 });
  }
}