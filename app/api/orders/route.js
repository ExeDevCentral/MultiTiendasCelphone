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
    const sanitizedItems = [];
    let computedTotal = 0;

    // 1. Validación y sanitización atómica con precios del servidor
    for (const item of items) {
      const prod = products.find((p) => p.id === (item.productId || item.id));
      if (!prod) {
        return NextResponse.json({ error: `Producto con ID ${item.productId || item.id} no encontrado` }, { status: 404 });
      }
      if (prod.storeId !== storeId && prod.type !== 'accessory') {
        return NextResponse.json({ error: `El producto ${prod.name} no pertenece a esta boutique` }, { status: 400 });
      }
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (prod.stock < quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${prod.name}. Disponible: ${prod.stock}` },
          { status: 409 }
        );
      }

      // Security: use authoritative price from database
      const verifiedPrice = Number(prod.price);
      computedTotal += verifiedPrice * quantity;

      sanitizedItems.push({
        productId: prod.id,
        name: prod.name,
        color: item.color || (prod.colors && prod.colors[0]?.name) || 'Estándar',
        storage: item.storage || (prod.storageOptions && prod.storageOptions[0]) || 'Estándar',
        price: verifiedPrice,
        quantity
      });
    }

    // 2. Descuento atómico de stock
    sanitizedItems.forEach((item) => {
      const pIndex = products.findIndex((p) => p.id === item.productId);
      if (pIndex !== -1) {
        products[pIndex].stock -= item.quantity;
      }
    });
    writeData(PRODUCTS_FILE, products);

    // 3. Registro seguro de orden
    const orders = readData(ORDERS_FILE);
    const newOrder = {
      id: `ord-${Date.now()}`,
      storeId,
      items: sanitizedItems,
      customer: {
        name: String(customer.name).trim(),
        email: String(customer.email).trim(),
        phone: customer.phone ? String(customer.phone).trim() : ''
      },
      paymentMethod: paymentMethod || 'mercadopago',
      total: computedTotal,
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
