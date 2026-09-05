import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toProductRow, toProductJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

const ProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  brand: z.string().min(1, 'La marca es requerida'),
  type: z.enum(['phone', 'accessory']).default('phone'),
  category: z.string().optional(),
  modelYear: z.number().int().min(1990).max(2030),
  generationCategory: z.enum(['last_2_years', 'recent_gen', 'vintage_classic']),
  price: z.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  storeId: z.string().min(1, 'El storeId es requerido'),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const generationCategory = searchParams.get('generationCategory');
    const type = searchParams.get('type');
    const brand = searchParams.get('brand');
    const isFeatured = searchParams.get('isFeatured');
    const includeDrafts = searchParams.get('includeDrafts');
    const q = searchParams.get('q');

    const supabase = createSupabaseClient();
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Public catalog only sees published products.
    // Un gerente autenticado ve published + drafts únicamente de su propia tienda.
    if (includeDrafts === 'true') {
      const auth = parseAuthToken(request);
      if (auth?.isSuperAdmin) {
        // Superadmin: catálogo completo de todas las boutiques
      } else if (auth?.storeId) {
        // Store manager: published + drafts de su propia tienda
        query = query.eq('store_id', auth.storeId);
      } else {
        // Público: solo published
        query = query.eq('status', 'published');
      }
    } else {
      query = query.eq('status', 'published');
    }

    if (storeId) {
      query = query.eq('store_id', storeId);
    }
    if (generationCategory) {
      query = query.eq('generation_category', generationCategory);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (brand) {
      query = query.ilike('brand', brand);
    }
    if (isFeatured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (q) {
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,tagline.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data.map(toProductJS));
  } catch (error) {
    console.error('GET /api/products:', error);
    return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = parseAuthToken(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'No autorizado: Se requiere sesión activa para crear productos' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = ProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de producto inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    if (!verifyTenantAccess(auth, body.storeId)) {
      return NextResponse.json(
        { error: 'Acceso denegado: No puedes publicar productos en otra boutique' },
        { status: 403 }
      );
    }

    const supabase = createSupabaseClient();
    const newProduct = {
      ...body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 1,
    };

    const row = toProductRow(newProduct);
    const { data, error } = await supabase.from('products').insert(row).select().single();
    if (error) throw error;

    return NextResponse.json(toProductJS(data), { status: 201 });
  } catch (error) {
    console.error('POST /api/products:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}