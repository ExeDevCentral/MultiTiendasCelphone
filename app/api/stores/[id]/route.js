import { NextResponse } from 'next/server';
import { STORES_FILE, readData, writeData } from '@/src/lib/dataStore';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const stores = readData(STORES_FILE);
    const store = stores.find((s) => s.id === id || s.slug === id);
    if (!store) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
    }
    const { managerPassword, ...safeStore } = store;
    return NextResponse.json(safeStore);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tienda' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const stores = readData(STORES_FILE);
    const index = stores.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
    }

    stores[index] = { ...stores[index], ...body, id: stores[index].id };
    writeData(STORES_FILE, stores);
    const { managerPassword, ...safeStore } = stores[index];
    return NextResponse.json(safeStore);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar tienda' }, { status: 500 });
  }
}
