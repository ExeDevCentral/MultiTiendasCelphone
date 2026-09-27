import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { toProductRow, toProductJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';
import { mockStore } from '@/src/lib/mockStore';

const ProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  brand: z.string().min(1, 'La marca es requerida'),
  type: z.enum(['phone', 'accessory']).default('phone'),
  category: z.string().optional(),
  modelYear: z.number().int().min(1990).max(2030).optional(),
  generationCategory: z.enum(['last_2_years', 'recent_gen', 'vintage_classic']).optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  storeId: z.string().min(1, 'El storeId es requerido'),
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const generationCategory = searchParams.get('generationCategory');
  const type = searchParams.get('type');
  const brand = searchParams.get('brand');
  const isFeatured = searchParams.get('isFeatured');
  const includeDrafts = searchParams.get('includeDrafts') === 'true';
  const q = searchParams.get('q');

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseClient();
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      if (storeId) query = query.eq('store_id', storeId);
      if (generationCategory) query = query.eq('generation_category', generationCategory);
      if (type) query = query.eq('type', type);
      if (brand) query = query.ilike('brand', brand);
      if (isFeatured === 'true') query = query.eq('is_featured', true);
      if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,tagline.ilike.%${q}%`);

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json(data.map(toProductJS));
      }
    } catch (dbErr) {
      console.warn('GET /api/products (Supabase bypass to mockStore):', dbErr.message);
    }
  }

  // Zero-cost Test Mode from mockStore
  let filtered = mockStore.getProducts();
  if (!includeDrafts) {
    filtered = filtered.filter((p) => p.status !== 'draft');
  }
  if (storeId) filtered = filtered.filter((p) => p.storeId === storeId);
  if (generationCategory) filtered = filtered.filter((p) => p.generationCategory === generationCategory);
  if (type) filtered = filtered.filter((p) => p.type === type);
  if (brand) filtered = filtered.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
  if (isFeatured === 'true') filtered = filtered.filter((p) => p.isFeatured);
  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(qLower) ||
      p.brand?.toLowerCase().includes(qLower) ||
      p.tagline?.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json(filtered);
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

    if (isSupabaseConfigured()) {
      try {
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
        if (!error && data) {
          return NextResponse.json(toProductJS(data), { status: 201 });
        }
      } catch (dbErr) {
        console.warn('POST /api/products (Supabase bypass to mockStore):', dbErr.message);
      }
    }

    // Zero-Cost Test Mode: create product in local mockStore
    const created = mockStore.createProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/products:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}