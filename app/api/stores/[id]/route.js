import { NextResponse } from 'next/server';
import { STORES_FILE, readData, writeData } from '@/src/lib/dataStore';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

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
    const auth = parseAuthToken(request);
    
    // Authorization Check
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado: Se requiere token de sesión' }, { status: 401 });
    }
    if (!verifyTenantAccess(auth, id)) {
      return NextResponse.json({ error: 'Acceso denegado: No tienes permisos para editar esta boutique' }, { status: 403 });
    }

    const body = await request.json();
    const stores = readData(STORES_FILE);
    const index = stores.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
    }

    // Sanitize body to avoid overwriting sensitive fields
    const { managerPassword, id: _bodyId, ...allowedUpdates } = body;

    stores[index] = { ...stores[index], ...allowedUpdates, id: stores[index].id };
    writeData(STORES_FILE, stores);
    const { managerPassword: _mp, ...safeStore } = stores[index];
    return NextResponse.json(safeStore);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar tienda' }, { status: 500 });
  }
}
