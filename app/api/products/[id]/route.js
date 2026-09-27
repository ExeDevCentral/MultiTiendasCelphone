import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { toProductRow, toProductJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';
import { mockStore } from '@/src/lib/mockStore';

const ProductUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  brand: z.string().min(1).optional(),
  type: z.enum(['phone', 'accessory']).optional(),
  category: z.string().optional(),
  modelYear: z.number().int().min(1990).max(2030).optional(),
  generationCategory: z.enum(['last_2_years', 'recent_gen', 'vintage_classic']).optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  status: z.enum(['published', 'draft', 'archived']).optional(),
  color: z.string().optional(),
  colors: z.array(z.any()).optional(),
  storage: z.string().optional(),
  storageOptions: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  specs: z.record(z.any()).optional(),
  solutions: z.array(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  condition: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  compatibility: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().int().optional(),
});

export async function GET(request, { params }) {
  const { id } = params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        if (data.status && data.status !== 'published') {
          const auth = parseAuthToken(request);
          if (!auth || (!auth.isSuperAdmin && auth.storeId !== data.store_id)) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
          }
        }
        return NextResponse.json(toProductJS(data));
      }
    } catch (dbErr) {
      console.warn('GET /api/products/:id (Supabase bypass to mockStore):', dbErr.message);
    }
  }

  // Zero-cost Test Mode mock fallback
  const mockProd = mockStore.getProductById(id);
  if (!mockProd) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  return NextResponse.json(mockProd);
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        const { data: existing, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (existing) {
          const auth = parseAuthToken(request);
          if (!auth) {
            return NextResponse.json({ error: 'No autorizado: Se requiere sesión activa' }, { status: 401 });
          }
          if (!verifyTenantAccess(auth, existing.store_id)) {
            return NextResponse.json(
              { error: 'Acceso denegado: No tienes permisos para modificar este producto' },
              { status: 403 }
            );
          }

          const validation = ProductUpdateSchema.safeParse(body);
          if (!validation.success) {
            return NextResponse.json(
              { error: 'Datos de actualización inválidos', details: validation.error.format() },
              { status: 400 }
            );
          }

          const { id: _ignoredId, storeId: _ignoredStoreId, ...safeUpdates } = body;
          const row = {
            ...toProductRow(safeUpdates),
            id: existing.id,
            store_id: existing.store_id,
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('products')
            .update(row)
            .eq('id', id)
            .select()
            .single();

          if (!error && data) {
            return NextResponse.json(toProductJS(data));
          }
        }
      } catch (dbErr) {
        console.warn('PUT /api/products/:id (Supabase bypass):', dbErr.message);
      }
    }

    // Zero-cost Test Mode local update
    const updated = mockStore.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Producto no encontrado en inventario de prueba' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/products/:id error:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        const { data: existing } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (existing) {
          const auth = parseAuthToken(request);
          if (!auth) {
            return NextResponse.json({ error: 'No autorizado: Se requiere sesión activa' }, { status: 401 });
          }
          if (!verifyTenantAccess(auth, existing.store_id)) {
            return NextResponse.json(
              { error: 'Acceso denegado: No tienes permisos para eliminar este producto' },
              { status: 403 }
            );
          }

          const { error } = await supabase.from('products').delete().eq('id', id);
          if (!error) {
            return NextResponse.json({ message: 'Producto eliminado correctamente' });
          }
        }
      } catch (dbErr) {
        console.warn('DELETE /api/products/:id (Supabase bypass):', dbErr.message);
      }
    }

    // Zero-cost Test Mode local delete
    mockStore.deleteProduct(id);
    return NextResponse.json({ message: 'Producto eliminado correctamente (Modo Prueba)' });
  } catch (error) {
    console.error('DELETE /api/products/:id error:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}