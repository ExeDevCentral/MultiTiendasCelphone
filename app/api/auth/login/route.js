import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSupabaseClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { toStoreJS } from '@/src/lib/supabaseMappers';
import { signToken } from '@/src/lib/tokenSigner';
import defaultStores from '@/data/stores.json';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña son requeridos' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Super Admin Global (Test Mode & Standard)
    const isSuperAdminEmail = cleanEmail === 'superadmin@platform.com' || cleanEmail === 'admin@celstore.com';
    const isAcceptedAdminPass = password === 'admin123' || password === 'password123' || password === (process.env.ADMIN_PASSWORD || '');
    
    if (isSuperAdminEmail && isAcceptedAdminPass) {
      const token = signToken({
        sub: 'super-admin-01',
        role: 'superadmin',
        name: 'Director General CelStore',
        email: cleanEmail,
      });

      return NextResponse.json({
        token,
        user: {
          id: 'super-admin-01',
          name: 'Director General CelStore',
          email: cleanEmail,
          role: 'superadmin',
          storeId: null,
          isTestMode: true,
        },
      });
    }

    // 2. Test Mode Fallback for Store Managers (Zero-Cost Supabase bypass)
    const localStore = defaultStores.find(
      (s) => s.managerEmail?.toLowerCase() === cleanEmail || s.id === cleanEmail
    );

    if (localStore && (password === 'admin123' || password === 'password123')) {
      const token = signToken({
        sub: `mgr-${localStore.id}`,
        role: 'store_manager',
        storeId: localStore.id,
        name: `Gerente ${localStore.name}`,
        email: localStore.managerEmail || cleanEmail,
      });

      return NextResponse.json({
        token,
        user: {
          id: `mgr-${localStore.id}`,
          name: `Gerente ${localStore.name}`,
          email: localStore.managerEmail || cleanEmail,
          role: 'store_manager',
          storeId: localStore.id,
          storeName: localStore.name,
          store: localStore,
          isTestMode: true,
        },
      });
    }

    // 3. Supabase Auth (if configured and live mode enabled)
    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        const { data: store, error } = await supabase
          .from('stores')
          .select('*')
          .eq('manager_email', cleanEmail)
          .maybeSingle();

        if (!error && store?.manager_password_hash) {
          const valid = await bcrypt.compare(password, store.manager_password_hash);
          if (valid) {
            const token = signToken({
              sub: `mgr-${store.id}`,
              role: 'store_manager',
              storeId: store.id,
              name: `Gerente ${store.name}`,
              email: store.manager_email,
            });

            return NextResponse.json({
              token,
              user: {
                id: `mgr-${store.id}`,
                name: `Gerente ${store.name}`,
                email: store.manager_email,
                role: 'store_manager',
                storeId: store.id,
                storeName: store.name,
                store: toStoreJS(store),
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('Supabase auth bypass in test mode:', dbErr.message);
      }
    }

    return NextResponse.json(
      { error: 'Credenciales inválidas. En Modo Prueba usa: admin@celstore.com / admin123' },
      { status: 401 }
    );
  } catch (error) {
    console.error('POST /api/auth/login:', error);
    return NextResponse.json({ error: 'Error durante la autenticación' }, { status: 500 });
  }
}