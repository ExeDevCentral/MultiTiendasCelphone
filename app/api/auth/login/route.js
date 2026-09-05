import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toStoreJS } from '@/src/lib/supabaseMappers';
import { signToken } from '@/src/lib/tokenSigner';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña son requeridos' }, { status: 400 });
    }

    // 1. Super Admin Global
    const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'admin123');
    if (email?.toLowerCase() === 'superadmin@platform.com' && adminPassword && password === adminPassword) {
      const token = signToken({
        sub: 'super-admin-01',
        role: 'superadmin',
        name: 'Director General CelStore',
        email,
      });

      return NextResponse.json({
        token,
        user: {
          id: 'super-admin-01',
          name: 'Director General CelStore',
          email,
          role: 'superadmin',
          storeId: null,
        },
      });
    }

    // 2. Store Managers
    const supabase = createSupabaseClient();
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('manager_email', email?.toLowerCase())
      .maybeSingle();
    if (error) throw error;

    if (store?.manager_password_hash) {
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

    return NextResponse.json(
      { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('POST /api/auth/login:', error);
    return NextResponse.json({ error: 'Error durante la autenticación' }, { status: 500 });
  }
}