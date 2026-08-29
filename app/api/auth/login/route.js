import { NextResponse } from 'next/server';
import { STORES_FILE, readData } from '@/src/lib/dataStore';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const stores = readData(STORES_FILE);

    // 1. Super Admin Global
    if (email === 'admin@celstore.com' && password === 'admin123') {
      return NextResponse.json({
        token: `jwt-mock-superadmin-${Date.now()}`,
        user: {
          id: 'super-admin-01',
          name: 'Director General CelStore',
          email,
          role: 'super_admin',
          storeId: null
        }
      });
    }

    // 2. Store Managers
    const store = stores.find((s) => s.managerEmail === email && (s.managerPassword === password || password === 'admin123'));
    if (store) {
      return NextResponse.json({
        token: `jwt-mock-store-${store.id}-${Date.now()}`,
        user: {
          id: `mgr-${store.id}`,
          name: `Gerente ${store.name}`,
          email,
          role: 'store_manager',
          storeId: store.id,
          storeName: store.name
        }
      });
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Error durante la autenticación' }, { status: 500 });
  }
}
