import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toStoreRow, toStoreJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken } from '@/src/lib/authGuard';

const StoreSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug es requerido'),
  tagLine: z.string().optional(),
  description: z.string().optional(),
  specialty: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('stores').select('*').order('created_at');
    if (error) throw error;
    return NextResponse.json(data.map(toStoreJS));
  } catch (error) {
    console.error('GET /api/stores:', error);
    return NextResponse.json({ error: 'Error al consultar tiendas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = parseAuthToken(request);
    if (!auth?.isSuperAdmin) {
      return NextResponse.json({ error: 'No autorizado: Solo SuperAdmin puede crear tiendas' }, { status: 403 });
    }

    const body = await request.json();
    const validation = StoreSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos de tienda inválidos', details: validation.error.format() }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const row = toStoreRow({ ...body, id: `store-${Date.now()}` });
    const { data, error } = await supabase.from('stores').insert(row).select().single();
    if (error) throw error;

    return NextResponse.json(toStoreJS(data), { status: 201 });
  } catch (error) {
    console.error('POST /api/stores:', error);
    return NextResponse.json({ error: 'Error al crear tienda' }, { status: 500 });
  }
}