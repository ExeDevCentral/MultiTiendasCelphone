import { NextResponse } from 'next/server';
import { STORES_FILE, readData } from '@/src/lib/dataStore';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const stores = readData(STORES_FILE);

    // 1. Super Admin Global
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (email?.toLowerCase() === 'admin@celstore.com' && password === adminPassword) {
      return NextResponse.json({
        token: `jwt-mock-superadmin-${Date.now()}`,
        user: {
          id: 'super-admin-01',
          name: 'Director General CelStore',
          email,
          role: 'superadmin',
          storeId: null
        }
      });
    }

    // 2. Store Managers (validación estricta sin backdoor)
    const store = stores.find(
      (s) => s.managerEmail?.toLowerCase() === email?.toLowerCase() && s.managerPassword === password
    );
    if (store) {
      return NextResponse.json({
        token: `jwt-mock-store-${store.id}-${Date.now()}`,
        user: {
          id: `mgr-${store.id}`,
          name: `Gerente ${store.name}`,
          email: store.managerEmail,
          role: 'store_manager',
          storeId: store.id,
          storeName: store.name
        }
      });
    }

    return NextResponse.json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Error durante la autenticación' }, { status: 500 });
  }
}
