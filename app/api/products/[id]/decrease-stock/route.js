import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/src/lib/supabase';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { quantity = 1 } = await request.json();

    const supabase = createSupabaseClient();

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, store_id, stock')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const { data: result, error } = await supabase.rpc('decrease_stock_atomic', {
      p_product_id: id,
      p_quantity: qty,
    });
    if (error) throw error;

    if (!result?.success) {
      return NextResponse.json(
        {
          error: result?.error || 'Stock insuficiente para completar la operación',
          availableStock: result?.available_stock ?? product.stock,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, remainingStock: result.remaining_stock });
  } catch (error) {
    console.error('POST /api/products/:id/decrease-stock:', error);
    return NextResponse.json({ error: 'Error al descontar stock' }, { status: 500 });
  }
}