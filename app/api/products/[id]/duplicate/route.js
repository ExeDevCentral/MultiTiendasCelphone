import { NextResponse } from 'next/server';
import { createSupabaseClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { toProductRow, toProductJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';
import { mockStore } from '@/src/lib/mockStore';

export async function POST(request, { params }) {
  try {
    const { id } = params;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        const { data: original, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (original) {
          const auth = parseAuthToken(request);
          if (!auth) {
            return NextResponse.json({ error: 'No autorizado: Se requiere sesión activa' }, { status: 401 });
          }
          if (!verifyTenantAccess(auth, original.store_id)) {
            return NextResponse.json(
              { error: 'Acceso denegado: No puedes duplicar productos de otra boutique' },
              { status: 403 }
            );
          }

          const duplicated = {
            ...original,
            id: `prod-${Date.now()}`,
            name: `[Copia] ${original.name}`,
            status: 'draft',
            is_featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            depth_map_url: null,
            depth_status: 'none',
          };

          const { data, error } = await supabase.from('products').insert(duplicated).select().single();
          if (!error && data) {
            return NextResponse.json(toProductJS(data), { status: 201 });
          }
        }
      } catch (dbErr) {
        console.warn('Duplicate fallback to mockStore:', dbErr.message);
      }
    }

    // Zero-Cost Mock Store duplicate
    const duplicatedMock = mockStore.duplicateProduct(id);
    if (!duplicatedMock) {
      return NextResponse.json({ error: 'Producto original no encontrado' }, { status: 404 });
    }
    return NextResponse.json(duplicatedMock, { status: 201 });
  } catch (error) {
    console.error('POST /api/products/:id/duplicate:', error);
    return NextResponse.json({ error: 'Error al duplicar producto' }, { status: 500 });
  }
}