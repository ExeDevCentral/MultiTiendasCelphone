import { NextResponse } from 'next/server';
import { STORES_FILE, readData } from '@/src/lib/dataStore';

export async function GET() {
  try {
    const stores = readData(STORES_FILE);
    const safeStores = stores.map(({ managerPassword, ...rest }) => rest);
    return NextResponse.json(safeStores);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tiendas' }, { status: 500 });
  }
}
