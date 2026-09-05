import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toProductRow, toProductJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

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
  try {
    const { id } = params;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (data.status && data.status !== 'published') {
      const auth = parseAuthToken(request);
      if (!auth || (!auth.isSuperAdmin && auth.storeId !== data.store_id)) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
    }

    return NextResponse.json(toProductJS(data));
  } catch (error) {
    console.error('GET /api/products/:id:', error);
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const supabase = createSupabaseClient();

    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!existing) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

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

    const body = await request.json();
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
    if (error) throw error;

    return NextResponse.json(toProductJS(data));
  } catch (error) {
    console.error('PUT /api/products/:id:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = createSupabaseClient();

    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!existing) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

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
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('DELETE /api/products/:id:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}