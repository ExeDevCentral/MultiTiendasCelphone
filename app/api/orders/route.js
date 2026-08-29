import { NextResponse } from 'next/server';
import { ORDERS_FILE, PRODUCTS_FILE, readData, writeData } from '@/src/lib/dataStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    let orders = readData(ORDERS_FILE);

    if (storeId) {
      orders = orders.filter((o) => o.storeId === storeId);
    }
    return NextResponse.json(orders);
  } catch (error) {
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

    const products = readData(PRODUCTS_FILE);

    // Validación atómica de stock
    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return NextResponse.json({ error: `Producto con ID ${item.productId} no encontrado` }, { status: 404 });
      }
      if (prod.storeId !== storeId && prod.type !== 'accessory') {
        return NextResponse.json({ error: `El producto ${prod.name} no pertenece a esta boutique` }, { status: 400 });
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${prod.name}. Disponible: ${prod.stock}` },
          { status: 409 }
        );
      }
    }

    // Descuento atómico de stock
    items.forEach((item) => {
      const pIndex = products.findIndex((p) => p.id === item.productId);
      if (pIndex !== -1) {
        products[pIndex].stock -= item.quantity;
      }
    });
    writeData(PRODUCTS_FILE, products);

    // Registro de orden
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orders = readData(ORDERS_FILE);
    const newOrder = {
      id: `ord-${Date.now()}`,
      storeId,
      items,
      customer,
      paymentMethod: paymentMethod || 'mercadopago',
      total,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    writeData(ORDERS_FILE, orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al procesar la orden' }, { status: 500 });
  }
}
