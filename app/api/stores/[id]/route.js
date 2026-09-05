import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toStoreJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
    }

    return NextResponse.json(toStoreJS(data));
  } catch (error) {
    console.error('GET /api/stores/:id:', error);
    return NextResponse.json({ error: 'Error al consultar tienda' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const auth = parseAuthToken(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado: Se requiere sesión activa' }, { status: 401 });
    }
    if (!verifyTenantAccess(auth, id)) {
      return NextResponse.json(
        { error: 'Acceso denegado: No tienes permisos para editar esta boutique' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const supabase = createSupabaseClient();

    const allowed = {
      name: body.name,
      slug: body.slug,
      tagline: body.tagLine ?? body.tagline,
      description: body.description,
      logo: body.logo,
      banner: body.banner,
      theme_color: body.themeColor,
      theme_gradient: body.themeGradient,
      address: body.address,
      phone_whatsapp: body.phoneWhatsApp,
      email: body.email,
      rating: body.rating,
      review_count: body.reviews ?? body.reviewCount,
      verified: body.verified,
      specialty: body.specialty,
      updated_at: new Date().toISOString(),
    };
    Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);

    const { data, error } = await supabase
      .from('stores')
      .update(allowed)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(toStoreJS(data));
  } catch (error) {
    console.error('PUT /api/stores/:id:', error);
    return NextResponse.json({ error: 'Error al actualizar tienda' }, { status: 500 });
  }
}