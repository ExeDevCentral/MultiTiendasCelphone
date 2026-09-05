import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/src/lib/supabase';
import { toProductJS } from '@/src/lib/supabaseMappers';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const supabase = createSupabaseClient();

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const auth = parseAuthToken(request);
    if (!auth || !verifyTenantAccess(auth, product.store_id)) {
      return NextResponse.json(
        { error: 'Acceso denegado: No tienes permisos para procesar este producto' },
        { status: 403 }
      );
    }

    const photoUrl = product.photo_url || product.images?.[0];
    if (!photoUrl) {
      return NextResponse.json(
        { error: 'El producto no tiene una imagen principal para generar profundidad' },
        { status: 400 }
      );
    }

    const { error: procError } = await supabase
      .from('products')
      .update({ depth_status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (procError) throw procError;

    const replicateToken = process.env.REPLICATE_API_TOKEN;

    if (replicateToken) {
      try {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${replicateToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: 'depth-anything/depth-anything-v2:latest',
            input: { image: photoUrl },
          }),
        });

        const prediction = await response.json();
        let depthResult = prediction;

        while (depthResult.status !== 'succeeded' && depthResult.status !== 'failed') {
          await new Promise((r) => setTimeout(r, 1000));
          const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${depthResult.id}`, {
            headers: { Authorization: `Bearer ${replicateToken}` },
          });
          depthResult = await pollRes.json();
        }

        const status = depthResult.status === 'succeeded' ? 'ready' : 'error';
        const depthMapUrl = depthResult.status === 'succeeded' ? depthResult.output : null;

        const { data, error } = await supabase
          .from('products')
          .update({
            depth_status: status,
            depth_map_url: depthMapUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;

        return NextResponse.json({ success: status === 'ready', product: toProductJS(data) });
      } catch (err) {
        console.error('Error generating depth map:', err);
        const { data, error } = await supabase
          .from('products')
          .update({ depth_status: 'error', updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json(
          { success: false, error: 'Fallo al procesar mapa de profundidad', product: toProductJS(data) },
          { status: 500 }
        );
      }
    }

    // Simulación de inferencia local inmediata (foto de referencia como depth map)
    const { data, error } = await supabase
      .from('products')
      .update({
        depth_map_url: photoUrl,
        depth_status: 'ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, product: toProductJS(data) });
  } catch (error) {
    console.error('POST /api/products/:id/generate-depth:', error);
    return NextResponse.json({ error: 'Error al generar mapa de profundidad' }, { status: 500 });
  }
}